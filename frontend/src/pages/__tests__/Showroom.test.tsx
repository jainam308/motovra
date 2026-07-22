import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import { Showroom } from '../Showroom';
import api from '../../api/axios';

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
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<Showroom />);
    
    expect(screen.getByTestId('showroom-skeleton')).toBeInTheDocument();
  });

  it('renders empty state when no vehicles match', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [],
        meta: { total: 0, totalPages: 0, page: 1, limit: 12 }
      }
    });
    
    renderWithProviders(<Showroom />);
    
    await waitFor(() => {
      expect(screen.getByText(/No Vehicles Found/i)).toBeInTheDocument();
    });
  });

  it('renders vehicle cards with details and stock status', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [
          { id: '1', make: 'Porsche', model: '911 GT3 RS', quantity: 2, price: 223800, category: 'SPORTS' },
          { id: '2', make: 'Ferrari', model: 'SF90 Stradale', quantity: 0, price: 524000, category: 'SPORTS' }
        ],
        meta: { total: 2, totalPages: 1, page: 1, limit: 12 }
      }
    });

    renderWithProviders(<Showroom />);

    await waitFor(() => {
      expect(screen.getByText('Porsche 911 GT3 RS')).toBeInTheDocument();
      expect(screen.getByText('Ferrari SF90 Stradale')).toBeInTheDocument();
    });

    expect(screen.getByText('2 Available')).toBeInTheDocument();
    expect(screen.getAllByText('Out of Stock')[0]).toBeInTheDocument();
  });

  it('filters vehicles by category when category button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [{ id: '1', make: 'Porsche', model: '911 GT3 RS', quantity: 2, price: 223800, category: 'SPORTS' }],
        meta: { total: 1, totalPages: 1, page: 1, limit: 12 }
      }
    });

    renderWithProviders(<Showroom />);

    await waitFor(() => {
      expect(screen.getByText('Porsche 911 GT3 RS')).toBeInTheDocument();
    });

    // Click SUV filter
    const suvCategoryBtn = screen.getByRole('button', { name: /^SUV$/i });
    await user.click(suvCategoryBtn);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('category=SUV'));
    });
  });

  it('renders pagination controls when totalPages > 1', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [{ id: '1', make: 'Porsche', model: '911 GT3 RS', quantity: 2, price: 223800, category: 'SPORTS' }],
        meta: { total: 15, totalPages: 2, page: 1, limit: 12 }
      }
    });

    renderWithProviders(<Showroom />);

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
  });
});
