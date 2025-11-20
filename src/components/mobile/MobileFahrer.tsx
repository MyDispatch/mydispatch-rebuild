/* ==================================================================================
   MOBILE-OPTIMIERTE FAHRER-ANSICHT V18.3 - MIT GRID-LAYOUT
   ==================================================================================
   Verwendet MobileGridLayout für standardisierte Struktur
   ================================================================================== */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { Plus, Search, Phone, MapPin, FileText, User } from "lucide-react";
import { MobileGridLayout } from "./MobileGridLayout";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { getShiftStatusLabel } from "@/lib/vehicle-status-utils";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  license_number: string;
  phone?: string;
  shift_status?: "available" | "busy" | "offline";
  rides_today?: number;
  current_location?: string;
  last_position?: { lat: number; lng: number };
  document_status?: "valid" | "expiring" | "expired";
}

interface MobileFahrerProps {
  drivers: Driver[];
  isLoading: boolean;
  onCreateNew: () => void;
  onDriverClick: (driver: Driver) => void;
  onRefresh: () => void;
}

export function MobileFahrer({
  drivers,
  isLoading,
  onCreateNew,
  onDriverClick,
  onRefresh,
}: MobileFahrerProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter drivers
  const filteredDrivers = drivers.filter((driver) => {
    // Status filter
    if (activeFilter === "available" && driver.shift_status !== "available") return false;
    if (activeFilter === "busy" && driver.shift_status !== "busy") return false;
    if (activeFilter === "offline" && driver.shift_status !== "offline") return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${driver.first_name} ${driver.last_name}`.toLowerCase();
      return (
        fullName.includes(query) ||
        driver.license_number?.toLowerCase().includes(query) ||
        driver.phone?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Count by status
  const statusCounts = {
    all: drivers.length,
    available: drivers.filter((d) => d.shift_status === "available").length,
    busy: drivers.filter((d) => d.shift_status === "busy").length,
    offline: drivers.filter((d) => d.shift_status === "offline").length,
  };

  const filters = [
    { id: "all", label: "Alle", count: statusCounts.all },
    { id: "available", label: "Verfügbar", count: statusCounts.available },
    { id: "busy", label: "Im Einsatz", count: statusCounts.busy },
    { id: "offline", label: "Offline", count: statusCounts.offline },
  ];

  const getStatusType = (status?: string) => {
    switch (status) {
      case "available":
        return "success";
      case "busy":
        return "warning";
      case "offline":
        return "neutral";
      default:
        return "neutral";
    }
  };

  return (
    <MobileGridLayout<Driver>
      searchPlaceholder="Suchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredDrivers}
      renderCard={(driver) => (
        <Card className="cursor-pointer hover:bg-primary/5 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-base">
                  {driver.first_name} {driver.last_name}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">{driver.license_number}</p>
              </div>
              <StatusIndicator
                type={getStatusType(driver.shift_status)}
                label={getShiftStatusLabel(driver.shift_status)}
              />
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {driver.rides_today !== undefined && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{driver.rides_today} Fahrten</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-foreground" />
                <span className="truncate">{driver.current_location || "Keine Position"}</span>
              </div>
            </div>

            {driver.license_number && (
              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t">
                <div className="flex items-center gap-1.5 text-xs">
                  <FileText className="h-4 w-4" />
                  <span>Dokumente</span>
                </div>
                <StatusIndicator
                  type={
                    driver.document_status === "valid"
                      ? "success"
                      : driver.document_status === "expiring"
                        ? "warning"
                        : "error"
                  }
                  label={
                    driver.document_status === "valid"
                      ? "Gültig"
                      : driver.document_status === "expiring"
                        ? "Läuft ab"
                        : "Abgelaufen"
                  }
                  size="sm"
                />
              </div>
            )}

            {driver.phone && (
              <V28Button
                variant="secondary"
                size="sm"
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${driver.phone}`;
                }}
              >
                <Phone className="h-4 w-4 mr-2" />
                Anrufen
              </V28Button>
            )}
          </CardContent>
        </Card>
      )}
      onItemClick={onDriverClick}
      entityLabel={{ singular: "Fahrer", plural: "Fahrer" }}
      fabLabel="Neuer Fahrer"
      onFabClick={onCreateNew}
      fabIcon={Plus}
      emptyStateProps={{
        icon: <Search className="h-16 w-16" />,
        noDataTitle: "Keine Fahrer",
        noDataDescription: "Erstelle deinen ersten Fahrer",
        noResultsTitle: "Keine Ergebnisse",
        noResultsDescription: "Versuche einen anderen Suchbegriff",
      }}
    />
  );
}
