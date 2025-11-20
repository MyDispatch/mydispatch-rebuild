/* ==================================================================================
   V28 SELECT - FLAT DESIGN 2.0
   ==================================================================================
   ✅ Tailwind-native colors (border-slate-200, text-slate-900)
   ✅ Focus: border-slate-400 + ring-slate-500
   ✅ Min-height: 44px (Touch-Target WCAG)
   ✅ NO v26-classes
   ✅ V28.1 PROFESSIONAL MINIMALISM
   ================================================================================== */

import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface V28SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
}

export const V28Select = forwardRef<HTMLSelectElement, V28SelectProps>(
  ({ label, options, className, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-slate-900"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full rounded-lg px-4 py-2.5 text-base',
            'min-h-[44px] transition-all duration-200',
            'bg-white border border-slate-200',
            'text-slate-900',
            'focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-500/10',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

V28Select.displayName = 'V28Select';
