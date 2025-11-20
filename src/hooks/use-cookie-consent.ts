/* ==================================================================================
   USE-COOKIE-CONSENT HOOK - TanStack Query für Cookie Consents
   ==================================================================================
   ✅ MISSION II: STRANGLER FIG 2.0 - Migration from direct Supabase calls
   ✅ Smart Caching (60s staleTime)
   ✅ Auto-Retry (3x Exponential Backoff)
   ✅ UPSERT Pattern (Update or Insert)
   ================================================================================== */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/error-handler';

interface CookieConsent {
  id: string;
  user_id: string;
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  consented_at: string;
}

interface UpsertCookieConsentData {
  user_id: string;
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  consented_at: string;
}

export function useCookieConsent(userId?: string) {
  const queryClient = useQueryClient();

  // Fetch Cookie Consent for specific user
  const { data: consent, isLoading, error } = useQuery({
    queryKey: ['cookie_consent', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('cookie_consents')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 60000, // 60s (Cookie-Preferences ändern sich selten)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Upsert Cookie Consent (Update or Insert)
  const upsertConsent = useMutation({
    mutationFn: async (consentData: UpsertCookieConsentData) => {
      const { data, error } = await supabase
        .from('cookie_consents')
        .upsert(consentData, {
          onConflict: 'user_id', // Conflict resolution on user_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cookie_consent', variables.user_id] });
      // NOTE: Kein Toast - Cookie-Consent soll unauffällig sein
    },
    onError: (error) => {
      handleError(error, 'Cookie-Einstellungen konnten nicht gespeichert werden');
    },
  });

  return {
    consent,
    isLoading,
    error,
    upsertConsent: upsertConsent.mutateAsync, // Use mutateAsync for async/await
    isUpsertingConsent: upsertConsent.isPending,
  };
}
