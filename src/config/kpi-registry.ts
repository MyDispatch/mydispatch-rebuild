/* ==================================================================================
   KPI REGISTRY - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ⚠️ KRITISCH: Alle KPI-Definitionen an EINER Stelle!
   
   REGEL: Jede Page hat GENAU 3 strategische KPIs!
   ================================================================================== */

import {
  FileText,
  Users,
  Car,
  Euro,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  BOOKING_STATUS_CONFIG,
  DRIVER_STATUS_CONFIG,
  INVOICE_STATUS_CONFIG,
  VEHICLE_STATUS_CONFIG,
} from "@/lib/status-system";

interface KPIDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
  getValue: () => Promise<string | number>;
  getChange?: () => Promise<{ value: number; trend: "up" | "down" | "neutral" }>;
  onClick?: () => void;
  // NEU: Status-Integration (Phase 2.5)
  getStatusInfo?: () => Promise<import("@/lib/status-system").StatusConfig | null>;
}

// Helper function to break TypeScript inference
const getCustomersPortalAccess = async (): Promise<number> => {
  try {
    const query = await (supabase as any)
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("portal_access_enabled", true);

    if (query.error) throw query.error;
    return query.count || 0;
  } catch {
    return 0;
  }
};

// ============================================================================
// DASHBOARD (Home)
// ============================================================================
const DASHBOARD_KPIS = [
  {
    id: "bookings-today",
    label: "Aufträge Heute",
    icon: FileText,
    getValue: async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { count, error } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .gte("pickup_date", today)
          .lt("pickup_date", new Date(Date.now() + 86400000).toISOString().split("T")[0]);

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
    getChange: async () => ({ value: 12, trend: "up" as const }),
  },
  {
    id: "revenue-today",
    label: "Umsatz Heute",
    icon: Euro,
    getValue: async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("bookings")
          .select("price")
          .gte("pickup_date", today)
          .eq("status", "completed");

        if (error) throw error;
        const total = data?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0;
        return `${total.toLocaleString("de-DE")} €`;
      } catch {
        return "0 €";
      }
    },
    getChange: async () => ({ value: 8, trend: "up" as const }),
  },
  {
    id: "drivers-active",
    label: "Fahrer Aktiv",
    icon: Users,
    getValue: async () => {
      try {
        const { count, error } = await supabase
          .from("drivers")
          .select("*", { count: "exact", head: true })
          .eq("shift_status", "on_duty");

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
];

// ============================================================================
// AUFTRÄGE (Bookings)
// ============================================================================
const AUFTRAEGE_KPIS = [
  {
    id: "bookings-open",
    label: "Offene Aufträge",
    icon: Clock,
    getValue: async () => {
      try {
        const { count, error } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
    // NEU: Status-Integration
    getStatusInfo: async () => BOOKING_STATUS_CONFIG.pending,
  },
  {
    id: "bookings-completed",
    label: "Abgeschlossen (Heute)",
    icon: CheckCircle,
    getValue: async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const { count, error } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed")
          .gte("pickup_date", today);

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
  {
    id: "bookings-revenue-month",
    label: "Umsatz (Monat)",
    icon: Euro,
    getValue: async () => {
      try {
        const firstDayOfMonth = new Date(new Date().setDate(1)).toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("bookings")
          .select("price")
          .eq("status", "completed")
          .gte("pickup_date", firstDayOfMonth);

        if (error) throw error;
        const total = data?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0;
        return `${total.toLocaleString("de-DE")} €`;
      } catch {
        return "0 €";
      }
    },
  },
];

// ============================================================================
// KUNDEN (Customers)
// ============================================================================
const KUNDEN_KPIS: KPIDefinition[] = [
  {
    id: "customers-total",
    label: "Kunden Gesamt",
    icon: Users,
    getValue: async (): Promise<number> => {
      try {
        const { count, error } = (await supabase
          .from("customers")
          .select("*", { count: "exact", head: true })) as { count: number | null; error: any };

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
  {
    id: "customers-portal-access",
    label: "Portal-Zugang",
    icon: Users,
    getValue: getCustomersPortalAccess,
  },
  {
    id: "customers-bookings-month",
    label: "Buchungen (Monat)",
    icon: FileText,
    getValue: async (): Promise<number> => {
      try {
        const firstDayOfMonth = new Date(new Date().setDate(1)).toISOString().split("T")[0];
        const { count, error } = (await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .gte("pickup_date", firstDayOfMonth)) as { count: number | null; error: any };

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
];

// ============================================================================
// FAHRER (Drivers)
// ============================================================================
const FAHRER_KPIS: KPIDefinition[] = [
  {
    id: "drivers-total",
    label: "Fahrer Gesamt",
    icon: Users,
    getValue: async () => {
      try {
        const { count, error } = await supabase
          .from("drivers")
          .select("*", { count: "exact", head: true });

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
  {
    id: "drivers-on-duty",
    label: "Im Dienst",
    icon: CheckCircle,
    getValue: async () => {
      try {
        const { count, error } = await supabase
          .from("drivers")
          .select("*", { count: "exact", head: true })
          .eq("shift_status", "on_duty");

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
  {
    id: "drivers-active-month",
    label: "Aktiv (Monat)",
    icon: TrendingUp,
    getValue: async () => {
      try {
        const firstDayOfMonth = new Date(new Date().setDate(1)).toISOString().split("T")[0];
        const { count, error } = await supabase
          .from("bookings")
          .select("driver_id", { count: "exact", head: true })
          .not("driver_id", "is", null)
          .gte("pickup_date", firstDayOfMonth);

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
];

// ============================================================================
// FAHRZEUGE (Vehicles)
// ============================================================================
const FAHRZEUGE_KPIS: KPIDefinition[] = [
  {
    id: "vehicles-total",
    label: "Fahrzeuge Gesamt",
    icon: Car,
    getValue: async () => {
      try {
        const { count, error } = await supabase
          .from("vehicles")
          .select("*", { count: "exact", head: true });

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
  {
    id: "vehicles-active",
    label: "Verfügbar",
    icon: CheckCircle,
    getValue: async () => {
      try {
        const { count, error } = await supabase
          .from("vehicles")
          .select("*", { count: "exact", head: true })
          .eq("status", "available");

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
  {
    id: "vehicles-in-service",
    label: "Im Einsatz",
    icon: TrendingUp,
    getValue: async () => {
      try {
        const { count, error } = await supabase
          .from("bookings")
          .select("vehicle_id", { count: "exact", head: true })
          .eq("status", "in_progress")
          .not("vehicle_id", "is", null);

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
];

// ============================================================================
// RECHNUNGEN (Invoices)
// ============================================================================
const RECHNUNGEN_KPIS: KPIDefinition[] = [
  {
    id: "invoices-open",
    label: "Offene Rechnungen",
    icon: AlertCircle,
    getValue: async () => {
      try {
        const { count, error } = await supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
  {
    id: "invoices-total-month",
    label: "Rechnungen (Monat)",
    icon: FileText,
    getValue: async () => {
      try {
        const firstDayOfMonth = new Date(new Date().setDate(1)).toISOString().split("T")[0];
        const { count, error } = await supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .gte("created_at", firstDayOfMonth);

        if (error) throw error;
        return count || 0;
      } catch {
        return 0;
      }
    },
  },
  {
    id: "invoices-revenue-month",
    label: "Umsatz (Monat)",
    icon: Euro,
    getValue: async () => {
      try {
        const firstDayOfMonth = new Date(new Date().setDate(1)).toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("invoices")
          .select("total_amount")
          .eq("status", "paid")
          .gte("created_at", firstDayOfMonth);

        if (error) throw error;
        const total = data?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;
        return `${total.toLocaleString("de-DE")} €`;
      } catch {
        return "0 €";
      }
    },
  },
];

// ============================================================================
// REGISTRY - ALL KPIS BY PAGE
// ============================================================================
export const KPI_REGISTRY = {
  dashboard: DASHBOARD_KPIS,
  auftraege: AUFTRAEGE_KPIS,
  kunden: KUNDEN_KPIS,
  fahrer: FAHRER_KPIS,
  fahrzeuge: FAHRZEUGE_KPIS,
  rechnungen: RECHNUNGEN_KPIS,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get KPIs by Page
 */
export const getKPIsForPage = (page: keyof typeof KPI_REGISTRY): KPIDefinition[] => {
  return KPI_REGISTRY[page];
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type KPIPage = keyof typeof KPI_REGISTRY;
export type { KPIDefinition };
