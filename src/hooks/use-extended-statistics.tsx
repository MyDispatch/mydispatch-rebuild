/* ==================================================================================
   USE-EXTENDED-STATISTICS HOOK - V18.3 Sprint 35
   ==================================================================================
   - Erweiterte Statistiken für Statistiken-Seite
   - Top-Fahrer-Ranking
   - Partner-Performance
   - Zeitbasierte Umsatz-Analyse
   - Multi-Tenant (company_id)
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { subDays, format } from 'date-fns';

interface TopDriver {
  driver_id: string;
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  total_rides: number;
  total_revenue: number;
  avg_rating?: number;
}

interface PartnerPerformance {
  partner_id: string;
  name: string;
  total_bookings: number;
  total_revenue: number;
  provision_rate: number;
  trend_percentage: number; // Echter Trend vs. letzten Monat
}

interface DailyRevenue {
  date: string;
  revenue: number;
  bookings: number;
}

export function useExtendedStatistics() {
  const { profile } = useAuth();

  // Top-Fahrer-Ranking (Monat)
  const { data: topDrivers = [], isLoading: loadingDrivers } = useQuery({
    queryKey: ['top-drivers', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          driver_id,
          price,
          drivers (
            id,
            first_name,
            last_name,
            profile_image_url
          )
        `)
        .eq('company_id', profile.company_id)
        .eq('archived', false)
        .gte('created_at', thirtyDaysAgo)
        .not('driver_id', 'is', null)
        .in('status', ['completed', 'confirmed']);

      if (error) throw error;

      // Aggregiere Daten pro Fahrer
      const driverStats = data.reduce((acc: Record<string, unknown>, booking) => {
        if (!booking.driver_id || !booking.drivers) return acc;

        const driverId = booking.driver_id;
        if (!acc[driverId]) {
          acc[driverId] = {
            driver_id: driverId,
            first_name: booking.drivers.first_name,
            last_name: booking.drivers.last_name,
            profile_image_url: booking.drivers.profile_image_url,
            total_rides: 0,
            total_revenue: 0,
          };
        }

        acc[driverId].total_rides += 1;
        acc[driverId].total_revenue += booking.price || 0;

        return acc;
      }, {});

      // Sortiere nach Umsatz
      return Object.values(driverStats)
        .sort((a: any, b: any) => b.total_revenue - a.total_revenue)
        .slice(0, 10) as TopDriver[];
    },
    enabled: !!profile?.company_id,
    staleTime: 300000, // 5 Minuten
  });

  // Partner-Performance mit Trend-Berechnung
  const { data: partnerPerformance = [], isLoading: loadingPartners } = useQuery({
    queryKey: ['partner-performance', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const sixtyDaysAgo = format(subDays(new Date(), 60), 'yyyy-MM-dd');

      // Step 1: Hole alle Partner-Bookings (letzte 60 Tage für Trend)
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('partner_id, price, partner_provision_manual, created_at')
        .eq('company_id', profile.company_id)
        .eq('archived', false)
        .eq('is_partner_booking', true)
        .gte('created_at', sixtyDaysAgo)
        .not('partner_id', 'is', null);

      if (bookingsError) throw bookingsError;
      if (!bookings || bookings.length === 0) return [];

      // Step 2: Hole Partner-Daten separat
      const partnerIds = [...new Set(bookings.map(b => b.partner_id).filter(Boolean))];
      const { data: partners, error: partnersError } = await supabase
        .from('partners')
        .select('id, name, provision_amount')
        .in('id', partnerIds);

      if (partnersError) throw partnersError;

      // Step 3: Mappe Partner-Daten
      const partnerMap = new Map(partners?.map(p => [p.id, p]) || []);

      // Step 4: Aggregiere Daten pro Partner (letzte 30 Tage vs. vorherige 30 Tage)
      const partnerStats = bookings.reduce((acc: Record<string, unknown>, booking) => {
        if (!booking.partner_id) return acc;

        const partnerId = booking.partner_id;
        const partnerData = partnerMap.get(partnerId);
        
        if (!partnerData) return acc;

        if (!acc[partnerId]) {
          acc[partnerId] = {
            partner_id: partnerId,
            name: partnerData.name,
            current_bookings: 0,
            current_revenue: 0,
            previous_bookings: 0,
            previous_revenue: 0,
            provision_rate: partnerData.provision_amount || 15,
          };
        }

        const bookingDate = new Date(booking.created_at);
        const isCurrentPeriod = bookingDate >= subDays(new Date(), 30);

        if (isCurrentPeriod) {
          acc[partnerId].current_bookings += 1;
          acc[partnerId].current_revenue += booking.price || 0;
        } else {
          acc[partnerId].previous_bookings += 1;
          acc[partnerId].previous_revenue += booking.price || 0;
        }

        return acc;
      }, {});

      // Step 5: Berechne Trends
      return Object.values(partnerStats)
        .map((stats: any) => {
          const trendPercentage = stats.previous_revenue > 0
            ? ((stats.current_revenue - stats.previous_revenue) / stats.previous_revenue) * 100
            : stats.current_revenue > 0 ? 100 : 0;

          return {
            partner_id: stats.partner_id,
            name: stats.name,
            total_bookings: stats.current_bookings,
            total_revenue: stats.current_revenue,
            provision_rate: stats.provision_rate,
            trend_percentage: Math.round(trendPercentage),
          };
        })
        .sort((a: any, b: any) => b.total_revenue - a.total_revenue) as PartnerPerformance[];
    },
    enabled: !!profile?.company_id,
    staleTime: 300000, // 5 Minuten
  });

  // Täglicher Umsatz (30 Tage)
  const { data: dailyRevenue = [], isLoading: loadingDaily } = useQuery({
    queryKey: ['daily-revenue', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('bookings')
        .select('created_at, price')
        .eq('company_id', profile.company_id)
        .eq('archived', false)
        .gte('created_at', thirtyDaysAgo)
        .in('status', ['completed', 'confirmed']);

      if (error) throw error;

      // Aggregiere nach Tag
      const dailyStats: Record<string, { revenue: number; bookings: number }> = {};

      // Initialisiere alle 30 Tage mit 0
      for (let i = 0; i < 30; i++) {
        const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
        dailyStats[date] = { revenue: 0, bookings: 0 };
      }

      // Fülle mit echten Daten
      data.forEach((booking) => {
        const date = format(new Date(booking.created_at), 'yyyy-MM-dd');
        if (dailyStats[date]) {
          dailyStats[date].revenue += booking.price || 0;
          dailyStats[date].bookings += 1;
        }
      });

      // Konvertiere zu Array
      return Object.entries(dailyStats)
        .map(([date, stats]) => ({
          date,
          revenue: stats.revenue,
          bookings: stats.bookings,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)) as DailyRevenue[];
    },
    enabled: !!profile?.company_id,
    staleTime: 300000, // 5 Minuten
  });

  return {
    topDrivers,
    partnerPerformance,
    dailyRevenue,
    isLoading: loadingDrivers || loadingPartners || loadingDaily,
  };
}

/**
 * Helper: Berechne Provision
 */
export function calculateProvision(revenue: number, rate: number): number {
  return (revenue * rate) / 100;
}
