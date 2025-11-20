/* ==================================================================================
   USE-DOCUMENT-TEMPLATES HOOK - React Query für Dokumenten-Vorlagen
   ==================================================================================
   - Basiert auf document_templates Tabelle
   - Smart Caching (30s staleTime)
   - Auto-Retry (3x Exponential Backoff)
   - Zentrale Fehlerbehandlung
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { handleError, handleSuccess } from "@/lib/error-handler";

export function useDocumentTemplates() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Document Templates
  const {
    data: templates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["document-templates", profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .eq("company_id", profile.company_id)
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.company_id,
    staleTime: 30000, // 30s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Create Document Template
  const createTemplate = useMutation({
    mutationFn: async (templateData: any) => {
      if (!profile?.company_id) throw new Error("Company ID fehlt");

      const { data, error } = await supabase
        .from("document_templates")
        .insert({
          ...templateData,
          company_id: profile.company_id,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-templates", profile?.company_id] });
      handleSuccess("Dokumenten-Vorlage erfolgreich erstellt");
    },
    onError: (error) => {
      handleError(error, "Dokumenten-Vorlage konnte nicht erstellt werden");
    },
  });

  // Update Document Template
  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from("document_templates")
        .update(updateData)
        .eq("id", id)
        .eq("company_id", profile?.company_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-templates", profile?.company_id] });
      handleSuccess("Dokumenten-Vorlage erfolgreich aktualisiert");
    },
    onError: (error) => {
      handleError(error, "Dokumenten-Vorlage konnte nicht aktualisiert werden");
    },
  });

  // Delete Document Template
  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("document_templates")
        .update({ is_active: false })
        .eq("id", id)
        .eq("company_id", profile?.company_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-templates", profile?.company_id] });
      handleSuccess("Dokumenten-Vorlage deaktiviert");
    },
    onError: (error) => {
      handleError(error, "Dokumenten-Vorlage konnte nicht deaktiviert werden");
    },
  });

  return {
    templates,
    isLoading,
    error,
    createTemplate: createTemplate.mutate,
    updateTemplate: updateTemplate.mutate,
    deleteTemplate: deleteTemplate.mutate,
    isCreating: createTemplate.isPending,
    isUpdating: updateTemplate.isPending,
    isDeleting: deleteTemplate.isPending,
  };
}
