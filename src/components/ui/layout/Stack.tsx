/* ==================================================================================
   STACK COMPONENT V28.1 - LAYOUT PATTERN SYSTEM
   ==================================================================================
   ✅ Vertical/horizontal stacking
   ✅ Consistent spacing
   ✅ V28.1 Slate Design System
   ================================================================================== */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stack direction */
  direction?: "vertical" | "horizontal";
  /** Spacing between items */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  /** Align items */
  align?: "start" | "end" | "center" | "stretch";
  children: React.ReactNode;
}

/**
 * Stack Component
 *
 * Simple stacking layout with consistent spacing.
 *
 * @example
 * <Stack spacing="md" align="center">
 *   {children}
 * </Stack>
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    { direction = "vertical", spacing = "md", align = "stretch", children, className, ...props },
    ref
  ) => {
    const spacingClasses = {
      vertical: {
        none: "space-y-0",
        sm: "space-y-2",
        md: "space-y-4",
        lg: "space-y-6",
        xl: "space-y-8",
      },
      horizontal: {
        none: "space-x-0",
        sm: "space-x-2",
        md: "space-x-4",
        lg: "space-x-6",
        xl: "space-x-8",
      },
    };

    const alignClasses = {
      start: direction === "vertical" ? "items-start" : "justify-start",
      end: direction === "vertical" ? "items-end" : "justify-end",
      center: direction === "vertical" ? "items-center" : "justify-center",
      stretch: direction === "vertical" ? "items-stretch" : "justify-stretch",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "vertical" ? "flex-col" : "flex-row",
          spacingClasses[direction][spacing],
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";
