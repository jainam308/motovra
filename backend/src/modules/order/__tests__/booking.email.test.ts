import { emailService } from '../../../common/services/email.service';
import { orderService } from '../order.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('TDD Cycle 1: Booking Confirmation Email (RED 1)', () => {
  let testVehicleId: string;
  let testUserId: string = 'user-email-test-101';

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { id: testUserId } });
    const user = await prisma.user.create({
      data: {
        id: testUserId,
        email: 'customer.bookingtest@example.com',
        role: 'CUSTOMER',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'PorscheTest',
        model: '911 Carrera',
        category: 'SPORTS',
        price: 150000,
        quantity: 2,
      },
    });
    testVehicleId = vehicle.id;
  });

  afterAll(async () => {
    if (testVehicleId) {
      await prisma.order.deleteMany({ where: { vehicleId: testVehicleId } });
      await prisma.vehicle.deleteMany({ where: { id: testVehicleId } });
    }
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it('should trigger booking confirmation email with Booking ID, Vehicle Details, Booking Amount, Dealer Info, and Next Steps after successful booking', async () => {
    const sendBookingSpy = jest.spyOn(emailService, 'sendBookingConfirmationEmail');

    const deliveryInfo = {
      fullName: 'John BookingCustomer',
      phone: '+1 800 555 1234',
      addressLine: '77 Rodeo Drive',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90210',
    };

    const order = await orderService.createOrder({
      userId: testUserId,
      vehicleId: testVehicleId,
      deliveryInfo,
    });

    expect(sendBookingSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        orderNumber: order.orderNumber,
        customerName: deliveryInfo.fullName,
        customerEmail: 'customer.bookingtest@example.com',
        make: 'PorscheTest',
        model: '911 Carrera',
        bookingAmount: expect.any(Number),
        dealerPhone: expect.any(String),
        nextSteps: expect.any(String),
      })
    );

    sendBookingSpy.mockRestore();
  });

  it('should NOT send booking confirmation email if booking creation fails due to zero stock', async () => {
    const sendBookingSpy = jest.spyOn(emailService, 'sendBookingConfirmationEmail');

    // Create an out-of-stock vehicle
    const outOfStockVehicle = await prisma.vehicle.create({
      data: {
        make: 'ZeroStockCar',
        model: 'Model Zero',
        category: 'SEDAN',
        price: 50000,
        quantity: 0,
      },
    });

    const deliveryInfo = {
      fullName: 'Fail User',
      phone: '+1 800 555 0000',
      addressLine: '123 Fail Street',
      city: 'FailCity',
      state: 'FC',
      postalCode: '00000',
    };

    await expect(
      orderService.createOrder({
        userId: testUserId,
        vehicleId: outOfStockVehicle.id,
        deliveryInfo,
      })
    ).rejects.toThrow('Insufficient stock available');

    expect(sendBookingSpy).not.toHaveBeenCalled();

    await prisma.vehicle.delete({ where: { id: outOfStockVehicle.id } });
    sendBookingSpy.mockRestore();
  });
});
