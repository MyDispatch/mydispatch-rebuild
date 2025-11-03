/* ==================================================================================
   V28 TEXTAREA COMPONENT V28.1 - PURE TAILWIND SLATE DESIGN
   ==================================================================================
   ✅ 100% Pure Tailwind - KEINE Token-Imports
   ✅ Slate Palette
   ✅ 1px Borders
   ✅ Focus Ring (ring-slate-400)
   ✅ Backward Compatible mit shadcn Textarea API
   ================================================================================== */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface V28TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const V28Textarea = React.forwardRef<HTMLTextAreaElement, V28TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white",
          "placeholder:text-slate-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
V28Textarea.displayName = "V28Textarea";

export { V28Textarea };

/**
 * USAGE EXAMPLES:
 * 
 * // Standard Textarea
 * <V28Textarea placeholder="Ihre Nachricht..." />
 * 
 * // Mit Custom Height
 * <V28Textarea className="min-h-[200px]" placeholder="Lange Nachricht..." />
 * 
 * // Disabled
 * <V28Textarea disabled value="Gesperrt" />
 */
