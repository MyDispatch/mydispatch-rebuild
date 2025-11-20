import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { V28Input } from '../V28Input';

describe('V28Input', () => {
  it('renders with placeholder', () => {
    const { container } = render(<V28Input placeholder="Test input" />);
    const input = container.querySelector('input');
    expect(input?.placeholder).toBe('Test input');
  });

  it('renders label when provided', () => {
    const { container } = render(<V28Input label="Email" placeholder="test" />);
    const label = container.querySelector('label');
    expect(label?.textContent).toBe('Email');
  });

  it('renders error message when provided', () => {
    const { container } = render(<V28Input error="Required field" placeholder="test" />);
    expect(container.textContent).toContain('Required field');
  });

  it('renders helper text when provided', () => {
    const { container } = render(<V28Input helperText="Must be 8 characters" placeholder="test" />);
    expect(container.textContent).toContain('Must be 8 characters');
  });

  it('prioritizes error over helper text', () => {
    const { container } = render(
      <V28Input error="Error message" helperText="Helper text" placeholder="test" />
    );
    expect(container.textContent).toContain('Error message');
    expect(container.textContent).not.toContain('Helper text');
  });

  it('applies error styles when error is present', () => {
    const { container } = render(<V28Input error="Error" placeholder="test" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('border-red-500');
  });

  it('handles disabled state', () => {
    const { container } = render(<V28Input placeholder="Test" disabled />);
    const input = container.querySelector('input');
    expect(input?.disabled).toBe(true);
    expect(input?.className).toContain('disabled:cursor-not-allowed');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<V28Input ref={ref} placeholder="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('accepts custom className', () => {
    const { container } = render(<V28Input placeholder="Test" className="custom-class" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('custom-class');
  });

  it('generates unique id when not provided', () => {
    const { container } = render(<V28Input placeholder="Test" />);
    const input = container.querySelector('input');
    expect(input?.id).toBeTruthy();
    expect(input?.id).toMatch(/^input-/);
  });

  it('uses provided id', () => {
    const { container } = render(<V28Input id="custom-id" placeholder="Test" />);
    const input = container.querySelector('input');
    expect(input?.id).toBe('custom-id');
  });

  it('links label to input with htmlFor', () => {
    const { container } = render(<V28Input id="test-input" label="Email" placeholder="Test" />);
    const label = container.querySelector('label');
    expect(label?.htmlFor).toBe('test-input');
  });
});
