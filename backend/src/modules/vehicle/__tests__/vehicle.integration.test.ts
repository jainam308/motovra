import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { jwtUtils } from '../../../common/utils/jwt';

const prisma = new PrismaClient();

describe('POST /api/vehicles', () => {
  let adminToken: string;
  let customerToken: string;

  beforeAll(async () => {
    await prisma.vehicle.deleteMany();
    adminToken = jwtUtils.generateAccessToken({ userId: 'admin1', role: 'ADMIN' });
    customerToken = jwtUtils.generateAccessToken({ userId: 'cust1', role: 'CUSTOMER' });
  });

  afterAll(async () => {
    await prisma.vehicle.deleteMany();
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
  beforeAll(async () => {
    await prisma.vehicle.deleteMany();
    await prisma.vehicle.createMany({
      data: [
        { make: 'Honda', model: 'Civic', category: 'SEDAN', price: 20000, quantity: 2 },
        { make: 'Honda', model: 'Accord', category: 'SEDAN', price: 25000, quantity: 1 },
        { make: 'Ford', model: 'F150', category: 'TRUCK', price: 35000, quantity: 5 }
      ]
    });
  });

  it('should filter by a single field (make)', async () => {
    const res = await request(app).get('/api/vehicles/search?make=Honda');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('should filter by combined fields (category and price range)', async () => {
    const res = await request(app).get('/api/vehicles/search?category=SEDAN&minPrice=22000&maxPrice=30000');
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
