/* ==================================================================================
   use-customer-related - TanStack Query Hook for Customer Related Data
   ==================================================================================
   MISSION II (STRANGLER FIG 2.0) - Cluster 4
   Ersetzt direkte Supabase-Calls in Kunden.tsx
   ================================================================================== */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CustomerBooking {
  id: string;
  pickup_address: string;
  dropoff_address: string | null;
  pickup_time: string;
  price: number;
  status: string;
}

interface CustomerInvoice {
  id: string;
  price: number;
  payment_status: "pending" | "paid" | "overdue" | "cancelled";
  created_at: string;
}

export function useCustomerRelatedData(customerId: string | null, companyId: string | undefined) {
  // Bookings Query
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["customer-bookings", customerId, companyId],
    queryFn: async () => {
      if (!customerId || !companyId) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select("id, pickup_address, dropoff_address, pickup_time, price, status")
        .eq("company_id", companyId)
        .eq("customer_id", customerId)
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as CustomerBooking[];
    },
    enabled: !!customerId && !!companyId,
  });

  // Invoices Query (via bookings with pending/overdue payment_status)
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["customer-invoices", customerId, companyId],
    queryFn: async () => {
      if (!customerId || !companyId) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select("id, price, payment_status, created_at")
        .eq("company_id", companyId)
        .eq("customer_id", customerId)
        .eq("archived", false)
        .in("payment_status", ["pending", "overdue"])
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as CustomerInvoice[];
    },
    enabled: !!customerId && !!companyId,
  });

  return {
    bookings,
    invoices,
    isLoading: isLoadingBookings || isLoadingInvoices,
  };
}
