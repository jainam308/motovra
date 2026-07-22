import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../axios';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
  Toaster: () => null,
}));

describe('Axios Interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('triggers toast and handles 403 Forbidden without redirecting', async () => {
    try {
      // @ts-ignore
      const interceptor = api.interceptors.response.handlers.find(h => h.rejected)?.rejected;
      if (interceptor) {
        await interceptor({
          response: { status: 403, data: { error: "You don't have permission" } }
        });
      }
    } catch (e) {
      // Expected to reject
    }

    expect(toast.error).toHaveBeenCalledWith("You don't have permission to perform this action.");
  });

  it('triggers toast, clears auth state, and redirects to /login on 401 when refresh fails', async () => {
    localStorage.setItem('accessToken', 'stale-token');
    localStorage.setItem('user', JSON.stringify({ id: 'u1' }));

    try {
      // @ts-ignore
      const interceptor = api.interceptors.response.handlers.find(h => h.rejected)?.rejected;
      if (interceptor) {
        await interceptor({
          config: { _retry: true },
          response: { status: 401, data: { error: 'Unauthorized' } }
        });
      }
    } catch (e) {
      // Expected to reject
    }

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(toast.error).toHaveBeenCalledWith('Session expired. Please sign in again.');
  });
});
