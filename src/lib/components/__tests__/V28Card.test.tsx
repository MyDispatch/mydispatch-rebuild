import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { V28Card } from '../V28Card';
import { Users } from 'lucide-react';

describe('V28Card', () => {
  it('renders title and description', () => {
    const { container } = render(
      <V28Card title="Test Title" description="Test description" />
    );
    expect(container.textContent).toContain('Test Title');
    expect(container.textContent).toContain('Test description');
  });

  it('renders children correctly', () => {
    const { container } = render(
      <V28Card>
        <div>Test content</div>
      </V28Card>
    );
    expect(container.textContent).toContain('Test content');
  });

  it('renders icon when provided', () => {
    const { container } = render(
      <V28Card title="Test" icon={Users} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('applies default variant classes', () => {
    const { container } = render(<V28Card title="Test" variant="default" />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('rounded-lg');
    expect(card.className).toContain('border');
  });

  it('applies hover variant classes', () => {
    const { container } = render(<V28Card title="Test" variant="hover" />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('hover:shadow-lg');
  });

  it('applies selected variant classes', () => {
    const { container } = render(<V28Card title="Test" variant="selected" />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('shadow-md');
  });

  it('handles onClick callback', () => {
    const onClick = vi.fn();
    const { container } = render(<V28Card title="Test" onClick={onClick} />);
    const card = container.firstChild as HTMLElement;
    
    card.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies interactive classes when onClick is provided', () => {
    const { container } = render(<V28Card title="Test" onClick={() => {}} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('cursor-pointer');
    expect(card.className).toContain('hover:scale-[1.02]');
  });

  it('accepts custom className', () => {
    const { container } = render(<V28Card title="Test" className="custom-class" />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('renders without title and description', () => {
    const { container } = render(
      <V28Card>
        <div>Only children</div>
      </V28Card>
    );
    expect(container.textContent).toBe('Only children');
  });
});
