import { PrismaClient } from '@prisma/client';
import { ConflictError } from '../../common/errors/ConflictError';
import { passwordUtils } from '../../common/utils/password';

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
  }
};
