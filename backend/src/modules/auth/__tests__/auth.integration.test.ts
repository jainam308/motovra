import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { passwordUtils } from '../../../common/utils/password';

jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options, callback) => (req: any, res: any, next: any) => {
    if (strategy === 'google') {
      if (req.originalUrl.includes('/google/callback')) {
        if (callback) {
          return callback(null, { id: 'mockedGoogleId', emails: [{ value: 'test@example.com' }] });
        }
      } else {
        return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?state=${options.state}`);
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
    it('should redirect to Google with state parameter', async () => {
      const res = await request(app).get('/api/auth/google');
      expect(res.status).toBe(302);
      expect(res.header.location).toContain('state=');
      expect(res.headers['set-cookie'][0]).toMatch(/oauth_state=/);
    });
  });

  describe('GET /api/auth/google/callback', () => {
    it('should return tokens on callback with valid state', async () => {
      const authRes = await request(app).get('/api/auth/google');
      const cookies = authRes.headers['set-cookie'];
      const location = authRes.header.location;
      const stateParam = new URL(location).searchParams.get('state');

      const res = await request(app)
        .get(`/api/auth/google/callback?state=${stateParam}`)
        .set('Cookie', cookies);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('should return 401 on state mismatch CSRF attempt', async () => {
      const authRes = await request(app).get('/api/auth/google');
      const cookies = authRes.headers['set-cookie'];

      const res = await request(app)
        .get(`/api/auth/google/callback?state=invalid_hacker_state`)
        .set('Cookie', cookies);
      
      expect(res.status).toBe(401);
    });
  });
});
