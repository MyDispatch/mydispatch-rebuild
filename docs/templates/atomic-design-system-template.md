# 🧱 ATOMIC DESIGN SYSTEM TEMPLATE

**Version**: 1.0  
**Source**: neXify SOL INVICTUS v21.0 - MISSION I (ATLAS)  
**Applicability**: React/TypeScript projects with Tailwind CSS

---

## 📘 CONTEXT

This template provides a step-by-step guide to create a production-ready atomic design system with:
- ✅ Reusable UI components
- ✅ Full Storybook documentation
- ✅ Comprehensive unit tests
- ✅ Accessibility (a11y) compliance
- ✅ Dark mode support

---

## 🎯 OBJECTIVE

Establish a scalable, maintainable atomic design system that:
1. Reduces code duplication
2. Ensures design consistency
3. Speeds up feature development
4. Provides clear documentation for developers

---

## 📚 PREREQUISITES

### Required Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@storybook/react": "^8.6.14",
    "@storybook/react-vite": "^8.6.14",
    "@testing-library/react": "^16.3.0",
    "vitest": "^4.0.4"
  }
}
```

### Required Configuration
1. Tailwind CSS configured
2. Storybook set up
3. Vitest + React Testing Library installed

---

## 🛠️ STEP-BY-STEP GUIDE

### Step 1: Define Component Atoms

**Prompt to AI**:
```
Create a set of atomic UI components based on the following specifications:

1. **V28Input**: Text input field with variants (default, error, disabled)
2. **V28Button**: Button with variants (primary, secondary, outline, ghost)
3. **V28Card**: Container with optional header and footer
4. **V28Badge**: Small status indicator (success, warning, error, info)
5. **V28Select**: Dropdown selector with search capability

Requirements:
- Use Tailwind CSS semantic tokens from `index.css`
- All colors MUST be HSL format
- Mobile-first responsive design
- Dark mode support built-in
- Use `class-variance-authority` for variant management
- Each component should be in `src/lib/components/[ComponentName].tsx`
```

---

### Step 2: Component Structure Template

**File**: `src/lib/components/V28Button.tsx`

```typescript
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface V28ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const V28Button = React.forwardRef<HTMLButtonElement, V28ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

V28Button.displayName = 'V28Button';
```

---

### Step 3: Create Storybook Stories

**Prompt to AI**:
```
For each component in `src/lib/components/`, create a corresponding Storybook story:

File pattern: `src/lib/components/[ComponentName].stories.tsx`

Include these stories:
- Default
- All variants
- Disabled state
- Interactive examples
- Accessibility checks

Use Storybook v8 with TypeScript.
```

**Example**: `src/lib/components/V28Button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { V28Button } from './V28Button';

const meta = {
  title: 'Components/V28Button',
  component: V28Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof V28Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <V28Button size="sm">Small</V28Button>
      <V28Button size="md">Medium</V28Button>
      <V28Button size="lg">Large</V28Button>
    </div>
  ),
};
```

---

### Step 4: Write Unit Tests

**Prompt to AI**:
```
For each component, create a unit test file:

File pattern: `src/lib/components/__tests__/[ComponentName].test.tsx`

Test coverage must include:
- Component renders correctly
- All variants render correctly
- Props are applied correctly
- User interactions work (clicks, input changes)
- Accessibility attributes are present

Use Vitest + @testing-library/react.
```

**Example**: `src/lib/components/__tests__/V28Button.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { V28Button } from '../V28Button';

describe('V28Button', () => {
  it('renders correctly', () => {
    render(<V28Button>Click Me</V28Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders primary variant', () => {
    render(<V28Button variant="primary">Primary</V28Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('renders secondary variant', () => {
    render(<V28Button variant="secondary">Secondary</V28Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('handles disabled state', () => {
    render(<V28Button disabled>Disabled</V28Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('handles click events', () => {
    let clicked = false;
    render(<V28Button onClick={() => { clicked = true; }}>Click</V28Button>);
    const button = screen.getByRole('button');
    button.click();
    expect(clicked).toBe(true);
  });

  it('applies custom className', () => {
    render(<V28Button className="custom-class">Custom</V28Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
```

---

### Step 5: Design System Configuration

**File**: `index.css` (Tailwind Configuration)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Primary Colors */
    --primary: 222 47% 11%;
    --primary-foreground: 210 40% 98%;
    
    /* Secondary Colors */
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    
    /* Accent Colors */
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    
    /* Background */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    
    /* Borders */
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    
    /* Status Colors */
    --success: 142 76% 36%;
    --warning: 38 92% 50%;
    --error: 0 84% 60%;
    --info: 199 89% 48%;
  }

  .dark {
    --primary: 210 40% 98%;
    --primary-foreground: 222 47% 11%;
    
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    
    --border: 217 33% 17%;
    --input: 217 33% 17%;
  }
}
```

---

## ✅ VALIDATION CHECKLIST

After implementing the atomic design system, verify:

- [ ] All components render correctly in Storybook
- [ ] All unit tests pass (`npm run test`)
- [ ] Components use semantic tokens (no direct colors)
- [ ] Dark mode works correctly
- [ ] Components are mobile-responsive
- [ ] Accessibility (a11y) checks pass
- [ ] Documentation is complete (JSDoc comments)
- [ ] No TypeScript errors

---

## 🚀 USAGE IN PROJECT

Once completed, use components like this:

```typescript
import { V28Button } from '@/lib/components/V28Button';
import { V28Card } from '@/lib/components/V28Card';
import { V28Badge } from '@/lib/components/V28Badge';

export function MyFeature() {
  return (
    <V28Card>
      <h1>My Feature</h1>
      <V28Badge variant="success">Active</V28Badge>
      <V28Button variant="primary" onClick={handleClick}>
        Submit
      </V28Button>
    </V28Card>
  );
}
```

---

## 📈 EXPECTED OUTCOMES

After implementing this template:
- ✅ 5-10 reusable atomic components
- ✅ 100% test coverage for new components
- ✅ Full Storybook documentation
- ✅ Consistent design language across app
- ✅ Faster feature development (2-3x speed increase)

---

## 🔧 TROUBLESHOOTING

### Issue: Colors not applying
**Solution**: Ensure `tailwind.config.ts` extends semantic tokens from `index.css`

### Issue: Storybook not showing stories
**Solution**: Check `.storybook/main.ts` includes correct story paths

### Issue: Tests failing
**Solution**: Ensure `vitest.config.ts` includes `@testing-library/jest-dom` setup

---

## 📚 ADDITIONAL RESOURCES

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [class-variance-authority Docs](https://cva.style/docs)
- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Template Version**: 1.0  
**Last Updated**: 2025-01-31  
**Maintained By**: neXify AI Team
