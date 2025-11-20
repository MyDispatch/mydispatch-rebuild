/* ==================================================================================
   SENTRY INTEGRATION - P2-OPTIMIERUNG V18.3.24
   ==================================================================================
   Error-Tracking mit n8n-Alerts für >10% Error-Rate
   DSGVO-konform: Anonymisierte Logs
   RESILIENT: Graceful fallback ohne DSN-Zwang
   ================================================================================== */

// import * as Sentry from '@sentry/react'; // DISABLED: Sentry not installed
import { supabase } from "@/integrations/supabase/client";

/**
 * Initialize Sentry mit DSGVO-konformen Einstellungen
 * Graceful fallback wenn VITE_SENTRY_DSN nicht gesetzt
 *
 * DISABLED: Sentry package not installed, function is a no-op
 */
export function initSentry() {
  // No-op: Sentry not installed
  return;
} /**
 * Sende Critical Errors zu n8n für Alerts (Email/Slack)
 */
export async function sendErrorToN8n(
  error: Error,
  context: Record<string, any> = {}
): Promise<void> {
  try {
    // Nur bei >10% Error-Rate oder Critical Severity
    const errorRate = await getErrorRate();
    if (errorRate < 0.1) return;

    await supabase.functions.invoke("n8n-webhook-trigger", {
      body: {
        event_type: "critical_error",
        payload: {
          error_message: error.message,
          error_stack: error.stack?.split("\n").slice(0, 3).join("\n"), // DSGVO: Nur Top 3 Lines
          error_rate: `${(errorRate * 100).toFixed(1)}%`,
          context: {
            route: window.location.pathname,
            timestamp: new Date().toISOString(),
            ...context,
          },
        },
      },
    });
  } catch (err) {
    // Silent fail in production
  }
}

/**
 * Berechne Error-Rate aus ai_actions_log (letzte 1h)
 */
async function getErrorRate(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("ai_actions_log")
      .select("success")
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .limit(100);

    if (error || !data || data.length === 0) return 0;

    const errors = data.filter((log) => log.success === false).length;
    return errors / data.length;
  } catch {
    return 0;
  }
}

/**
 * Log Error zu ai_actions_log UND Sentry
 *
 * DISABLED: Sentry package not installed
 */
export async function captureError(error: Error, context: Record<string, any> = {}): Promise<void> {
  // Log zu Sentry - DISABLED: Sentry not installed
  // Sentry.captureException(error, {
  //   contexts: { custom: context },
  // });

  // Log zu ai_actions_log (für interne Analyse)
  try {
    await supabase.from("ai_actions_log").insert({
      action_type: "frontend_error",
      task_description: error.message,
      metadata: {
        message: error.message,
        route: window.location.pathname,
        ...context,
      },
      success: false,
      error_message: error.message,
    });
  } catch {
    // Silent fail
  }

  // Sende zu n8n falls kritisch
  await sendErrorToN8n(error, context);
}
