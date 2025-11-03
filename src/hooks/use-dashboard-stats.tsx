/* ==================================================================================
   USE-DASHBOARD-STATS HOOK - Materialized View Integration
   ==================================================================================
   - Nutzt dashboard_stats View mit RLS-Policy (company_id-isoliert)
   - Auto-Refresh via Trigger
   - React Query Caching
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

interface DashboardStats {
  company_id: string;
  completed_bookings: number;
  confirmed_bookings: number;
  pending_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  avg_booking_value: number;
  paid_revenue: number;
  unpaid_revenue: number; // ✅ FIX: Renamed from pending_revenue to match DB function
  partner_bookings: number;
  partner_revenue: number;
  total_customers: number;
  total_drivers: number;
  total_vehicles: number;
  last_updated: string; // ✅ FIX: Renamed from last_refresh to match DB function
}

export function useDashboardStats() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return null;

      // V18.3.29: Nutze RPC function (Materialized View in analytics schema)
      const { data, error } = await supabase
        .rpc('get_dashboard_stats_for_company', {
          target_company_id: profile.company_id
        })
        .maybeSingle();

      if (error) throw error;
      return data as DashboardStats | null;
    },
    enabled: !!profile?.company_id,
    staleTime: 60000, // 1 Minute Cache (View refresht automatisch via Trigger)
    gcTime: 5 * 60 * 1000, // 5 Minuten
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

/**
 * Helper: Formatiere Währung
 */
export function formatRevenue(amount: number | null | undefined): string {
  if (!amount) return '0,00 €';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/**
 * Helper: Berechne Wachstum
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
