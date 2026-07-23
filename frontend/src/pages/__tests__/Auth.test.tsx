import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import { Login } from '../Login';
import { Register } from '../Register';
import { OAuthCallback } from '../OAuthCallback';
import api from '../../api/axios';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('Auth User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Login Page', () => {
    it('renders the login form with email and password inputs', () => {
      renderWithProviders(<Login />);
      expect(screen.getByAltText('Motovra Emblem')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeInTheDocument();
    });

    it('submits login form and calls auth login API', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValueOnce({
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: { id: 'u1', email: 'customer@motovra.com', role: 'CUSTOMER' }
        }
      });

      renderWithProviders(<Login />);

      await user.type(screen.getByPlaceholderText('name@example.com'), 'customer@motovra.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /^Sign In$/i }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/login', {
          email: 'customer@motovra.com',
          password: 'password123'
        });
      });
    });

    it('displays error message when login fails with invalid credentials', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockRejectedValueOnce({
        response: { data: { error: 'Invalid credentials' } }
      });

      renderWithProviders(<Login />);

      await user.type(screen.getByPlaceholderText('name@example.com'), 'wrong@motovra.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /^Sign In$/i }));

      expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  describe('Register Page', () => {
    it('renders register form fields including password confirmation', () => {
      renderWithProviders(<Register />);
      expect(screen.getByAltText('Motovra Emblem')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
      const passwordInputs = screen.getAllByPlaceholderText('••••••••');
      expect(passwordInputs).toHaveLength(2);
      expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    });

    it('shows error if password and confirm password do not match', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Register />);

      await user.type(screen.getByPlaceholderText('name@example.com'), 'newuser@motovra.com');
      const [passInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
      await user.type(passInput, 'password123');
      await user.type(confirmInput, 'mismatchpass');
      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
      expect(api.post).not.toHaveBeenCalled();
    });

    it('submits registration form on valid input', async () => {
      const user = userEvent.setup();
      vi.mocked(api.post).mockResolvedValueOnce({
        data: {
          accessToken: 'new-token',
          refreshToken: 'new-refresh',
          user: { id: 'u2', email: 'newuser@motovra.com', role: 'CUSTOMER' }
        }
      });

      renderWithProviders(<Register />);

      await user.type(screen.getByPlaceholderText('name@example.com'), 'newuser@motovra.com');
      const [passInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');
      await user.type(passInput, 'password123');
      await user.type(confirmInput, 'password123');
      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/register', {
          email: 'newuser@motovra.com',
          password: 'password123'
        });
      });
    });
  });

  describe('Google OAuth Flow & Callback', () => {
    it('redirects to backend google auth endpoint when clicking Continue with Google', async () => {
      const user = userEvent.setup();
      const originalLocation = window.location;
      // @ts-ignore
      delete window.location;
      // @ts-ignore
      window.location = { href: '' };

      renderWithProviders(<Login />);

      const googleBtn = screen.getByRole('button', { name: /Continue with Google|Google/i });
      await user.click(googleBtn);

      expect(window.location.href).toBe('http://localhost:3000/api/auth/google');

      window.location = originalLocation;
    });

    it('renders error state on OAuthCallback when error param is present', async () => {
      renderWithProviders(<OAuthCallback />, {
        initialEntries: ['/oauth-callback?error=google_failed']
      });

      expect(await screen.findByText(/Google sign-in was cancelled or failed/i)).toBeInTheDocument();
    });
  });
});
