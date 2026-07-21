import { PrismaClient } from '@prisma/client';
import { vehicleValidation } from './vehicle.validation';

const prisma = new PrismaClient();

export const vehicleService = {
  async create(data: any): Promise<any> {
    const { error, value } = vehicleValidation.create.validate(data);
    if (error) {
      const err: any = new Error(error.details[0].message);
      err.statusCode = 400;
      throw err;
    }

    return prisma.vehicle.create({
      data: value
    });
  }
};
