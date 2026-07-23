import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PriceBadge } from '../PriceBadge';
import React from 'react';

describe('PriceBadge Component', () => {
  it('renders EXCELLENT_DEAL badge correctly', () => {
    render(<PriceBadge recommendation="EXCELLENT_DEAL" />);
    expect(screen.getByText('Excellent Deal')).toBeInTheDocument();
  });

  it('renders FAIR_DEAL badge correctly', () => {
    render(<PriceBadge recommendation="FAIR_DEAL" />);
    expect(screen.getByText('Fair Market Value')).toBeInTheDocument();
  });

  it('renders PREMIUM_PRICING badge correctly', () => {
    render(<PriceBadge recommendation="PREMIUM_PRICING" />);
    expect(screen.getByText('Premium Collector Pricing')).toBeInTheDocument();
  });

  it('returns null if recommendation is missing', () => {
    const { container } = render(<PriceBadge recommendation={null} />);
    expect(container.firstChild).toBeNull();
  });
});
