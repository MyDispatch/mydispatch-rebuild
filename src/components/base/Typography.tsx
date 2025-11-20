/* ==================================================================================
   TYPOGRAPHY COMPONENTS - DEUTSCHE STANDARDS
   ==================================================================================
   ✅ DIN 5008 konforme Typografie
   ✅ Konsistente Font-Größen & Line-Heights
   ✅ Semantische HTML-Tags (h1, h2, p, span)
   ==================================================================================
   NUTZUNG: <Heading level={1}>Titel</Heading>
   ================================================================================== */

import React from "react";
import { TYPOGRAPHY } from "@/lib/design-system";
import { cn } from "@/lib/utils";

// ==================================================================================
// HEADING COMPONENT
// ==================================================================================

interface HeadingProps {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level, children, className }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const styleMap = {
    1: TYPOGRAPHY.h1,
    2: TYPOGRAPHY.h2,
    3: TYPOGRAPHY.h3,
    4: TYPOGRAPHY.h4,
  };

  return <Tag className={cn(styleMap[level], className)}>{children}</Tag>;
}

// ==================================================================================
// BODY TEXT COMPONENT
// ==================================================================================

interface BodyProps {
  children: React.ReactNode;
  size?: "small" | "default" | "large";
  className?: string;
}

export function Body({ children, size = "default", className }: BodyProps) {
  const sizeMap = {
    small: TYPOGRAPHY.bodySmall,
    default: TYPOGRAPHY.body,
    large: TYPOGRAPHY.bodyLarge,
  };

  return <p className={cn(sizeMap[size], className)}>{children}</p>;
}

// ==================================================================================
// LABEL COMPONENT
// ==================================================================================

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function Label({ children, htmlFor, required, className }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={cn(TYPOGRAPHY.label, className)}>
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

// ==================================================================================
// CAPTION COMPONENT
// ==================================================================================

interface CaptionProps {
  children: React.ReactNode;
  className?: string;
}

export function Caption({ children, className }: CaptionProps) {
  return <span className={cn(TYPOGRAPHY.caption, className)}>{children}</span>;
}

// ==================================================================================
// METRIC COMPONENT (Zahlen-Anzeige)
// ==================================================================================

interface MetricProps {
  value: string | number;
  size?: "small" | "medium" | "large";
  className?: string;
}

export function Metric({ value, size = "medium", className }: MetricProps) {
  const sizeMap = {
    small: TYPOGRAPHY.metricSmall,
    medium: TYPOGRAPHY.metricMedium,
    large: TYPOGRAPHY.metricLarge,
  };

  return <span className={cn(sizeMap[size], className)}>{value}</span>;
}

// ==================================================================================
// LINK COMPONENT
// ==================================================================================

interface LinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function Link({ children, href, onClick, className }: LinkProps) {
  if (href) {
    return (
      <a href={href} className={cn(TYPOGRAPHY.link, className)} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cn(TYPOGRAPHY.link, "border-0 bg-transparent p-0", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
