/* ==================================================================================
   VEHICLES HOOK - HYPERION PHASE 2: API Layer Integration
   ==================================================================================
   ✅ Abstrahiert Supabase-Zugriff über API-Layer
   ✅ Konsistentes Error-Handling
   ✅ Optimiertes Caching mit React Query
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createVehiclesApi } from '@/api/vehicles';
import { useAuth } from './use-auth';
import { queryKeys } from '@/lib/query-client';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { useMemo } from 'react';

interface Vehicle {
  id?: string;
  license_plate: string;
  vehicle_class: 'Economy Class (1-4 Pax)' | 'Business Class - Limousine (1-4 Pax)' | 'Business Class - Kombi (1-4 Pax)' | 'First Class (1-3 Pax)' | 'Van / SUV (1-8 Pax)';
  concession_number?: string;
  status?: 'available' | 'im_einsatz' | 'wartung' | 'defekt';
  assigned_driver_id?: string;
  archived?: boolean;
  // V18.1 Neue Felder (FORMS_FIELD_REQUIREMENTS.md)
  brand?: string;
  model?: string;
  year?: number;
  tuev_expiry_date?: string;
  vin?: string;
  fuel_type?: string;
  seats?: number;
  mileage?: number;
  insurance_company?: string;
  insurance_policy_number?: string;
  insurance_start_date?: string;
  insurance_end_date?: string;
  insurance_type?: string;
  insurance_annual_premium?: number;
  last_service_date?: string;
  next_service_date?: string;
  service_interval_km?: number;
  profile_image_url?: string;
}

export const useVehicles = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // ✅ HYPERION: API Client Factory (zentrale Abstraktion)
  const api = useMemo(() => createVehiclesApi(supabase), []);

  // Fetch all vehicles (via API Layer)
  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: queryKeys.vehicles(profile?.company_id || ''),
    queryFn: async () => {
      if (!profile?.company_id) return [];
      return await api.list({ archived: false });
    },
    enabled: !!profile?.company_id,
  });

  // Create vehicle (via API Layer)
  const createVehicle = useMutation({
    mutationFn: async (newVehicle: any) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');
      return await api.create({
        ...newVehicle,
        company_id: profile.company_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles(profile?.company_id || '') });
      handleSuccess('Fahrzeug erfolgreich erstellt');
    },
    onError: (error) => {
      handleError(error, 'Fahrzeug konnte nicht erstellt werden');
    },
  });

  // Update vehicle (via API Layer)
  const updateVehicle = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');
      return await api.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles(profile?.company_id || '') });
      handleSuccess('Fahrzeug erfolgreich aktualisiert');
    },
    onError: (error) => {
      handleError(error, 'Fahrzeug konnte nicht aktualisiert werden');
    },
  });

  // Archive vehicle (via API Layer)
  const archiveVehicle = useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.company_id) throw new Error('Company ID fehlt');
      await api.archive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles(profile?.company_id || '') });
      handleSuccess('Fahrzeug archiviert');
    },
    onError: (error) => {
      handleError(error, 'Fahrzeug konnte nicht archiviert werden');
    },
  });

  return {
    vehicles,
    isLoading,
    error,
    createVehicle: createVehicle.mutate,
    updateVehicle: updateVehicle.mutate,
    archiveVehicle: archiveVehicle.mutate,
    isCreating: createVehicle.isPending,
    isUpdating: updateVehicle.isPending,
    isArchiving: archiveVehicle.isPending,
  };
};
