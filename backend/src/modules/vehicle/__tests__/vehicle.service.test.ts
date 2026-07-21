import { vehicleService } from '../vehicle.service';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    vehicle: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Vehicle Service - create', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject if price is negative (Joi validation)', async () => {
    const payload = {
      make: 'Toyota',
      model: 'Corolla',
      category: 'SEDAN',
      price: -100,
      quantity: 10
    };
    await expect(vehicleService.create(payload)).rejects.toThrow();
  });

  it('should persist valid payload via mocked repository', async () => {
    const payload = {
      make: 'Toyota',
      model: 'Corolla',
      category: 'SEDAN',
      price: 20000,
      quantity: 10
    };
    
    (prisma.vehicle.create as jest.Mock).mockResolvedValue({ id: '1', ...payload });
    
    const result = await vehicleService.create(payload);
    expect(result).toHaveProperty('id', '1');
    expect(prisma.vehicle.create).toHaveBeenCalledWith({ data: payload });
  });
});
