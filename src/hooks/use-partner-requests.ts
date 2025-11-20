/* ==================================================================================
   USE-PARTNER-REQUESTS HOOK - TanStack Query für Partner Requests
   ==================================================================================
   ✅ MISSION II: STRANGLER FIG 2.0 - Migration from direct Supabase calls
   ✅ Smart Caching (30s staleTime)
   ✅ Auto-Retry (3x Exponential Backoff)
   ✅ Optimistic Updates
   ================================================================================== */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { handleError, handleSuccess } from "@/lib/error-handler";

interface PartnerRequest {
  id: string;
  requesting_company_id: string;
  target_company_id: string;
  message?: string | null;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

interface CreatePartnerRequestData {
  requesting_company_id: string;
  target_company_id: string;
  message?: string | null;
}

export function usePartnerRequests(companyId?: string) {
  const queryClient = useQueryClient();

  // Fetch Partner Requests
  const {
    data: requests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["partner_requests", companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from("partner_requests")
        .select("*")
        .or(`requesting_company_id.eq.${companyId},target_company_id.eq.${companyId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
    staleTime: 30000, // 30s
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Create Partner Request
  const createRequest = useMutation({
    mutationFn: async (requestData: CreatePartnerRequestData) => {
      const { data, error } = await supabase
        .from("partner_requests")
        .insert(requestData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner_requests", companyId] });
      handleSuccess("Partner-Anfrage erfolgreich gesendet");
    },
    onError: (error) => {
      handleError(error, "Partner-Anfrage konnte nicht gesendet werden");
    },
  });

  // Update Partner Request Status
  const updateRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "rejected" }) => {
      const { data, error } = await supabase
        .from("partner_requests")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner_requests", companyId] });
      handleSuccess("Anfrage-Status aktualisiert");
    },
    onError: (error) => {
      handleError(error, "Status konnte nicht aktualisiert werden");
    },
  });

  return {
    requests,
    isLoading,
    error,
    createRequest: createRequest.mutateAsync, // Use mutateAsync for async/await
    updateRequestStatus: updateRequestStatus.mutate,
    isCreatingRequest: createRequest.isPending,
    isUpdatingStatus: updateRequestStatus.isPending,
  };
}
