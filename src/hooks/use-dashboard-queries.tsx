/* ==================================================================================
   DASHBOARD QUERIES HOOK - PHASE 3 DATA FLOW
   ==================================================================================
   ✅ Revenue Chart Data (7 days, grouped by date)
   ✅ Order Status Data (count by status)
   ✅ Recent Activities (last 10 bookings)
   ================================================================================== */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { format, subDays } from "date-fns";

interface RevenueDataPoint {
  date: string;
  amount: number;
}

interface OrderStatusPoint {
  status: string;
  value: number;
  label: string;
}

// Revenue Data for BarChart (7 days)
export function useRevenueData() {
  const { profile } = useAuth();

  return useQuery<RevenueDataPoint[]>({
    queryKey: ["dashboard-revenue", profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const sevenDaysAgo = subDays(new Date(), 7).toISOString();

      const { data, error } = await (supabase as any)
        .from("bookings")
        .select("created_at, price")
        .eq("company_id", profile.company_id)
        .gte("created_at", sevenDaysAgo)
        .neq("status", "cancelled")
        .eq("is_archived", false)
        .not("price", "is", null);

      if (error) throw error;

      // Group by date
      const grouped: Record<string, number> = {};
      if (data) {
        data.forEach((booking: any) => {
          const date = format(new Date(booking.created_at), "dd.MM");
          grouped[date] = (grouped[date] || 0) + (booking.price || 0);
        });
      }

      return Object.entries(grouped).map(([date, amount]) => ({
        date,
        amount,
      }));
    },
    enabled: !!profile?.company_id,
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

// Order Status Data for PieChart
export function useOrderStatusData() {
  const { profile } = useAuth();

  return useQuery<OrderStatusPoint[]>({
    queryKey: ["dashboard-order-status", profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await (supabase as any)
        .from("bookings")
        .select("status")
        .eq("company_id", profile.company_id)
        .eq("is_archived", false);

      if (error) throw error;

      // Count by status
      const counts: Record<string, number> = {};
      if (data) {
        data.forEach((booking: any) => {
          const status = booking.status || "unknown";
          counts[status] = (counts[status] || 0) + 1;
        });
      }

      const statusLabels: Record<string, string> = {
        pending: "Wartend",
        confirmed: "Bestätigt",
        in_progress: "In Bearbeitung",
        completed: "Abgeschlossen",
        cancelled: "Storniert",
      };

      return Object.entries(counts).map(([status, value]) => ({
        status,
        value,
        label: statusLabels[status] || status,
      }));
    },
    enabled: !!profile?.company_id,
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

// Recent Activities (last 10 bookings)
export function useRecentActivities() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["dashboard-activities", profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await (supabase as any)
        .from("bookings")
        .select(
          "id, created_at, pickup_address, dropoff_address, status, customer:customers(first_name, last_name)"
        )
        .eq("company_id", profile.company_id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map((booking: any) => ({
        id: booking.id,
        timestamp: booking.created_at,
        type: "booking",
        description: `Auftrag ${booking.pickup_address} → ${booking.dropoff_address}`,
        status: booking.status,
        customer: booking.customer
          ? `${booking.customer.first_name} ${booking.customer.last_name}`
          : "Unbekannt",
      }));
    },
    enabled: !!profile?.company_id,
    staleTime: 60000,
    refetchInterval: 60000,
  });
}
