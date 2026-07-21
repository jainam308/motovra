import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, User } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { user?: User }
) => {
  const queryClient = createTestQueryClient();
  
  if (options?.user) {
    localStorage.setItem('user', JSON.stringify(options.user));
    localStorage.setItem('accessToken', 'mock-token');
  } else {
    localStorage.clear();
  }

  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    ),
    ...options,
  });
};
