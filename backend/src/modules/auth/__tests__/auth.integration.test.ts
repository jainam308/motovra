import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { passwordUtils } from '../../../common/utils/password';

jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options, callback) => (req: any, res: any, next: any) => {
    if (strategy === 'google') {
      if (req.originalUrl.includes('/google/callback')) {
        req.user = {
          id: 'mockedGoogleId',
          email: 'googleuser@example.com',
          emails: [{ value: 'googleuser@example.com' }],
          role: 'CUSTOMER'
        };
        return next();
      } else {
        return res.redirect('https://accounts.google.com/o/oauth2/v2/auth');
      }
    }
    next();
  }),
  use: jest.fn(),
  initialize: jest.fn(() => (req: any, res: any, next: any) => next())
}));

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

  describe('POST /api/auth/logout', () => {
    it('should clear the cookie and invalidate the token, making subsequent refreshes fail', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testlogin@example.com', password: 'password123' });
      
      const cookies = loginRes.headers['set-cookie'];

      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);
      
      expect(logoutRes.status).toBe(200);

      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);
      
      expect(refreshRes.status).toBe(401);
    });
  });

  describe('GET /api/auth/google', () => {
    it('should redirect to Google OAuth authorization endpoint', async () => {
      const res = await request(app).get('/api/auth/google');
      expect(res.status).toBe(302);
      expect(res.header.location).toContain('accounts.google.com');
    });
  });

  describe('GET /api/auth/google/callback', () => {
    it('should redirect to frontend /oauth-callback with tokens in query params', async () => {
      const res = await request(app).get('/api/auth/google/callback');
      expect(res.status).toBe(302);
      expect(res.header.location).toContain('http://localhost:5173/oauth-callback?accessToken=');
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });
});
