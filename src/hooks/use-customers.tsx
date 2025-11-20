/* ==================================================================================
   CUSTOMERS HOOK - HYPERION PHASE 2: API Layer Integration
   ==================================================================================
   ✅ Abstrahiert Supabase-Zugriff über API-Layer
   ✅ Konsistentes Error-Handling
   ✅ Optimiertes Caching mit React Query
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createCustomersApi, type CustomerInsert, type CustomerUpdate } from '@/api/customers';
import { useAuth } from './use-auth';
import { queryKeys } from '@/lib/query-client';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { useMemo } from 'react';

interface Customer {
  id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  salutation?: 'Herr' | 'Frau' | 'Divers';
  title?: string;
  notes?: string;
  has_portal_access?: boolean;
  is_manually_created?: boolean;
  archived?: boolean;
  // V18.1 Neue Felder (FORMS_FIELD_REQUIREMENTS.md)
  customer_type?: 'Privatkunde' | 'Geschäftskunde';
  company_name?: string;
  tax_id?: string;
  street?: string;
  street_number?: string;
  postal_code?: string;
  city?: string;
  billing_street?: string;
  billing_street_number?: string;
  billing_postal_code?: string;
  billing_city?: string;
  billing_address?: string;
  payment_term_days?: number;
  discount_percentage?: number;
}

export const useCustomers = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // ✅ HYPERION: API Client Factory (zentrale Abstraktion)
  const api = useMemo(() => createCustomersApi(supabase), []);

  // Fetch all customers (via API Layer)
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: queryKeys.customers(profile?.company_id || ''),
    queryFn: async () => {
      if (!profile?.company_id) return [];
      return await api.list({ archived: false });
    },
    enabled: !!profile?.company_id,
  });

  // Create customer (via API Layer)
  const createCustomer = useMutation({
    mutationFn: async (newCustomer: CustomerInsert) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');
      return await api.create({
        ...newCustomer,
        company_id: profile.company_id,
        is_manually_created: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers(profile?.company_id || '') });
      handleSuccess('Kunde erfolgreich erstellt');
    },
    onError: (error) => {
      handleError(error, 'Kunde konnte nicht erstellt werden');
    },
  });

  // Update customer (via API Layer)
  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...updates }: CustomerUpdate & { id: string }) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');
      return await api.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers(profile?.company_id || '') });
      handleSuccess('Kunde erfolgreich aktualisiert');
    },
    onError: (error) => {
      handleError(error, 'Kunde konnte nicht aktualisiert werden');
    },
  });

  // Archive customer (via API Layer)
  const archiveCustomer = useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');
      await api.archive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers(profile?.company_id || '') });
      handleSuccess('Kunde archiviert');
    },
    onError: (error) => {
      handleError(error, 'Kunde konnte nicht archiviert werden');
    },
  });

  return {
    customers,
    isLoading,
    error,
    createCustomer: createCustomer.mutate,
    updateCustomer: updateCustomer.mutate,
    archiveCustomer: archiveCustomer.mutate,
    isCreating: createCustomer.isPending,
    isUpdating: updateCustomer.isPending,
    isArchiving: archiveCustomer.isPending,
  };
};
