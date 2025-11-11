"use client";
export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StandardListPage, type ListColumn, type BulkAction } from "@/components/templates/StandardListPage";
import { formatDate, formatPhone } from "@/lib/formatters";
import { V28Button } from "@/components/design-system/V28Button";
import { Plus, Trash2, UserCheck } from "lucide-react";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  license_expiry_date?: string;
  shift_status?: "available" | "on_duty" | "offline" | "busy" | "break";
}

export default function DriversListPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchDrivers() {
      setLoading(true);
      const { data, error } = await supabase
        .from("drivers")
        .select(
          "id, first_name, last_name, email, phone, license_expiry_date, shift_status"
        );
      if (!active) return;
      if (error) {
        console.error("Fehler beim Laden der Fahrer:", error);
        setDrivers([]);
      } else {
        setDrivers((data as Driver[]) || []);
      }
      setLoading(false);
    }
    fetchDrivers();
    return () => {
      active = false;
    };
  }, [supabase]);

  const columns: ListColumn<Driver>[] = [
    {
      key: "first_name",
      label: "Name",
      width: "220px",
      render: (_v, item) => `${item.first_name} ${item.last_name}`,
    },
    { key: "email", label: "E-Mail", width: "220px" },
    {
      key: "phone",
      label: "Telefon",
      width: "160px",
      render: (value) => formatPhone(value as string),
    },
    {
      key: "license_expiry_date",
      label: "Führerschein gültig bis",
      width: "160px",
      render: (value) => formatDate(value as string),
    },
    {
      key: "shift_status",
      label: "Verfügbarkeit",
      width: "140px",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs ${
            value === "available"
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-700"
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
      icon: <UserCheck className="mr-2 h-4 w-4" />,
      onClick: (ids) => {
        console.debug("Bulk activate drivers:", ids);
        // Optional: Supabase update logic
      },
      variant: "default",
    },
    {
      label: "Löschen",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: (ids) => {
        console.debug("Bulk delete drivers:", ids);
        // Optional: Supabase delete logic
      },
      variant: "destructive",
    },
  ];

  const kpis = [
    { label: "Gesamt", value: drivers.length, change: 0 },
    {
      label: "Verfügbar",
      value: drivers.filter((d) => d.shift_status === "available").length,
      change: 0,
    },
    {
      label: "Im Dienst",
      value: drivers.filter((d) => d.shift_status === "on_duty").length,
      change: 0,
    },
    {
      label: "Nicht verfügbar",
      value: drivers.filter((d) => d.shift_status === "offline").length,
      change: 0,
    },
  ];

  return (
    <StandardListPage<Driver>
      title="Fahrer"
      subtitle="Alle Fahrer verwalten"
      kpis={kpis}
      data={drivers}
      columns={columns}
      isLoading={loading}
      onCreateNew={() => router.push("/drivers/new")}
      onViewDetail={(driver) => router.push(`/drivers/${driver.id}`)}
      bulkActions={bulkActions}
      onExport={(format) => {
        console.debug("Export drivers:", format);
      }}
    />
  );
}
