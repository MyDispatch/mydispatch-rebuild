import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { formatCurrency } from "@/lib/format-utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
  }>;
  total: number;
}

// Design-System-konforme Farben für Datenvisualisierung
const COLORS = [
  "hsl(var(--primary))", // #EADEBD - Hauptfarbe
  "hsl(var(--chart-secondary))", // #D4C5A3 - Sekundärfarbe
  "hsl(var(--chart-tertiary))", // #B89368 - Tertiärfarbe
];

export function RevenueChart({ data, total }: RevenueChartProps) {
  const maxValue = Math.max(...data.map((d) => d.revenue));
  const avgValue = data.reduce((sum, d) => sum + d.revenue, 0) / data.length;

  // Berechne Trend: Vergleiche die letzten 3 Tage mit den ersten 4 Tagen
  const firstHalf = data.slice(0, 4).reduce((sum, d) => sum + d.revenue, 0);
  const secondHalf = data.slice(4).reduce((sum, d) => sum + d.revenue, 0);
  const trend = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0;
  const isPositive = trend >= 0;

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardContent className="pt-3 pb-3">
        <div className="w-full h-[140px] min-w-0">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--chart-grid))"
                opacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                height={20}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                width={35}
                tickFormatter={(value) => `${Math.round(value / 100)}€`}
              />
              <Tooltip
                wrapperClassName="recharts-tooltip-wrapper"
                formatter={(value: any) => [formatCurrency(value), "Umsatz"]}
                cursor={{
                  stroke: "hsl(var(--muted-foreground))",
                  strokeWidth: 1,
                  strokeDasharray: "5 5",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                dot={{
                  fill: "hsl(var(--primary))",
                  strokeWidth: 2,
                  r: 3.5,
                  stroke: "hsl(var(--background))",
                }}
                activeDot={{
                  r: 5,
                  fill: "hsl(var(--primary))",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-4 mb-3">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Umsatz-Entwicklung
            </CardTitle>
            <p className="text-[10px] text-muted-foreground mt-0.5">Letzte 7 Tage</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-foreground">{formatCurrency(total)}</p>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              {total > 0 && (
                <>
                  <div
                    className={`px-1.5 py-0.5 rounded border ${
                      isPositive
                        ? "bg-status-success/10 border-status-success/20"
                        : "bg-status-error/10 border-status-error/20"
                    }`}
                  >
                    <span
                      className={`text-[9px] font-semibold ${
                        isPositive ? "text-status-success" : "text-status-error"
                      }`}
                    >
                      {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
                    </span>
                  </div>
                  <span className="text-[8px] text-muted-foreground">vs. Anfang Woche</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="text-center p-2 rounded-lg border border-border bg-card">
            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">
              Höchstwert
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(maxValue)}</p>
          </div>
          <div className="text-center p-2 rounded-lg border border-border bg-card">
            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">
              Durchschnitt
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(avgValue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentMethodsChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Zahlungsarten</CardTitle>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">{formatCurrency(total)}</p>
            <p className="text-[8px] text-muted-foreground uppercase tracking-wide mt-0.5">
              Gesamt
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-[90px] h-[90px] flex-shrink-0">
            <PieChart width={90} height={90}>
              <Pie
                data={data}
                cx={45}
                cy={45}
                innerRadius={30}
                outerRadius={43}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-foreground">{data.length}</span>
              <span className="text-[8px] text-muted-foreground uppercase tracking-wide">
                Arten
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            {data.map((item, index) => (
              <div key={item.name} className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-foreground">
                      {formatCurrency(item.value)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div
                    className="flex-1 h-1 bg-muted rounded-full overflow-hidden"
                    style={{ "--progress": `${item.percentage}%` } as React.CSSProperties}
                  >
                    <div
                      className={`chart-progress-bar chart-progress-bar--${index % 5} h-full rounded-full`}
                    />
                  </div>
                  <span className="text-[9px] font-medium text-muted-foreground w-8 text-right tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
