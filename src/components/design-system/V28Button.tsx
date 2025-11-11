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

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

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
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
          'inline-flex items-center justify-center gap-2 whitespace-nowrap',
          'shadow-sm hover:shadow-md',
          // Size variants (kompakter, aber weiterhin touch-freundlich)
          // sm: kompakt für Toolbars und Sekundäraktionen
          size === 'sm' && 'h-9 px-4 text-sm',
          // md: Standardgröße – 40px Höhe
          size === 'md' && 'h-10 px-5 text-sm',
          // lg: Primäre CTAs – mindestens 44px Höhe
          size === 'lg' && 'min-h-[44px] h-auto px-6 sm:px-8 py-2 text-base',
          // Full width
          fullWidth && 'w-full',
          // Variant styles
          variant === 'primary' && !isDisabled && 'bg-primary text-slate-50 hover:bg-primary/90',
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
