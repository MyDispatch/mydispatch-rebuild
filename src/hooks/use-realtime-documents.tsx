/* ==================================================================================
   REALTIME DOCUMENTS HOOK - V35.0 BATCH 1
   ==================================================================================
   - Supabase Realtime für documents Tabelle
   - Auto-Invalidate React Query Cache
   - Connection Target: < 500ms
   ================================================================================== */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

export const useRealtimeDocuments = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.company_id) return;

    const channel = supabase
      .channel('documents-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `company_id=eq.${profile.company_id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['documents', profile.company_id]
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, profile?.company_id]);
};
