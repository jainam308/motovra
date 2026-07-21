import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { passwordUtils } from '../../../common/utils/password';

const prisma = new PrismaClient();

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    const passwordHash = await passwordUtils.hash('password123');
    await prisma.user.create({
      data: {
        email: 'testlogin@example.com',
        passwordHash,
        role: 'CUSTOMER',
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should return 401 for incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testlogin@example.com', password: 'wrongpassword' });
    
    expect(res.status).toBe(401);
  });

  it('should return 200 with tokens for correct credentials and set httpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testlogin@example.com', password: 'password123' });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=.*;.*HttpOnly/);
  });

  describe('POST /api/auth/refresh', () => {
    it('should return 401 for missing refresh token cookie', async () => {
      const res = await request(app).post('/api/auth/refresh');
      expect(res.status).toBe(401);
    });

    it('should rotate tokens for valid refresh token cookie', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testlogin@example.com', password: 'password123' });
      
      const cookies = loginRes.headers['set-cookie'];

      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);
      
      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body).toHaveProperty('accessToken');
      expect(refreshRes.headers['set-cookie'][0]).toMatch(/refreshToken=.*;.*HttpOnly/);
    });
  });
});
