/**
 * V28Sheet - Atomic Design System Sheet Component
 * Part of MISSION I (ATLAS) - UI Atoms
 * Side panel drawer component
 */

import { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface V28SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
}

const sideVariants = {
  left: "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  right:
    "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  top: "inset-x-0 top-0 w-full data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
  bottom:
    "inset-x-0 bottom-0 w-full data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
};

export function V28Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = "right",
  className,
}: V28SheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:duration-300 data-[state=open]:duration-300",
            "border-slate-200 dark:border-slate-700 dark:bg-slate-900",
            sideVariants[side],
            className
          )}
        >
          <div className="flex flex-col space-y-2">
            {title && (
              <DialogPrimitive.Title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </DialogPrimitive.Title>
            )}
            {description && (
              <DialogPrimitive.Description className="text-sm text-slate-600 dark:text-slate-400">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">{children}</div>

          <DialogPrimitive.Close className="absolute right-4 top-4 opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-slate-900">
            <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
