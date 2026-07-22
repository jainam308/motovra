import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for centralized error handling and automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config || {};

    // 403 Forbidden -> Display permission toast without redirecting
    if (status === 403) {
      toast.error("You don't have permission to perform this action.");
      return Promise.reject(error);
    }

    // 401 Unauthorized -> Attempt token refresh once, or redirect to login on failure
    if (status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('No refresh token');

          const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
          localStorage.setItem('accessToken', data.accessToken);
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Silent refresh failed -> wipe state, notify user, and redirect
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          toast.error('Session expired. Please sign in again.');
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // Retry failed as well
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        toast.error('Session expired. Please sign in again.');
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    // Network / Server errors (no response from server)
    if (!error.response && error.message) {
      toast.error('Network error. Please check your internet connection.');
    }

    return Promise.reject(error);
  }
);

export default api;
