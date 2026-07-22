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
  /**
   * TDD Cycle 1: Dashboard Statistics
   * Concurrent aggregations for vehicles, bookings, revenue, and customers
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalVehicles,
      availableVehicles,
      totalBookings,
      revenueAggregate,
      totalCustomers,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { quantity: { gt: 0 } } }),
      prisma.order.count(),
      prisma.payment.aggregate({
        where: { paymentStatus: 'BOOKING_PAID' },
        _sum: { bookingAmount: true },
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);

    return {
      totalVehicles,
      availableVehicles,
      totalBookings,
      totalRevenue: Number(revenueAggregate._sum.bookingAmount || 0),
      totalCustomers,
    };
  },
};
