import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('TDD Cycle 1 — Dashboard Statistics (RED)', () => {
  let adminToken: string;
  let adminUserId = 'user-admin-analytics-stats';
  let customerUserId = 'user-customer-analytics-stats';
  let testVehicleId: string;

  beforeAll(async () => {
    // Clean up
    await prisma.payment.deleteMany({ where: { order: { vehicle: { make: 'StatsTestMake' } } } });
    await prisma.order.deleteMany({ where: { vehicle: { make: 'StatsTestMake' } } });
    await prisma.vehicle.deleteMany({ where: { make: 'StatsTestMake' } });
    await prisma.user.deleteMany({ where: { id: { in: [adminUserId, customerUserId] } } });

    // Seed admin & customer users
    await prisma.user.create({
      data: {
        id: adminUserId,
        email: 'admin.stats@motovra.com',
        role: 'ADMIN',
      },
    });

    await prisma.user.create({
      data: {
        id: customerUserId,
        email: 'customer.stats@motovra.com',
        role: 'CUSTOMER',
      },
    });

    adminToken = jwt.sign(
      { id: adminUserId, email: 'admin.stats@motovra.com', role: 'ADMIN' },
      process.env.JWT_SECRET || 'secret'
    );

    // Seed test vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'StatsTestMake',
        model: 'StatsModel',
        category: 'SUPERCAR',
        price: 250000,
        quantity: 2,
      },
    });
    testVehicleId = vehicle.id;
  });

  afterAll(async () => {
    await prisma.payment.deleteMany({ where: { order: { vehicleId: testVehicleId } } });
    await prisma.order.deleteMany({ where: { vehicleId: testVehicleId } });
    await prisma.vehicle.deleteMany({ where: { id: testVehicleId } });
    await prisma.user.deleteMany({ where: { id: { in: [adminUserId, customerUserId] } } });
    await prisma.$disconnect();
  });

  it('GET /api/analytics/stats should return dashboard summary statistics', async () => {
    const res = await request(app)
      .get('/api/analytics/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalVehicles');
    expect(res.body).toHaveProperty('availableVehicles');
    expect(res.body).toHaveProperty('totalBookings');
    expect(res.body).toHaveProperty('totalRevenue');
    expect(res.body).toHaveProperty('totalCustomers');

    expect(typeof res.body.totalVehicles).toBe('number');
    expect(typeof res.body.availableVehicles).toBe('number');
    expect(typeof res.body.totalBookings).toBe('number');
    expect(typeof res.body.totalRevenue).toBe('number');
    expect(typeof res.body.totalCustomers).toBe('number');
  });

  it('GET /api/analytics/stats should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/analytics/stats');
    expect(res.status).toBe(401);
  });
});
