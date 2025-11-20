/* ==================================================================================
   PARTNERS HOOK - V18.1 mit React Query
   ==================================================================================
   CRUD-Operationen für Partner mit Smart Caching
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { queryKeys } from "@/lib/query-client";
import { toast } from "@/hooks/use-toast";

interface Partner {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  provision_amount?: number;
  online_access_enabled?: boolean;
  archived?: boolean;
}

export const usePartners = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all partners
  const {
    data: partners = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.partners(profile?.company_id || ""),
    queryFn: async () => {
      if (!profile?.company_id) return [];

      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("company_id", profile.company_id)
        .eq("archived", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.company_id,
  });

  // Create partner
  const createPartner = useMutation({
    mutationFn: async (newPartner: Partner) => {
      if (!profile?.company_id) throw new Error("Company ID fehlt");

      const { data, error } = await supabase
        .from("partners")
        .insert({
          ...newPartner,
          company_id: profile.company_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partners(profile?.company_id || "") });
      toast({
        title: "Erfolg",
        description: "Partner wurde erfolgreich erstellt.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: `Partner konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update partner
  const updatePartner = useMutation({
    mutationFn: async ({ id, ...updates }: Partner & { id: string }) => {
      if (!profile?.company_id) throw new Error("Company ID fehlt");

      const { data, error } = await supabase
        .from("partners")
        .update(updates)
        .eq("id", id)
        .eq("company_id", profile.company_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partners(profile?.company_id || "") });
      toast({
        title: "Erfolg",
        description: "Partner wurde erfolgreich aktualisiert.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: `Partner konnte nicht aktualisiert werden: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Archive partner (statt Delete)
  const archivePartner = useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.company_id) throw new Error("Company ID fehlt");

      const { error } = await supabase
        .from("partners")
        .update({ archived: true })
        .eq("id", id)
        .eq("company_id", profile.company_id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partners(profile?.company_id || "") });
      toast({
        title: "Erfolg",
        description: "Partner wurde archiviert.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: `Partner konnte nicht archiviert werden: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    partners,
    isLoading,
    error,
    createPartner: createPartner.mutate,
    updatePartner: updatePartner.mutate,
    archivePartner: archivePartner.mutate,
    isCreating: createPartner.isPending,
    isUpdating: updatePartner.isPending,
    isArchiving: archivePartner.isPending,
  };
};
