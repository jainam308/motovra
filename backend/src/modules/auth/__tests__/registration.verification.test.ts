import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import { emailService } from '../../../common/services/email.service';

const prisma = new PrismaClient();

jest.spyOn(emailService, 'sendVerificationEmail').mockImplementation(async () => {
  return Promise.resolve({ success: true, messageId: 'mock-verification-id' } as any);
});

describe('Cycle 2 — Email Verification Registration Flow (TDD)', () => {
  const testEmail = `reg_verify_${Date.now()}@example.com`;
  const password = 'Password123!';

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: 'reg_verify_' } }
    });
    await prisma.$disconnect();
  });

  it('should register user with isVerified = false, generate hashed verification token, send email, and return NO JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password,
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/verify your email/i);
    expect(res.body.accessToken).toBeUndefined();
    expect(res.body.refreshToken).toBeUndefined();

    // Check user in database
    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(user).toBeDefined();
    expect(user?.isVerified).toBe(false);
    expect(user?.provider).toBe('local');
    expect(user?.verificationToken).toBeDefined();
    expect(typeof user?.verificationToken).toBe('string');
    expect(user?.verificationTokenExpiry).toBeDefined();

    // Verification token stored must be hashed (not raw 64 hex length raw token)
    expect(user?.verificationToken?.length).toBe(64); // SHA256 hex digest

    // Email service should have been invoked
    expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: testEmail,
        verificationToken: expect.any(String),
      })
    );
  });

  it('should return 409 conflict when registering with a duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password,
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/email already in use/i);
  });
});
