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
      expect(screen.getByRole('heading', { name: /Porsche 911 GT3 RS/i })).toBeInTheDocument();
      expect(screen.getByText('2 In Network')).toBeInTheDocument();
    });
  });

  it('displays "Sign in to Acquire" disabled button when user is unauthenticated', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { data: [mockVehicle] }
    });

    renderVehicleDetail();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Porsche 911 GT3 RS/i })).toBeInTheDocument();
    });

    const acquireBtn = screen.getByRole('button', { name: /Sign in to Acquire/i });
    expect(acquireBtn).toBeDisabled();
    expect(screen.getByText('You must be signed in to an approved account to purchase.')).toBeInTheDocument();
  });

  it('enables "Acquire Now" button when authenticated and vehicle in stock', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { data: [mockVehicle] }
    });

    renderVehicleDetail({
      user: { id: 'u1', email: 'customer@motovra.com', role: 'CUSTOMER' }
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Acquire Now/i })).not.toBeDisabled();
    });
  });

  it('executes purchase API call on clicking Acquire Now', async () => {
    const user = userEvent.setup();
    vi.mocked(api.get).mockResolvedValue({
      data: { data: [mockVehicle] }
    });
    vi.mocked(api.post).mockResolvedValue({ data: { id: '1', quantity: 1 } });

    renderVehicleDetail({
      user: { id: 'u1', email: 'customer@motovra.com', role: 'CUSTOMER' }
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Acquire Now/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Acquire Now/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/vehicles/1/purchase');
    });
  });
});
