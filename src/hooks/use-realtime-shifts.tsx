/* ==================================================================================
   REALTIME SHIFTS HOOK - V35.0 BATCH 1
   ==================================================================================
   - Supabase Realtime für shifts Tabelle
   - Auto-Invalidate React Query Cache
   - Connection Target: < 500ms
   ================================================================================== */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/query-client';
import { useAuth } from './use-auth';

export const useRealtimeShifts = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.company_id) return;

    console.log('[Realtime] Subscribing to shifts-realtime-updates');

    const channel = supabase
      .channel('shifts-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shifts',
          filter: `company_id=eq.${profile.company_id}`,
        },
        (payload) => {
          console.log('[Realtime] Shift change:', payload);
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.shifts(profile.company_id) 
          });
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Shifts subscription status:', status);
      });

    return () => {
      console.log('[Realtime] Unsubscribing from shifts-realtime-updates');
      supabase.removeChannel(channel);
    };
  }, [queryClient, profile?.company_id]);
};
