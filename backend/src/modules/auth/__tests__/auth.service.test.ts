import { authService } from '../auth.service';
import { passwordUtils } from '../../../common/utils/password';
import { PrismaClient } from '@prisma/client';
import { ConflictError } from '../../../common/errors/ConflictError';

// Mock Prisma and passwordUtils
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
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
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (passwordUtils.hash as jest.Mock).mockResolvedValue('hashedPassword123');
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: '1', email: 'test@example.com' });

    const result = await authService.register('test@example.com', 'password123');

    expect(passwordUtils.hash).toHaveBeenCalledWith('password123');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashedPassword123',
        role: 'CUSTOMER',
      },
    });
    expect(result).toBeDefined();
  });

  it('should reject duplicate emails with a ConflictError', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'test@example.com' });

    await expect(authService.register('test@example.com', 'password123')).rejects.toThrow(ConflictError);
    expect(passwordUtils.hash).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
