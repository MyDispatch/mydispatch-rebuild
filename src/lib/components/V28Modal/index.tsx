/**
 * V28Modal - Atomic Design System Modal Component
 * Part of MISSION I (ATLAS) - UI Atoms
 * Full-screen overlay modal for critical actions
 */

import { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface V28ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export function V28Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = "md",
}: V28ModalProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    full: "max-w-full mx-4",
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-6",
            "border bg-white p-6 shadow-lg duration-300",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "border-slate-200 dark:border-slate-700 dark:bg-slate-900",
            sizeClasses[size],
            className
          )}
        >
          <div className="flex flex-col space-y-2">
            {title && (
              <DialogPrimitive.Title className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </DialogPrimitive.Title>
            )}
            {description && (
              <DialogPrimitive.Description className="text-sm text-slate-600 dark:text-slate-400">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>

          {children}

          <DialogPrimitive.Close className="absolute right-4 top-4 opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-900 dark:focus:ring-slate-600 dark:data-[state=open]:bg-slate-700">
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
