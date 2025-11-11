/* ==================================================================================
   STATISTICS HOOK - V18.1 mit React Query
   ==================================================================================
   Dashboard-Statistiken mit Smart Caching
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { queryKeys } from '@/lib/react-query/query-keys';

interface DashboardStats {
  bookings_today: number;
  active_drivers: number;
  inactive_drivers: number;
  total_drivers: number;
  vehicles_in_use: number;
  revenue_today: number;
  bookings_this_week: number;
  revenue_this_week: number;
  bookings_this_month: number;
  revenue_this_month: number;
  month_revenue: number;
  month_revenue_growth: number; // Prozentwert (z. B. 0.12 für +12%)
}

export { type DashboardStats };

export const useStatistics = () => {
  const { profile } = useAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: queryKeys.dashboardStats.list(profile?.company_id),
    queryFn: async (): Promise<DashboardStats> => {
      if (!profile?.company_id) {
        return {
          bookings_today: 0,
          active_drivers: 0,
          inactive_drivers: 0,
          total_drivers: 0,
          vehicles_in_use: 0,
          revenue_today: 0,
          bookings_this_week: 0,
          revenue_this_week: 0,
          bookings_this_month: 0,
          revenue_this_month: 0,
          month_revenue: 0,
          month_revenue_growth: 0,
        };
      }

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Wochenstart (Montag)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1);
      const weekStartStr = weekStart.toISOString().split('T')[0];
      
      // Monatsstart
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthStartStr = monthStart.toISOString().split('T')[0];
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // letzter Tag des Vormonats
      const prevMonthStartStr = prevMonthStart.toISOString().split('T')[0];
      const prevMonthEndStr = prevMonthEnd.toISOString().split('T')[0];

      // Parallele Queries für Performance
      const [
        todayBookingsResult,
        activeDriversResult,
        totalDriversResult,
        vehiclesInUseResult,
        todayRevenueResult,
        weekBookingsResult,
        weekRevenueResult,
        monthBookingsResult,
        monthRevenueResult,
        prevMonthRevenueResult,
      ] = await Promise.all([
        // Heutige Aufträge
        supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', profile.company_id)
          .gte('pickup_time', `${today}T00:00:00`)
          .lte('pickup_time', `${today}T23:59:59`)
          .eq('archived', false),
        
        // Aktive Fahrer
        supabase
          .from('drivers')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', profile.company_id)
          .eq('shift_status', 'available')
          .eq('archived', false),

        // Gesamtzahl Fahrer
        supabase
          .from('drivers')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', profile.company_id)
          .eq('archived', false),
        
        // Fahrzeuge im Einsatz
        supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', profile.company_id)
          .eq('status', 'im_einsatz')
          .eq('archived', false),
        
        // Heutiger Umsatz
        supabase
          .from('bookings')
          .select('price')
          .eq('company_id', profile.company_id)
          .gte('pickup_time', `${today}T00:00:00`)
          .lte('pickup_time', `${today}T23:59:59`)
          .eq('archived', false),
        
        // Wochenaufträge
        supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', profile.company_id)
          .gte('pickup_time', `${weekStartStr}T00:00:00`)
          .eq('archived', false),
        
        // Wochenumsatz
        supabase
          .from('bookings')
          .select('price')
          .eq('company_id', profile.company_id)
          .gte('pickup_time', `${weekStartStr}T00:00:00`)
          .eq('archived', false),
        
        // Monatsaufträge
        supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', profile.company_id)
          .gte('pickup_time', `${monthStartStr}T00:00:00`)
          .eq('archived', false),
        
        // Monatsumsatz
        supabase
          .from('bookings')
          .select('price')
          .eq('company_id', profile.company_id)
          .gte('pickup_time', `${monthStartStr}T00:00:00`)
          .eq('archived', false),

        // Vormonatsumsatz
        supabase
          .from('bookings')
          .select('price')
          .eq('company_id', profile.company_id)
          .gte('pickup_time', `${prevMonthStartStr}T00:00:00`)
          .lte('pickup_time', `${prevMonthEndStr}T23:59:59`)
          .eq('archived', false),
      ]);

      const todayRevenue = todayRevenueResult.data?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;
      const weekRevenue = weekRevenueResult.data?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;
      const monthRevenue = monthRevenueResult.data?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;
      const prevMonthRevenue = prevMonthRevenueResult.data?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;

      const totalDrivers = totalDriversResult.count || 0;
      const activeDrivers = activeDriversResult.count || 0;
      const inactiveDrivers = Math.max(0, totalDrivers - activeDrivers);
      const monthGrowth = prevMonthRevenue > 0 ? (monthRevenue - prevMonthRevenue) / prevMonthRevenue : 0;

      return {
        bookings_today: todayBookingsResult.count || 0,
        active_drivers: activeDrivers,
        inactive_drivers: inactiveDrivers,
        total_drivers: totalDrivers,
        vehicles_in_use: vehiclesInUseResult.count || 0,
        revenue_today: todayRevenue,
        bookings_this_week: weekBookingsResult.count || 0,
        revenue_this_week: weekRevenue,
        bookings_this_month: monthBookingsResult.count || 0,
        revenue_this_month: monthRevenue,
        month_revenue: monthRevenue,
        month_revenue_growth: monthGrowth,
      };
    },
    enabled: !!profile?.company_id,
    staleTime: 30000, // 30 Sekunden für Dashboard
    refetchInterval: 30000, // Auto-refresh alle 30s
  });

  return {
    stats: stats || {
      bookings_today: 0,
      active_drivers: 0,
      inactive_drivers: 0,
      total_drivers: 0,
      vehicles_in_use: 0,
      revenue_today: 0,
      bookings_this_week: 0,
      revenue_this_week: 0,
      bookings_this_month: 0,
      revenue_this_month: 0,
      month_revenue: 0,
      month_revenue_growth: 0,
    },
    isLoading,
    error,
  };
};
