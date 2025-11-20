/**
 * V28Switch - Atomic Design System Switch Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface V28SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
}

export const V28Switch = forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, V28SwitchProps>(
  ({ className, label, ...props }, ref) => (
    <div className="flex items-center space-x-2">
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center border-2 border-transparent",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "bg-slate-200 data-[state=checked]:bg-slate-700",
          "dark:bg-slate-700 dark:data-[state=checked]:bg-slate-600",
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block h-5 w-5 bg-white shadow-lg ring-0 transition-transform",
            "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchPrimitive.Root>
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
);

V28Switch.displayName = "V28Switch";
