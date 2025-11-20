/* ==================================================================================
   TOP CUSTOMERS WIDGET - V18.3 Sprint 34
   ==================================================================================
   Top-Kunden nach Umsatz mit Drill-Down-Navigation
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Euro, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/format-utils";
import { useBookings } from "@/hooks/use-bookings";
import { useCustomers } from "@/hooks/use-customers";
import { useMemo } from "react";

interface TopCustomer {
  id: string;
  name: string;
  email?: string;
  total_bookings: number;
  total_revenue: number;
  avatar_url?: string;
}

export function TopCustomersWidget() {
  const navigate = useNavigate();
  const { bookings = [] } = useBookings();
  const { customers = [] } = useCustomers();

  // Berechne Top-Kunden basierend auf echten Daten
  const topCustomers = useMemo<TopCustomer[]>(() => {
    const customerStats = new Map<string, { bookings: number; revenue: number }>();

    // Aggregiere Buchungen pro Kunde
    bookings
      .filter(
        (b) => !b.archived && b.customer_id && b.price && b.price > 0 && b.payment_status === "paid"
      )
      .forEach((booking) => {
        const stats = customerStats.get(booking.customer_id!) || { bookings: 0, revenue: 0 };
        stats.bookings += 1;
        stats.revenue += booking.price || 0;
        customerStats.set(booking.customer_id!, stats);
      });

    // Erstelle Top-Kunden-Array
    return (
      Array.from(customerStats.entries())
        .map(([customerId, stats]) => {
          const customer = customers.find((c) => c.id === customerId);
          if (!customer) return null;

          return {
            id: customerId,
            name:
              `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
              customer.company_name ||
              "Unbekannt",
            email: customer.email || undefined,
            total_bookings: stats.bookings,
            total_revenue: stats.revenue,
            avatar_url: undefined, // Customers don't have avatar field
          };
        })
        .filter((c) => c !== null) as TopCustomer[]
    )
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 5);
  }, [bookings, customers]);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-foreground" />
            Top-Kunden
          </CardTitle>
          <Badge variant="outline" className="text-[10px] px-2 py-0.5">
            Umsatz
          </Badge>
        </div>
        <CardDescription className="text-[10px]">Nach Gesamtumsatz sortiert</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-3">
        {topCustomers.length === 0 ? (
          <div className="text-center py-4">
            <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-xs text-muted-foreground">Noch keine Kundendaten</p>
          </div>
        ) : (
          topCustomers.map((customer, index) => (
            <div
              key={customer.id}
              className="flex items-center gap-3 p-2 rounded-lg border bg-card hover:bg-muted/20 transition-colors cursor-pointer"
              onClick={() => navigate(`/kunden?id=${customer.id}`)}
            >
              {/* Ranking Badge */}
              <div
                className={`
                w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
                ${
                  index === 0
                    ? "bg-status-warning/20 text-status-warning"
                    : index === 1
                      ? "bg-muted text-muted-foreground"
                      : "bg-muted/50 text-muted-foreground"
                }
              `}
              >
                {index + 1}
              </div>

              {/* Avatar */}
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={customer.avatar_url || undefined} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-foreground">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Customer Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{customer.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{customer.total_bookings} Fahrten</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(customer.total_revenue)}
                  </span>
                </div>
              </div>

              {/* Trophy for #1 */}
              {index === 0 && <div className="text-status-warning">🏆</div>}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
