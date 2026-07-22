import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
}

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const totalVehicles = await prisma.vehicle.count();

    const availableVehicles = await prisma.vehicle.count({
      where: {
        quantity: { gt: 0 },
      },
    });

    const totalBookings = await prisma.order.count();

    const revenueAggregate = await prisma.payment.aggregate({
      where: {
        paymentStatus: 'BOOKING_PAID',
      },
      _sum: {
        bookingAmount: true,
      },
    });

    const totalRevenue = Number(revenueAggregate._sum.bookingAmount || 0);

    const totalCustomers = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    });

    return {
      totalVehicles,
      availableVehicles,
      totalBookings,
      totalRevenue,
      totalCustomers,
    };
  },
};
