import { render, screen } from '@testing-library/react';
import { V28Sheet } from '../index';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('V28Sheet', () => {
  it('renders when open', () => {
    render(
      <V28Sheet open={true} onOpenChange={() => {}}>
        <div>Sheet Content</div>
      </V28Sheet>
    );
    expect(screen.getByText('Sheet Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <V28Sheet open={false} onOpenChange={() => {}}>
        <div>Sheet Content</div>
      </V28Sheet>
    );
    expect(screen.queryByText('Sheet Content')).not.toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(
      <V28Sheet open={true} onOpenChange={() => {}} title="Sheet Title" description="Sheet Description">
        <div>Content</div>
      </V28Sheet>
    );
    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    expect(screen.getByText('Sheet Description')).toBeInTheDocument();
  });

  it('applies side variants correctly', () => {
    const { rerender } = render(
      <V28Sheet open={true} onOpenChange={() => {}} side="left">
        <div>Content</div>
      </V28Sheet>
    );
    // Check that sheet with left side is rendered
    const leftSheet = document.querySelector('[class*="left-0"]');
    expect(leftSheet).toBeInTheDocument();

    rerender(
      <V28Sheet open={true} onOpenChange={() => {}} side="bottom">
        <div>Content</div>
      </V28Sheet>
    );
    // Check that sheet with bottom side is rendered
    const bottomSheet = document.querySelector('[class*="bottom-0"]');
    expect(bottomSheet).toBeInTheDocument();
  });
});
