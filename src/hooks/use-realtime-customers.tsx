/* ==================================================================================
   REALTIME CUSTOMERS HOOK - V35.0 BATCH 1
   ==================================================================================
   - Supabase Realtime für customers Tabelle
   - Auto-Invalidate React Query Cache
   - Connection Target: < 500ms
   ================================================================================== */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/query-client';
import { useAuth } from './use-auth';

export const useRealtimeCustomers = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.company_id) return;

    console.log('[Realtime] Subscribing to customers-realtime-updates');

    const channel = supabase
      .channel('customers-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers',
          filter: `company_id=eq.${profile.company_id}`,
        },
        (payload) => {
          console.log('[Realtime] Customer change:', payload);
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.customers(profile.company_id) 
          });
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Customers subscription status:', status);
      });

    return () => {
      console.log('[Realtime] Unsubscribing from customers-realtime-updates');
      supabase.removeChannel(channel);
    };
  }, [queryClient, profile?.company_id]);
};
