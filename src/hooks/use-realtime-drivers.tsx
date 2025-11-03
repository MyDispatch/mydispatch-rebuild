/* ==================================================================================
   USE-REALTIME-DRIVERS - Echtzeit-Updates für Fahrer
   ==================================================================================
   - Live-Shift-Status-Updates (available, busy, offline)
   - GPS-Position-Updates (alle 30s via vehicle_positions)
   - Company-Isolation via RLS
   ================================================================================== */

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { logger } from '@/lib/logger';

/**
 * Hook für Realtime-Updates von Fahrern
 * Invalidiert Query-Cache bei Änderungen an Drivers-Tabelle
 */
export const useRealtimeDrivers = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('drivers-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drivers'
        },
        (payload) => {
          logger.info('📡 Realtime Driver Update', { 
            eventType: payload.eventType, 
            data: payload.new,
            component: 'useRealtimeDrivers' 
          });
          
          // Invalidiere Queries
          queryClient.invalidateQueries({ queryKey: ['drivers'] });
          
          // Bei Shift-Status-Änderung auch Dashboard aktualisieren
          if (payload.new && typeof payload.new === 'object' && 'shift_status' in payload.new) {
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
