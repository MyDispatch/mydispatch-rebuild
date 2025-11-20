/**
 * V28Spinner - Core Spinner Atom
 * HYPERION Phase 1.3 - Design System
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
    variant: {
      default: "text-primary",
      secondary: "text-secondary",
      destructive: "text-destructive",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export interface V28SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export const V28Spinner = React.forwardRef<HTMLDivElement, V28SpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-2", className)}
        role="status"
        aria-label={label || "Loading"}
        {...props}
      >
        <Loader2 className={cn(spinnerVariants({ size, variant }))} />
        {label && <span className="text-sm text-muted-foreground">{label}</span>}
      </div>
    );
  }
);

V28Spinner.displayName = "V28Spinner";
