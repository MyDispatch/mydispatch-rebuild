"use client";

import { ReactNode } from "react";
import { Eye, Plus } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";

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

export interface KPIData {
  label: string;
  value: number | string;
  change?: number;
}

export interface StandardListPageProps<T extends { id: string }> {
  title: string;
  subtitle?: string;
  kpis?: KPIData[];
  data: T[];
  columns: ListColumn<T>[];
  isLoading?: boolean;
  onCreateNew?: () => void;
  onViewDetail: (item: T) => void;
  bulkActions?: BulkAction[];
  filterComponent?: ReactNode;
  onExport?: (format: "pdf" | "excel" | "csv") => void;
}

export function StandardListPage<T extends { id: string }>({
  title,
  subtitle,
  kpis = [],
  data,
  columns,
  isLoading = false,
  onCreateNew,
  onViewDetail,
  bulkActions = [],
  filterComponent,
  onExport,
}: StandardListPageProps<T>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto w-full max-w-screen-2xl p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          {subtitle && (
            <p className="text-slate-700 mt-1 font-medium">{subtitle}</p>
          )}
        </div>

        {kpis.length > 0 && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
                <div className="mt-1 text-2xl font-semibold text-slate-800">
                  {kpi.value}
                </div>
                {typeof kpi.change === "number" && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {kpi.change > 0 ? "+" : ""}
                    {kpi.change}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {bulkActions.map((action, idx) => (
              <V28Button
                key={idx}
                variant={
                  action.variant === "destructive" ? "destructive" : "secondary"
                }
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
            {onExport && (
              <V28Button
                variant="secondary"
                size="sm"
                onClick={() => onExport("csv")}
              >
                Export CSV
              </V28Button>
            )}
            {onCreateNew && (
              <V28Button onClick={onCreateNew} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Neu erstellen
              </V28Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow">
          {/* Header */}
          <div
            className="grid gap-4 border-b bg-gradient-to-r from-slate-50 to-blue-50 p-4 text-sm font-semibold text-slate-800"
            style={{
              gridTemplateColumns:
                columns.map((col) => col.width || "1fr").join(" ") + " auto",
            }}
          >
            {columns.map((col) => (
              <div key={String(col.key)}>{col.label}</div>
            ))}
            <div className="text-right">Aktionen</div>
          </div>

          {/* Body */}
          {isLoading ? (
            <div className="p-8 text-center text-slate-600 font-medium">
              Lädt...
            </div>
          ) : data.length === 0 ? (
            <div className="p-8 text-center text-slate-600 font-medium">
              Keine Einträge vorhanden
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-4 p-4 text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50"
                  style={{
                    gridTemplateColumns:
                      columns.map((col) => col.width || "1fr").join(" ") +
                      " auto",
                  }}
                >
                  {columns.map((col) => (
                    <div
                      key={String(col.key)}
                      className="font-medium text-slate-800"
                    >
                      {col.render
                        ? col.render(item[col.key], item)
                        : String(item[col.key] as any)}
                    </div>
                  ))}
                  <div className="text-right">
                    <V28Button
                      variant="secondary"
                      size="sm"
                      className="transition-all duration-300 hover:shadow-md"
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
  );
}

export default StandardListPage;

