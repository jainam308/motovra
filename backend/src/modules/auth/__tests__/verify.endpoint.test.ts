import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { emailService } from '../../../common/services/email.service';

const prisma = new PrismaClient();

jest.spyOn(emailService, 'sendWelcomeEmail').mockImplementation(async () => {
  return Promise.resolve({ success: true } as any);
});

describe('Cycle 3 — Email Verification Endpoint (TDD)', () => {
  const testEmail = `verify_endpoint_${Date.now()}@example.com`;
  const rawToken = 'valid_raw_token_1234567890abcdef';
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  let testUserId: string;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: 'hashed_password',
        isVerified: false,
        provider: 'local',
        verificationToken: hashedToken,
        verificationTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour valid
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'verify_endpoint_' } }
    });
    await prisma.$disconnect();
  });

  it('should verify email with valid token, set isVerified=true, set verifiedAt, clear token, send welcome email', async () => {
    const res = await request(app).get(`/api/auth/verify-email/${rawToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/email verified successfully/i);

    const updatedUser = await prisma.user.findUnique({ where: { id: testUserId } });
    expect(updatedUser?.isVerified).toBe(true);
    expect(updatedUser?.verifiedAt).toBeDefined();
    expect(updatedUser?.verificationToken).toBeNull();
    expect(updatedUser?.verificationTokenExpiry).toBeNull();

    expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: testEmail })
    );
  });

  it('should return 400 for already verified account or reused token', async () => {
    const res = await request(app).get(`/api/auth/verify-email/${rawToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid or expired/i);
  });

  it('should return 400 for expired verification token', async () => {
    const expiredRawToken = 'expired_raw_token_9876543210fedcba';
    const expiredHashedToken = crypto.createHash('sha256').update(expiredRawToken).digest('hex');

    await prisma.user.create({
      data: {
        email: `expired_${Date.now()}@example.com`,
        passwordHash: 'hash',
        isVerified: false,
        verificationToken: expiredHashedToken,
        verificationTokenExpiry: new Date(Date.now() - 60 * 1000), // Expired 1 min ago
      },
    });

    const res = await request(app).get(`/api/auth/verify-email/${expiredRawToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid or expired/i);
  });
});
