/**
 * V28Select - Atomic Design System Select Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface V28SelectOption {
  label: string;
  value: string;
}

export interface V28SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  options: V28SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}

export const V28Select = forwardRef<HTMLSelectElement, V28SelectProps>(
  ({ className, label, error, placeholder, options, value, onChange, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              'flex h-10 w-full appearance-none rounded-md border bg-white px-3 py-2 text-sm pr-10',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-300',
              error
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-slate-200 dark:border-slate-700',
              className
            )}
            {...props}
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
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

V28Select.displayName = 'V28Select';
