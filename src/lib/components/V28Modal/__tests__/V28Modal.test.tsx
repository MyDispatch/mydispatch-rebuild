import { render } from '@testing-library/react';
import { V28Modal } from '../index';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('V28Modal', () => {
  it('renders when open', () => {
    const { getByText } = render(
      <V28Modal open={true} onOpenChange={() => {}}>
        <div>Modal Content</div>
      </V28Modal>
    );
    expect(getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const { queryByText } = render(
      <V28Modal open={false} onOpenChange={() => {}}>
        <div>Modal Content</div>
      </V28Modal>
    );
    expect(queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders title and description', () => {
    const { getByText } = render(
      <V28Modal open={true} onOpenChange={() => {}} title="Test Modal" description="Test Description">
        <div>Content</div>
      </V28Modal>
    );
    expect(getByText('Test Modal')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
  });

  it('applies size variants correctly', () => {
    const { container, rerender } = render(
      <V28Modal open={true} onOpenChange={() => {}} size="sm">
        <div>Content</div>
      </V28Modal>
    );
    expect(container.querySelector('.max-w-sm')).toBeInTheDocument();

    rerender(
      <V28Modal open={true} onOpenChange={() => {}} size="full">
        <div>Content</div>
      </V28Modal>
    );
    expect(container.querySelector('.max-w-full')).toBeInTheDocument();
  });
});
