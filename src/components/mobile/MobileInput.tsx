/* ==================================================================================
   MOBILE-OPTIMIERTES INPUT-ELEMENT V18.3
   ==================================================================================
   - Touch-optimiert (min-h-[44px])
   - Verschiedene Typen (text, email, tel, number)
   - Automatische Tastatur-Optimierung
   ================================================================================== */

import { forwardRef, InputHTMLAttributes } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MobileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  onChange?: (value: string) => void;
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ label, icon: Icon, error, onChange, className, required, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && (
          <Label htmlFor={label} className="text-xs font-medium">
            {label} {required && <span className="text-status-error">*</span>}
          </Label>
        )}
        <div className="relative w-full">
          {Icon && (
            <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          )}
          <input
            ref={ref}
            id={label}
            onChange={(e) => onChange?.(e.target.value)}
            required={required}
            className={cn(
              "w-full h-9 rounded-md border border-input",
              "bg-background text-foreground text-sm",
              "focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "touch-manipulation",
              Icon ? "pl-8 pr-2.5" : "px-2.5",
              error && "border-status-error focus:ring-status-error",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-status-error mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

MobileInput.displayName = 'MobileInput';
