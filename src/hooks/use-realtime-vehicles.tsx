/* ==================================================================================
   USE-REALTIME-VEHICLES - Echtzeit-Updates für Fahrzeuge
   ==================================================================================
   - Verfügbarkeits-Status (available, in_use, maintenance)
   - TÜV-Ablauf-Updates
   - Company-Isolation via RLS
   ================================================================================== */

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { logger } from '@/lib/logger';

/**
 * Hook für Realtime-Updates von Fahrzeugen
 * Invalidiert Query-Cache bei Änderungen an Vehicles-Tabelle
 */
export const useRealtimeVehicles = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('vehicles-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicles'
        },
        (payload) => {
          logger.info('📡 Realtime Vehicle Update', { 
            eventType: payload.eventType, 
            data: payload.new,
            component: 'useRealtimeVehicles' 
          });
          
          // Invalidiere Queries
          queryClient.invalidateQueries({ queryKey: ['vehicles'] });
          
          // Bei Status-Änderung auch Dashboard aktualisieren
          if (payload.new && typeof payload.new === 'object' && 'status' in payload.new) {
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
