/* ==================================================================================
   ⚠️ LAYOUT FREEZE V28.1 - KEINE DESIGN/LAYOUT-ÄNDERUNGEN ERLAUBT!
   ==================================================================================
   DESIGN-SYSTEM: V28.1 Professional Minimalism (Slate-Palette)
   GESCHÜTZT: Input-Design, Höhe, Padding, Border, Focus-States
   ERLAUBT: Technische Optimierungen (Validation, A11y)
   VERBOTEN: Design-Änderungen, neue Varianten
   LETZTE FREIGABE: 2025-01-30
   ==================================================================================
   
   V28 AUTH INPUT - FLAT DESIGN 2.0
   ==================================================================================
   ✅ Tailwind-native colors (border-slate-200, text-slate-900)
   ✅ Focus: border-slate-400 + ring-slate-500
   ✅ Min-height: 44px (Touch-Target WCAG)
   ✅ NO v26-classes
   ✅ V28.1 PROFESSIONAL MINIMALISM
   ================================================================================== */

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface V28AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const V28AuthInput = forwardRef<HTMLInputElement, V28AuthInputProps>(
  ({ label, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-900"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-lg px-4 py-2.5 text-base',
            'min-h-[44px] transition-all duration-200',
            'bg-white border border-slate-200',
            'text-slate-900 placeholder:text-slate-400',
            'focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-500/10',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

V28AuthInput.displayName = 'V28AuthInput';
