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

describe('Admin Page & Vehicle Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue({
      data: {
        data: [
          { id: '1', make: 'Porsche', model: '911', category: 'SPORTS', price: 200000, quantity: 2 }
        ],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
      }
    });
  });

  const renderAdmin = () => {
    return renderWithProviders(<Admin />, {
      user: { id: 'admin1', email: 'admin@motovra.com', role: 'ADMIN' }
    });
  };

  it('renders the inventory table', async () => {
    renderAdmin();
    await waitFor(() => {
      expect(screen.getAllByText(/Porsche/i)[0]).toBeInTheDocument();
    });
  });

  it('validates client-side form before submitting', async () => {
    const user = userEvent.setup();
    renderAdmin();
    
    // Open modal
    await user.click(screen.getByRole('button', { name: /Add Vehicle/i }));
    
    expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();

    // Submit empty form
    await user.click(screen.getByRole('button', { name: /Create Vehicle/i }));

    // Expect validation messages
    expect(await screen.findByText('Make is required')).toBeInTheDocument();
    expect(await screen.findByText('Model is required')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('prompts confirmation on delete', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(api.delete).mockResolvedValue({ data: {} });

    renderAdmin();

    await waitFor(() => {
      expect(screen.getByTitle('Delete')).toBeInTheDocument();
    });

    await user.click(screen.getByTitle('Delete'));

    expect(confirmSpy).toHaveBeenCalled();
    expect(api.delete).toHaveBeenCalledWith('/vehicles/1');
  });
});
