/* ==================================================================================
   Partner Performance Table - V18.3 Sprint 35
   ==================================================================================
   - Partner-Umsatz-Tracking
   - Provisions-Berechnung
   - Trend-Indikatoren
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Handshake, TrendingUp, TrendingDown } from "lucide-react";

interface PartnerPerformanceData {
  partner_id: string;
  name: string;
  bookings: number;
  revenue: number;
  provision: number;
  provisionRate: number;
  trend?: string;
}

interface PartnerPerformanceTableProps {
  data: PartnerPerformanceData[];
  onPartnerClick?: (partnerId: string) => void;
}

export function PartnerPerformanceTable({ data, onPartnerClick }: PartnerPerformanceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const parseTrend = (trend?: string) => {
    if (!trend) return { value: 0, isPositive: true };
    const value = parseFloat(trend.replace(/[+%]/g, ""));
    return { value, isPositive: value >= 0 };
  };

  const getTotalStats = () => {
    return data.reduce(
      (acc, partner) => ({
        bookings: acc.bookings + partner.bookings,
        revenue: acc.revenue + partner.revenue,
        provision: acc.provision + partner.provision,
      }),
      { bookings: 0, revenue: 0, provision: 0 }
    );
  };

  const totals = getTotalStats();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-foreground" />
            Partner-Performance
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Business+
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead className="text-right">Aufträge</TableHead>
                <TableHead className="text-right">Umsatz</TableHead>
                <TableHead className="text-right">Provision</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    Keine Partner-Daten verfügbar
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {data.map((partner) => {
                    const trend = parseTrend(partner.trend);
                    return (
                      <TableRow
                        key={partner.partner_id}
                        className={onPartnerClick ? "cursor-pointer hover:bg-muted/50" : ""}
                        onClick={() => onPartnerClick?.(partner.partner_id)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{partner.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {partner.provisionRate}% Provision
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">{partner.bookings}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold">{formatCurrency(partner.revenue)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-primary">
                            {formatCurrency(partner.provision)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {partner.trend && (
                            <Badge
                              variant={trend.isPositive ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {trend.isPositive ? (
                                <TrendingUp className="h-4 w-4 mr-1 text-foreground" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1 text-foreground" />
                              )}
                              {partner.trend}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Summen-Zeile */}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>Gesamt</TableCell>
                    <TableCell className="text-right">{totals.bookings}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totals.revenue)}</TableCell>
                    <TableCell className="text-right text-primary">
                      {formatCurrency(totals.provision)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
        {onPartnerClick && data.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            💡 Klicken Sie auf einen Partner für Details
          </p>
        )}
      </CardContent>
    </Card>
  );
}
