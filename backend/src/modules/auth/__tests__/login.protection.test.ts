import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { passwordUtils } from '../../../common/utils/password';

const prisma = new PrismaClient();

describe('Cycle 4 — Verified User Authentication & Login Protection (TDD)', () => {
  const verifiedEmail = `verified_user_${Date.now()}@example.com`;
  const unverifiedEmail = `unverified_user_${Date.now()}@example.com`;
  const password = 'Password123!';

  beforeAll(async () => {
    const passwordHash = await passwordUtils.hash(password);

    // Create verified user
    await prisma.user.create({
      data: {
        email: verifiedEmail,
        passwordHash,
        isVerified: true,
        provider: 'local',
      },
    });

    // Create unverified user
    await prisma.user.create({
      data: {
        email: unverifiedEmail,
        passwordHash,
        isVerified: false,
        provider: 'local',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: { in: [verifiedEmail, unverifiedEmail] },
      },
    });
    await prisma.$disconnect();
  });

  it('should allow login for verified user and return JWT tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: verifiedEmail, password });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.email).toBe(verifiedEmail);
  });

  it('should block login for unverified user and return error requesting verification', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: unverifiedEmail, password });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/verify your email/i);
    expect(res.body.accessToken).toBeUndefined();
  });

  it('should return 401 for invalid password regardless of verification status', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: verifiedEmail, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });
});
