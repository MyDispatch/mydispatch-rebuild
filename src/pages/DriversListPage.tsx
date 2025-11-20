/**
 * DRIVERS LIST PAGE V1.0 (KRONOS Wave 2 - Batch 1)
 *
 * Assembliert aus:
 * - StandardListPage Template
 * - useDrivers API Hook
 * - driversStore State
 */

import { useState } from "react";
import { Plus, Trash2, UserCheck } from "lucide-react";
import { StandardListPage, ListColumn, BulkAction } from "@/templates/StandardListPage";
import { useDrivers } from "@/hooks/use-drivers";
import { formatDate, formatPhone } from "@/lib/data-transformers";
import type { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";
import { logDebug, logError } from "@/lib/logger";

type Driver = Tables<"drivers">;

export function DriversListPage() {
  const { drivers, isLoading } = useDrivers();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const columns: ListColumn<Driver>[] = [
    {
      key: "first_name",
      label: "Name",
      width: "200px",
      render: (value, item) => `${item.first_name} ${item.last_name}`,
    },
    {
      key: "email",
      label: "E-Mail",
      width: "200px",
    },
    {
      key: "phone",
      label: "Telefon",
      width: "150px",
      render: (value) => formatPhone(value as string),
    },
    {
      key: "license_expiry_date",
      label: "Führerschein gültig bis",
      width: "150px",
      render: (value) => formatDate(value as string),
    },
    {
      key: "shift_status",
      label: "Verfügbarkeit",
      width: "120px",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs ${
            value === "available" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
          }`}
        >
          {value === "available" ? "Verfügbar" : "Nicht verfügbar"}
        </span>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: "Aktivieren",
      icon: <UserCheck className="h-4 w-4 mr-2" />,
      onClick: (ids) => {
        logDebug("Bulk activate drivers:", ids);
        // TODO: Implement driver activation logic
      },
      variant: "default",
    },
    {
      label: "Löschen",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: (ids) => {
        logDebug("Bulk delete drivers:", ids);
        try {
          // TODO: Implement driver deletion logic
          logError("Driver deletion not implemented yet");
        } catch (error) {
          logError("Failed to delete drivers:", error);
        }
      },
      variant: "destructive",
    },
  ];

  const kpis = [
    { label: "Gesamt", value: drivers?.length || 0, change: 0 },
    {
      label: "Verfügbar",
      value: drivers?.filter((d) => d.shift_status === "available").length || 0,
      change: 0,
    },
    {
      label: "Im Dienst",
      value: drivers?.filter((d) => d.shift_status === "on_duty").length || 0,
      change: 0,
    },
    {
      label: "Nicht verfügbar",
      value: drivers?.filter((d) => d.shift_status === "offline").length || 0,
      change: 0,
    },
  ];

  const quickActions = [
    {
      label: "Neuer Fahrer",
      icon: Plus,
      onClick: () => {
        logDebug("Navigate to new driver");
        navigate("/drivers/new");
      },
    },
  ];

  return (
    <StandardListPage
      title="Fahrer"
      subtitle="Alle Fahrer verwalten"
      kpis={kpis}
      data={drivers || []}
      columns={columns}
      isLoading={isLoading}
      onCreateNew={() => {
        logDebug("Create new driver");
        navigate("/drivers/new");
      }}
      onViewDetail={(driver) => {
        logDebug("View driver details:", driver.id);
        navigate(`/drivers/${driver.id}`);
      }}
      bulkActions={bulkActions}
      dashboardArea="drivers"
      quickActions={quickActions}
      onExport={(format) => {
        logDebug("Export drivers:", format);
        // TODO: Implement driver export functionality
      }}
    />
  );
}
