import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import { Showroom } from '../Showroom';
import api from '../../api/axios';

// Mock axios
vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  }
}));

describe('Showroom Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton loading state initially', async () => {
    // Keep the promise unresolved to stay in loading state
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<Showroom />);
    
    expect(screen.getByTestId('showroom-skeleton')).toBeInTheDocument();
  });

  it('renders empty state when no vehicles match', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { data: [] } });
    
    renderWithProviders(<Showroom />);
    
    await waitFor(() => {
      expect(screen.getByText(/No Vehicles Found/i)).toBeInTheDocument();
    });
  });

  it('disables purchase button and shows "Sold Out" when quantity is 0', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [{ id: '1', make: 'Porsche', model: '911', quantity: 0, price: 150000, category: 'SPORTS' }]
      }
    });

    renderWithProviders(<Showroom />, { user: { id: 'u1', email: 'test@example.com', role: 'CUSTOMER' } });

    await waitFor(() => {
      expect(screen.getByText('Porsche 911')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /Sold Out/i });
    expect(purchaseBtn).toBeDisabled();
  });

  it('optimistically decrements quantity on purchase and rolls back on failure', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [{ id: '2', make: 'Tesla', model: 'Model S', quantity: 1, price: 90000, category: 'SEDAN' }]
      }
    });
    
    // API fails with artificial delay so we can catch optimistic state
    vi.mocked(api.post).mockImplementation(() => 
      new Promise((_, reject) => setTimeout(() => reject(new Error('Conflict')), 100))
    );

    const user = userEvent.setup();
    renderWithProviders(<Showroom />, { user: { id: 'u1', email: 'test@example.com', role: 'CUSTOMER' } });

    await waitFor(() => {
      expect(screen.getByText('1 Available')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /Purchase Now/i });
    
    // Act
    await user.click(purchaseBtn);

    // Assert Optimistic Update (instantly displays Sold Out / 0 Available)
    await waitFor(() => {
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });
    
    // Assert Rollback after the API actually rejects 100ms later
    await waitFor(() => {
      expect(screen.getByText('1 Available')).toBeInTheDocument();
    });
    
    expect(api.post).toHaveBeenCalledWith('/vehicles/2/purchase');
  });
});
