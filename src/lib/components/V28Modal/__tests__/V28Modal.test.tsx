import { render, screen } from '@testing-library/react';
import { V28Modal } from '../index';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('V28Modal', () => {
  it('renders when open', () => {
    render(
      <V28Modal open={true} onOpenChange={() => {}}>
        <div>Modal Content</div>
      </V28Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <V28Modal open={false} onOpenChange={() => {}}>
        <div>Modal Content</div>
      </V28Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(
      <V28Modal open={true} onOpenChange={() => {}} title="Test Modal" description="Test Description">
        <div>Content</div>
      </V28Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('applies size variants correctly', () => {
    const { rerender } = render(
      <V28Modal open={true} onOpenChange={() => {}} size="sm">
        <div>Content</div>
      </V28Modal>
    );
    // Check that modal with sm size is rendered
    const smallModal = document.querySelector('.max-w-sm');
    expect(smallModal).toBeInTheDocument();

    rerender(
      <V28Modal open={true} onOpenChange={() => {}} size="full">
        <div>Content</div>
      </V28Modal>
    );
    // Check that modal with full size is rendered
    const fullModal = document.querySelector('.max-w-full');
    expect(fullModal).toBeInTheDocument();
  });
});
