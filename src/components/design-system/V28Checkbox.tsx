/**
 * V28 Checkbox - Checkbox mit Label
 * 
 * Features:
 * - Label Support (inline oder gestapelt)
 * - Description Support
 * - Error State Handling
 * - Semantic Color Tokens
 * - Touch-optimiert (min 44px)
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/lib/compat';
import { typography } from '@/lib/design-system';

export interface V28CheckboxProps {
  /** Checkbox ID */
  id?: string;
  /** Label-Text */
  label: string;
  /** Optional Description unterhalb des Labels */
  description?: string;
  /** Error-Message */
  error?: string;
  /** Checked State */
  checked?: boolean;
  /** Default Checked (uncontrolled) */
  defaultChecked?: boolean;
  /** OnChange Handler */
  onCheckedChange?: (checked: boolean) => void;
  /** Disabled State */
  disabled?: boolean;
  /** Required Field */
  required?: boolean;
  /** Custom Class */
  className?: string;
}

export const V28Checkbox = forwardRef<HTMLButtonElement, V28CheckboxProps>(
  ({ 
    id,
    label, 
    description,
    error, 
    checked,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    required = false,
    className,
  }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-start space-x-3 min-h-[44px]">
          <Checkbox
            ref={ref}
            id={checkboxId}
            checked={checked}
            defaultChecked={defaultChecked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${checkboxId}-error` : 
              description ? `${checkboxId}-description` : 
              undefined
            }
            className={cn(
              'mt-1',
              error && 'border-status-error',
            )}
          />
          
          <div className="flex-1 space-y-1">
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-sm font-medium leading-none cursor-pointer',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                disabled && 'opacity-70 cursor-not-allowed',
              )}
            >
              {label}
              {required && <span className="text-status-error ml-1">*</span>}
            </label>
            
            {description && (
              <p 
                id={`${checkboxId}-description`}
                className={cn(typography.caption)}
              >
                {description}
              </p>
            )}
          </div>
        </div>
        
        {error && (
          <p 
            id={`${checkboxId}-error`}
            className={cn(typography.caption, 'text-status-error ml-8')}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

V28Checkbox.displayName = 'V28Checkbox';
