/* ==================================================================================
   COST CENTERS HOOK - V18.1 mit React Query
   ==================================================================================
   CRUD-Operationen für Kostenstellen mit Smart Caching
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { queryKeys } from '@/lib/query-client';
import { handleError, handleSuccess } from '@/lib/error-handler';

interface CostCenter {
  id?: string;
  name: string;
  description?: string;
  active?: boolean;
  archived?: boolean;
}

export const useCostCenters = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all cost centers
  const { data: costCenters = [], isLoading, error } = useQuery({
    queryKey: queryKeys.costCenters(profile?.company_id || ''),
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await supabase
        .from('cost_centers')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.company_id,
  });

  // Create cost center
  const createCostCenter = useMutation({
    mutationFn: async (newCostCenter: CostCenter) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');

      const { data, error } = await supabase
        .from('cost_centers')
        .insert({
          ...newCostCenter,
          company_id: profile.company_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenters(profile?.company_id || '') });
      handleSuccess('Kostenstelle erfolgreich erstellt');
    },
    onError: (error) => {
      handleError(error, 'Kostenstelle konnte nicht erstellt werden');
    },
  });

  // Update cost center
  const updateCostCenter = useMutation({
    mutationFn: async ({ id, ...updates }: CostCenter & { id: string }) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');

      const { data, error } = await supabase
        .from('cost_centers')
        .update(updates)
        .eq('id', id)
        .eq('company_id', profile.company_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenters(profile?.company_id || '') });
      handleSuccess('Kostenstelle erfolgreich aktualisiert');
    },
    onError: (error) => {
      handleError(error, 'Kostenstelle konnte nicht aktualisiert werden');
    },
  });

  // Deactivate cost center (statt Archive)
  const deactivateCostCenter = useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');

      const { error } = await supabase
        .from('cost_centers')
        .update({ active: false })
        .eq('id', id)
        .eq('company_id', profile.company_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenters(profile?.company_id || '') });
      handleSuccess('Kostenstelle deaktiviert');
    },
    onError: (error) => {
      handleError(error, 'Kostenstelle konnte nicht deaktiviert werden');
    },
  });

  return {
    costCenters,
    isLoading,
    error,
    createCostCenter: createCostCenter.mutate,
    updateCostCenter: updateCostCenter.mutate,
    deactivateCostCenter: deactivateCostCenter.mutate,
    isCreating: createCostCenter.isPending,
    isUpdating: updateCostCenter.isPending,
    isDeactivating: deactivateCostCenter.isPending,
  };
};
