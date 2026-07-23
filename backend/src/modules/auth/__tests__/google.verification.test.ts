import { authService } from '../auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Cycle 5 — Google Authentication & Automatic Verification (TDD)', () => {
  const googleEmailNew = `google_new_${Date.now()}@example.com`;
  const googleEmailExisting = `google_existing_${Date.now()}@example.com`;
  const googleId1 = `google_id_${Date.now()}_1`;
  const googleId2 = `google_id_${Date.now()}_2`;

  beforeAll(async () => {
    // Create an unverified local user with googleEmailExisting
    await prisma.user.create({
      data: {
        email: googleEmailExisting,
        passwordHash: 'hashed_local_pass',
        isVerified: false,
        provider: 'local',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: { in: [googleEmailNew, googleEmailExisting] },
      },
    });
    await prisma.$disconnect();
  });

  it('should auto-verify new Google user and set provider = google, isVerified = true', async () => {
    const profile = {
      id: googleId1,
      emails: [{ value: googleEmailNew }],
    };

    const res = await authService.googleLogin(profile);

    expect(res.accessToken).toBeDefined();

    const userInDb = await prisma.user.findUnique({ where: { email: googleEmailNew } });
    expect(userInDb).toBeDefined();
    expect(userInDb?.isVerified).toBe(true);
    expect(userInDb?.provider).toBe('google');
    expect(userInDb?.googleId).toBe(googleId1);
    expect(userInDb?.verifiedAt).toBeDefined();
  });

  it('should link existing local user account, update provider = google, and auto-verify account', async () => {
    const profile = {
      id: googleId2,
      emails: [{ value: googleEmailExisting }],
    };

    const res = await authService.googleLogin(profile);

    expect(res.accessToken).toBeDefined();

    const userInDb = await prisma.user.findUnique({ where: { email: googleEmailExisting } });
    expect(userInDb).toBeDefined();
    expect(userInDb?.isVerified).toBe(true);
    expect(userInDb?.provider).toBe('google');
    expect(userInDb?.googleId).toBe(googleId2);
    expect(userInDb?.verifiedAt).toBeDefined();
  });
});
