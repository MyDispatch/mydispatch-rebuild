import { Card, CardContent, CardHeader, CardTitle } from "@/lib/compat";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/format-utils";
import { V28Button } from "@/components/design-system/V28Button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface StatisticsWidgetProps {
  revenueToday: number;
  revenueYesterday: number;
  revenueThisWeek: number;
  revenueLastWeek: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  bookingsToday: number;
  bookingsYesterday: number;
}

export function StatisticsWidget({
  revenueToday,
  revenueYesterday,
  revenueThisWeek,
  revenueLastWeek,
  revenueThisMonth,
  revenueLastMonth,
  bookingsToday,
  bookingsYesterday,
}: StatisticsWidgetProps) {
  const navigate = useNavigate();

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const revenueChangeDay = calculateChange(revenueToday, revenueYesterday);
  const revenueChangeWeek = calculateChange(revenueThisWeek, revenueLastWeek);
  const revenueChangeMonth = calculateChange(revenueThisMonth, revenueLastMonth);

  const stats = [
    {
      label: "Gestern",
      value: formatCurrency(revenueYesterday),
      change: revenueChangeDay,
      subLabel: `${bookingsYesterday} Aufträge`,
    },
    {
      label: "Diese Woche",
      value: formatCurrency(revenueThisWeek),
      change: revenueChangeWeek,
      subLabel: "vs. letzte Woche",
    },
    {
      label: "Dieser Monat",
      value: formatCurrency(revenueThisMonth),
      change: revenueChangeMonth,
      subLabel: "vs. letzter Monat",
    },
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-foreground" />
            Vergleich & Trends
          </CardTitle>
          <V28Button
            variant="secondary"
            size="sm"
            className="h-6 text-[11px] hover:bg-muted px-2"
            onClick={() => navigate("/statistiken")}
          >
            Details →
          </V28Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 pb-3">
        {stats.map((stat, index) => (
          <div key={index} className="p-2 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
              {stat.change !== 0 && (
                <div
                  className={cn(
                    "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold",
                    stat.change > 0
                      ? "bg-status-success/10 text-status-success"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {stat.change > 0 ? (
                    <TrendingUp className="h-2.5 w-2.5 text-foreground" />
                  ) : (
                    <TrendingDown className="h-2.5 w-2.5 text-foreground" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              )}
            </div>
            <p className="text-base font-bold text-foreground">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{stat.subLabel}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
