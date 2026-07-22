import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { jwtUtils } from '../../../common/utils/jwt';

const prisma = new PrismaClient();

describe('Order Management & Purchase Flow Integration Tests', () => {
  let user1Token: string;
  let user2Token: string;
  let user1Id: string = 'user-id-101';
  let user2Id: string = 'user-id-102';
  let vehicleId: string;

  beforeAll(async () => {
    // Scoped cleanup
    await prisma.user.deleteMany({ where: { id: { in: [user1Id, user2Id] } } });

    // Create test users
    const u1 = await prisma.user.create({
      data: { id: user1Id, email: 'buyer1@motovra.com', role: 'CUSTOMER' }
    });
    const u2 = await prisma.user.create({
      data: { id: user2Id, email: 'buyer2@motovra.com', role: 'CUSTOMER' }
    });

    user1Token = jwtUtils.generateAccessToken({ userId: u1.id, role: u1.role });
    user2Token = jwtUtils.generateAccessToken({ userId: u2.id, role: u2.role });

    // Create test vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'PorscheTest',
        model: '911 GT3 RS',
        category: 'SPORTS',
        price: 223800,
        quantity: 3
      }
    });
    vehicleId = vehicle.id;
  });

  afterAll(async () => {
    if (vehicleId) {
      await prisma.order.deleteMany({ where: { vehicleId } });
      await prisma.vehicle.deleteMany({ where: { id: vehicleId } });
    }
    await prisma.user.deleteMany({ where: { id: { in: [user1Id, user2Id] } } });
    await prisma.$disconnect();
  });

  describe('POST /api/vehicles/:id/purchase (Order Creation)', () => {
    it('should create an order with unique orderNumber, status CONFIRMED, and reduce stock', async () => {
      const deliveryInfo = {
        fullName: 'Jane Doe',
        phone: '+1 555-0199',
        addressLine: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477'
      };

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ deliveryInfo });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('orderNumber');
      expect(res.body.orderNumber).toMatch(/^MV-/);
      expect(res.body.status).toBe('CONFIRMED');
      expect(res.body.make).toBe('PorscheTest');
      expect(res.body.deliveryInfo.fullName).toBe('Jane Doe');

      // Verify stock was reduced from 3 to 2
      const updatedVehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      expect(updatedVehicle?.quantity).toBe(2);
    });

    it('should fail to purchase when stock is insufficient', async () => {
      // Set stock to 0
      await prisma.vehicle.update({ where: { id: vehicleId }, data: { quantity: 0 } });

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ deliveryInfo: { fullName: 'Test User', phone: '+1-555-0100', addressLine: '1 Test St', city: 'Portland', state: 'OR', postalCode: '97201' } });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('stock');
    });
  });

  describe('GET /api/orders', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.status).toBe(401);
    });

    it('should return list of authenticated user\'s orders only', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0].userId).toBe(user1Id);
    });
  });

  describe('GET /api/orders/:id', () => {
    let createdOrderId: string;

    beforeAll(async () => {
      // Reset stock & create a fresh order for user1
      await prisma.vehicle.update({ where: { id: vehicleId }, data: { quantity: 5 } });
      const orderRes = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ deliveryInfo: { fullName: 'Jane Doe', phone: '+1-555-0199', addressLine: '742 Evergreen Terrace', city: 'Springfield', state: 'OR', postalCode: '97477' } });
      createdOrderId = orderRes.body.id;
    });

    it('should allow user to view their own order', async () => {
      const res = await request(app)
        .get(`/api/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdOrderId);
    });

    it('should deny access when another user tries to view the order', async () => {
      const res = await request(app)
        .get(`/api/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(403);
    });
  });
});
