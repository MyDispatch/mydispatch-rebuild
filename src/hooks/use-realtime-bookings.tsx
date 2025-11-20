/* ==================================================================================
   USE-REALTIME-BOOKINGS - Echtzeit-Updates für Aufträge
   ==================================================================================
   - Automatische Re-Fetch bei Bookings-Changes (INSERT/UPDATE/DELETE)
   - Company-Isolation via RLS
   - PWA-Offline-Unterstützung
   ================================================================================== */

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { logDebug } from '@/lib/logger';

/**
 * Hook für Realtime-Updates von Bookings
 * Invalidiert Query-Cache bei Änderungen an Bookings-Tabelle
 */
export const useRealtimeBookings = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('bookings-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          logDebug('📡 Realtime Booking Update', { 
            eventType: payload.eventType, 
            booking: payload.new 
          });
          
          // Invalidiere Queries für automatisches Re-Fetch
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .subscribe();

    // Cleanup bei Component-Unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
