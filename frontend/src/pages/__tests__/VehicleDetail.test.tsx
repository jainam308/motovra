import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/test-utils';
import { VehicleDetail } from '../VehicleDetail';
import api from '../../api/axios';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('VehicleDetail Page & Purchase Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockVehicle = {
    id: '1',
    make: 'Porsche',
    model: '911 GT3 RS',
    category: 'SPORTS',
    price: 223800,
    quantity: 2,
  };

  const renderVehicleDetail = (options?: { user?: any }) => {
    return renderWithProviders(
      <Routes>
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
      </Routes>,
      {
        initialEntries: ['/vehicles/1'],
        user: options?.user,
      }
    );
  };

  it('renders vehicle information correctly', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { data: [mockVehicle] }
    });

    renderVehicleDetail();

    await waitFor(() => {
      expect(screen.getByText('Porsche')).toBeInTheDocument();
      expect(screen.getByText('2 In Network')).toBeInTheDocument();
    });
  });

  it('shows "Sign in to Acquire" button when user is unauthenticated', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { data: [mockVehicle] }
    });

    renderVehicleDetail();

    await waitFor(() => {
      expect(screen.getByText('Porsche')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Sign in to Acquire/i })).toBeInTheDocument();
    expect(screen.getByText('You must be signed in to purchase a vehicle.')).toBeInTheDocument();
  });

  it('enables "Buy Now" button when authenticated and vehicle in stock', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { data: [mockVehicle] }
    });

    renderVehicleDetail({
      user: { id: 'u1', email: 'customer@motovra.com', role: 'CUSTOMER' }
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Buy Now/i })).not.toBeDisabled();
    });
  });

  it('opens checkout modal on clicking Buy Now', async () => {
    const user = userEvent.setup();
    vi.mocked(api.get).mockResolvedValue({
      data: { data: [mockVehicle] }
    });

    renderVehicleDetail({
      user: { id: 'u1', email: 'customer@motovra.com', role: 'CUSTOMER' }
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Buy Now/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Buy Now/i }));

    // Modal should open with the delivery address step
    await waitFor(() => {
      expect(screen.getByText('Delivery Address')).toBeInTheDocument();
    });
  });
});
