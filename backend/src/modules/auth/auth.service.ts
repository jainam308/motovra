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

    // Generate 6-digit numeric OTP code and store SHA-256 hash in DB
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
    const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 Mins

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isVerified: false,
        provider: 'local',
        verificationToken: hashedOtp,
        verificationTokenExpiry,
        role: 'CUSTOMER',
      },
    });

    try {
      await emailService.sendVerificationEmail({
        email: user.email,
        verificationToken: otpCode,
      });
    } catch (emailErr) {
      console.error('[Registration Verification Email Error]', emailErr);
    }

    return {
      message: 'Registration successful! Please verify your email with the 6-digit OTP.',
      user: { id: user.id, email: user.email, isVerified: user.isVerified },
    };
  },

  async verifyOtp(rawEmail: string, rawOtp: string): Promise<any> {
    const email = rawEmail?.trim().toLowerCase();
    const otp = rawOtp?.trim();

    if (!email || !otp || otp.length !== 6) {
      const err: any = new Error('Invalid or expired OTP code');
      err.statusCode = 400;
      throw err;
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        verificationToken: hashedOtp,
        verificationTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      const err: any = new Error('Invalid or expired OTP code');
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

    const accessToken = jwtUtils.generateAccessToken({ userId: updatedUser.id, role: updatedUser.role });
    const refreshToken = jwtUtils.generateRefreshToken({ userId: updatedUser.id });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: updatedUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      message: 'Email verified successfully! Welcome to Motovra.',
      accessToken,
      refreshToken,
      user: { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role, isVerified: true },
    };
  },

  async verifyEmail(rawToken: string): Promise<any> {
    if (!rawToken || typeof rawToken !== 'string') {
      const err: any = new Error('Invalid or expired verification token');
      err.statusCode = 400;
      throw err;
    }

    const trimmedToken = rawToken.trim();

    const hashedToken = crypto.createHash('sha256').update(trimmedToken).digest('hex');

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

  async resendVerification(rawEmail: string): Promise<any> {
    const email = rawEmail?.trim().toLowerCase();
    if (!email) {
      const err: any = new Error('Email is required');
      err.statusCode = 400;
      throw err;
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (!user) {
      const err: any = new Error('User not found with provided email address.');
      err.statusCode = 404;
      throw err;
    }

    if (user.isVerified) {
      const err: any = new Error('Account is already verified.');
      err.statusCode = 400;
      throw err;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
    const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: hashedOtp,
        verificationTokenExpiry,
      },
    });

    try {
      await emailService.sendVerificationEmail({
        email: user.email,
        verificationToken: otpCode,
      });
    } catch (emailErr) {
      console.error('[Resend Verification Email Error]', emailErr);
    }

    return {
      message: 'Verification OTP sent successfully.',
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
      if (user.role === 'ADMIN') {
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true, verifiedAt: new Date() },
        });
        user.isVerified = true;
      } else {
        const err: any = new Error('Please verify your email address before logging in.');
        err.statusCode = 403;
        throw err;
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
    const email = profile.emails?.[0]?.value?.trim().toLowerCase();
    if (!email) throw new Error('No email found in Google profile');

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: profile.id },
          { email: { equals: email, mode: 'insensitive' } },
        ],
      },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profile.id,
          provider: 'google',
          isVerified: true,
          verifiedAt: user.verifiedAt || new Date(),
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          googleId: profile.id,
          provider: 'google',
          isVerified: true,
          verifiedAt: new Date(),
          role: 'CUSTOMER',
        },
      });
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

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, isVerified: user.isVerified } };
  }
};
