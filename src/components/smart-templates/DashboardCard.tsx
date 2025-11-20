/* ==================================================================================
   SMART TEMPLATE: DASHBOARD CARD V21.0.0
   ==================================================================================
   ✅ Wiederverwendbare Card-Komponente für Dashboard-Inhalte
   ✅ Basiert auf Pricing.tsx Master-Vorlage
   ✅ 100% Design-Token-konform
   ✅ Pixelgenaue Umsetzung mit Hover-Effekten
   ================================================================================== */

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  // Content
  title: string;
  description?: string;
  children: ReactNode;

  // Visual
  icon?: LucideIcon;
  iconVariant?: "dunkelblau" | "beige";
  highlighted?: boolean;
  badge?: string;

  // Behavior
  onClick?: () => void;
  hoverable?: boolean;

  // Styling
  className?: string;
  contentClassName?: string;
}

export function DashboardCard({
  title,
  description,
  children,
  icon: Icon,
  iconVariant = "dunkelblau",
  highlighted = false,
  badge,
  onClick,
  hoverable = !!onClick,
  className,
  contentClassName,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col text-left bg-white border transition-all duration-300",
        highlighted ? "border-slate-700 ring-2 ring-slate-200 shadow-xl" : "border-slate-200",
        hoverable && "cursor-pointer hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md",
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

      {/* Header */}
      <CardHeader className={cn("pb-6", badge ? "pt-12 px-6 md:px-8" : "pt-8 px-6 md:px-8")}>
        <div className="flex items-start justify-between mb-4">
          <CardTitle className="text-2xl font-semibold text-slate-900">{title}</CardTitle>

          {/* Icon */}
          {Icon && (
            <div className="p-2.5 rounded-lg bg-slate-100 shrink-0">
              <Icon className="h-6 w-6 text-slate-700" />
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <CardDescription className="text-base font-normal leading-relaxed text-slate-600">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className={cn("flex-1 pt-0 pb-8 px-6 md:px-8", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
