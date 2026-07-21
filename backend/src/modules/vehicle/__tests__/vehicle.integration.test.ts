import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import jwtUtils from '../../../common/utils/jwt';

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
