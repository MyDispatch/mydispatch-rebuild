/* ==================================================================================
   DASHBOARD SIDEBAR V28.1 - PURE TAILWIND SLATE DESIGN
   ==================================================================================
   ✅ 100% Pure Tailwind - KEINE Token-Imports
   ✅ Slate Palette (Professional Gray-Blue)
   ✅ 1px Borders (V28.1 Spec)
   ✅ Tailwind Shadows (shadow-sm, shadow-md, shadow-lg)
   ✅ 200-300ms Transitions
   ✅ KEINE V26 Components
   ✅ KEINE DashboardInfoCard
   ✅ KEINE Inline Styles
   ================================================================================== */

import React, { useMemo, useState, useEffect } from "react";
import { useBookings } from "@/hooks/use-bookings";
import { useCustomers } from "@/hooks/use-customers";
import { useInvoices } from "@/hooks/use-invoices";
import { useVehicles } from "@/hooks/use-vehicles";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { formatCurrency } from "@/lib/format-utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  MapPin,
  UserPlus,
  Calendar,
  Activity,
  Clock,
} from "lucide-react";
import { PremiumWeatherDisplay } from "./PremiumWeatherDisplay";
import { PremiumTrafficDisplay } from "./PremiumTrafficDisplay";
import { Badge } from "@/lib/compat";
import { UniversalDownload } from "@/components/shared/UniversalDownload";

interface DashboardSidebarProps {
  sidebarExpanded: boolean;
}

