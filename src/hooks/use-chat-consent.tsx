/* ==================================================================================
   USE CHAT CONSENT HOOK - DSGVO-konformes Einwilligungsmanagement
   ================================================================================== */

import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { supabase } from "@/integrations/supabase/client";
import { handleError, handleSuccess } from "@/lib/error-handler";

interface ChatConsent {
  id: string;
  user_id: string;
  company_id: string;
  entity_type: "entrepreneur" | "driver" | "customer";
  consent_given: boolean;
  consent_given_at: string | null;
  consent_method: string | null;
  opt_out: boolean;
  opt_out_at: string | null;
  confirmation_email_sent: boolean;
  confirmed_at: string | null;
  created_at: string;
}

export function useChatConsent() {
  const { user, profile } = useAuth();
  const [consent, setConsent] = useState<ChatConsent | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchConsent();
    }
  }, [user?.id]);

  const fetchConsent = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("chat_consent")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setConsent(data as ChatConsent | null);
    } catch (error) {
      handleError(error, "Einwilligungsstatus konnte nicht geladen werden", { showToast: false });
    } finally {
      setLoading(false);
    }
  };

  const giveConsent = async () => {
    if (!user?.id || !profile?.company_id) return;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from("chat_consent")
        .upsert(
          {
            user_id: user.id,
            company_id: profile.company_id,
            entity_type: "entrepreneur", // Default, kann später angepasst werden
            consent_given: true,
            consent_given_at: new Date().toISOString(),
            consent_method: "manual",
            opt_out: false,
          },
          {
            onConflict: "user_id",
          }
        )
        .select()
        .single();

      if (error) throw error;
      setConsent(data as ChatConsent);

      // KEIN Reload mehr nötig - Trigger fügt User automatisch zu Company-Chat hinzu
      handleSuccess("Team-Chat wurde aktiviert. Sie können nun chatten!");
    } catch (error) {
      handleError(error, "Einwilligung konnte nicht gespeichert werden");
    } finally {
      setUpdating(false);
    }
  };

  const withdrawConsent = async (reason?: string) => {
    if (!user?.id) return;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from("chat_consent")
        .update({
          opt_out: true,
          opt_out_at: new Date().toISOString(),
          opt_out_reason: reason || null,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      setConsent(data as ChatConsent);

      // KEIN Reload - Opt-Out-Trigger entfernt User automatisch
      handleSuccess("Sie wurden vom Team-Chat abgemeldet");
    } catch (error) {
      handleError(error, "Widerruf konnte nicht gespeichert werden");
    } finally {
      setUpdating(false);
    }
  };

  const requestConsent = async () => {
    if (!user?.id) return;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from("chat_consent")
        .update({
          opt_out: false,
          opt_out_at: null,
          opt_out_reason: null,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      setConsent(data as ChatConsent);
    } catch (error) {
      handleError(error, "Erneute Teilnahme konnte nicht angefordert werden");
    } finally {
      setUpdating(false);
    }
  };

  const hasActiveConsent = consent?.consent_given && !consent?.opt_out;

  return {
    consent,
    loading,
    updating,
    hasActiveConsent,
    giveConsent,
    withdrawConsent,
    requestConsent,
    refetch: fetchConsent,
  };
}
