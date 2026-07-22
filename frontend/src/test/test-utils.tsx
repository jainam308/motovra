import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, User } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: User;
  initialEntries?: string[];
}

export const renderWithProviders = (
  ui: ReactElement,
  options?: RenderWithProvidersOptions
) => {
  const queryClient = createTestQueryClient();
  
  if (options?.user) {
    localStorage.setItem('user', JSON.stringify(options.user));
    localStorage.setItem('accessToken', 'mock-token');
  } else {
    localStorage.clear();
  }

  const initialEntries = options?.initialEntries || ['/'];

  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={initialEntries}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
    ...options,
  });
};
