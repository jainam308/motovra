import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from '../AdminDashboard';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../api/axios';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('TDD Cycle 3 — Admin Dashboard UI (RED)', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderDashboard = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <AdminDashboard />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders dashboard loading state initially', () => {
    (api.get as any).mockReturnValue(new Promise(() => {}));
    renderDashboard();
    expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
  });

  it('renders stats cards, charts, and recent activity when data is loaded', async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/analytics/stats') {
        return Promise.resolve({
          data: {
            totalVehicles: 15,
            availableVehicles: 12,
            totalBookings: 8,
            totalRevenue: 200000,
            totalCustomers: 5,
          },
        });
      }
      if (url === '/analytics/reports') {
        return Promise.resolve({
          data: {
            monthlyBookings: [{ month: 'Jul 2026', count: 8 }],
            bookingStatusDistribution: [{ status: 'CONFIRMED', count: 8 }],
            topBookedVehicles: [{ make: 'Porsche', model: '911 GT3 RS', count: 4 }],
            monthlyRevenue: [{ month: 'Jul 2026', revenue: 200000 }],
            averageBookingValue: 25000,
            vehiclesByBrand: [{ brand: 'Porsche', count: 5 }],
            availableVsSold: { available: 12, sold: 3 },
          },
        });
      }
      if (url === '/analytics/recent-activity') {
        return Promise.resolve({
          data: {
            latestBookings: [
              { id: '1', orderNumber: 'MV-1001', make: 'Porsche', model: '911 GT3 RS', fullName: 'John Doe', totalAmount: 250000, status: 'CONFIRMED' },
            ],
            recentPayments: [
              { id: 'p1', razorpayPaymentId: 'pay_123', bookingAmount: 25000, paymentStatus: 'BOOKING_PAID' },
            ],
            recentContactInquiries: [
              { id: 'c1', name: 'Jane Smith', subject: 'Custom Order', message: 'Interested in DBS Superleggera' },
            ],
          },
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Total Vehicles')).toBeInTheDocument();
      expect(screen.getByText('Available Vehicles')).toBeInTheDocument();
      expect(screen.getByText('Total Bookings')).toBeInTheDocument();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('Total Customers')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Porsche 911 GT3 RS')[0]).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
