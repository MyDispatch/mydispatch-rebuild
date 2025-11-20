import { render } from '@testing-library/react';
import { V28Textarea } from '../index';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('V28Textarea', () => {
  it('renders without label', () => {
    const { getByPlaceholderText } = render(<V28Textarea placeholder="Enter text" />);
    expect(getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    const { getByText } = render(<V28Textarea label="Description" />);
    expect(getByText('Description')).toBeInTheDocument();
  });

  it('displays error message', () => {
    const { getByText } = render(<V28Textarea label="Message" error="Field is required" />);
    expect(getByText('Field is required')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    const { getByText } = render(<V28Textarea label="Comments" helperText="Max 500 characters" />);
    expect(getByText('Max 500 characters')).toBeInTheDocument();
  });

  it('supports custom rows', () => {
    const { container } = render(<V28Textarea rows={6} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveAttribute('rows', '6');
  });

  it('supports disabled state', () => {
    const { container } = render(<V28Textarea label="Disabled" disabled />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeDisabled();
  });
});
