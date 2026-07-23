import { authService } from '../auth.service';
import { passwordUtils } from '../../../common/utils/password';
import { PrismaClient } from '@prisma/client';
import { ConflictError } from '../../../common/errors/ConflictError';

// Mock Prisma and passwordUtils
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    }
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('../../../common/utils/password', () => ({
  passwordUtils: {
    hash: jest.fn(),
    compare: jest.fn(),
  }
}));

const prisma = new PrismaClient();

describe('Auth Service - register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should hash the password with bcrypt (cost 12) and create user', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (passwordUtils.hash as jest.Mock).mockResolvedValue('hashedPassword123');
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: '1', email: 'test@example.com', isVerified: false });

    const result = await authService.register('test@example.com', 'password123');

    expect(passwordUtils.hash).toHaveBeenCalledWith('password123');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        isVerified: false,
        provider: 'local',
        role: 'CUSTOMER',
      }),
    });
    expect(result).toBeDefined();
  });

  it('should reject duplicate emails with a ConflictError', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: '1', email: 'test@example.com' });

    await expect(authService.register('test@example.com', 'password123')).rejects.toThrow(ConflictError);
    expect(passwordUtils.hash).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});

describe('Auth Service - login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw Error for incorrect password', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: '1', email: 'test@example.com', passwordHash: 'hash', isVerified: true });
    (passwordUtils.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.login('test@example.com', 'wrong')).rejects.toThrow();
  });

  it('should return tokens for correct credentials when user is verified', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: '1', email: 'test@example.com', passwordHash: 'hash', isVerified: true });
    (passwordUtils.compare as jest.Mock).mockResolvedValue(true);

    const result = await authService.login('test@example.com', 'correct');
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('should reject login if user is not verified', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: '1', email: 'test@example.com', passwordHash: 'hash', isVerified: false });
    (passwordUtils.compare as jest.Mock).mockResolvedValue(true);

    await expect(authService.login('test@example.com', 'correct')).rejects.toThrow(/verify your email/i);
  });
});

describe('Auth Service - logout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the refresh token from the database', async () => {
    (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
    await authService.logout('some-token');
    expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({ where: { token: 'some-token' } });
  });
});

describe('Auth Service - googleLogin', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create a new user if googleId does not exist', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: '1', role: 'CUSTOMER', isVerified: true });
    
    const result = await authService.googleLogin({
      id: 'google123',
      emails: [{ value: 'google@example.com' }]
    });
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('should link googleId if email already exists', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: '1', email: 'google@example.com', role: 'CUSTOMER' });
    (prisma.user.update as jest.Mock).mockResolvedValue({ id: '1', role: 'CUSTOMER', isVerified: true });
    
    const result = await authService.googleLogin({
      id: 'google123',
      emails: [{ value: 'google@example.com' }]
    });
    expect(result).toHaveProperty('accessToken');
    expect(prisma.user.update).toHaveBeenCalled();
  });
});

