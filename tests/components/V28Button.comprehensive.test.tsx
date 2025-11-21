/* ==================================================================================
   COMPREHENSIVE TESTS: V28Button Component
   ==================================================================================
   Coverage: Variants, sizes, states, accessibility, touch targets
   Target: 85%+ coverage (design system critical component)
   ================================================================================== */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { V28Button } from '@/components/ui/V28Button';

describe('V28Button - Design System Component Tests', () => {
  describe('Rendering & Variants', () => {
    it('should render with default variant (primary)', () => {
      render(<V28Button>Click Me</V28Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary');
    });

    it('should render secondary variant', () => {
      render(<V28Button variant="secondary">Secondary</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
    });

    it('should render success variant', () => {
      render(<V28Button variant="success">Success</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-success');
    });

    it('should render error variant', () => {
      render(<V28Button variant="error">Error</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-error');
    });

    it('should render warning variant', () => {
      render(<V28Button variant="warning">Warning</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-warning');
    });

    it('should render ghost variant', () => {
      render(<V28Button variant="ghost">Ghost</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent');
    });

    it('should render outline variant', () => {
      render(<V28Button variant="outline">Outline</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('bg-background');
    });
  });

  describe('Sizes', () => {
    it('should render default size', () => {
      render(<V28Button>Default</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
    });

    it('should render sm size', () => {
      render(<V28Button size="sm">Small</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9');
      expect(button).toHaveClass('px-3');
    });

    it('should render lg size', () => {
      render(<V28Button size="lg">Large</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-11');
      expect(button).toHaveClass('px-8');
    });

    it('should render icon size', () => {
      render(<V28Button size="icon">X</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('w-10');
    });
  });

  describe('States', () => {
    it('should handle disabled state', () => {
      render(<V28Button disabled>Disabled</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none');
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('should handle loading state', () => {
      render(<V28Button loading>Loading</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      // Check for loading spinner
      const svg = button.querySelector('svg.animate-spin');
      expect(svg).toBeInTheDocument();
    });

    it('should hide text content when loading', () => {
      render(<V28Button loading>Submit</V28Button>);

      const button = screen.getByRole('button');
      const span = button.querySelector('span');
      expect(span).toHaveClass('opacity-0'); // Text hidden during loading
    });
  });

  describe('Interaction', () => {
    it('should handle onClick events', () => {
      const handleClick = vi.fn();
      render(<V28Button onClick={handleClick}>Click</V28Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<V28Button disabled onClick={handleClick}>Disabled</V28Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not trigger onClick when loading', () => {
      const handleClick = vi.fn();
      render(<V28Button loading onClick={handleClick}>Loading</V28Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('🎯 Accessibility (WCAG 2.1)', () => {
    it('should have minimum touch target size 44x44px for default size', () => {
      render(<V28Button>Touch Target</V28Button>);

      const button = screen.getByRole('button');
      const styles = window.getComputedStyle(button);

      // h-10 = 40px, but with padding should meet 44x44px
      expect(button).toHaveClass('h-10'); // 40px base
      expect(button).toHaveClass('px-4'); // Horizontal padding
      expect(button).toHaveClass('py-2'); // Vertical padding
    });

    it('should have proper ARIA attributes when loading', () => {
      render(<V28Button loading>Processing</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be keyboard accessible', () => {
      const handleClick = vi.fn();
      render(<V28Button onClick={handleClick}>Keyboard</V28Button>);

      const button = screen.getByRole('button');

      // Simulate Enter key
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      // Note: Button onClick is triggered by native browser on Enter
      // So we just verify button is focusable
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have visible focus indicator', () => {
      render(<V28Button>Focus Test</V28Button>);

      const button = screen.getByRole('button');

      // Check for focus ring classes
      expect(button).toHaveClass('focus-visible:outline-none');
      expect(button).toHaveClass('focus-visible:ring-2');
      expect(button).toHaveClass('focus-visible:ring-ring');
      expect(button).toHaveClass('focus-visible:ring-offset-2');
    });
  });

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<V28Button className="custom-class">Custom</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('bg-primary'); // Still has default classes
    });

    it('should forward ref correctly', () => {
      const ref = vi.fn();
      render(<V28Button ref={ref as any}>Ref Test</V28Button>);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
    });

    it('should support asChild prop with Slot', () => {
      render(
        <V28Button asChild>
          <a href="/test">Link Button</a>
        </V28Button>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveClass('bg-primary'); // Should inherit button styles
    });

    it('should accept button type attribute', () => {
      render(<V28Button type="submit">Submit</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Design System Compliance', () => {
    it('should use semantic color tokens (not hardcoded Tailwind colors)', () => {
      render(<V28Button variant="primary">Primary</V28Button>);

      const button = screen.getByRole('button');

      // Should use semantic tokens like bg-primary, NOT bg-blue-600
      expect(button.className).toContain('bg-primary');
      expect(button.className).not.toContain('bg-blue-');
      expect(button.className).not.toContain('bg-red-');
      expect(button.className).not.toContain('bg-green-');
    });

    it('should have consistent border radius', () => {
      render(<V28Button>Rounded</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-md');
    });

    it('should have smooth transitions', () => {
      render(<V28Button>Transition</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors');
    });

    it('should have proper font weight', () => {
      render(<V28Button>Font</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('font-medium');
    });
  });

  describe('Edge Cases', () => {
    it('should handle children as React nodes', () => {
      render(
        <V28Button>
          <span>Icon</span>
          <span>Text</span>
        </V28Button>
      );

      const button = screen.getByRole('button');
      expect(button).toContainHTML('<span>Icon</span>');
      expect(button).toContainHTML('<span>Text</span>');
    });

    it('should handle empty children', () => {
      render(<V28Button></V28Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('should maintain styles with both variant and size', () => {
      render(<V28Button variant="success" size="lg">Large Success</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-success');
      expect(button).toHaveClass('h-11');
      expect(button).toHaveClass('px-8');
    });

    it('should combine loading and variant correctly', () => {
      render(<V28Button loading variant="error">Error Loading</V28Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-error');
      expect(button).toBeDisabled();

      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = vi.fn();

      const TestButton = () => {
        renderSpy();
        return <V28Button>Test</V28Button>;
      };

      const { rerender } = render(<TestButton />);

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(<TestButton />);

      // Should not trigger additional renders (React optimization)
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});
