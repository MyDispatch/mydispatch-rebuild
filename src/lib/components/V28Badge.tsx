/**
 * V28Badge - Atomic Design System Badge Component
 * Part of MISSION I (ATLAS) - UI Atoms
 */

import { cn } from "@/lib/utils";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

export interface V28BadgeProps {
  label: string;
  variant: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  neutral: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
};

export function V28Badge({ label, variant, className }: V28BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        "transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
