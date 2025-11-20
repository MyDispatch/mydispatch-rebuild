/* ==================================================================================
   DASHBOARD RENDERER V29.4 - LIVE-PREVIEW COMPONENT
   ==================================================================================
   ✅ Rendert Mini-Versionen von Dashboard-Seiten für Hero-Sections
   ✅ Unterstützt echte Daten ODER Demo-Daten
   ✅ CSS transform: scale() für Mockup-Darstellung
   ✅ V28.1 Design System compliant
   ================================================================================== */

import { useMemo } from "react";
import { useBookings } from "@/hooks/use-bookings";
import { useDrivers } from "@/hooks/use-drivers";
import { useVehicles } from "@/hooks/use-vehicles";
import { formatCurrency } from "@/lib/format-utils";
import { FileText, Users, Car, Euro } from "lucide-react";
import { V28StatCard, V28DashboardSection } from "@/components/design-system";
import { DataGrid } from "@/components/smart-templates";

interface DashboardRendererProps {
  pageType: "dashboard" | "auftraege" | "fahrer";
  scale?: number; // 0.5 = 50% Größe für Mockups
  liveData?: boolean; // true = Echte Daten, false = Demo-Daten
}

export function DashboardRenderer({
  pageType,
  scale = 1,
  liveData = false,
}: DashboardRendererProps) {
  // Live-Daten (nur wenn liveData=true)
  const { bookings = [] } = useBookings();
  const { drivers = [] } = useDrivers();
  const { vehicles = [] } = useVehicles();

  // Demo-Daten (Fallback)
  const demoData = useMemo(
    () => ({
      bookings: liveData ? bookings.length : 127,
      revenue: liveData ? bookings.reduce((sum, b) => sum + (b.price || 0), 0) : 45280,
      drivers: liveData ? drivers.filter((d) => !d.archived).length : 23,
      vehicles: liveData
        ? vehicles.filter((v) => !v.archived && v.status === "available").length
        : 18,
    }),
    [liveData, bookings, drivers, vehicles]
  );

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
      }}
      className="bg-slate-50"
    >
      {/* Dashboard Preview */}
      {pageType === "dashboard" && (
        <div className="p-8 space-y-8">
          <V28DashboardSection background="white" className="py-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">
              Dashboard
            </h1>
            <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg">
              <V28StatCard
                label="Aufträge heute"
                value={demoData.bookings}
                change={{ value: 12.5, trend: "up" }}
                icon={FileText}
              />
              <V28StatCard
                label="Umsatz heute"
                value={formatCurrency(demoData.revenue)}
                change={{ value: 8.3, trend: "up" }}
                icon={Euro}
              />
              <V28StatCard label="Aktive Fahrer" value={demoData.drivers} icon={Users} />
              <V28StatCard label="Verfügbare Fahrzeuge" value={demoData.vehicles} icon={Car} />
            </DataGrid>
          </V28DashboardSection>

          {/* Vereinfachte Map-Darstellung */}
          <div className="h-[300px] bg-slate-200 rounded-xl flex items-center justify-center">
            <p className="text-slate-600 font-semibold">Live-Karte</p>
          </div>
        </div>
      )}

      {/* Auftraege Preview */}
      {pageType === "auftraege" && (
        <div className="p-8 space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">Aufträge</h1>
          <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg">
            <V28StatCard label="Aufträge gesamt" value={demoData.bookings} icon={FileText} />
            <V28StatCard label="Umsatz" value={formatCurrency(demoData.revenue)} icon={Euro} />
            <V28StatCard
              label="Heute"
              value={Math.floor(demoData.bookings * 0.15)}
              icon={FileText}
            />
            <V28StatCard
              label="Abgeschlossen"
              value={Math.floor(demoData.bookings * 0.75)}
              icon={FileText}
            />
          </DataGrid>

          {/* Vereinfachte Tabelle */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-white border border-slate-200 rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {/* Fahrer Preview */}
      {pageType === "fahrer" && (
        <div className="p-8 space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">Fahrer</h1>
          <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            <V28StatCard label="Fahrer gesamt" value={demoData.drivers} icon={Users} />
            <V28StatCard
              label="Im Einsatz"
              value={Math.floor(demoData.drivers * 0.6)}
              icon={Users}
            />
            <V28StatCard
              label="Verfügbar"
              value={Math.floor(demoData.drivers * 0.4)}
              icon={Users}
            />
          </DataGrid>
        </div>
      )}
    </div>
  );
}
