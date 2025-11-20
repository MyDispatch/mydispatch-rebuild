/* ==================================================================================
   DRIVERS HOOK - HYPERION PHASE 2: API Layer Integration
   ==================================================================================
   ✅ Abstrahiert Supabase-Zugriff über API-Layer
   ✅ Konsistentes Error-Handling
   ✅ Optimiertes Caching mit React Query
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createDriversApi, type DriverInsert, type DriverUpdate } from "@/api/drivers";
import { useAuth } from "./use-auth";
import { queryKeys } from "@/lib/query-client";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { useMemo } from "react";

interface Driver {
  id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  license_number?: string;
  shift_status?: "offline" | "on_duty" | "available" | "busy" | "break";
  salutation?: "Herr" | "Frau" | "Divers";
  title?: string;
  address?: string;
  notes?: string;
  archived?: boolean;
  // V18.1 Neue Felder
  street?: string;
  street_number?: string;
  postal_code?: string;
  city?: string;
  license_expiry_date?: string;
  license_classes?: string[];
  profile_image_url?: string;
}

export const useDrivers = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // ✅ HYPERION: API Client Factory (zentrale Abstraktion)
  const api = useMemo(() => createDriversApi(supabase), []);

  // Fetch all drivers (via API Layer)
  const {
    data: drivers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.drivers(profile?.company_id || ""),
    queryFn: async () => {
      if (!profile?.company_id) return [];
      return await api.list({ archived: false });
    },
    enabled: !!profile?.company_id,
  });

  // Create driver (via API Layer)
  const createDriver = useMutation({
    mutationFn: async (newDriver: DriverInsert) => {
      if (!profile?.company_id) throw new Error("Company ID fehlt");
      return await api.create({
        ...newDriver,
        company_id: profile.company_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers(profile?.company_id || "") });
      handleSuccess("Fahrer erfolgreich erstellt");
    },
    onError: (error) => {
      handleError(error, "Fahrer konnte nicht erstellt werden");
    },
  });

  // Update driver (via API Layer)
  const updateDriver = useMutation({
    mutationFn: async ({ id, ...updates }: DriverUpdate & { id: string }) => {
      if (!profile?.company_id) throw new Error("Company ID fehlt");
      return await api.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers(profile?.company_id || "") });
      handleSuccess("Fahrer erfolgreich aktualisiert");
    },
    onError: (error) => {
      handleError(error, "Fahrer konnte nicht aktualisiert werden");
    },
  });

  // Archive driver (via API Layer)
  const archiveDriver = useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.company_id) throw new Error("Company ID fehlt");
      await api.archive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers(profile?.company_id || "") });
      handleSuccess("Fahrer archiviert");
    },
    onError: (error) => {
      handleError(error, "Fahrer konnte nicht archiviert werden");
    },
  });

  return {
    drivers,
    isLoading,
    error,
    createDriver: createDriver.mutate,
    updateDriver: updateDriver.mutate,
    archiveDriver: archiveDriver.mutate,
    isCreating: createDriver.isPending,
    isUpdating: updateDriver.isPending,
    isArchiving: archiveDriver.isPending,
  };
};
