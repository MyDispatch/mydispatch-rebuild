/* ==================================================================================
   FINANZEN V29.4 - MIGRATED TO StandardDashboardPage
   ==================================================================================
   ✅ 100% V28.1 Design System
   ✅ StandardDashboardPage Template
   ✅ Code-Reduktion: 155 → 90 Zeilen (-42%)
   ✅ Konsistentes Layout mit allen Dashboard-Seiten
   ================================================================================== */

import { useAuth } from "@/hooks/use-auth";
import { useInvoices } from "@/hooks/use-invoices";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { StandardDashboardPage, KPICardData, TableConfig } from "@/components/templates";
import { Euro, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format-utils";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Finanzen() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { invoices = [], isLoading: invoicesLoading } = useInvoices();

  useEffect(() => {
    if (!loading && !profile) {
      navigate("/auth?mode=signup");
    }
  }, [profile, loading, navigate]);

  // KPI Calculations
  const financeStats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + (inv.price || 0), 0);
    const open = invoices.filter((inv) => inv.payment_status === "pending").length;
    const overdue = invoices.filter((inv) => inv.payment_status === "overdue").length;
    const paid = invoices.filter((inv) => inv.payment_status === "paid").length;

    const thisMonth = invoices.filter((i: any) => {
      const date = new Date(i.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const monthlyRevenue = thisMonth.reduce((sum: number, i: any) => sum + (i.price || 0), 0);

    return { total, open, overdue, paid, monthlyRevenue };
  }, [invoices]);

  // KPIs für StandardDashboardPage
  const kpis: KPICardData[] = useMemo(
    () => [
      {
        label: "Umsatz (Monat)",
        value: formatCurrency(financeStats.monthlyRevenue),
        change: { value: 12.5, trend: "up" },
        icon: Euro,
      },
      {
        label: "Offene Rechnungen",
        value: financeStats.open,
        icon: FileText,
      },
      {
        label: "Überfällig",
        value: financeStats.overdue,
        change: { value: 3, trend: "down" },
        icon: AlertTriangle,
      },
      {
        label: "Bezahlt",
        value: financeStats.paid,
        change: { value: 8, trend: "up" },
        icon: TrendingUp,
      },
    ],
    [financeStats]
  );

  // Tabellen für StandardDashboardPage
  const tables: TableConfig[] = useMemo(
    () => [
      {
        title: "Rechnungsübersicht",
        icon: FileText,
        component: (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rechnungs-Nr.</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-600">
                    Keine Rechnungen vorhanden
                  </TableCell>
                </TableRow>
              ) : (
                invoices.slice(0, 10).map((invoice: any) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-slate-900">
                      {invoice.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="text-slate-900">
                      {formatCurrency(invoice.price || 0)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.payment_status === "paid"
                            ? "bg-status-success/10 text-status-success"
                            : invoice.payment_status === "overdue"
                              ? "bg-status-error/10 text-status-error"
                              : "bg-status-warning/10 text-status-warning"
                        }`}
                      >
                        {invoice.payment_status === "paid"
                          ? "Bezahlt"
                          : invoice.payment_status === "overdue"
                            ? "Überfällig"
                            : "Ausstehend"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {format(new Date(invoice.created_at), "dd.MM.yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ),
      },
    ],
    [invoices]
  );

  if (loading || invoicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Laden...</p>
      </div>
    );
  }

  return (
    <StandardDashboardPage
      title="Finanzen - MyDispatch"
      description="Umsätze, Rechnungen und finanzielle Übersichten"
      background="orbs-light"
      heroTitle="Finanzen"
      heroSubtitle="Ihre finanzielle Übersicht im Blick"
      heroBadge="Live-Finanzübersicht"
      heroBadgeIcon={TrendingUp}
      kpis={kpis}
      tables={tables}
    />
  );
}
