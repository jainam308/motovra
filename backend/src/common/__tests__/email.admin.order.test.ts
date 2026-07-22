import { emailService } from '../services/email.service';
import { paymentService } from '../../modules/payment/payment.service';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

describe('TDD Cycle: Admin Order Notification Email & Customer Email Resolution (RED)', () => {
  let testVehicleId: string;
  let testUserId: string = 'user-admin-email-test-303';

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.user.create({
      data: {
        id: testUserId,
        email: 'customer.adminorder@example.com',
        role: 'CUSTOMER',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Aston Martin Test',
        model: 'DBS Superleggera',
        category: 'GT',
        price: 320000,
        quantity: 3,
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

  it('should trigger admin order notification email to DEALERSHIP_EMAIL with full order details', async () => {
    const sendAdminOrderSpy = jest.spyOn(emailService, 'sendAdminOrderNotification');

    const razorpayOrder = await paymentService.createRazorpayOrder({
      vehicleId: testVehicleId,
      bookingAmount: 25000,
    });

    const mockPaymentId = `pay_admin_test_${Date.now()}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'n5YPbMCx25L2oZOLiGLU5HPN';
    const text = `${razorpayOrder.razorpayOrderId}|${mockPaymentId}`;
    const validSignature = crypto.createHmac('sha256', secret).update(text).digest('hex');

    const deliveryInfo = {
      fullName: 'Alex AdminAlert',
      email: 'alex.customer@example.com',
      phone: '+91 99887 76655',
      addressLine: '100 Ocean Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
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

    expect(sendAdminOrderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        orderNumber: expect.any(String),
        customerName: deliveryInfo.fullName,
        customerPhone: deliveryInfo.phone,
        customerEmail: deliveryInfo.email,
        make: 'Aston Martin Test',
        model: 'DBS Superleggera',
        amountPaid: 25000,
        remainingAmount: 295000, // 320000 - 25000
      })
    );

    sendAdminOrderSpy.mockRestore();
  });
});
