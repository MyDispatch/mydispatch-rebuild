/**
 * VEHICLES LIST PAGE V1.0 (KRONOS Wave 2 - Batch 1)
 *
 * Assembliert aus:
 * - StandardListPage Template
 * - useVehicles API Hook
 * - vehiclesStore State
 */

import { useVehicles } from "@/hooks/use-vehicles";
import type { Tables } from "@/integrations/supabase/types";
import { BulkAction, ListColumn, StandardListPage } from "@/templates/StandardListPage";
import { Plus, Trash2, Wrench } from "lucide-react";
import { useState } from "react";

type Vehicle = Tables<"vehicles">;

export function VehiclesListPage() {
  const { vehicles, isLoading } = useVehicles();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const columns: ListColumn<Vehicle>[] = [
    {
      key: "license_plate",
      label: "Kennzeichen",
      width: "120px",
    },
    {
      key: "brand",
      label: "Marke",
      width: "150px",
    },
    {
      key: "model",
      label: "Modell",
      width: "150px",
    },
    {
      key: "year",
      label: "Baujahr",
      width: "100px",
    },
    {
      key: "status",
      label: "Status",
      width: "120px",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs ${
            value === "available"
              ? "bg-green-100 text-green-700"
              : value === "wartung"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {value === "available" ? "Verfügbar" : value === "wartung" ? "Wartung" : "Im Einsatz"}
        </span>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: "Wartung planen",
      icon: <Wrench className="h-4 w-4 mr-2" />,
      onClick: (ids) => {
        logDebug("[VehiclesList] Schedule maintenance for vehicles:", ids);
        // TODO: Implement maintenance scheduling
        // navigate(`/maintenance/schedule?vehicleIds=${ids.join(',')}`);
      },
      variant: "default",
    },
    {
      label: "Löschen",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: async (ids) => {
        logDebug("[VehiclesList] Delete vehicles:", ids);
        try {
          // TODO: Implement vehicle deletion with confirmation
          // const confirmed = await showConfirmationDialog();
          // if (confirmed) {
          //   await deleteVehicles(ids);
          // }
        } catch (error) {
          logError("[VehiclesList] Failed to delete vehicles:", error);
        }
      },
      variant: "destructive",
    },
  ];

  const kpis = [
    { label: "Gesamt", value: vehicles?.length || 0, change: 0 },
    {
      label: "Verfügbar",
      value: vehicles?.filter((v) => v.status === "available").length || 0,
      change: 0,
    },
    {
      label: "Im Einsatz",
      value: vehicles?.filter((v) => v.status === "im_einsatz").length || 0,
      change: 0,
    },
    {
      label: "Wartung",
      value: vehicles?.filter((v) => v.status === "wartung").length || 0,
      change: 0,
    },
  ];

  const quickActions = [
    {
      label: "Neues Fahrzeug",
      icon: Plus,
      onClick: () => {
        logDebug("[VehiclesList] Navigate to new vehicle form");
        navigate("/vehicles/new");
      },
    },
  ];

  return (
    <StandardListPage
      title="Fahrzeuge"
      subtitle="Alle Fahrzeuge verwalten"
      kpis={kpis}
      data={vehicles || []}
      columns={columns}
      isLoading={isLoading}
      onCreateNew={() => {
        logDebug("[VehiclesList] Create new vehicle");
        navigate("/vehicles/new");
      }}
      onViewDetail={(vehicle) => {
        logDebug("[VehiclesList] View vehicle details:", vehicle.id);
        navigate(`/vehicles/${vehicle.id}`);
      }}
      bulkActions={bulkActions}
      dashboardArea="vehicles"
      quickActions={quickActions}
      onExport={(format) => {
        logDebug("[VehiclesList] Export vehicles in format:", format);
        // TODO: Implement vehicle export functionality
        // exportVehicles(format, selectedIds);
      }}
    />
  );
}
