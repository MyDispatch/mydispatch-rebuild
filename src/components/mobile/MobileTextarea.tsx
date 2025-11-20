/* ==================================================================================
   MOBILE-OPTIMIERTES TEXTAREA-ELEMENT V18.3
   ==================================================================================
   - Touch-optimiert
   - Auto-Resize
   - Zeichenzähler optional
   ================================================================================== */

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MobileTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  showCounter?: boolean;
  currentLength?: number;
}

export const MobileTextarea = forwardRef<HTMLTextAreaElement, MobileTextareaProps>(
  ({ label, error, onChange, maxLength, showCounter, currentLength, className, required, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <Label htmlFor={label} className="text-sm font-medium">
            {label} {required && <span className="text-status-error">*</span>}
          </Label>
        )}
        <textarea
          ref={ref}
          id={label}
          onChange={(e) => onChange?.(e.target.value)}
          maxLength={maxLength}
          required={required}
          className={cn(
            "w-full min-h-[88px] p-3 rounded-md border border-input",
            "bg-background text-foreground text-base",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y",
            error && "border-status-error focus:ring-status-error",
            className
          )}
          {...props}
        />
        <div className="flex items-center justify-between">
          {error && (
            <p className="text-xs text-status-error">{error}</p>
          )}
          {showCounter && maxLength && (
            <p className="text-xs text-muted-foreground ml-auto">
              {currentLength || 0} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

MobileTextarea.displayName = 'MobileTextarea';
