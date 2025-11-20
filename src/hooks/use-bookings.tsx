/* ==================================================================================
   USE-BOOKINGS HOOK - HYPERION PHASE 2: API Layer Integration
   ==================================================================================
   ✅ Abstrahiert Supabase-Zugriff über API-Layer
   ✅ Konsistentes Error-Handling
   ✅ Optimiertes Caching mit React Query
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createApiClient, BookingWithRelations } from "@/lib/api";
import { useAuth } from "./use-auth";
import { useAuditLogs } from "./use-audit-logs";
import { queryKeys } from "@/lib/query-client";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { logger } from "@/lib/logger";
import { useMemo } from "react";

export const useBookings = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { logAudit } = useAuditLogs();

  // ✅ HYPERION: API Client Factory (zentrale Abstraktion)
  const api = useMemo(() => createApiClient(supabase), []);

  // Alle Aufträge abrufen (via API Layer)
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery<BookingWithRelations[]>({
    queryKey: queryKeys.bookings(profile?.company_id || ""),
    queryFn: async () => {
      if (!profile?.company_id) return [];

      try {
        // ✅ HYPERION: Kein direkter Supabase-Zugriff mehr!
        const data = await api.bookings.list();
        return data;
      } catch (error) {
        logger.error("Fehler beim Laden der Aufträge", error as Error, {
          component: "useBookings",
          action: "queryFn",
          companyId: profile?.company_id,
        });
        throw error;
      }
    },
    enabled: !!profile?.company_id,
    staleTime: 30000, // 30 Sekunden fresh für Dashboard
  });

  // Auftrag erstellen (via API Layer)
  const createMutation = useMutation({
    mutationFn: async (booking: any) => {
      if (!profile?.company_id) throw new Error("Keine Company-ID");

      try {
        // ✅ HYPERION: API Layer Handle
        const data = await api.bookings.create({
          ...booking,
          company_id: profile.company_id,
        });

        // ✅ PHASE 2: Centralized Audit Logging
        logAudit({
          company_id: profile.company_id,
          user_id: profile.user_id,
          action: "create",
          entity_type: "booking",
          entity_id: data.id,
          new_data: data,
        });

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings(profile!.company_id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats(profile!.company_id!) });
      handleSuccess("Auftrag erfolgreich erstellt");
    },
    onError: (error: any) => {
      logger.error("Fehler beim Erstellen des Auftrags", error, {
        component: "useBookings",
        action: "createMutation",
        companyId: profile?.company_id,
      });
      handleError(error, "Auftrag konnte nicht erstellt werden");
    },
  });

  // Auftrag aktualisieren (via API Layer)
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!profile?.company_id) throw new Error("Keine Company-ID");

      try {
        // Alte Daten für Audit-Log (direkt, da getById noch nicht in API)
        const { data: oldData } = await supabase.from("bookings").select().eq("id", id).single();

        // ✅ HYPERION: API Layer Handle
        const data = await api.bookings.update(id, updates);

        // ✅ PHASE 2: Centralized Audit Logging
        logAudit({
          company_id: profile.company_id,
          user_id: profile.user_id,
          action: "update",
          entity_type: "booking",
          entity_id: id,
          old_data: oldData,
          new_data: data,
        });

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings(profile!.company_id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats(profile!.company_id!) });
      handleSuccess("Auftrag erfolgreich aktualisiert");
    },
    onError: (error: any) => {
      logger.error("Fehler beim Aktualisieren des Auftrags", error, {
        component: "useBookings",
        action: "updateMutation",
        companyId: profile?.company_id,
      });
      handleError(error, "Auftrag konnte nicht aktualisiert werden");
    },
  });

  // Auftrag archivieren (via API Layer - KEIN DELETE!)
  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.company_id) throw new Error("Keine Company-ID");

      try {
        // ✅ HYPERION: API Layer Handle
        await api.bookings.archive(id);

        // ✅ PHASE 2: Centralized Audit Logging
        logAudit({
          company_id: profile.company_id,
          user_id: profile.user_id,
          action: "archive",
          entity_type: "booking",
          entity_id: id,
        });
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings(profile!.company_id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats(profile!.company_id!) });
      handleSuccess("Auftrag archiviert");
    },
    onError: (error: any) => {
      logger.error("Fehler beim Archivieren des Auftrags", error, {
        component: "useBookings",
        action: "archiveMutation",
        companyId: profile?.company_id,
      });
      handleError(error, "Auftrag konnte nicht archiviert werden");
    },
  });

  return {
    bookings: bookings || [],
    isLoading,
    error,
    createBooking: createMutation.mutate,
    updateBooking: updateMutation.mutate,
    archiveBooking: archiveMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isArchiving: archiveMutation.isPending,
  };
};
