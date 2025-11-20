/* ==================================================================================
   V28 DIALOG WRAPPER V33.0 - PRE-LOGIN DESIGN SYSTEM
   ==================================================================================
   ✅ Wrapper um shadcn/ui Dialog mit Pre-Login Design-System
   ✅ Gradient Header (wie AuthHeader)
   ✅ Gradient Footer (wie AuthFooter)
   ✅ Premium Shadows & Slate Colors
   ✅ Responsive (Fullscreen Mobile, Centered Desktop)
   ✅ Sizes: sm (384px), md (448px), lg (512px), xl (576px), full (100%)
   ================================================================================== */

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/lib/compat";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface V28DialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export function V28DialogWrapper({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  children,
  footer,
  showCloseButton = true,
  closeOnOutsideClick = true,
  className,
}: V28DialogWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          sizeClasses[size],
          "p-0 gap-0 bg-gradient-to-b from-white to-slate-50 border-slate-200 shadow-2xl overflow-hidden",
          className
        )}
        onInteractOutside={(e) => {
          if (!closeOnOutsideClick) {
            e.preventDefault();
          }
        }}
      >
        {/* Header - Gradient wie AuthHeader */}
        <DialogHeader className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 p-6 relative">
          <DialogTitle className="text-xl font-semibold text-slate-900 pr-8">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-slate-600 mt-1">
              {description}
            </DialogDescription>
          )}
          {showCloseButton && (
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-md p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Dialog schließen"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </DialogHeader>

        {/* Body - Scrollable */}
        <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">{children}</div>

        {/* Footer - Gradient wie AuthFooter (nur wenn Content vorhanden) */}
        {footer && (
          <DialogFooter className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 p-6">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
