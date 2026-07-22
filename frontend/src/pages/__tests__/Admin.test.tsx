import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import { Admin } from '../Admin';
import api from '../../api/axios';

vi.mock('../../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

// Mock window.confirm
const originalConfirm = window.confirm;

describe('Admin Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [
          { id: '1', make: 'Porsche', model: '911', quantity: 2, price: 150000, category: 'SPORTS' }
        ]
      }
    });
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  const renderAdmin = () => 
    renderWithProviders(<Admin />, { user: { id: 'a1', email: 'admin@motovra.com', role: 'ADMIN' } });

  it('renders the inventory table', async () => {
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText('Porsche 911')).toBeInTheDocument();
    });
  });

  it('validates client-side form before submitting', async () => {
    const user = userEvent.setup();
    renderAdmin();
    
    // Open modal
    await user.click(screen.getByRole('button', { name: /Add Vehicle/i }));
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Submit empty form
    await user.click(screen.getByRole('button', { name: /Save Vehicle/i }));

    // Expect validation messages (HTML5 validation or custom)
    // We will use standard custom errors for our fields
    expect(await screen.findByText('Make is required')).toBeInTheDocument();
    expect(await screen.findByText('Model is required')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('prompts confirmation on delete', async () => {
    const user = userEvent.setup();
    renderAdmin();

    await waitFor(() => {
      expect(screen.getByText('Porsche 911')).toBeInTheDocument();
    });

    // Click delete
    await user.click(screen.getByTitle('Delete'));

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this vehicle?');
    expect(api.delete).toHaveBeenCalledWith('/vehicles/1');
  });
});
