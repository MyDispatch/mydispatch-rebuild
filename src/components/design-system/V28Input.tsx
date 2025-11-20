/**
 * V28 Input - Standard Input-Feld
 *
 * Features:
 * - Label Support
 * - Error State Handling
 * - Semantic Color Tokens
 * - Accessibility (ARIA)
 */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/lib/compat";
import { typography } from "@/lib/design-system";

export interface V28InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional Label-Text */
  label?: string;
  /** Error-Message (zeigt roten Border + Text) */
  error?: string;
  /** Helper-Text unterhalb des Inputs */
  helperText?: string;
  /** Full Width (default: true) */
  fullWidth?: boolean;
}

export const V28Input = forwardRef<HTMLInputElement, V28InputProps>(
  ({ className, error, label, helperText, fullWidth = true, ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && (
          <label htmlFor={inputId} className={cn(typography.label, "text-foreground")}>
            {label}
            {props.required && <span className="text-status-error ml-1">*</span>}
          </label>
        )}

        <Input
          ref={ref}
          id={inputId}
          className={cn(error && "border-status-error focus-visible:ring-status-error", className)}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className={cn(typography.caption, "text-status-error")}
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className={typography.caption}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

V28Input.displayName = "V28Input";
