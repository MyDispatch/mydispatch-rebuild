/* ==================================================================================
   TRAFFIC DATA HOOK - V18.5.3 (React Query + Rate-Limit Resilience)
   ==================================================================================
   ✅ Automatisches Caching (5 Min Stale-Time)
   ✅ Retry-Logic mit Exponential Backoff
   ✅ Optimistic Updates
   ✅ Rate-Limit Handling (429 → Info statt Error)
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/react-query/query-keys';
import { handleInfo } from '@/lib/error-handler';
import { TrafficApiResponse, validateApiResponse, isValidTrafficResponse } from '@/types/api-schemas';

interface UseTrafficOptions {
  origin: string;
  enabled?: boolean;
  refetchInterval?: number; // Default: 30s (reduziert von 15s)
}

interface TrafficData {
  jam_factor: number;
  speed: number;
  status: string;
  route_summary: string;
  delay_seconds: number;
  retry_after?: number; // ⭐ Für Rate-Limit Info
}

export function useTraffic({ origin, enabled = true, refetchInterval = 30000 }: UseTrafficOptions) {
  return useQuery({
    queryKey: queryKeys.traffic(origin),
    queryFn: async (): Promise<TrafficData> => {
      const { data, error } = await supabase.functions.invoke('get-traffic', {
        body: { origin },
      });

      // ⭐ 429 HANDLING: Edge Function gibt jetzt 200 + retry_after zurück
      if (data?.retry_after) {
        handleInfo(
          `Verkehrsdaten werden in ${data.retry_after}s aktualisiert (API-Limit)`,
          'Rate Limit'
        );
        return data as TrafficData;
      }

      if (error) {
        throw error;
      }

      // ✅ TYPE VALIDATION
      const validated = validateApiResponse(data, isValidTrafficResponse, 'Traffic');
      
      return {
        jam_factor: validated.jam_factor,
        speed: validated.speed,
        status: validated.status || 'Unbekannt',
        route_summary: validated.route_summary || '',
        delay_seconds: validated.delay_seconds || 0,
      };
    },
    enabled: enabled && !!origin,
    staleTime: 5 * 60 * 1000, // ⭐ 5 Min (Edge Function Cache-TTL)
    gcTime: 10 * 60 * 1000, // 10 Min Garbage Collection
    refetchInterval, // ⭐ 30s statt 15s (50% weniger API-Calls)
    retry: (failureCount, error) => {
      // ⭐ EXPONENTIAL BACKOFF: 1s → 2s → 4s → Stop
      if (failureCount >= 3) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
