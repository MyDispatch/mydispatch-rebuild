/* ==================================================================================
   FEATURE ICON BOX - Wiederverwendbare Icon-Box für Features
   ==================================================================================
   Konsistentes Design wie Sidebar-Buttons: Blauer Hintergrund, helles Icon
   ================================================================================== */

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureIconBoxProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "p-2 rounded-lg",
  md: "p-2 sm:p-3 rounded-lg",
  lg: "p-3 sm:p-4 rounded-xl",
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6 sm:h-8 sm:w-8",
  lg: "h-8 w-8 sm:h-10 sm:w-10",
};

export function FeatureIconBox({ icon: Icon, size = "md", className }: FeatureIconBoxProps) {
  return (
    <div
      className={cn(
        "bg-secondary group-hover:bg-secondary/90 transition-all duration-200 shadow-md",
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn("text-primary-foreground", iconSizeClasses[size])} />
    </div>
  );
}
