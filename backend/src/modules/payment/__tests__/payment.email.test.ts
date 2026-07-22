import { emailService } from '../../../common/services/email.service';
import { paymentService } from '../payment.service';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

describe('TDD Cycle 2: Payment Success Email (RED 2)', () => {
  let testVehicleId: string;
  let testUserId: string = 'user-payment-email-202';

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.user.create({
      data: {
        id: testUserId,
        email: 'customer.paymenttest@example.com',
        role: 'CUSTOMER',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'FerrariTest',
        model: 'SF90 Stradale',
        category: 'SUPERCAR',
        price: 500000,
        quantity: 5,
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
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it('should trigger payment success email after valid Razorpay signature verification with Payment ID, Booking ID, Vehicle Details, Amount Paid, Remaining Due, and Receipt', async () => {
    const sendPaymentSpy = jest.spyOn(emailService, 'sendPaymentSuccessEmail');

    // 1. Create Razorpay order
    const razorpayOrder = await paymentService.createRazorpayOrder({
      vehicleId: testVehicleId,
      bookingAmount: 25000,
    });

    // 2. Generate valid HMAC-SHA256 signature
    const mockPaymentId = `pay_mock_${Date.now()}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'n5YPbMCx25L2oZOLiGLU5HPN';
    const text = `${razorpayOrder.razorpayOrderId}|${mockPaymentId}`;
    const validSignature = crypto.createHmac('sha256', secret).update(text).digest('hex');

    // 3. Verify payment
    const deliveryInfo = {
      fullName: 'Ferrari Customer',
      phone: '+1 800 555 9999',
      addressLine: '1 Monaco Way',
      city: 'Monte Carlo',
      state: 'MC',
      postalCode: '98000',
    };

    const result = await paymentService.verifyPaymentAndCreateOrder({
      razorpay_order_id: razorpayOrder.razorpayOrderId,
      razorpay_payment_id: mockPaymentId,
      razorpay_signature: validSignature,
      vehicleId: testVehicleId,
      userId: testUserId,
      bookingAmount: 25000,
      deliveryInfo,
    });

    expect(result).toHaveProperty('order');
    expect(result).toHaveProperty('payment');

    expect(sendPaymentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        razorpayPaymentId: mockPaymentId,
        orderNumber: expect.any(String),
        customerName: deliveryInfo.fullName,
        customerEmail: 'customer.paymenttest@example.com',
        make: 'FerrariTest',
        model: 'SF90 Stradale',
        amountPaid: 25000,
        remainingAmount: 475000, // 500,000 - 25,000
      })
    );

    sendPaymentSpy.mockRestore();
  });

  it('should NOT trigger payment success email if Razorpay signature is invalid/tampered', async () => {
    const sendPaymentSpy = jest.spyOn(emailService, 'sendPaymentSuccessEmail');

    const razorpayOrder = await paymentService.createRazorpayOrder({
      vehicleId: testVehicleId,
      bookingAmount: 25000,
    });

    const mockPaymentId = `pay_tampered_${Date.now()}`;
    const tamperedSignature = 'invalid_tampered_signature_string';

    const deliveryInfo = {
      fullName: 'Fake Customer',
      phone: '+1 800 555 0000',
      addressLine: '1 Tamper Street',
      city: 'FakeCity',
      state: 'FK',
      postalCode: '00000',
    };

    await expect(
      paymentService.verifyPaymentAndCreateOrder({
        razorpay_order_id: razorpayOrder.razorpayOrderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: tamperedSignature,
        vehicleId: testVehicleId,
        userId: testUserId,
        bookingAmount: 25000,
        deliveryInfo,
      })
    ).rejects.toThrow('Invalid payment signature');

    expect(sendPaymentSpy).not.toHaveBeenCalled();

    sendPaymentSpy.mockRestore();
  });
});
