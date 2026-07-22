import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
}

export interface AnalyticsReports {
  monthlyBookings: { month: string; count: number }[];
  bookingStatusDistribution: { status: string; count: number }[];
  topBookedVehicles: { make: string; model: string; count: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  averageBookingValue: number;
  vehiclesByBrand: { brand: string; count: number }[];
  availableVsSold: { available: number; sold: number };
}

export interface RecentActivity {
  latestBookings: any[];
  recentPayments: any[];
  recentContactInquiries: any[];
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const analyticsService = {
  /**
   * TDD Cycle 1: Dashboard Summary Statistics
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

  /**
   * TDD Cycle 2: Comprehensive Analytics Reports
   */
  async getAnalyticsReports(): Promise<AnalyticsReports> {
    const [
      ordersByStatus,
      topVehiclesGroup,
      bookingAvgAgg,
      brandGroup,
      availableCount,
      soldCount,
      allOrders,
      allPayments,
    ] = await Promise.all([
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.order.groupBy({
        by: ['make', 'model'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      prisma.payment.aggregate({
        where: { paymentStatus: 'BOOKING_PAID' },
        _avg: { bookingAmount: true },
      }),
      prisma.vehicle.groupBy({
        by: ['make'],
        _count: { id: true },
      }),
      prisma.vehicle.count({ where: { quantity: { gt: 0 } } }),
      prisma.vehicle.count({ where: { quantity: 0 } }),
      prisma.order.findMany({ select: { createdAt: true }, orderBy: { createdAt: 'asc' } }),
      prisma.payment.findMany({
        where: { paymentStatus: 'BOOKING_PAID' },
        select: { paidAt: true, bookingAmount: true },
        orderBy: { paidAt: 'asc' },
      }),
    ]);

    // Format Booking Status Distribution
    const bookingStatusDistribution = ordersByStatus.map(o => ({
      status: o.status,
      count: o._count.id,
    }));

    // Format Top Booked Vehicles
    const topBookedVehicles = topVehiclesGroup.map(v => ({
      make: v.make,
      model: v.model,
      count: v._count.id,
    }));

    // Format Vehicles By Brand
    const vehiclesByBrand = brandGroup.map(b => ({
      brand: b.make,
      count: b._count.id,
    }));

    // Format Monthly Bookings
    const monthlyBookingsMap: { [key: string]: number } = {};
    allOrders.forEach(o => {
      const date = new Date(o.createdAt);
      const key = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
      monthlyBookingsMap[key] = (monthlyBookingsMap[key] || 0) + 1;
    });

    const monthlyBookings = Object.keys(monthlyBookingsMap).map(m => ({
      month: m,
      count: monthlyBookingsMap[m],
    }));

    // Format Monthly Revenue
    const monthlyRevenueMap: { [key: string]: number } = {};
    allPayments.forEach(p => {
      const date = p.paidAt ? new Date(p.paidAt) : new Date();
      const key = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
      monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + Number(p.bookingAmount);
    });

    const monthlyRevenue = Object.keys(monthlyRevenueMap).map(m => ({
      month: m,
      revenue: monthlyRevenueMap[m],
    }));

    return {
      monthlyBookings,
      bookingStatusDistribution,
      topBookedVehicles,
      monthlyRevenue,
      averageBookingValue: Number(bookingAvgAgg._avg.bookingAmount || 0),
      vehiclesByBrand,
      availableVsSold: {
        available: availableCount,
        sold: soldCount,
      },
    };
  },

  /**
   * TDD Cycle 2: Recent Activity Feed
   */
  async getRecentActivity(): Promise<RecentActivity> {
    const [latestBookings, recentPayments, recentContactInquiries] = await Promise.all([
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { vehicle: true },
      }),
      prisma.payment.findMany({
        take: 5,
        orderBy: { paidAt: 'desc' },
        include: { order: true },
      }),
      prisma.contactInquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      latestBookings,
      recentPayments,
      recentContactInquiries,
    };
  },
};
