/* ==================================================================================
   V28 BUTTON - UNIVERSAL PREMIUM DESIGN
   ==================================================================================
   ✅ rounded-xl (wie Pricing)
   ✅ shadow-sm hover:shadow-md
   ✅ hover:scale-[1.02]
   ✅ Ring focus (accessibility)
   ✅ Smooth transitions (200ms)
   ✅ Icon Support (left/right)
   ✅ Loading State
   ✅ Full Width Option
   ✅ forwardRef Support (V6K)
   ✅ HTML Attributes Support (role, aria-*, data-*)
   ================================================================================== */

import type { ReactNode} from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface V28ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  children?: ReactNode; // Optional for icon-only buttons
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  
  // Universal Features
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

export const V28Button = forwardRef<HTMLButtonElement, V28ButtonProps>(
  (
    {
      children,
      onClick,
      disabled = false,
      variant = 'primary',
      size = 'md',
      className,
      type = 'button',
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      loading = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={cn(
          'rounded-xl font-semibold',
          'transition-all duration-200',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500',
          'inline-flex items-center justify-center gap-2 whitespace-nowrap',
          'shadow-sm hover:shadow-md',
          // Size variants (WCAG 2.1 Level AA: min 44x44px touch targets)
          size === 'sm' && 'h-11 px-6 text-sm', // 44px (was 40px - WCAG fix)
          size === 'md' && 'h-12 px-8 text-base', // 48px ✅
          size === 'lg' && 'min-h-[56px] h-auto px-8 sm:px-10 py-3 text-base sm:text-lg', // 56px ✅
          // Full width
          fullWidth && 'w-full',
          // Variant styles
          variant === 'primary' && !isDisabled && 'bg-slate-700 text-white hover:bg-slate-800',
          variant === 'secondary' && !isDisabled && 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200',
          variant === 'ghost' && !isDisabled && 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200',
          variant === 'destructive' && !isDisabled && 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
          // Disabled state
          isDisabled && 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400',
          className
        )}
        {...props}
      >
        {Icon && iconPosition === 'left' && <Icon className="h-5 w-5" />}

        {loading ? 'Lädt...' : children}

        {Icon && iconPosition === 'right' && <Icon className="h-5 w-5" />}
      </button>
    );
  }
);

V28Button.displayName = 'V28Button';
