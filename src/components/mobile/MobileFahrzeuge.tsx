/* ==================================================================================
   MOBILE-OPTIMIERTE FAHRZEUGE-ANSICHT V18.3 - MIT GRID-LAYOUT
   ==================================================================================
   Verwendet MobileGridLayout für standardisierte Struktur
   ================================================================================== */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Car, Calendar, AlertTriangle } from "lucide-react";
import { MobileGridLayout } from "./MobileGridLayout";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { getVehicleStatusLabel } from "@/lib/vehicle-status-utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface Vehicle {
  id: string;
  license_plate: string;
  vehicle_class?: string;
  status?: "available" | "maintenance" | "offline";
  tuev_expiry?: string;
  next_maintenance?: string;
  last_maintenance_at?: string;
  total_rides?: number;
  document_status?: "valid" | "expiring" | "expired";
}

interface MobileFahrzeugeProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onCreateNew: () => void;
  onVehicleClick: (vehicle: Vehicle) => void;
  onRefresh: () => void;
}

export function MobileFahrzeuge({
  vehicles,
  isLoading,
  onCreateNew,
  onVehicleClick,
  onRefresh,
}: MobileFahrzeugeProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (activeFilter === "available" && vehicle.status !== "available") return false;
    if (activeFilter === "maintenance" && vehicle.status !== "maintenance") return false;
    if (activeFilter === "offline" && vehicle.status !== "offline") return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        vehicle.license_plate?.toLowerCase().includes(query) ||
        vehicle.vehicle_class?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const statusCounts = {
    all: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    offline: vehicles.filter((v) => v.status === "offline").length,
  };

  const filters = [
    { id: "all", label: "Alle", count: statusCounts.all },
    { id: "available", label: "Verfügbar", count: statusCounts.available },
    { id: "maintenance", label: "Gewartet", count: statusCounts.maintenance },
    { id: "offline", label: "Offline", count: statusCounts.offline },
  ];

  const getStatusType = (status?: string) => {
    switch (status) {
      case "available":
        return "success";
      case "maintenance":
        return "warning";
      case "offline":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getTuevStatus = (
    expiryDate?: string
  ): { type: "success" | "warning" | "error"; label: string } => {
    if (!expiryDate) return { type: "neutral" as any, label: "Unbekannt" };

    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { type: "error", label: "Abgelaufen" };
    if (daysUntilExpiry <= 30) return { type: "warning", label: "Läuft ab" };
    return { type: "success", label: "Gültig" };
  };

  return (
    <MobileGridLayout<Vehicle>
      searchPlaceholder="Suchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredVehicles}
      renderCard={(vehicle) => {
        const tuevStatus = getTuevStatus(vehicle.tuev_expiry);

        return (
          <Card className="cursor-pointer hover:bg-primary/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Car className="h-4 w-4 text-foreground" />
                    {vehicle.license_plate}
                  </h3>
                  {vehicle.vehicle_class && (
                    <p className="text-sm text-muted-foreground mt-0.5">{vehicle.vehicle_class}</p>
                  )}
                </div>
                <StatusIndicator
                  type={getStatusType(vehicle.status)}
                  label={getVehicleStatusLabel(vehicle.status || "available")}
                />
              </div>

              {vehicle.total_rides !== undefined && (
                <div className="text-xs text-muted-foreground mb-3">
                  {vehicle.total_rides} Fahrten gesamt
                </div>
              )}

              <div className="space-y-2 pt-3 border-t">
                {vehicle.tuev_expiry && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      TÜV: {format(new Date(vehicle.tuev_expiry), "dd.MM.yyyy", { locale: de })}
                    </span>
                  </div>
                )}
                {vehicle.last_maintenance_at && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Letzte Wartung:{" "}
                      {format(new Date(vehicle.last_maintenance_at), "dd.MM.yyyy", { locale: de })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      }}
      onItemClick={onVehicleClick}
      entityLabel={{ singular: "Fahrzeug", plural: "Fahrzeuge" }}
      fabLabel="Neues Fahrzeug"
      onFabClick={onCreateNew}
      fabIcon={Plus}
      emptyStateProps={{
        icon: <Search className="h-16 w-16" />,
        noDataTitle: "Keine Fahrzeuge",
        noDataDescription: "Erstelle dein erstes Fahrzeug",
        noResultsTitle: "Keine Ergebnisse",
        noResultsDescription: "Versuche einen anderen Suchbegriff",
      }}
    />
  );
}
