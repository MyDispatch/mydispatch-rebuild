/* ==================================================================================
   REVENUE BREAKDOWN WIDGET - V28.1 Slate Design
   ==================================================================================
   ✅ V28.1 Professional Minimalism
   ✅ Pure Tailwind CSS (Slate Palette)
   ✅ Responsive Design
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, roundTo, calculatePercentageChange } from "@/lib";

interface RevenueBreakdown {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface RevenueComparison {
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
}

interface RevenueBreakdownWidgetProps {
  total: number;
  breakdown: RevenueBreakdown[];
  comparison?: RevenueComparison;
}

export function RevenueBreakdownWidget({
  total,
  breakdown,
  comparison,
}: RevenueBreakdownWidgetProps) {
  const navigate = useNavigate();

  const todayChange = comparison ? calculatePercentageChange(comparison.yesterday, total) : 0;
  const isPositive = todayChange >= 0;

  return (
    <Card className="bg-white rounded-xl border-2 border-slate-200/20 shadow-sm p-6">
      <CardHeader className="pb-3 flex-shrink-0 p-0 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-700 mb-2">
              Umsatz-Analyse
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">Heute</CardDescription>
          </div>
          <Badge variant="outline">Business+</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-y-auto pb-4">
        {/* Gesamt-Umsatz */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{formatCurrency(total)}</span>
            {comparison && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  isPositive ? "text-status-success" : "text-status-error"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-semibold">{roundTo(Math.abs(todayChange), 1)}%</span>
              </div>
            )}
          </div>
          <p className="revenue-breakdown-widget__subtitle mt-1">
            vs. Gestern: {comparison ? formatCurrency(comparison.yesterday) : "—"}
          </p>
        </div>

        {/* Breakdown nach Zahlungsmethode */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm text-slate-600 uppercase">Nach Zahlungsmethode</h4>
          {breakdown.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 last:border-b-0 last:pb-0">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <span className="text-xs text-slate-600">{item.percentage}%</span>
                </div>
                <span className="text-lg font-bold text-slate-700">
                  {formatCurrency(item.value)}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-slate-700 transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Vergleiche */}
        {comparison && (
          <div className="pt-3 border-t border-border">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Vergleiche
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Diese Woche</p>
                <p className="text-sm font-semibold">{formatCurrency(comparison.lastWeek)}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Dieser Monat</p>
                <p className="text-sm font-semibold">{formatCurrency(comparison.lastMonth)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => navigate("/statistiken")}
          className="w-full text-center py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors"
        >
          Detaillierte Statistiken ansehen →
        </button>
      </CardContent>
    </Card>
  );
}
