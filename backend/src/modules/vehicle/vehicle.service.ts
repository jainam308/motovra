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
  },

  async list(query: any): Promise<any> {
    const { error, value } = vehicleValidation.search.validate(query);
    if (error) {
      const err: any = new Error(error.message);
      err.statusCode = 400;
      throw err;
    }

    const { page, limit, make, model, category, minPrice, maxPrice } = value;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (make) where.make = { contains: make, mode: 'insensitive' };
    if (model) where.model = { contains: model, mode: 'insensitive' };
    if (category) where.category = { contains: category, mode: 'insensitive' };
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({ where, skip, take: limit }),
      prisma.vehicle.count({ where })
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async update(id: string, data: any): Promise<any> {
    const { error, value } = vehicleValidation.update.validate(data);
    if (error) {
      const err: any = new Error(error.details[0].message);
      err.statusCode = 400;
      throw err;
    }

    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      const err: any = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }

    return prisma.vehicle.update({
      where: { id },
      data: value
    });
  },

  async delete(id: string): Promise<any> {
    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      const err: any = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }

    return prisma.vehicle.delete({
      where: { id }
    });
  }
};
