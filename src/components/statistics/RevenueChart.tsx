/* ==================================================================================
   Revenue Chart Component - V18.3 Sprint 35
   ==================================================================================
   - Interaktive Umsatz-Entwicklung Chart (30 Tage)
   - Click-to-Details (Tag-Drill-Down)
   - Breakdown nach Zahlungsmethode
   - Recharts Integration
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, subDays } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface RevenueDataPoint {
  date: string;
  revenue: number;
  bookings: number;
}

interface RevenueBreakdown {
  completed: number;
  pending: number;
  cancelled: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  breakdown: RevenueBreakdown;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  interactive?: boolean;
  onDayClick?: (date: string) => void;
}

export function RevenueChart({
  data,
  breakdown,
  totalRevenue,
  paidRevenue,
  pendingRevenue,
  interactive = false,
  onDayClick,
}: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd.MM", { locale: de });
    } catch {
      return dateString;
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-1">
            {format(new Date(payload[0].payload.date), "dd. MMMM yyyy", { locale: de })}
          </p>
          <p className="text-sm text-primary font-semibold">
            Umsatz: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {payload[0].payload.bookings} Aufträge
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Umsatzentwicklung (30 Tage)</CardTitle>
            <CardDescription className="mt-2">
              Gesamt: <span className="font-semibold">{formatCurrency(totalRevenue)}</span> |
              Bezahlt: <span className="text-status-success">{formatCurrency(paidRevenue)}</span> |
              Offen: <span className="text-status-warning">{formatCurrency(pendingRevenue)}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              <span className="w-2 h-2 rounded-full bg-status-success mr-1.5"></span>
              {breakdown.completed} Abgeschlossen
            </Badge>
            <Badge variant="outline" className="text-xs">
              <span className="w-2 h-2 rounded-full bg-status-warning mr-1.5"></span>
              {breakdown.pending} Ausstehend
            </Badge>
            <Badge variant="outline" className="text-xs">
              <span className="w-2 h-2 rounded-full bg-status-error mr-1.5"></span>
              {breakdown.cancelled} Storniert
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            onClick={(e) => {
              if (interactive && onDayClick && e?.activePayload?.[0]?.payload?.date) {
                onDayClick(e.activePayload[0].payload.date);
              }
            }}
            className={interactive ? "cursor-pointer" : ""}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{
                fill: "hsl(var(--primary))",
                r: 4,
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
                cursor: interactive ? "pointer" : "default",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
        {interactive && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            💡 Klicken Sie auf einen Tag für Details
          </p>
        )}
      </CardContent>
    </Card>
  );
}
