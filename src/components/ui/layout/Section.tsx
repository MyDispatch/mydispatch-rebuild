/* ==================================================================================
   SECTION COMPONENT V28.1 - LAYOUT PATTERN SYSTEM
   ==================================================================================
   ✅ Vertical spacing
   ✅ Background variants
   ✅ V28.1 Slate Design System
   ================================================================================== */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical spacing */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  /** Background variant */
  background?: "white" | "gray" | "slate" | "transparent";
  children: React.ReactNode;
  /** HTML tag */
  as?: "section" | "div" | "article" | "aside";
}

/**
 * Section Component
 *
 * Semantic section with consistent spacing and backgrounds.
 *
 * @example
 * <Section spacing="xl" background="gray">
 *   {children}
 * </Section>
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    { spacing = "md", background = "white", as = "section", children, className, ...props },
    ref
  ) => {
    const Component = as;

    const spacingClasses = {
      none: "",
      sm: "py-8 md:py-12",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-24",
      xl: "py-24 md:py-32",
    };

    const backgroundClasses = {
      white: "bg-white",
      gray: "bg-slate-50",
      slate: "bg-slate-100",
      transparent: "bg-transparent",
    };

    return (
      <Component
        ref={ref as any}
        className={cn("w-full", spacingClasses[spacing], backgroundClasses[background], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Section.displayName = "Section";
