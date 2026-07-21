import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ConflictError } from '../../common/errors/ConflictError';

const prisma = new PrismaClient();

export const authService = {
  async register(email: string, password: string): Promise<any> {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'CUSTOMER',
      },
    });

    return user;
  }
};
