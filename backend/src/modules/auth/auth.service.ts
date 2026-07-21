import { PrismaClient } from '@prisma/client';
import { ConflictError } from '../../common/errors/ConflictError';
import { UnauthorizedError } from '../../common/errors/UnauthorizedError';
import { passwordUtils } from '../../common/utils/password';
import { jwtUtils } from '../../common/utils/jwt';

const prisma = new PrismaClient();

export const authService = {
  async register(email: string, password: string): Promise<any> {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const passwordHash = await passwordUtils.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'CUSTOMER',
      },
    });

    return user;
  },

  async login(email: string, password: string): Promise<any> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await passwordUtils.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = jwtUtils.generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = jwtUtils.generateRefreshToken({ userId: user.id });

    return { accessToken, refreshToken };
  }
};
