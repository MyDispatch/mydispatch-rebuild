/* ==================================================================================
   SHIFTS HOOK - V18.1 mit React Query
   ==================================================================================
   CRUD-Operationen für Schichten mit Smart Caching
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { queryKeys } from '@/lib/query-client';
import { handleError, handleSuccess } from '@/lib/error-handler';

interface Shift {
  id?: string;
  driver_id: string;
  vehicle_id: string;
  date: string;
  shift_start_time: string;
  shift_end_time?: string;
  pause_start_time?: string;
  pause_end_time?: string;
  km_start?: number;
  km_end?: number;
  total_km?: number;
  cash_earnings?: number;
  card_earnings?: number;
  invoice_earnings?: number;
  license_plate?: string;
  concession_number?: string;
  confirmed_by_driver?: boolean;
  approved_by_company?: boolean;
}

export const useShifts = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all shifts
  const { data: shifts = [], isLoading, error } = useQuery({
    queryKey: queryKeys.shifts(profile?.company_id || ''),
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await supabase
        .from('shifts')
        .select('*, drivers(first_name, last_name), vehicles(license_plate)')
        .eq('company_id', profile.company_id)
        .order('date', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.company_id,
  });

  // Create shift
  const createShift = useMutation({
    mutationFn: async (newShift: Shift) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');

      const { data, error } = await supabase
        .from('shifts')
        .insert({
          ...newShift,
          company_id: profile.company_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts(profile?.company_id || '') });
      handleSuccess('Schicht erfolgreich erstellt');
    },
    onError: (error) => {
      handleError(error, 'Schicht konnte nicht erstellt werden');
    },
  });

  // Update shift
  const updateShift = useMutation({
    mutationFn: async ({ id, ...updates }: Shift & { id: string }) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');

      const { data, error } = await supabase
        .from('shifts')
        .update(updates)
        .eq('id', id)
        .eq('company_id', profile.company_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts(profile?.company_id || '') });
      handleSuccess('Schicht erfolgreich aktualisiert');
    },
    onError: (error) => {
      handleError(error, 'Schicht konnte nicht aktualisiert werden');
    },
  });

  // Archive shift (V18.3.29: Archiving-System via RPC)
  const archiveShift = useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');

      // V18.3.29: Nutze RPC function für Soft-Delete
      const { data, error } = await supabase
        .rpc('archive_shift', {
          shift_id_param: id
        });

      if (error) throw error;
      if (!data) throw new Error('Archivierung fehlgeschlagen');
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shifts(profile?.company_id || '') });
      handleSuccess('Schicht entfernt');
    },
    onError: (error) => {
      handleError(error, 'Schicht konnte nicht archiviert werden');
    },
  });

  // V37.0: Export simple async functions instead of mutation objects
  const createShiftFn = async (newShift: Shift) => {
    return createShift.mutateAsync(newShift);
  };

  const updateShiftFn = async (shift: Shift & { id: string }) => {
    return updateShift.mutateAsync(shift);
  };

  const archiveShiftFn = async (id: string) => {
    return archiveShift.mutateAsync(id);
  };

  return {
    shifts,
    isLoading,
    error,
    createShift: createShiftFn,
    updateShift: updateShiftFn,
    archiveShift: archiveShiftFn,
    // Expose mutation states for loading indicators
    isCreating: createShift.isPending,
    isUpdating: updateShift.isPending,
    isArchiving: archiveShift.isPending,
  };
};
