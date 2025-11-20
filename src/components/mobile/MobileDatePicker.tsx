/* ==================================================================================
   MOBILE-OPTIMIERTES DATEPICKER-ELEMENT V18.3
   ==================================================================================
   - Touch-optimiert (min-h-[44px])
   - Native Date Input für bessere Mobile-UX
   - Deutsche Formatierung (DD.MM.YYYY)
   ================================================================================== */

import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface MobileDatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  min?: string;
  max?: string;
  className?: string;
}

export const MobileDatePicker = forwardRef<HTMLInputElement, MobileDatePickerProps>(
  (
    { label, value, onChange, placeholder, required, disabled, error, min, max, className },
    ref
  ) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <Label htmlFor={label} className="text-sm font-medium">
            {label} {required && <span className="text-status-error">*</span>}
          </Label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            id={label}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            placeholder={placeholder}
            className={cn(
              "w-full min-h-[44px] h-11 px-3 pr-10 rounded-md border border-input",
              "bg-background text-foreground text-base",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "[&::-webkit-calendar-picker-indicator]:opacity-0",
              "[&::-webkit-calendar-picker-indicator]:absolute",
              "[&::-webkit-calendar-picker-indicator]:w-full",
              "[&::-webkit-calendar-picker-indicator]:h-full",
              "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
              error && "border-status-error focus:ring-status-error",
              className
            )}
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        {error && <p className="text-xs text-status-error mt-1">{error}</p>}
      </div>
    );
  }
);

MobileDatePicker.displayName = "MobileDatePicker";
