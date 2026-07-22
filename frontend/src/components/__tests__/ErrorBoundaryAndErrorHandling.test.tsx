import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import App from '../../App';
import { Showroom } from '../../pages/Showroom';
import { ErrorBoundary } from '../ErrorBoundary';
import api from '../../api/axios';

vi.mock('../../api/axios', async () => {
  const actual: any = await vi.importActual('../../api/axios');
  return {
    ...actual,
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: actual.default?.interceptors || {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }
  };
});

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
  Toaster: () => null,
}));

// Component that throws error for Error Boundary testing
const ProblematicComponent = () => {
  throw new Error('Test crash in component');
};

describe('Error Handling, Error Boundary & 404 Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('React Error Boundary', () => {
    it('renders fallback UI when a child component throws an uncaught error', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      renderWithProviders(
        <ErrorBoundary>
          <ProblematicComponent />
        </ErrorBoundary>
      );

      expect(screen.getByRole('heading', { name: /Something Went Wrong/i })).toBeInTheDocument();
      expect(screen.getByText(/Test crash in component/i)).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('404 Page', () => {
    it('renders custom 404 page for unknown routes', async () => {
      renderWithProviders(<App />, { initialEntries: ['/unknown-page-route'] });

      expect(await screen.findByRole('heading', { name: /404 - Page Not Found/i })).toBeInTheDocument();
      expect(screen.getByText(/The luxury route you are trying to reach does not exist/i)).toBeInTheDocument();
    });
  });

  describe('409 Stock Conflict handling', () => {
    it('displays inline conflict message on vehicle card when purchase encounters 409 conflict', async () => {
      const user = userEvent.setup();
      vi.mocked(api.get).mockResolvedValue({
        data: {
          data: [{ id: 'v100', make: 'Ferrari', model: 'SF90', quantity: 1, price: 500000, category: 'SPORTS' }],
          meta: { total: 1, totalPages: 1 }
        }
      });

      // Mock purchase API returning 409 conflict
      vi.mocked(api.post).mockRejectedValueOnce({
        response: { status: 409, data: { error: 'Stock conflict: Someone else just purchased this vehicle.' } }
      });

      renderWithProviders(<Showroom />, {
        user: { id: 'u1', email: 'test@example.com', role: 'CUSTOMER' }
      });

      await waitFor(() => {
        expect(screen.getByText('Ferrari SF90')).toBeInTheDocument();
      });

      const purchaseBtn = screen.getByRole('button', { name: /Acquire Now|Purchase/i });
      await user.click(purchaseBtn);

      // Assert inline conflict message appears on the card
      expect(await screen.findByText(/Stock conflict: Someone else just purchased this vehicle/i)).toBeInTheDocument();
    });
  });

  describe('Logout Flow', () => {
    it('executes POST /api/auth/logout, clears client state, removes protected data, and redirects to login', async () => {
      const user = userEvent.setup();
      vi.mocked(api.get).mockResolvedValue({ data: [] });
      vi.mocked(api.post).mockResolvedValueOnce({ data: { message: 'Logged out' } });

      renderWithProviders(<App />, {
        user: { id: 'u1', email: 'customer@motovra.com', role: 'CUSTOMER' },
        initialEntries: ['/profile']
      });

      expect(await screen.findByText('customer@motovra.com')).toBeInTheDocument();

      const signOutBtn = screen.getAllByRole('button', { name: /Sign Out/i })[0];
      await user.click(signOutBtn);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/logout');
      });

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(await screen.findByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
    });
  });
});
