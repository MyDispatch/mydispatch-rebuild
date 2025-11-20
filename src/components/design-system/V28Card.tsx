/* ==================================================================================
   V28 CARD - UNIVERSAL CONTENT CARD
   ==================================================================================
   ✅ Multiple variants (default, elevated, outlined)
   ✅ Optional header with title and description
   ✅ Optional footer
   ✅ Clickable variant
   ✅ Hover effects
   ================================================================================== */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface V28CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export function V28Card({
  children,
  title,
  description,
  footer,
  variant = "default",
  clickable = false,
  onClick,
  className,
}: V28CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        // Variant styles
        variant === "default" && "bg-white border border-slate-200",
        variant === "elevated" && "bg-white shadow-lg hover:shadow-xl",
        variant === "outlined" && "bg-transparent border-2 border-slate-200",
        // Clickable styles
        clickable && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        clickable && variant === "default" && "hover:border-slate-300",
        clickable && variant === "elevated" && "hover:shadow-2xl",
        clickable && variant === "outlined" && "hover:border-slate-300",
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      {(title || description) && (
        <div className="px-6 py-5 border-b border-slate-200">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-5">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">{footer}</div>
      )}
    </div>
  );
}
