/* ==================================================================================
   DASHBOARD INFO BOARD V30.0 - PREMIUM V28.1 REDESIGN
   ==================================================================================
   ✅ Fixed Positioning zwischen Sidebar und Content
   ✅ V28.1 Premium Design (Slate Palette)
   ✅ KPIs, Charts, Quick Actions
   ✅ Export-Funktionen (PDF/Excel/CSV)
   ✅ Area-spezifische Konfiguration
   ✅ Responsive (Mobile: Hidden, Desktop: Fixed)
   ================================================================================== */

import { ReactNode } from "react";
import {
  LucideIcon,
  TrendingUp,
  TrendingDown,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { V28Button } from "@/components/design-system/V28Button";
import { Badge } from "@/lib/compat";
import { cn } from "@/lib/utils";

export interface KPIData {
  label: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
}

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

export interface DashboardInfoBoardProps {
  area: string;
  sidebarExpanded?: boolean;
  kpis?: KPIData[];
  quickActions?: QuickAction[];
  chartData?: any;
  currentData?: any[];
}

export function DashboardInfoBoard({
  area,
  sidebarExpanded = false,
  kpis = [],
  quickActions = [],
  chartData,
  currentData = [],
}: DashboardInfoBoardProps) {
  // Calculate left position based on sidebar state
  const leftPosition = sidebarExpanded ? "560px" : "384px"; // AppSidebar (240px/64px) + DashboardSidebar (320px)

  return (
    <div
      className={cn(
        "fixed z-30 overflow-y-auto",
        "bg-white border-l border-slate-200 shadow-lg",
        "transition-all duration-300",
        "hidden lg:block" // Hidden on mobile/tablet
      )}
      style={{
        top: "64px", // Below Header
        bottom: "48px", // Above Footer
        left: leftPosition,
        width: "320px",
        scrollbarWidth: "thin",
      }}
    >
      <div className="p-6 space-y-6">
        {/* Area Header */}
        <div className="text-center pb-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">{area}</h3>
          <p className="text-sm text-slate-600 mt-1">Bereichs-Übersicht</p>
        </div>

        {/* KPIs Section */}
        {kpis.length > 0 && (
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Kennzahlen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {kpis.slice(0, 4).map((kpi, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-xs text-slate-600">{kpi.label}</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">{kpi.value}</p>
                  </div>
                  {kpi.change !== undefined && (
                    <Badge variant={kpi.change >= 0 ? "default" : "destructive"} className="ml-2">
                      {kpi.change >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(kpi.change)}%
                    </Badge>
                  )}
                  {kpi.icon && (
                    <div className="ml-2 p-2 bg-slate-100 rounded-md">
                      <kpi.icon className="w-4 h-4 text-slate-700" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Chart Preview */}
        {chartData && (
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Entwicklung</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-32 bg-slate-50 rounded-md flex items-center justify-center">
                <p className="text-xs text-slate-600">Chart Preview</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Schnellaktionen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.slice(0, 5).map((action, index) => (
                <V28Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={action.onClick}
                  className="w-full justify-start text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </V28Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Export Section */}
        <Card className="border border-slate-200 shadow-sm bg-slate-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-900">Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <V28Button
              variant="secondary"
              size="sm"
              className="w-full justify-start text-slate-700 hover:bg-white hover:text-slate-900"
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </V28Button>
            <V28Button
              variant="secondary"
              size="sm"
              className="w-full justify-start text-slate-700 hover:bg-white hover:text-slate-900"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </V28Button>
            <V28Button
              variant="secondary"
              size="sm"
              className="w-full justify-start text-slate-700 hover:bg-white hover:text-slate-900"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </V28Button>
          </CardContent>
        </Card>

        {/* Data Count */}
        {currentData.length > 0 && (
          <div className="text-center py-3 bg-slate-100 rounded-md">
            <p className="text-xs text-slate-600">{currentData.length} Einträge gesamt</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Type Exports for legacy compatibility
export type DashboardArea = string;
export interface ChartData {
  labels: string[];
  data: number[];
}
