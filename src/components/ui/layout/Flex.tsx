/* ==================================================================================
   FLEX COMPONENT V28.1 - LAYOUT PATTERN SYSTEM
   ==================================================================================
   ✅ Flexbox layouts
   ✅ Direction, justify, align variants
   ✅ Gap support
   ✅ V28.1 Slate Design System
   ================================================================================== */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex direction */
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  /** Justify content */
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  /** Align items */
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  /** Gap between items */
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  /** Wrap */
  wrap?: boolean;
  children: React.ReactNode;
}

/**
 * Flex Component
 *
 * Flexbox layout with common alignment options.
 *
 * @example
 * <Flex justify="between" align="center" gap="md">
 *   {children}
 * </Flex>
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction = "row",
      justify = "start",
      align = "stretch",
      gap = "none",
      wrap = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const directionClasses = {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    };

    const justifyClasses = {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const alignClasses = {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    };

    const gapClasses = {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClasses[direction],
          justifyClasses[justify],
          alignClasses[align],
          gapClasses[gap],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = "Flex";
