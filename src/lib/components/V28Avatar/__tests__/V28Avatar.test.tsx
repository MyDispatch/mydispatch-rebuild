import { render, waitFor } from '@testing-library/react';
import { V28Avatar } from '../index';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('V28Avatar', () => {
  it('renders with default props', () => {
    const { container } = render(<V28Avatar />);
    const avatar = container.querySelector('[class*="relative flex"]');
    expect(avatar).toBeInTheDocument();
  });

  it('renders fallback text', async () => {
    const { getByText } = render(<V28Avatar fallback="JD" />);
    // Wait for fallback to appear (Radix Avatar has delay)
    await waitFor(() => {
      expect(getByText('JD')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('applies size variants correctly', () => {
    const { container, rerender } = render(<V28Avatar size="sm" />);
    const smallAvatar = container.querySelector('.h-8');
    expect(smallAvatar).toBeInTheDocument();

    rerender(<V28Avatar size="xl" />);
    const largeAvatar = container.querySelector('.h-16');
    expect(largeAvatar).toBeInTheDocument();
  });

  it('renders image when src provided', () => {
    const { container } = render(<V28Avatar src="https://example.com/avatar.jpg" alt="Test User" />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    if (img) {
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(img).toHaveAttribute('alt', 'Test User');
    }
  });
});
