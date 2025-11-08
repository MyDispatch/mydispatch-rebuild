/* ==================================================================================
   USE-COMPANY HOOK - React Query für Firmendaten
   ==================================================================================
   - Basiert auf companies Tabelle
   - Smart Caching (30s staleTime)
   - Auto-Retry (3x Exponential Backoff)
   - Zentrale Fehlerbehandlung
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { handleError, handleSuccess } from '@/lib/error-handler';
import type { Company } from '@/integrations/supabase/types/core-tables';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Type helper for typed queries
type TypedSupabaseClient = typeof supabase & {
  from(table: 'companies'): any;
};
const typedClient = supabase as TypedSupabaseClient;

export function useCompany() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Company Data
  const { data: company, isLoading, error } = useQuery({
    queryKey: ['company', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return null;

      const { data, error } = await typedClient
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      if (error) throw error;
      return data as Company;
    },
    enabled: !!profile?.company_id,
    staleTime: 30000, // 30s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Update Company
  const updateCompany = useMutation({
    mutationFn: async (updateData: any) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');

      const { data, error } = await typedClient
        .from('companies')
        .update(updateData)
        .eq('id', profile.company_id)
        .select()
        .single();

      if (error) throw error;
      return data as Company;
    },
    onSuccess: (data) => {
      // Invalidate admin company cache
      queryClient.invalidateQueries({ queryKey: ['company', profile?.company_id] });

      // KRITISCH: Invalidate public landing page cache
      queryClient.invalidateQueries({ queryKey: ['public-company'] });

      handleSuccess('Unternehmensdaten erfolgreich aktualisiert');
    },
    onError: (error) => {
      handleError(error, 'Unternehmensdaten konnten nicht aktualisiert werden');
    },
  });

  return {
    company,
    isLoading,
    error,
    updateCompany: updateCompany.mutate,
    isUpdating: updateCompany.isPending,
  };
}
