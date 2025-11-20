/**
 * V28Checkbox - Atomic Design System Checkbox Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import { forwardRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface V28CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
}

export const V28Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  V28CheckboxProps
>(({ className, label, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 border border-slate-300 bg-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-slate-700 data-[state=checked]:text-white data-[state=checked]:border-slate-700",
        "dark:border-slate-600 dark:bg-slate-900",
        "dark:data-[state=checked]:bg-slate-600",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className="h-3 w-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    {label && (
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
        {label}
      </label>
    )}
  </div>
));

V28Checkbox.displayName = 'V28Checkbox';
