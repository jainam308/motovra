import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { Orders } from '../Orders';
import api from '../../api/axios';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('Orders Page (My Orders)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when user has no orders', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    renderWithProviders(<Orders />, {
      user: { id: 'u1', email: 'test@example.com', role: 'CUSTOMER' }
    });

    await waitFor(() => {
      expect(screen.getByTestId('orders-empty-state')).toBeInTheDocument();
      expect(screen.getByText('No Orders Yet')).toBeInTheDocument();
    });
  });

  it('renders order cards with human-readable order number, vehicle details, total amount, and delivery info', async () => {
    const mockOrder = {
      id: 'ord-123',
      orderNumber: 'MV-1001',
      make: 'Porsche',
      model: '911 GT3 RS',
      quantity: 1,
      totalAmount: 223800,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      deliveryInfo: {
        fullName: 'Jane Doe',
        phone: '+1 555-0199',
        addressLine: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477'
      }
    };

    vi.mocked(api.get).mockResolvedValue({ data: [mockOrder] });

    renderWithProviders(<Orders />, {
      user: { id: 'u1', email: 'test@example.com', role: 'CUSTOMER' }
    });

    await waitFor(() => {
      expect(screen.getByText('MV-1001')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: /Porsche 911 GT3 RS/i })).toBeInTheDocument();
      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/742 Evergreen Terrace/i)).toBeInTheDocument();
    });
  });
});
