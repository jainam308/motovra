import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { jwtUtils } from '../../../common/utils/jwt';

const prisma = new PrismaClient();

describe('POST /api/ai-market-analysis/:vehicleId (Integration)', () => {
  let adminToken: string;
  let customerToken: string;
  let testVehicleId: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: ['aiAdmin1', 'aiCust1'] } } });

    await prisma.user.create({ data: { id: 'aiAdmin1', email: 'aiadmin@motovra.com', role: 'ADMIN', isVerified: true } }).catch(() => {});
    await prisma.user.create({ data: { id: 'aiCust1', email: 'aicust@motovra.com', role: 'CUSTOMER', isVerified: true } }).catch(() => {});

    adminToken = jwtUtils.generateAccessToken({ userId: 'aiAdmin1', role: 'ADMIN' });
    customerToken = jwtUtils.generateAccessToken({ userId: 'aiCust1', role: 'CUSTOMER' });

    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Porsche',
        model: '911 GT3 RS',
        category: 'SPORTS',
        price: 223800,
        quantity: 3,
      },
    });

    testVehicleId = vehicle.id;
  });

  afterAll(async () => {
    if (testVehicleId) {
      await prisma.vehicle.deleteMany({ where: { id: testVehicleId } });
    }
    await prisma.user.deleteMany({ where: { id: { in: ['aiAdmin1', 'aiCust1'] } } });
    await prisma.$disconnect();
  });

  it('should return 401 for unauthenticated request', async () => {
    const res = await request(app).post(`/api/ai-market-analysis/${testVehicleId}`);
    expect(res.status).toBe(401);
  });

  it('should return 403 for customer role', async () => {
    const res = await request(app)
      .post(`/api/ai-market-analysis/${testVehicleId}`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  it('should generate and save AI Market Intelligence for ADMIN role', async () => {
    const res = await request(app)
      .post(`/api/ai-market-analysis/${testVehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.recommendation).toBeDefined();
    expect(Number(res.body.data.estimatedMarketPrice)).toBeGreaterThan(0);
    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.strengths.length).toBeGreaterThan(0);
    expect(res.body.data.comparableVehicles.length).toBeGreaterThan(0);

    // Verify persisted in PostgreSQL DB
    const dbVehicle = await prisma.vehicle.findUnique({ where: { id: testVehicleId } });
    expect(dbVehicle?.recommendation).toBe(res.body.data.recommendation);
    expect(dbVehicle?.confidenceScore).toBeGreaterThanOrEqual(60);
  });

  it('should return 404 for non-existent vehicle ID', async () => {
    const res = await request(app)
      .post('/api/ai-market-analysis/c0a80101-9999-9999-9999-999999999999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
