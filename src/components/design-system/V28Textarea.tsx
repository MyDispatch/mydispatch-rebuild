/**
 * V28 Textarea - Mehrzeiliges Eingabefeld
 *
 * Features:
 * - Label Support
 * - Error State Handling
 * - Character Counter (optional)
 * - Auto-Resize (optional)
 * - Semantic Color Tokens
 */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/lib/compat";
import { typography } from "@/lib/design-system";

export interface V28TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Optional Label-Text */
  label?: string;
  /** Error-Message (zeigt roten Border + Text) */
  error?: string;
  /** Helper-Text unterhalb der Textarea */
  helperText?: string;
  /** Zeige Character Counter (z.B. "45 / 200") */
  showCharacterCount?: boolean;
  /** Full Width (default: true) */
  fullWidth?: boolean;
}

export const V28Textarea = forwardRef<HTMLTextAreaElement, V28TextareaProps>(
  (
    {
      className,
      error,
      label,
      helperText,
      showCharacterCount = false,
      fullWidth = true,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={textareaId} className={cn(typography.label, "text-foreground")}>
              {label}
              {props.required && <span className="text-status-error ml-1">*</span>}
            </label>

            {showCharacterCount && maxLength && (
              <span
                className={cn(
                  typography.caption,
                  currentLength > maxLength ? "text-status-error" : "text-muted-foreground"
                )}
              >
                {currentLength} / {maxLength}
              </span>
            )}
          </div>
        )}

        <Textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={cn(error && "border-status-error focus-visible:ring-status-error", className)}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
            className={cn(typography.caption, "text-status-error")}
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${textareaId}-helper`} className={typography.caption}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

V28Textarea.displayName = "V28Textarea";
