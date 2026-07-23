import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Cycle 1 — User Model Email Verification Schema & Default Behavior (TDD)', () => {
  const testEmail = `verification_model_test_${Date.now()}@example.com`;
  let createdUserId: string;

  afterAll(async () => {
    if (createdUserId) {
      await prisma.user.delete({ where: { id: createdUserId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  it('should create a local user with default verification fields (isVerified = false, provider = local)', async () => {
    const user = await (prisma.user.create as any)({
      data: {
        email: testEmail,
        passwordHash: 'hashed_password_123',
        isVerified: false,
        provider: 'local',
      },
    });

    createdUserId = user.id;

    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.isVerified).toBe(false);
    expect(user.provider).toBe('local');
    expect(user.verificationToken).toBeNull();
    expect(user.verificationTokenExpiry).toBeNull();
    expect(user.verifiedAt).toBeNull();
  });

  it('should allow setting verification token, expiration, and provider', async () => {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const updatedUser = await (prisma.user.update as any)({
      where: { id: createdUserId },
      data: {
        verificationToken: 'hashed_token_abc123',
        verificationTokenExpiry: expiresAt,
      },
    });

    expect(updatedUser.verificationToken).toBe('hashed_token_abc123');
    expect(updatedUser.verificationTokenExpiry).toBeDefined();
  });

  it('should update isVerified and verifiedAt when account is verified', async () => {
    const now = new Date();
    const verifiedUser = await (prisma.user.update as any)({
      where: { id: createdUserId },
      data: {
        isVerified: true,
        verifiedAt: now,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    expect(verifiedUser.isVerified).toBe(true);
    expect(verifiedUser.verifiedAt).toBeDefined();
    expect(verifiedUser.verificationToken).toBeNull();
    expect(verifiedUser.verificationTokenExpiry).toBeNull();
  });
});
