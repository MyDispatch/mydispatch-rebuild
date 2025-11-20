/**
 * BOOKINGS PAGE V1.0 (KRONOS Wave 2 - Batch 1)
 *
 * Assembliert aus:
 * - StandardListPage Template
 * - useBookings API Hook
 * - bookingsStore State
 */

import { useState } from "react";
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { StandardListPage, ListColumn, BulkAction } from "@/templates/StandardListPage";
import { useBookings } from "@/lib/api/bookings-hooks";
import { formatDate, formatCurrency, formatStatus } from "@/lib/data-transformers";
import type { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";
import { logDebug, logError } from "@/lib/logger";

type Booking = Tables<"bookings">;

export function BookingsPage() {
  const { data: bookings, isLoading } = useBookings();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const columns: ListColumn<Booking>[] = [
    {
      key: "id",
      label: "Auftragsnummer",
      width: "120px",
      render: (value) => `#${String(value).slice(0, 8)}`,
    },
    {
      key: "customer_id",
      label: "Kunde",
      width: "200px",
      render: (value) => value || "-",
    },
    {
      key: "pickup_time",
      label: "Abholdatum",
      width: "120px",
      render: (value) => formatDate(value as string),
    },
    {
      key: "dropoff_address",
      label: "Ziel",
      width: "250px",
    },
    {
      key: "price",
      label: "Preis",
      width: "100px",
      render: (value) => formatCurrency(value as number),
    },
    {
      key: "status",
      label: "Status",
      width: "120px",
      render: (value) => (
        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700">
          {formatStatus(value as string)}
        </span>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: "Bestätigen",
      icon: <CheckCircle className="h-4 w-4 mr-2" />,
      onClick: (ids) => {
        logDebug("Bulk confirm bookings:", ids);
        // TODO: Implement booking confirmation logic
      },
      variant: "default",
    },
    {
      label: "Löschen",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: (ids) => {
        logDebug("Bulk delete bookings:", ids);
        try {
          // TODO: Implement booking deletion logic
          logError("Booking deletion not implemented yet");
        } catch (error) {
          logError("Failed to delete bookings:", error);
        }
      },
      variant: "destructive",
    },
  ];

  const kpis = [
    { label: "Gesamt", value: bookings?.length || 0, change: 0 },
    {
      label: "Ausstehend",
      value: bookings?.filter((b) => b.status === "pending").length || 0,
      change: 0,
    },
    {
      label: "In Bearbeitung",
      value: bookings?.filter((b) => b.status === "in_progress").length || 0,
      change: 0,
    },
    {
      label: "Abgeschlossen",
      value: bookings?.filter((b) => b.status === "completed").length || 0,
      change: 0,
    },
  ];

  const quickActions = [
    {
      label: "Neuer Auftrag",
      icon: Plus,
      onClick: () => {
        logDebug("Navigate to new booking");
        navigate("/bookings/new");
      },
    },
  ];

  return (
    <StandardListPage
      title="Aufträge"
      subtitle="Alle Transportaufträge verwalten"
      kpis={kpis}
      data={bookings || []}
      columns={columns}
      isLoading={isLoading}
      onCreateNew={() => {
        logDebug("Create new booking");
        navigate("/bookings/new");
      }}
      onViewDetail={(booking) => {
        logDebug("View booking details:", booking.id);
        navigate(`/bookings/${booking.id}`);
      }}
      bulkActions={bulkActions}
      dashboardArea="bookings"
      quickActions={quickActions}
      onExport={(format) => {
        logDebug("Export bookings:", format);
        // TODO: Implement booking export functionality
      }}
    />
  );
}
