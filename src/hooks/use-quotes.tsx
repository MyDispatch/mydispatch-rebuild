/* ==================================================================================
   USE-QUOTES HOOK - React Query für Angebote
   ==================================================================================
   - Basiert auf bookings Tabelle mit is_offer=true
   - Smart Caching (30s staleTime)
   - Auto-Retry (3x Exponential Backoff)
   - Zentrale Fehlerbehandlung
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { handleError, handleSuccess } from "@/lib/error-handler";

export function useQuotes() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Quotes (bookings with is_offer=true)
  const {
    data: quotes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quotes", profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("company_id", profile.company_id)
        .eq("is_offer", true)
        .eq("archived", false)
        .order("pickup_time", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.company_id,
    staleTime: 30000, // 30s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Create Quote
  const createQuote = useMutation({
    mutationFn: async (quoteData: any) => {
      if (!profile?.company_id) throw new Error("Company ID fehlt");

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          ...quoteData,
          company_id: profile.company_id,
          is_offer: true,
          archived: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes", profile?.company_id] });
      handleSuccess("Angebot erfolgreich erstellt");
    },
    onError: (error) => {
      handleError(error, "Angebot konnte nicht erstellt werden");
    },
  });

  // Update Quote
  const updateQuote = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("id", id)
        .eq("company_id", profile?.company_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes", profile?.company_id] });
      handleSuccess("Angebot erfolgreich aktualisiert");
    },
    onError: (error) => {
      handleError(error, "Angebot konnte nicht aktualisiert werden");
    },
  });

  // Archive Quote
  const archiveQuote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({ archived: true, archived_at: new Date().toISOString() })
        .eq("id", id)
        .eq("company_id", profile?.company_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes", profile?.company_id] });
      handleSuccess("Angebot archiviert");
    },
    onError: (error) => {
      handleError(error, "Angebot konnte nicht archiviert werden");
    },
  });

  // Convert Quote to Booking
  const convertToBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bookings")
        .update({
          is_offer: false,
          offer_status: "accepted",
          booking_status: "pending",
        })
        .eq("id", id)
        .eq("company_id", profile?.company_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes", profile?.company_id] });
      queryClient.invalidateQueries({ queryKey: ["bookings", profile?.company_id] });
      handleSuccess("Angebot in Auftrag umgewandelt");
    },
    onError: (error) => {
      handleError(error, "Umwandlung fehlgeschlagen");
    },
  });

  return {
    quotes,
    isLoading,
    error,
    createQuote: createQuote.mutate,
    updateQuote: updateQuote.mutate,
    archiveQuote: archiveQuote.mutate,
    convertToBooking: convertToBooking.mutate,
    isCreating: createQuote.isPending,
    isUpdating: updateQuote.isPending,
    isArchiving: archiveQuote.isPending,
    isConverting: convertToBooking.isPending,
  };
}
