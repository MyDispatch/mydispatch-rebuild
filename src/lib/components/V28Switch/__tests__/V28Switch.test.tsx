import { render } from '@testing-library/react';
import { V28Switch } from '../index';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('V28Switch', () => {
  it('renders without label', () => {
    const { container } = render(<V28Switch />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toBeInTheDocument();
  });

  it('renders with label', () => {
    const { getByText } = render(<V28Switch label="Enable Feature" />);
    expect(getByText('Enable Feature')).toBeInTheDocument();
  });

  it('supports checked state', () => {
    const { container } = render(<V28Switch label="Test" defaultChecked />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('supports disabled state', () => {
    const { container } = render(<V28Switch label="Test" disabled />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toBeDisabled();
  });
});
