/* ==================================================================================
   SENTRY INTEGRATION - P2-OPTIMIERUNG V18.3.24
   ==================================================================================
   Error-Tracking mit n8n-Alerts für >10% Error-Rate
   DSGVO-konform: Anonymisierte Logs
   RESILIENT: Graceful fallback ohne DSN-Zwang
   ================================================================================== */

import * as Sentry from '@sentry/react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize Sentry mit DSGVO-konformen Einstellungen
 * Graceful fallback wenn VITE_SENTRY_DSN nicht gesetzt
 */
export function initSentry() {
  // DEFENSIVE: Try-Catch um komplette Init-Funktion
  try {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    
    // Graceful exit wenn kein DSN verfügbar (Silent - NIEMALS crashen!)
    if (!sentryDsn) {
      return;
    }
    
    // Nur in Production initialisieren
    if (!import.meta.env.PROD) {
      return;
    }

    Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true, // DSGVO: Alle Texte maskieren
        blockAllMedia: true, // DSGVO: Keine Medien aufzeichnen
      }),
    ],
    tracesSampleRate: 0.1, // 10% Performance-Monitoring
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // DSGVO: PII entfernen
    beforeSend(event, hint) {
      // Entferne sensible Daten
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      
      // Anonymisiere URLs (entferne Query-Parameter)
      if (event.request?.url) {
        event.request.url = event.request.url.split('?')[0];
      }
      
      return event;
    },
    
    // Ignoriere bekannte harmlose Fehler
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
      'ChunkLoadError',
      'Failed to fetch',
      'Script error',
    ],
  });
  } catch {
    // KRITISCH: Sentry-Init darf NIEMALS die App crashen!
    // Silent fail - KEINE console-Ausgaben
  }
}

/**
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

    await supabase.functions.invoke('n8n-webhook-trigger', {
      body: {
        event_type: 'critical_error',
        payload: {
          error_message: error.message,
          error_stack: error.stack?.split('\n').slice(0, 3).join('\n'), // DSGVO: Nur Top 3 Lines
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
      .from('ai_actions_log')
      .select('success')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .limit(100);

    if (error || !data || data.length === 0) return 0;

    const errors = data.filter(log => log.success === false).length;
    return errors / data.length;
  } catch {
    return 0;
  }
}

/**
 * Log Error zu ai_actions_log UND Sentry
 */
export async function captureError(
  error: Error,
  context: Record<string, any> = {}
): Promise<void> {
  // Log zu Sentry
  Sentry.captureException(error, {
    contexts: { custom: context },
  });

  // Log zu ai_actions_log (für interne Analyse)
  try {
    await supabase.from('ai_actions_log').insert({
      action_type: 'frontend_error',
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
