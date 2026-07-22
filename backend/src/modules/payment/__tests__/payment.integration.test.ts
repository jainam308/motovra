import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { jwtUtils } from '../../../common/utils/jwt';
import crypto from 'crypto';

const prisma = new PrismaClient();

describe('Payment & Razorpay End-to-End Integration Tests', () => {
  let customerToken: string;
  let customerId: string = 'cust-pay-101';
  let vehicleId: string;

  beforeAll(async () => {
    // Scoped cleanup
    await prisma.user.deleteMany({ where: { id: customerId } });

    const user = await prisma.user.create({
      data: { id: customerId, email: 'paybuyer@motovra.com', role: 'CUSTOMER' },
    });

    customerToken = jwtUtils.generateAccessToken({ userId: user.id, role: user.role });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'RazorpayHttp',
        model: 'Model Y',
        category: 'SUV',
        price: 80000,
        quantity: 2,
      },
    });
    vehicleId = vehicle.id;
  });

  afterAll(async () => {
    if (vehicleId) {
      await prisma.payment.deleteMany({ where: { order: { vehicleId } } });
      await prisma.order.deleteMany({ where: { vehicleId } });
      await prisma.vehicle.deleteMany({ where: { id: vehicleId } });
    }
    await prisma.user.deleteMany({ where: { id: customerId } });
    await prisma.$disconnect();
  });

  describe('POST /api/payments/create-order', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .send({ vehicleId, bookingAmount: 25000 });

      expect(res.status).toBe(401);
    });

    it('should create Razorpay payment order and return order ID and key', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ vehicleId, bookingAmount: 25000 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('razorpayOrderId');
      expect(res.body.amount).toBe(25000);
      expect(res.body.currency).toBe('INR');
      expect(res.body).toHaveProperty('key');
    });
  });

  describe('POST /api/payments/verify', () => {
    const razorpay_order_id = 'order_integ_999';
    const razorpay_payment_id = 'pay_integ_888';
    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key_456';
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const deliveryInfo = {
      fullName: 'John Razor',
      phone: '+91 98765 00000',
      addressLine: '100 Gateway Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
    };

    it('should fail with 400 when signature is invalid', async () => {
      const res = await request(app)
        .post('/api/payments/verify')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature: 'fake_signature',
          vehicleId,
          deliveryInfo,
          bookingAmount: 25000,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('signature');
    });

    it('should verify payment successfully, create order with BOOKING_PAID status, and decrease vehicle quantity', async () => {
      const res = await request(app)
        .post('/api/payments/verify')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature: validSignature,
          vehicleId,
          deliveryInfo,
          bookingAmount: 25000,
        });

      expect(res.status).toBe(201);
      expect(res.body.order.status).toBe('BOOKING_PAID');
      expect(res.body.payment.razorpayPaymentId).toBe(razorpay_payment_id);
      expect(Number(res.body.payment.bookingAmount)).toBe(25000);
      expect(Number(res.body.payment.remainingAmount)).toBe(55000); // 80000 - 25000

      // Verify stock was reduced from 2 to 1
      const updatedVehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      expect(updatedVehicle?.quantity).toBe(1);
    });
  });
});
