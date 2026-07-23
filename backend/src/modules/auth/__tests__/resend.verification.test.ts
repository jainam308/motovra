import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { emailService } from '../../../common/services/email.service';

const prisma = new PrismaClient();

jest.spyOn(emailService, 'sendVerificationEmail').mockImplementation(async () => {
  return Promise.resolve({ success: true } as any);
});

describe('Cycle 6 — Resend Verification Email Workflow (TDD)', () => {
  const unverifiedEmail = `resend_unverified_${Date.now()}@example.com`;
  const verifiedEmail = `resend_verified_${Date.now()}@example.com`;

  let unverifiedUserId: string;

  beforeAll(async () => {
    const unverifiedUser = await prisma.user.create({
      data: {
        email: unverifiedEmail,
        passwordHash: 'hash',
        isVerified: false,
        verificationToken: 'old_hashed_token',
        verificationTokenExpiry: new Date(Date.now() + 1000),
      },
    });
    unverifiedUserId = unverifiedUser.id;

    await prisma.user.create({
      data: {
        email: verifiedEmail,
        passwordHash: 'hash',
        isVerified: true,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: { in: [unverifiedEmail, verifiedEmail] },
      },
    });
    await prisma.$disconnect();
  });

  it('should resend verification email, generate a new hashed token, and invalidate previous token', async () => {
    const res = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: unverifiedEmail });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/verification email sent/i);

    const updatedUser = await prisma.user.findUnique({ where: { id: unverifiedUserId } });
    expect(updatedUser?.verificationToken).not.toBe('old_hashed_token');
    expect(updatedUser?.verificationToken?.length).toBe(64); // SHA256 hex digest

    expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ email: unverifiedEmail })
    );
  });

  it('should return 400 if user account is already verified', async () => {
    const res = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: verifiedEmail });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already verified/i);
  });

  it('should return 404/400 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: 'nonexistent@example.com' });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.error).toBeDefined();
  });
});
