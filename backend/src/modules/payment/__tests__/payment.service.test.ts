import { paymentService } from '../payment.service';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

describe('PaymentService - TDD Cycle 1, 2 & 3', () => {
  let testVehicleId: string;

  beforeAll(async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'RazorpayTest',
        model: 'Model X',
        category: 'ELECTRIC',
        price: 100000,
        quantity: 2,
      },
    });
    testVehicleId = vehicle.id;
  });

  afterAll(async () => {
    if (testVehicleId) {
      await prisma.payment.deleteMany({
        where: { order: { vehicleId: testVehicleId } },
      });
      await prisma.order.deleteMany({ where: { vehicleId: testVehicleId } });
      await prisma.vehicle.deleteMany({ where: { id: testVehicleId } });
    }
    await prisma.$disconnect();
  });

  describe('TDD Cycle 1: Create Razorpay Order', () => {
    it('should create a Razorpay order with correct amount, currency (INR), and key', async () => {
      const result = await paymentService.createRazorpayOrder({
        vehicleId: testVehicleId,
        bookingAmount: 25000,
      });

      expect(result).toHaveProperty('razorpayOrderId');
      expect(result.razorpayOrderId).toMatch(/^order_/);
      expect(result.amount).toBe(25000);
      expect(result.currency).toBe('INR');
      expect(result).toHaveProperty('key');
    });

    it('should reject invalid vehicle or zero stock when creating Razorpay order', async () => {
      await expect(
        paymentService.createRazorpayOrder({
          vehicleId: 'non-existent-vehicle-id',
          bookingAmount: 25000,
        })
      ).rejects.toThrow('Vehicle not found');
    });

    it('should reject invalid booking amount (<= 0)', async () => {
      await expect(
        paymentService.createRazorpayOrder({
          vehicleId: testVehicleId,
          bookingAmount: -500,
        })
      ).rejects.toThrow('Invalid booking amount');
    });
  });

  describe('TDD Cycle 2 & 3: Signature Verification, Order Creation & Inventory Logic', () => {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key_456';
    const razorpayOrderId = 'order_test_12345';
    const razorpayPaymentId = 'pay_test_67890';
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const deliveryInfo = {
      fullName: 'Alice Smith',
      phone: '+91 99999 88888',
      addressLine: '45 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
    };

    it('should verify signature successfully for valid HMAC sha256', () => {
      const isSignatureValid = paymentService.verifySignature(
        razorpayOrderId,
        razorpayPaymentId,
        validSignature
      );
      expect(isSignatureValid).toBe(true);
    });

    it('should reject invalid / tampered signature', async () => {
      await expect(
        paymentService.verifyPaymentAndCreateOrder({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: 'invalid_tampered_signature',
          vehicleId: testVehicleId,
          deliveryInfo,
          bookingAmount: 25000,
        })
      ).rejects.toThrow('Invalid payment signature');

      // Verify stock was NOT decreased
      const vehicle = await prisma.vehicle.findUnique({ where: { id: testVehicleId } });
      expect(vehicle?.quantity).toBe(2);
    });

    it('should create order, store payment record, and decrease stock upon valid signature verification', async () => {
      const result = await paymentService.verifyPaymentAndCreateOrder({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: validSignature,
        vehicleId: testVehicleId,
        deliveryInfo,
        bookingAmount: 25000,
      });

      expect(result).toHaveProperty('order');
      expect(result).toHaveProperty('payment');
      expect(result.order.status).toBe('BOOKING_PAID');
      expect(result.payment.razorpayPaymentId).toBe(razorpayPaymentId);
      expect(Number(result.payment.bookingAmount)).toBe(25000);
      expect(Number(result.payment.remainingAmount)).toBe(75000); // 100000 - 25000

      // Stock must decrease from 2 to 1
      const updatedVehicle = await prisma.vehicle.findUnique({ where: { id: testVehicleId } });
      expect(updatedVehicle?.quantity).toBe(1);
    });

    it('should prevent duplicate payment verification (replay attack)', async () => {
      await expect(
        paymentService.verifyPaymentAndCreateOrder({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: validSignature,
          vehicleId: testVehicleId,
          deliveryInfo,
          bookingAmount: 25000,
        })
      ).rejects.toThrow('Payment already processed');
    });
  });
});
