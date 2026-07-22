import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import {
  Car,
  CheckCircle2,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Award,
  Clock,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { StatCard } from '../components/dashboard/StatCard';

interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
}

interface AnalyticsReports {
  monthlyBookings: { month: string; count: number }[];
  bookingStatusDistribution: { status: string; count: number }[];
  topBookedVehicles: { make: string; model: string; count: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  averageBookingValue: number;
  vehiclesByBrand: { brand: string; count: number }[];
  availableVsSold: { available: number; sold: number };
}

interface RecentActivity {
  latestBookings: any[];
  recentPayments: any[];
  recentContactInquiries: any[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/analytics/stats')).data,
  });

  const { data: reports, isLoading: reportsLoading } = useQuery<AnalyticsReports>({
    queryKey: ['admin-reports'],
    queryFn: async () => (await api.get('/analytics/reports')).data,
  });

  const { data: activity, isLoading: activityLoading } = useQuery<RecentActivity>({
    queryKey: ['admin-activity'],
    queryFn: async () => (await api.get('/analytics/recent-activity')).data,
  });

  const isLoading = statsLoading || reportsLoading || activityLoading;

  if (isLoading) {
    return (
      <div data-testid="dashboard-skeleton" className="min-h-screen bg-black text-white p-6 md:p-10 space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-white/10 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-28 bg-white/5 border border-white/10 rounded-2xl p-4" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white/5 border border-white/10 rounded-2xl" />
          <div className="h-64 bg-white/5 border border-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats?.totalVehicles ?? 0,
      icon: Car,
      color: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
    {
      title: 'Available Vehicles',
      value: stats?.availableVehicles ?? 0,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings ?? 0,
      icon: Calendar,
      color: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-amber-400/20 to-amber-600/10',
      borderColor: 'border-amber-400/40',
      textColor: 'text-amber-300',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 space-y-10 selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
              Executive Suite
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Analytics
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Admin Intelligence Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time executive metrics, inventory velocity, revenue breakdown, and customer engagement.
          </p>
        </div>
      </div>

      {/* 5 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <StatCard key={card.title} {...card} index={idx} />
        ))}
      </div>

      {/* Analytics Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Booked Vehicles */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Top Booked Vehicles
            </h3>
            <span className="text-xs text-gray-400">Demand Ranking</span>
          </div>

          <div className="space-y-3">
            {reports?.topBookedVehicles && reports.topBookedVehicles.length > 0 ? (
              reports.topBookedVehicles.map((item, i) => (
                <div key={`${item.make}-${item.model}`} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-white">{item.make} {item.model}</p>
                      <p className="text-xs text-gray-400">{item.count} reservations</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    High Demand
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic py-6 text-center">No booking data available yet</p>
            )}
          </div>
        </div>

        {/* Vehicles by Brand */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" /> Inventory by Brand
            </h3>
            <span className="text-xs text-gray-400">Brand Mix</span>
          </div>

          <div className="space-y-3">
            {reports?.vehiclesByBrand && reports.vehiclesByBrand.length > 0 ? (
              reports.vehiclesByBrand.map(b => (
                <div key={b.brand} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-300">{b.brand}</span>
                    <span className="text-purple-400 font-bold">{b.count} models</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (b.count / (stats?.totalVehicles || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic py-6 text-center">No brand data available</p>
            )}
          </div>
        </div>

        {/* Available vs Sold Status */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Stock Availability
              </h3>
              <span className="text-xs text-gray-400">Inventory Status</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                <p className="text-2xl font-black text-emerald-400">{reports?.availableVsSold?.available ?? 0}</p>
                <p className="text-xs font-semibold text-emerald-300 mt-1 uppercase tracking-wider">Available</p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                <p className="text-2xl font-black text-amber-400">{reports?.availableVsSold?.sold ?? 0}</p>
                <p className="text-xs font-semibold text-amber-300 mt-1 uppercase tracking-wider">Reserved / Sold</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs text-gray-300">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Avg Booking Value:
            </span>
            <span className="font-extrabold text-amber-400 text-sm">
              ${(reports?.averageBookingValue ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Bookings */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Clock className="w-5 h-5 text-blue-400" /> Latest Reservations
          </h3>
          <div className="space-y-3">
            {activity?.latestBookings && activity.latestBookings.length > 0 ? (
              activity.latestBookings.map(b => (
                <div key={b.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>{b.make} {b.model}</span>
                    <span className="text-emerald-400">${Number(b.totalAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Customer: {b.fullName}</span>
                    <span className="text-blue-400">{b.orderNumber}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic py-4 text-center">No recent bookings</p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <CreditCard className="w-5 h-5 text-emerald-400" /> Recent Payments
          </h3>
          <div className="space-y-3">
            {activity?.recentPayments && activity.recentPayments.length > 0 ? (
              activity.recentPayments.map(p => (
                <div key={p.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span className="text-emerald-400">${Number(p.bookingAmount).toLocaleString()}</span>
                    <span className="text-amber-400 font-mono text-[10px]">{p.razorpayPaymentId}</span>
                  </div>
                  <p className="text-gray-400">Status: <span className="text-emerald-300 font-semibold">{p.paymentStatus}</span></p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic py-4 text-center">No recent payments</p>
            )}
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <MessageSquare className="w-5 h-5 text-amber-400" /> Customer Inquiries
          </h3>
          <div className="space-y-3">
            {activity?.recentContactInquiries && activity.recentContactInquiries.length > 0 ? (
              activity.recentContactInquiries.map(c => (
                <div key={c.id} className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>{c.name}</span>
                    <span className="text-amber-400">{c.subject}</span>
                  </div>
                  <p className="text-gray-400 truncate">{c.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic py-4 text-center">No recent inquiries</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
