/* ==================================================================================
   MOBILE-OPTIMIERTES SELECT-ELEMENT V18.3
   ==================================================================================
   - Touch-optimiert (min-h-[44px])
   - Native Select für bessere Mobile-UX
   - Keine seitlichen Scrolls
   - Deutsche Labels
   ================================================================================== */

import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MobileSelectOption {
  value: string;
  label: string;
}

interface MobileSelectProps {
  label?: string;
  options: MobileSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const MobileSelect = forwardRef<HTMLSelectElement, MobileSelectProps>(
  ({ label, options, value, onChange, placeholder, required, disabled, error, className }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <Label htmlFor={label} className="text-sm font-medium">
            {label} {required && <span className="text-status-error">*</span>}
          </Label>
        )}
        <select
          ref={ref}
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full min-h-[44px] h-11 px-3 rounded-md border border-input",
            "bg-background text-foreground text-base",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "appearance-none cursor-pointer",
            "[&>option]:bg-background [&>option]:text-foreground",
            error && "border-status-error focus:ring-status-error",
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.25rem",
            paddingRight: "2.5rem",
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-status-error mt-1">{error}</p>}
      </div>
    );
  }
);

MobileSelect.displayName = "MobileSelect";
