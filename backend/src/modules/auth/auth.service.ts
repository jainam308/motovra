import { PrismaClient } from '@prisma/client';
import { ConflictError } from '../../common/errors/ConflictError';
import { UnauthorizedError } from '../../common/errors/UnauthorizedError';
import { passwordUtils } from '../../common/utils/password';
import { jwtUtils } from '../../common/utils/jwt';

const prisma = new PrismaClient();

import crypto from 'crypto';
import { emailService } from '../../common/services/email.service';

export const authService = {
  async register(rawEmail: string, password: string): Promise<any> {
    const email = rawEmail?.trim().toLowerCase();
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const passwordHash = await passwordUtils.hash(password);

    // Generate secure 32-byte raw token and store SHA-256 hash in DB
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isVerified: false,
        provider: 'local',
        verificationToken: hashedToken,
        verificationTokenExpiry,
        role: 'CUSTOMER',
      },
    });

    try {
      await emailService.sendVerificationEmail({
        email: user.email,
        verificationToken: rawToken,
      });
    } catch (emailErr) {
      console.error('[Registration Verification Email Error]', emailErr);
    }

    return {
      message: 'Registration successful! Please verify your email.',
      user: { id: user.id, email: user.email, isVerified: user.isVerified },
    };
  },

  async verifyEmail(rawToken: string): Promise<any> {
    if (!rawToken || typeof rawToken !== 'string') {
      const err: any = new Error('Invalid or expired verification token');
      err.statusCode = 400;
      throw err;
    }

    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: hashedToken,
        verificationTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      const err: any = new Error('Invalid or expired verification token');
      err.statusCode = 400;
      throw err;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    try {
      await emailService.sendWelcomeEmail({ email: updatedUser.email });
    } catch (emailErr) {
      console.error('[Welcome Email Error]', emailErr);
    }

    return {
      message: 'Email verified successfully! You can now sign in.',
    };
  },

  async login(rawEmail: string, password: string): Promise<any> {
    const email = rawEmail?.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await passwordUtils.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isVerified) {
      const err: any = new Error('Please verify your email address before logging in.');
      err.statusCode = 403;
      throw err;
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

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
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

      return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
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

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }
};
