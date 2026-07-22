import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { Profile } from '../Profile';
import api from '../../api/axios';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('Profile Page & My Garage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser = {
    id: 'u1',
    email: 'customer@motovra.com',
    role: 'CUSTOMER' as const
  };

  it('renders user profile details', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    renderWithProviders(<Profile />, { user: mockUser });

    expect(screen.getByText('customer@motovra.com')).toBeInTheDocument();
    expect(screen.getByText('CUSTOMER')).toBeInTheDocument();
  });

  it('renders empty garage message when no saved vehicles', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    renderWithProviders(<Profile />, { user: mockUser });

    await waitFor(() => {
      expect(screen.getByText(/your garage is empty/i)).toBeInTheDocument();
    });
  });

  it('renders saved vehicles list in garage', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [
        {
          id: 's1',
          vehicle: {
            id: 'v1',
            make: 'Ferrari',
            model: 'SF90 Stradale',
            category: 'SPORTS',
            price: 524000
          }
        }
      ]
    });

    renderWithProviders(<Profile />, { user: mockUser });

    await waitFor(() => {
      expect(screen.getByText('Ferrari')).toBeInTheDocument();
      expect(screen.getByText('SF90 Stradale')).toBeInTheDocument();
      expect(screen.getByText(/5,24|524/)).toBeInTheDocument();
    });
  });
});