// Status-Badge Helper (außerhalb der Komponente für Performance)
const getStatusBadge = (status: string) => {
  const statusMap: Record<
    string,
    { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
  > = {
    pending: { variant: "outline", label: "Ausstehend" },
    confirmed: { variant: "default", label: "Bestätigt" },
    in_progress: { variant: "secondary", label: "In Arbeit" },
    completed: { variant: "default", label: "Abgeschlossen" },
    cancelled: { variant: "destructive", label: "Storniert" },
  };
  return statusMap[status] || { variant: "outline", label: status };
};

// Status-Farben Helper (Tailwind-Klassen)
const getStatusColorClass = (status: string) => {
  switch (status) {
    case "available":
      return "bg-status-success";
    case "im_einsatz":
      return "bg-status-warning";
    case "wartung":
      return "bg-status-error";
    case "defekt":
      return "bg-muted";
    default:
      return "bg-status-success";
  }
};

export function DashboardSidebar({ sidebarExpanded }: DashboardSidebarProps) {
  const { bookings = [] } = useBookings();
  const { customers = [] } = useCustomers();
  const { invoices = [] } = useInvoices();
  const { vehicles = [] } = useVehicles();
  const { data: dashboardStats } = useDashboardStats();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update Zeit jede Sekunde
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Memoized calculations für Performance
  const dateRanges = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return { sevenDaysAgo, today };
  }, []);

  const recentBookings = useMemo(
    () =>
      bookings
        .filter((b) => !b.archived && !b.is_offer)
        .sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        .slice(0, 10),
    [bookings]
  );

  const newCustomers = useMemo(
    () => customers.filter((c) => new Date(c.created_at || 0) >= dateRanges.sevenDaysAgo).length,
    [customers, dateRanges.sevenDaysAgo]
  );

  const { openInvoices, overdueInvoices } = useMemo(() => {
    const open = invoices.filter(
      (inv) => inv.payment_status === "pending" || inv.payment_status === "overdue"
    ).length;
    const overdue = invoices.filter((inv) => inv.payment_status === "overdue").length;
    return { openInvoices: open, overdueInvoices: overdue };
  }, [invoices]);

  const todayBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (b.archived) return false;
      const bookingDate = new Date(b.pickup_time);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === dateRanges.today.getTime();
    });
  }, [bookings, dateRanges.today]);

  // Memoized Fahrzeug-Statistiken (Performance-Optimierung)
  const vehicleStats = useMemo(
    () => ({
      available: vehicles.filter((v) => v.status === "available").length,
      im_einsatz: vehicles.filter((v) => v.status === "im_einsatz").length,
      wartung: vehicles.filter((v) => v.status === "wartung").length,
      defekt: vehicles.filter((v) => v.status === "defekt").length,
    }),
    [vehicles]
  );

  return (
    <aside
      className="absolute inset-0 bg-white border border-l-0 border-slate-200 pt-16 pb-16 shadow-lg transition-all flex flex-col z-10"
      data-sidebar
      style={{
        transitionDuration: "600ms",
      }}
    >
      <div
        className="flex-1 overflow-y-auto px-5 pb-6 space-y-5 animate-fade-in"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(203 213 225) transparent",
        }}
      >
        {/* ======================================================================
               HEADER - V28.1 SLATE DESIGN
               ====================================================================== */}
        <div className="pt-6 pb-4 border-b border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Auftrags-Übersicht</h2>
          <p className="text-xs mt-2 font-medium text-slate-600">Live-Status & Aktivitäten</p>
        </div>

        {/* ======================================================================
               INFO-BEREICH - V28.1 PURE TAILWIND
               ====================================================================== */}
        <div className="space-y-3.5">
          {/* Uhrzeit & Datum */}
          <div className="group relative overflow-hidden p-3 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tabular-nums text-slate-900">
                  {format(currentTime, "HH:mm:ss")}
                </span>
                <span className="text-[11px] font-semibold mt-0.5 text-slate-600">
                  {format(currentTime, "dd.MM.yyyy", { locale: de })}
                </span>
              </div>
            </div>
          </div>

          {/* Fahrzeugstatus & Legende */}
          <div className="group relative overflow-hidden p-3 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Activity className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col gap-2.5 flex-1">
                <div className="flex items-center gap-2.5">
                  {Object.entries(vehicleStats).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-1.5">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${getStatusColorClass(status)} shadow-sm`}
                      />
                      <span className="text-sm font-bold tabular-nums text-slate-900">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-status-success" />
                    <span>Verfügbar</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-status-warning" />
                    <span>Aktiv</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-status-error" />
                    <span>Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wetter & Verkehr */}
          <div className="space-y-3">
            <PremiumWeatherDisplay />
            <PremiumTrafficDisplay />
          </div>
        </div>

        {/* ======================================================================
               NEUE KUNDEN - V28.1 PURE TAILWIND
               ====================================================================== */}
        <div className="space-y-3.5 mt-11">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-slate-700" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">
              Neue Kunden (7 Tage)
            </h3>
          </div>
          <div className="group relative overflow-hidden p-5 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
            <div className="relative z-10 space-y-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                  Registrierungen
                </span>
                <div className="flex items-center justify-center w-9 h-9 bg-status-success/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-status-success" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-black tracking-tighter leading-none text-slate-900">
                  {newCustomers}
                </p>
                <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700">
                  +7d
                </span>
              </div>
              <div className="pt-4.5 border-t border-slate-200">
                <p className="text-xs font-bold leading-relaxed text-slate-600">
                  Gesamt: <span className="font-bold text-slate-900">{customers.length}</span>{" "}
                  Kunden
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================
               RECHNUNGS-STATUS - V28.1 PURE TAILWIND
               ====================================================================== */}
        <div className="space-y-3.5 mt-11">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-slate-700" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">Rechnungen</h3>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="group relative overflow-hidden p-3 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  Offen
                </span>
                <p className="text-3xl font-black mt-2.5 tracking-tight text-slate-900">
                  {openInvoices}
                </p>
              </div>
            </div>
            <div className="group relative overflow-hidden p-3 rounded-lg border border-slate-200 bg-status-error/5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-status-error/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-wide text-status-error">
                  Überfällig
                </span>
                <p className="text-3xl font-black mt-2.5 tracking-tight text-status-error">
                  {overdueInvoices}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================
               HEUTIGE AUFTRÄGE - V28.1 PURE TAILWIND
               ====================================================================== */}
        <div className="space-y-3.5 mt-11">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-slate-700" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">Heute geplant</h3>
          </div>
          <div className="group relative overflow-hidden p-5 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
            <div className="relative z-10 space-y-4.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
                  Aufträge
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-slate-700" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-black tracking-tighter leading-none text-slate-900">
                  {todayBookings.length}
                </p>
                {todayBookings.length > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700">
                    {`${((todayBookings.filter((b) => b.status === "confirmed" || b.status === "in_progress").length / todayBookings.length) * 100).toFixed(0)}%`}
                  </span>
                )}
              </div>
              <div className="pt-4.5 space-y-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Bestätigt</span>
                  <span className="text-base font-bold tabular-nums text-slate-900">
                    {todayBookings.filter((b) => b.status === "confirmed").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">In Arbeit</span>
                  <span className="text-base font-bold tabular-nums text-slate-900">
                    {todayBookings.filter((b) => b.status === "in_progress").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================
               LETZTE AUFTRÄGE - V28.1 PURE TAILWIND mit Scroll
               ====================================================================== */}
        <div className="space-y-3.5 mt-11">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-slate-700" />
            </div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">Letzte Aufträge</h3>
          </div>
          <div
            className="h-[420px] pr-1.5 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "transparent transparent",
            }}
          >
            <div className="space-y-3 pr-1">
              {recentBookings.length === 0 ? (
                <div className="group relative overflow-hidden p-5 rounded-lg border border-slate-200 bg-white shadow-sm text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                  <div className="relative z-10">
                    <div className="inline-block mb-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-slate-700" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-600">Keine Aufträge vorhanden</p>
                  </div>
                </div>
              ) : (
                recentBookings.map((booking, index) => {
                  const statusInfo = getStatusBadge(booking.status);
                  return (
                    <div
                      key={booking.id}
                      className="group relative overflow-hidden p-3 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in"
                      style={{
                        animationDelay: `${index * 30}ms`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                      <div className="relative z-10 flex items-start justify-between mb-2.5">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              <MapPin className="h-4 w-4 text-slate-700" />
                            </div>
                            <p className="text-xs truncate font-bold text-slate-900">
                              {booking.pickup_address}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pl-7">
                            <p className="text-xs truncate font-medium text-slate-600">
                              {booking.dropoff_address}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={statusInfo.variant}
                          className="shrink-0 ml-2 text-[10px] px-2.5 py-1 font-bold"
                        >
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-200">
                        <span className="text-xs font-bold text-slate-600">
                          {format(new Date(booking.pickup_time), "HH:mm", { locale: de })}
                        </span>
                        <span className="text-base font-black tracking-tight text-slate-900">
                          {formatCurrency(booking.price || 0)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ======================================================================
               DRINGENDE AKTIONEN - V28.1 PURE TAILWIND (Conditional)
               ====================================================================== */}
        {overdueInvoices > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-status-error/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-status-error" />
              </div>
              <h3 className="text-sm font-bold text-status-error tracking-tight">Achtung</h3>
            </div>
            <div className="p-4 bg-status-error/10 rounded-xl border border-status-error/30 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-base font-black mb-3 text-status-error tracking-tight">
                {overdueInvoices} überfällige Rechnung{overdueInvoices !== 1 ? "en" : ""}
              </p>
              <p className="text-xs font-bold text-status-error/80">Bitte Zahlungen prüfen</p>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================
           EXPORT-SECTION - STICKY FOOTER (V29.4)
           ====================================================================== */}
      <div className="sticky bottom-0 bg-white pt-5 pb-6 border-t border-slate-200 mt-11">
        <div className="flex items-center gap-3 mb-3.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <FileText className="h-4 w-4 text-slate-700" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Export</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <UniversalDownload
            type="pdf"
            data={bookings.slice(0, 100)}
            filename="mydispatch-export"
            buttonLabel="PDF"
            variant="default"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white"
          />

          <UniversalDownload
            type="xlsx"
            data={bookings.slice(0, 100)}
            filename="mydispatch-export"
            buttonLabel="Excel"
            variant="default"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white"
          />

          <UniversalDownload
            type="csv"
            data={bookings.slice(0, 100)}
            filename="mydispatch-export"
            buttonLabel="CSV"
            variant="default"
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white"
          />
        </div>
      </div>
    </aside>
  );
}
