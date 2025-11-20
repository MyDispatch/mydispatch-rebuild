/* ==================================================================================
   SMART TEMPLATE: STAT CARD V28.1
   ==================================================================================
   ✅ Kompakte Karte für KPIs und Statistiken
   ✅ V28.1 Professional Minimalism
   ✅ Pure Tailwind mit Slate-Palette
   ================================================================================== */

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import type { StatusConfig } from "@/lib/status-system";

interface StatCardProps {
  // Content
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };

  // Visual
  icon?: LucideIcon;

  // Behavior
  onClick?: () => void;

  // Styling
  className?: string;

  // NEU: Status-Integration (Phase 2.5)
  statusInfo?: StatusConfig | null;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  onClick,
  className,
  statusInfo,
}: StatCardProps) {
  const TrendIcon =
    change?.trend === "up" ? TrendingUp : change?.trend === "down" ? TrendingDown : null;

  return (
    <Card
      className={cn(
        "bg-white border border-slate-200 rounded-lg transition-all duration-300",
        onClick && "cursor-pointer hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Label */}
            <p className="text-sm font-medium mb-2 text-slate-600">{label}</p>

            {/* Value */}
            <p className="text-3xl font-bold mb-2 text-slate-900">{value}</p>

            {/* Change Indicator */}
            {change && TrendIcon && (
              <div className="flex items-center gap-1">
                <TrendIcon
                  className={cn(
                    "h-4 w-4",
                    change.trend === "up" && "text-green-600",
                    change.trend === "down" && "text-red-600",
                    change.trend === "neutral" && "text-slate-400"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    change.trend === "up" && "text-green-600",
                    change.trend === "down" && "text-red-600",
                    change.trend === "neutral" && "text-slate-400"
                  )}
                >
                  {change.value > 0 ? "+" : ""}
                  {change.value}%
                </span>
              </div>
            )}

            {/* NEU: Status Badge (Phase 2.5) */}
            {statusInfo && (
              <Badge
                variant="outline"
                className={cn("mt-2", statusInfo.bgColorClass, statusInfo.borderColorClass)}
              >
                <span className={statusInfo.colorClass}>{statusInfo.label}</span>
              </Badge>
            )}
          </div>

          {/* Icon */}
          {Icon && (
            <div className="p-2.5 rounded-lg bg-slate-100 shrink-0">
              <Icon className="h-5 w-5 text-slate-700" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
