/* ==================================================================================
   DESIGN-SYSTEM V18.5.0 - ZENTRALE DESIGN-BIBLIOTHEK
   ==================================================================================
   Production-Ready TypeScript Library für semantische Design-Tokens
   
   Features:
   - Type-Safe Semantic Color Tokens (HSL-basiert)
   - Responsive Typography System (Fluid Scaling)
   - Spacing System (8px Grid, DIN 5008)
   - Icon Sizes (Mobile-First Touch Targets)
   - Premium Shadow System
   - Validation Helpers
   
   ZWINGEND:
   - Niemals direkte Farben (text-white, bg-white, etc.)
   - Immer semantische Tokens (bg-background, text-foreground)
   - Icons nur mit text-foreground / text-muted-foreground
   - Touch-Targets min-h-[44px] auf Mobile
   ================================================================================== */

// ==================================================================================
// TYPOGRAPHY (Responsive, Fluid Scaling)
// ==================================================================================

export const typography = {
  h1: "scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl",
  h2: "scroll-m-20 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl",
  h3: "scroll-m-20 text-xl font-semibold tracking-tight sm:text-2xl",
  h4: "scroll-m-20 text-lg font-semibold tracking-tight sm:text-xl",
  body: "text-sm leading-7 sm:text-base",
  bodySmall: "text-xs leading-6",
  bodyLarge: "text-base leading-7 sm:text-lg",
  label: "text-xs font-medium uppercase tracking-wider",
  caption: "text-xs text-muted-foreground",
  link: "text-primary hover:underline cursor-pointer",
  metric: "text-2xl font-bold tabular-nums sm:text-3xl md:text-4xl",
  metricSmall: "text-lg font-bold tabular-nums",
  metricMedium: "text-2xl font-bold tabular-nums",
  metricLarge: "text-3xl font-bold tabular-nums sm:text-4xl",
} as const;

export const spacing = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

export const statusColors = {
  success: "bg-status-success text-status-success-foreground",
  warning: "bg-status-warning text-status-warning-foreground",
  error: "bg-status-error text-status-error-foreground",
} as const;

export const iconSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

// ==================================================================================
// UPPERCASE EXPORTS (Backwards Compatibility)
// ==================================================================================

export const TYPOGRAPHY = typography;
export const SPACING = spacing;
export const ICON_SIZES = iconSizes;

/**
 * @deprecated Use UNIFIED_DESIGN_TOKENS instead
 * Legacy color system - kept for backwards compatibility
 * All values converted to HSL
 */
export const CI_COLORS_HEX = {
  primary: "hsl(42, 49%, 78%)", // Beige
  primaryDark: "hsl(225, 31%, 35%)", // Dunkelblau dunkel
  primaryLight: "hsl(42, 49%, 88%)", // Beige hell
  foreground: "hsl(225, 31%, 28%)", // Dunkelblau
  mutedForeground: "hsl(220, 9%, 46%)", // Grau
  background: "hsl(0, 0%, 100%)", // Weiß
  muted: "hsl(220, 14%, 98%)", // Canvas
  success: "hsl(142, 76%, 36%)", // Grün
  statusSuccess: "hsl(142, 76%, 36%)", // Grün
  warning: "hsl(43, 96%, 53%)", // Orange
  statusWarning: "hsl(43, 96%, 53%)", // Orange
  error: "hsl(0, 84%, 60%)", // Rot
} as const;

export const CARD_STYLES = {
  base: "rounded-lg border bg-card text-card-foreground shadow-sm",
  header: "flex flex-col space-y-1.5 p-6",
  headerCompact: "flex flex-col space-y-1 p-4",
  content: "p-6 pt-0",
  contentCompact: "p-4 pt-0",
  footer: "flex items-center p-6 pt-0",
  interactive: "hover:shadow-md transition-shadow duration-200 cursor-pointer",
  hover: "hover:shadow-md transition-shadow duration-200",
  elevated: "shadow-lg",
} as const;

export const ANIMATIONS = {
  transition: "transition-all duration-200",
  transitionSlow: "transition-all duration-300",
  transitionFast: "transition-all duration-100",
  hoverScale: "hover:scale-105 transition-transform duration-200",
  hoverShadow: "hover:shadow-lg transition-shadow duration-200",
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",
} as const;

export const ICON_COLORS = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
} as const;

// ==================================================================================
// VALIDATION HELPERS
// ==================================================================================

export function hasHardcodedColors(className: string): boolean {
  return /text-white|bg-white|text-\[#|bg-\[#/.test(className);
}

export function isSemanticColor(className: string): boolean {
  return /bg-background|text-foreground|bg-primary|text-primary/.test(className);
}

export function isValidIconColor(color: string): boolean {
  const allowedIconColors = ["text-foreground", "text-muted-foreground", "text-primary"];
  return allowedIconColors.includes(color);
}
