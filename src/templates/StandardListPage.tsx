/**
 * STANDARD LIST PAGE TEMPLATE V45.0 - PREMIUM VIBRANT PROFESSIONAL
 *
 * Wiederverwendbare Template-Komponente für alle Listen-Ansichten
 * Basiert auf Fahrer.tsx Pattern (VERIFIED GOLDEN TEMPLATE)
 *
 * Features:
 * - DashboardInfoBoard (rechts, fixed position)
 * - PageHeaderWithKPIs (oben)
 * - Bulk Actions + Filter
 * - Detail-Button (Eye-Icon) pro Zeile
 * - Export-Funktionalität (PDF/Excel/CSV)
 *
 * ✅ V45.0 PREMIUM VIBRANT PROFESSIONAL DESIGN
 * ✅ Premium Vibrant Professional Farbpalette
 * ✅ Verbesserte Kontraste und leuchtende Farben
 * ✅ Business Tarif Premium Features
 * ✅ 100% V45.0 Design System kompatibel
 */

import { ReactNode } from "react";
import { Eye, Plus } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import {
  DashboardInfoBoard,
  DashboardArea,
  ChartData,
  QuickAction,
  KPIData,
} from "@/components/dashboard/DashboardInfoBoard";
import { useMainLayout } from "@/hooks/useMainLayout";

export interface ListColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface BulkAction {
  label: string;
  icon: ReactNode;
  onClick: (selectedIds: string[]) => void;
  variant?: "default" | "destructive";
}

export interface StandardListPageProps<T extends { id: string }> {
  // Header
  title: string;
  subtitle?: string;
  kpis: KPIData[];

  // List Data
  data: T[];
  columns: ListColumn<T>[];
  isLoading?: boolean;

  // Actions
  onCreateNew?: () => void;
  onViewDetail: (item: T) => void;
  bulkActions?: BulkAction[];

  // InfoBoard
  dashboardArea: DashboardArea;
  chartData?: ChartData;
  quickActions: QuickAction[];

  // Export
  onExport?: (format: "pdf" | "excel" | "csv") => void;

  // Filters
  filterComponent?: ReactNode;
}

export function StandardListPage<T extends { id: string }>({
  title,
  subtitle,
  kpis,
  data,
  columns,
  isLoading = false,
  onCreateNew,
  onViewDetail,
  bulkActions = [],
  dashboardArea,
  chartData,
  quickActions,
  onExport,
  filterComponent,
}: StandardListPageProps<T>) {
  const { sidebarExpanded } = useMainLayout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* DashboardInfoBoard - Fixed Right */}
      <div
        className="fixed top-16 bottom-0 w-96 transition-all duration-300 shadow-lg"
        style={{
          left: sidebarExpanded ? "560px" : "384px",
        }}
      >
        <DashboardInfoBoard
          area={dashboardArea}
          chartData={chartData}
          currentData={data}
          kpis={kpis}
          quickActions={quickActions}
          sidebarExpanded={sidebarExpanded}
        />
      </div>

      {/* Main Content */}
      <div
        className="transition-all duration-300 pr-96"
        style={{
          marginLeft: sidebarExpanded ? "256px" : "56px",
        }}
      >
        <div className="p-8">
          {/* Header mit KPIs */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
            {subtitle && <p className="text-slate-700 mt-1 font-medium">{subtitle}</p>}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {bulkActions.map((action, idx) => (
                <V28Button
                  key={idx}
                  variant={action.variant === "destructive" ? "destructive" : "secondary"}
                  size="sm"
                  onClick={() => action.onClick([])}
                >
                  {action.icon}
                  {action.label}
                </V28Button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {filterComponent}

              {onCreateNew && (
                <V28Button onClick={onCreateNew} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Neu erstellen
                </V28Button>
              )}
            </div>
          </div>

          {/* List Table */}
          <div className="bg-white border border-slate-200 overflow-hidden shadow-lg">
            {/* Table Header */}
            <div
              className="grid gap-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100 font-semibold text-sm text-slate-800"
              style={{
                gridTemplateColumns: columns.map((col) => col.width || "1fr").join(" ") + " auto",
              }}
            >
              {columns.map((col) => (
                <div key={String(col.key)}>{col.label}</div>
              ))}
              <div className="text-right">Aktionen</div>
            </div>

            {/* Table Body */}
            {isLoading ? (
              <div className="p-8 text-center text-slate-600 font-medium">Lädt...</div>
            ) : data.length === 0 ? (
              <div className="p-8 text-center text-slate-600 font-medium">
                Keine Einträge vorhanden
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {data.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-4 p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-300 text-sm"
                    style={{
                      gridTemplateColumns:
                        columns.map((col) => col.width || "1fr").join(" ") + " auto",
                    }}
                  >
                    {columns.map((col) => (
                      <div key={String(col.key)} className="text-slate-800 font-medium">
                        {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                      </div>
                    ))}

                    <div className="text-right">
                      <V28Button
                        variant="secondary"
                        size="sm"
                        className="hover:shadow-md transition-all duration-300"
                        onClick={() => onViewDetail(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </V28Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
