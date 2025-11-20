/* ==================================================================================
   OPEN INVOICES CARD V28.1 - PURE TAILWIND
   ==================================================================================
   Offene Rechnungen - Linke Spalte Position 5
   ✅ Pure Tailwind Slate Design
   ✅ Offen, Überfällig, Summen
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { FileText, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/format-utils";
import { Badge } from "@/lib/compat";

interface InvoiceStats {
  open: {
    count: number;
    total: number;
  };
  overdue: {
    count: number;
    total: number;
  };
}

interface OpenInvoicesCardProps {
  stats: InvoiceStats;
  onViewAll?: () => void;
}

export function OpenInvoicesCard({ stats, onViewAll }: OpenInvoicesCardProps) {
  const totalCount = stats.open.count + stats.overdue.count;
  const totalAmount = stats.open.total + stats.overdue.total;

  return (
    <Card
      className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onViewAll}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-100">
              <FileText className="h-4 w-4 text-slate-700" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Offene Rechnungen
            </CardTitle>
          </div>
          {totalCount > 0 && (
            <Badge variant="outline" className="h-6 px-2 text-xs font-bold border-slate-300">
              {totalCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        {/* Gesamt */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs font-semibold text-slate-600">Gesamt offen</span>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalAmount)}</p>
          </div>
          <p className="text-[10px] text-slate-500">
            {totalCount} {totalCount === 1 ? "Rechnung" : "Rechnungen"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Normal Offen */}
          <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
            <div className="flex items-center gap-1.5 mb-2">
              <FileText className="h-3 w-3 text-slate-700" />
              <p className="text-[10px] font-semibold text-slate-700">Offen</p>
            </div>
            <p className="text-xl font-bold text-slate-900 mb-0.5">{stats.open.count}</p>
            <p className="text-[10px] font-medium text-slate-700">
              {formatCurrency(stats.open.total)}
            </p>
          </div>

          {/* Überfällig */}
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <p className="text-[10px] font-semibold text-red-600">Überfällig</p>{" "}
              {/* ✅ Status Exception */}
            </div>
            <p className="text-xl font-bold text-red-700 mb-0.5">{stats.overdue.count}</p>
            <p className="text-[10px] font-medium text-red-600">
              {formatCurrency(stats.overdue.total)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
