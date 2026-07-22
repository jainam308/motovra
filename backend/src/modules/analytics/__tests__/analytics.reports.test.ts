import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('TDD Cycle 2 — Analytics Reports (RED)', () => {
  let adminToken: string;
  let adminUserId = 'user-admin-analytics-reports';

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { id: adminUserId } });
    await prisma.user.create({
      data: {
        id: adminUserId,
        email: 'admin.reports@motovra.com',
        role: 'ADMIN',
      },
    });

    adminToken = jwt.sign(
      { id: adminUserId, email: 'admin.reports@motovra.com', role: 'ADMIN' },
      process.env.JWT_SECRET || 'secret'
    );
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: adminUserId } });
    await prisma.$disconnect();
  });

  it('GET /api/analytics/reports should return full analytics reports', async () => {
    const res = await request(app)
      .get('/api/analytics/reports')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('monthlyBookings');
    expect(res.body).toHaveProperty('bookingStatusDistribution');
    expect(res.body).toHaveProperty('topBookedVehicles');
    expect(res.body).toHaveProperty('monthlyRevenue');
    expect(res.body).toHaveProperty('averageBookingValue');
    expect(res.body).toHaveProperty('vehiclesByBrand');
    expect(res.body).toHaveProperty('availableVsSold');

    expect(Array.isArray(res.body.monthlyBookings)).toBe(true);
    expect(Array.isArray(res.body.bookingStatusDistribution)).toBe(true);
    expect(Array.isArray(res.body.topBookedVehicles)).toBe(true);
    expect(Array.isArray(res.body.monthlyRevenue)).toBe(true);
    expect(typeof res.body.averageBookingValue).toBe('number');
    expect(Array.isArray(res.body.vehiclesByBrand)).toBe(true);
    expect(res.body.availableVsSold).toHaveProperty('available');
    expect(res.body.availableVsSold).toHaveProperty('sold');
  });

  it('GET /api/analytics/recent-activity should return recent activity feeds', async () => {
    const res = await request(app)
      .get('/api/analytics/recent-activity')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('latestBookings');
    expect(res.body).toHaveProperty('recentPayments');
    expect(res.body).toHaveProperty('recentContactInquiries');

    expect(Array.isArray(res.body.latestBookings)).toBe(true);
    expect(Array.isArray(res.body.recentPayments)).toBe(true);
    expect(Array.isArray(res.body.recentContactInquiries)).toBe(true);
  });
});
