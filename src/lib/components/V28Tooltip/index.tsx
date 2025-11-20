/**
 * V28Tooltip - Atomic Design System Tooltip Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import { ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export interface V28TooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

export function V28Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  className,
}: V28TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            className={cn(
              "z-50 overflow-hidden border px-3 py-1.5 text-sm",
              "bg-slate-900 text-slate-50 border-slate-700",
              "dark:bg-slate-50 dark:text-slate-900 dark:border-slate-200",
              "animate-in fade-in-0 zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className
            )}
            sideOffset={4}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-slate-900 dark:fill-slate-50" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
