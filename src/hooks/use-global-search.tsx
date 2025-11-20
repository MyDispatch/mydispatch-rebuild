/* ==================================================================================
   GLOBAL SEARCH HOOK - V18.1
   ==================================================================================
   Full-Text Search mit Fuzzy-Matching
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { queryKeys } from '@/lib/query-client';

export const useGlobalSearch = (query: string) => {
  const { profile } = useAuth();

  const { data: results, isLoading } = useQuery({
    queryKey: queryKeys.globalSearch(profile?.company_id || '', query),
    queryFn: async () => {
      if (!profile?.company_id || query.length < 2) {
        return {
          bookings: [],
          customers: [],
          drivers: [],
          vehicles: [],
        };
      }

      // Parallele Suche in allen Tabellen
      const [bookingsResult, customersResult, driversResult, vehiclesResult] = await Promise.all([
        // Aufträge durchsuchen
        supabase
          .from('bookings')
          .select('id, pickup_address, dropoff_address, status, pickup_time')
          .eq('company_id', profile.company_id)
          .eq('archived', false)
          .or(`pickup_address.ilike.%${query}%,dropoff_address.ilike.%${query}%`)
          .limit(5),

        // Kunden durchsuchen
        supabase
          .from('customers')
          .select('id, first_name, last_name, email')
          .eq('company_id', profile.company_id)
          .eq('archived', false)
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(5),

        // Fahrer durchsuchen
        supabase
          .from('drivers')
          .select('id, first_name, last_name, shift_status')
          .eq('company_id', profile.company_id)
          .eq('archived', false)
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
          .limit(5),

        // Fahrzeuge durchsuchen
        supabase
          .from('vehicles')
          .select('id, license_plate, vehicle_class, status')
          .eq('company_id', profile.company_id)
          .eq('archived', false)
          .ilike('license_plate', `%${query}%`)
          .limit(5),
      ]);

      return {
        bookings: bookingsResult.data || [],
        customers: customersResult.data || [],
        drivers: driversResult.data || [],
        vehicles: vehiclesResult.data || [],
      };
    },
    enabled: query.length >= 2 && !!profile?.company_id,
    staleTime: 30000, // 30 Sekunden
  });

  return {
    results,
    isLoading,
  };
};
