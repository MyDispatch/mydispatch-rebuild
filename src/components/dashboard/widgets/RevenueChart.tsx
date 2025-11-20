/* ==================================================================================
   REVENUE CHART V28.1 - PURE TAILWIND
   ==================================================================================
   Umsatz-Entwicklung Area Chart - Linke Spalte Position 1
   ✅ Pure Tailwind Slate Design
   ✅ Recharts Area Chart
   ✅ 7-Tage-Verlauf mit Tooltips
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/format-utils";

interface RevenueData {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

export function RevenueChart({ data, trend }: RevenueChartProps) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  const average = data.length > 0 ? total / data.length : 0;

  return (
    <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-100">
              <TrendingUp className="h-4 w-4 text-slate-700" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Umsatz-Entwicklung
            </CardTitle>
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                trend.direction === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600" // ✅ Status Exception
              }`}
            >
              <TrendingUp className={`h-3 w-3 ${trend.direction === "down" ? "rotate-180" : ""}`} />
              <span className="text-xs font-bold">
                {trend.value > 0 ? "+" : ""}
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(total)}</p>
          <span className="text-xs font-medium text-slate-600">
            Ø {formatCurrency(average)}/Tag
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(59 130 246)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(59 130 246)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "rgb(100 116 139)" }}
              stroke="rgb(203 213 225)"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "rgb(100 116 139)" }}
              stroke="rgb(203 213 225)"
              tickFormatter={(value) => `${value}€`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Umsatz"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid rgb(226 232 240)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="rgb(59 130 246)"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
