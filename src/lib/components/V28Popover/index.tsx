/**
 * V28Popover - Atomic Design System Popover Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import { ReactNode } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export interface V28PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

export function V28Popover({
  trigger,
  children,
  side = "bottom",
  align = "center",
  className,
}: V28PopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={side}
          align={align}
          className={cn(
            "z-50 w-72 border bg-white p-4 shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "border-slate-200 dark:border-slate-700 dark:bg-slate-800",
            className
          )}
          sideOffset={4}
        >
          {children}
          <PopoverPrimitive.Arrow className="fill-white dark:fill-slate-800" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
