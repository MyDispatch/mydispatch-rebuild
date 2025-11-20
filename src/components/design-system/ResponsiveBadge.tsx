/* ==================================================================================
   RESPONSIVE BADGE - MASTER COMPONENT V18.3.25
   ==================================================================================
   Professional Badge System with:
   - All semantic variants (default, primary, secondary, success, warning, error, info)
   - Responsive sizing (xs, sm, md, lg)
   - Auto-scaling on breakpoints
   - Icon support
   - Professional styling with proper contrast
   - WCAG AA compliance
   ================================================================================== */

import { Badge } from "@/lib/compat";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type ResponsiveBadgeVariant =
  | "default" // Neutral
  | "primary" // CI-Farbe
  | "secondary" // Muted
  | "success" // Nur für Status
  | "warning" // Nur für Status
  | "error" // Nur für Status
  | "info"; // Neutral Info

export type ResponsiveBadgeSize = "xs" | "sm" | "md" | "lg";

export interface ResponsiveBadgeProps {
  variant?: ResponsiveBadgeVariant;
  size?: ResponsiveBadgeSize;
  children: React.ReactNode;
  icon?: LucideIcon;
  responsive?: boolean; // Auto-scale on breakpoints
  className?: string;
}

export function ResponsiveBadge({
  variant = "default",
  size = "sm",
  children,
  icon: Icon,
  responsive = true,
  className,
}: ResponsiveBadgeProps) {
  // Size configurations
  const sizeClasses = {
    xs: responsive
      ? "text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 gap-1"
      : "text-[10px] px-2 py-0.5 gap-1",
    sm: responsive
      ? "text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 gap-1 sm:gap-1.5"
      : "text-sm px-3 py-1.5 gap-1.5",
    md: responsive
      ? "text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 gap-1.5 sm:gap-2"
      : "text-base px-4 py-2 gap-2",
    lg: responsive
      ? "text-base sm:text-lg px-4 sm:px-5 py-2 sm:py-2.5 gap-2 sm:gap-2.5"
      : "text-lg px-5 py-2.5 gap-2.5",
  };

  // Icon size based on badge size
  const iconSizes = {
    xs: "h-2.5 w-2.5 sm:h-3 sm:w-3",
    sm: "h-3 w-3 sm:h-3.5 sm:w-3.5",
    md: "h-3.5 w-3.5 sm:h-4 sm:w-4",
    lg: "h-4 w-4 sm:h-5 sm:w-5",
  };

  // Variant-specific styling (CI-compliant, no accent!)
  const variantClasses = {
    default: "bg-muted text-muted-foreground border-muted-foreground/20",
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-muted/50 text-muted-foreground border-border",
    success: "bg-status-success/10 text-status-success border-status-success/20",
    warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
    error: "bg-status-error/10 text-status-error border-status-error/20",
    info: "bg-primary/5 text-foreground border-primary/10",
  };

  return (
    <Badge
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-full border transition-colors",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {Icon && <Icon className={cn("shrink-0", iconSizes[size])} />}
      <span>{children}</span>
    </Badge>
  );
}
