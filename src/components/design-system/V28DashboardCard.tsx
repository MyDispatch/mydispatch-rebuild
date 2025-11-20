/* ==================================================================================
   V28 DASHBOARD CARD - PREMIUM CONTENT CONTAINER
   ==================================================================================
   ✅ Based on V28MarketingCard
   ✅ Hover-Glow + Scale Animation
   ✅ Premium Shadows
   ✅ Badge Support
   ✅ V28IconBox Integration
   ✅ Tailwind-native Slate colors
   ================================================================================== */

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { V28IconBox } from "./V28IconBox";

interface V28DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: LucideIcon;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

export function V28DashboardCard({
  title,
  description,
  children,
  icon,
  badge,
  onClick,
  className,
}: V28DashboardCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "rounded-2xl bg-white border border-slate-200 shadow-lg",
        "transition-all duration-300",
        onClick && "cursor-pointer hover:shadow-2xl hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-1.5 text-sm font-semibold rounded-full bg-slate-700 text-white">
            {badge}
          </div>
        </div>
      )}

      {/* Hover-Glow-Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <div className={cn("relative z-10 p-8", badge && "pt-12")}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h3>
            {description && <p className="text-base mt-2 text-slate-600">{description}</p>}
          </div>

          {icon && <V28IconBox icon={icon} variant="slate" />}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 pb-8">{children}</div>
    </div>
  );
}
