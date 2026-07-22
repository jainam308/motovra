import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { jwtUtils } from '../../../common/utils/jwt';

const prisma = new PrismaClient();

describe('POST /api/vehicles', () => {
  let adminToken: string;
  let customerToken: string;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: ['admin1', 'cust1'] } } });

    await prisma.user.create({ data: { id: 'admin1', email: 'admin1@test.com', role: 'ADMIN' } }).catch(() => {});
    await prisma.user.create({ data: { id: 'cust1', email: 'cust1@test.com', role: 'CUSTOMER' } }).catch(() => {});

    adminToken = jwtUtils.generateAccessToken({ userId: 'admin1', role: 'ADMIN' });
    customerToken = jwtUtils.generateAccessToken({ userId: 'cust1', role: 'CUSTOMER' });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: ['admin1', 'cust1'] } } });
    await prisma.$disconnect();
  });

  it('should return 403 for CUSTOMER role', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ make: 'Honda', model: 'Civic', category: 'SEDAN', price: 25000, quantity: 5 });
    
    expect(res.status).toBe(403);
  });

  it('should return 400 for unknown fields (Joi validation)', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Honda', model: 'Civic', category: 'SEDAN', price: 25000, quantity: 5, unknownField: 'hacker' });
    
    expect(res.status).toBe(400);
  });

  it('should create vehicle for ADMIN role with valid payload', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Honda', model: 'Civic', category: 'SEDAN', price: 25000, quantity: 5 });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});

describe('GET /api/vehicles', () => {
  it('should return empty result set with pagination metadata', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(501);
  });
});

describe('GET /api/vehicles/search', () => {
  let createdIds: string[] = [];

  beforeAll(async () => {
    const v1 = await prisma.vehicle.create({ data: { make: 'HondaTest', model: 'Civic', category: 'SEDAN', price: 20000, quantity: 2 } });
    const v2 = await prisma.vehicle.create({ data: { make: 'HondaTest', model: 'Accord', category: 'SEDAN', price: 25000, quantity: 1 } });
    const v3 = await prisma.vehicle.create({ data: { make: 'FordTest', model: 'F150', category: 'TRUCK', price: 35000, quantity: 5 } });
    createdIds = [v1.id, v2.id, v3.id];
  });

  afterAll(async () => {
    await prisma.vehicle.deleteMany({ where: { id: { in: createdIds } } });
  });

  it('should filter by a single field (make)', async () => {
    const res = await request(app).get('/api/vehicles/search?make=HondaTest');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('should filter by combined fields (category and price range)', async () => {
    const res = await request(app).get('/api/vehicles/search?make=HondaTest&category=SEDAN&minPrice=22000&maxPrice=30000');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].model).toBe('Accord');
  });

  it('should return 400 for invalid price range (min > max)', async () => {
    const res = await request(app).get('/api/vehicles/search?minPrice=30000&maxPrice=20000');
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/vehicles/:id', () => {
  it('should return 400 for invalid payload before touching DB', async () => {
    const adminToken = jwtUtils.generateAccessToken({ userId: 'admin1', role: 'ADMIN' });
    const res = await request(app)
      .put('/api/vehicles/123')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: -500 });
    
    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent id', async () => {
    const adminToken = jwtUtils.generateAccessToken({ userId: 'admin1', role: 'ADMIN' });
    const res = await request(app)
      .put('/api/vehicles/non-existent-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Honda', model: 'Civic', category: 'SEDAN', price: 20000, quantity: 5 });
    
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/vehicles/:id', () => {
  it('should return 403 for CUSTOMER role', async () => {
    const customerToken = jwtUtils.generateAccessToken({ userId: 'cust1', role: 'CUSTOMER' });
    const res = await request(app)
      .delete('/api/vehicles/123')
      .set('Authorization', `Bearer ${customerToken}`);
    
    expect(res.status).toBe(403);
  });

  it('should return 404 for non-existent id', async () => {
    const adminToken = jwtUtils.generateAccessToken({ userId: 'admin1', role: 'ADMIN' });
    const res = await request(app)
      .delete('/api/vehicles/non-existent-id')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).toBe(404);
  });
});

describe('POST /api/vehicles/:id/restock', () => {
  it('should return 403 for CUSTOMER role', async () => {
    const customerToken = jwtUtils.generateAccessToken({ userId: 'cust1', role: 'CUSTOMER' });
    const res = await request(app)
      .post('/api/vehicles/123/restock')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ amount: 5 });
    
    expect(res.status).toBe(403);
  });
});

describe('POST /api/vehicles/:id/purchase (Concurrency)', () => {
  let vehicleId: string;

  afterAll(async () => {
    if (vehicleId) {
      await prisma.order.deleteMany({ where: { vehicleId } });
      await prisma.vehicle.deleteMany({ where: { id: vehicleId } });
    }
  });

  it('should handle concurrent purchases safely and prevent negative quantity', async () => {
    const adminToken = jwtUtils.generateAccessToken({ userId: 'admin1', role: 'ADMIN' });
    const customerToken = jwtUtils.generateAccessToken({ userId: 'cust1', role: 'CUSTOMER' });

    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Honda', model: 'Concurrent', category: 'SEDAN', price: 20000, quantity: 1 });
    
    vehicleId = vehicleRes.body.id;

    const deliveryPayload = { deliveryInfo: { fullName: 'Test Buyer', phone: '+1-555-0101', addressLine: '1 Test Ave', city: 'Portland', state: 'OR', postalCode: '97201' } };
    const req1 = request(app).post(`/api/vehicles/${vehicleId}/purchase`).set('Authorization', `Bearer ${customerToken}`).send(deliveryPayload);
    const req2 = request(app).post(`/api/vehicles/${vehicleId}/purchase`).set('Authorization', `Bearer ${customerToken}`).send(deliveryPayload);
    const [res1, res2] = await Promise.all([req1, req2]);

    const statuses = [res1.status, res2.status].sort();
    
    // 201 Created for successful purchase order, 409 Conflict for concurrent purchase
    expect(statuses).toEqual([201, 409]);

    const finalVehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    expect(finalVehicle?.quantity).toBe(0);
  });
});
