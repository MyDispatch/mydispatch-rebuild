/* ==================================================================================
   KPI LIVE DASHBOARD V31.0
   ==================================================================================
   Shows real-time KPIs, statistics, and performance metrics
   ================================================================================== */

import { RenderingResolution } from "@/lib/rendering-quality";
import { useOptimizedRendering } from "@/hooks/useOptimizedRendering";
import { TrendingUp, TrendingDown, Users, Euro, Activity, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPILiveDashboardProps {
  variant?: "ipad" | "iphone" | "desktop";
  interactive?: boolean;
  resolution?: RenderingResolution;
}

export default function KPILiveDashboard({
  variant = "ipad",
  resolution = "retina",
}: KPILiveDashboardProps) {
  const { shouldRender, elementRef } = useOptimizedRendering(resolution);

  if (!shouldRender) {
    return <div ref={elementRef} className="w-full h-full bg-slate-50 animate-pulse" />;
  }

  const kpis = [
    {
      label: "Umsatz heute",
      value: "2.847€",
      change: "+12%",
      trend: "up",
      icon: Euro,
      color: "text-slate-700",
      bgColor: "bg-slate-50",
    },
    {
      label: "Aktive Fahrer",
      value: "24",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "text-slate-700",
      bgColor: "bg-slate-50",
    },
    {
      label: "Aufträge",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: Activity,
      color: "text-slate-700",
      bgColor: "bg-slate-50",
    },
    {
      label: "Ø Wartezeit",
      value: "4.2 Min",
      change: "-15%",
      trend: "down",
      icon: Clock,
      color: "text-slate-700",
      bgColor: "bg-slate-50",
    },
  ];

  return (
    <div
      ref={elementRef}
      className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Live Dashboard</h2>
        <p className="text-sm text-slate-600">
          Echtzeit-Übersicht • Letzte Aktualisierung: vor 2 Sek.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <div
              key={kpi.label}
              className={cn(
                "rounded-xl p-4 shadow-sm border border-slate-200 bg-white",
                "hover:shadow-md transition-shadow"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    kpi.bgColor
                  )}
                >
                  <Icon className={cn("w-5 h-5", kpi.color)} />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                    kpi.trend === "up"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-slate-100 text-slate-700"
                  )}
                >
                  <TrendIcon className="w-3 h-3" />
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="text-sm text-slate-600 mb-1">{kpi.label}</div>
              <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Activity Chart (Simplified) */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="text-sm font-semibold text-slate-900 mb-4">Aufträge letzte 7 Tage</div>
        <div className="flex items-end justify-between h-32 gap-2">
          {[120, 145, 132, 168, 156, 189, 156].map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-gradient-to-t from-slate-600 to-slate-500 rounded-t"
                style={{ height: `${(value / 200) * 100}%` }}
              />
              <span className="text-xs text-slate-600">
                {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
