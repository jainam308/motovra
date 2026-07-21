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

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return { accessToken, refreshToken };
  },

  async refresh(token: string): Promise<any> {
    if (!token) throw new UnauthorizedError('No refresh token provided');

    try {
      const decoded = jwtUtils.verifyRefreshToken(token);
      
      const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
      if (!dbToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      await prisma.refreshToken.delete({ where: { id: dbToken.id } });

      const user = await prisma.user.findUnique({ where: { id: dbToken.userId } });
      if (!user) throw new UnauthorizedError('User not found');

      const accessToken = jwtUtils.generateAccessToken({ userId: user.id, role: user.role });
      const refreshToken = jwtUtils.generateRefreshToken({ userId: user.id });

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  },

  async logout(token: string): Promise<void> {
    if (!token) return;
    await prisma.refreshToken.deleteMany({ where: { token } });
  },

  async googleLogin(profile: any): Promise<any> {
    const email = profile.emails?.[0].value;
    if (!email) throw new Error('No email found in Google profile');

    let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.id }
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            googleId: profile.id,
          }
        });
      }
    }

    const accessToken = jwtUtils.generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = jwtUtils.generateRefreshToken({ userId: user.id });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return { accessToken, refreshToken };
  }
};
