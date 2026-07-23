import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import App from '../../App';
import { Navbar } from '../layout/Navbar';
import api from '../../api/axios';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: [], meta: { total: 0, totalPages: 0 } } }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('Protected Routes & Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Navbar', () => {
    it('shows Sign In and Register buttons when unauthenticated', () => {
      renderWithProviders(<Navbar />);

      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
      expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
    });

    it('shows My Garage and Sign Out buttons when authenticated as customer', () => {
      renderWithProviders(<Navbar />, {
        user: { id: 'u1', email: 'customer@motovra.com', role: 'CUSTOMER' }
      });

      expect(screen.getByText('My Garage')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
      expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
    });

    it('shows Dashboard link when authenticated as ADMIN', () => {
      renderWithProviders(<Navbar />, {
        user: { id: 'a1', email: 'admin@motovra.com', role: 'ADMIN' }
      });

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('My Garage')).toBeInTheDocument();
    });
  });

  describe('App Route Protection', () => {
    it('redirects unauthenticated user navigating to /admin to /login', async () => {
      renderWithProviders(<App />, { initialEntries: ['/admin'] });

      expect(await screen.findByAltText('Motovra Emblem')).toBeInTheDocument();
    });

    it('redirects CUSTOMER user navigating to /admin to /showroom', async () => {
      renderWithProviders(<App />, {
        user: { id: 'c1', email: 'customer@motovra.com', role: 'CUSTOMER' },
        initialEntries: ['/admin']
      });

      expect(await screen.findByText(/vehicles matching your criteria/i)).toBeInTheDocument();
    });

    it('renders Admin page for ADMIN role user navigating to /admin', async () => {
      renderWithProviders(<App />, {
        user: { id: 'a1', email: 'admin@motovra.com', role: 'ADMIN' },
        initialEntries: ['/admin']
      });

      expect(await screen.findByRole('heading', { name: /Admin Intelligence Dashboard|Inventory Management/i })).toBeInTheDocument();
    });
  });
});
