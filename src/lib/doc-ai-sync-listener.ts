/* ==================================================================================
   DOC-AI SYNC LISTENER - V18.5.3 (Real-Time Channel Integration)
   ==================================================================================
   Lauscht auf Doc-AI Validation Requests via Supabase Real-Time
   
   Features:
   ✅ Auto-Subscribe bei App-Start
   ✅ Toast-Notifications für Reviews
   ✅ Integration mit NeXify Dashboard
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { handleInfo, handleWarning } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

interface ValidationNotification {
  doc_path: string;
  confidence: number;
  summary: string;
  status: 'needs_review' | 'auto_approved';
}

let activeChannel: ReturnType<typeof supabase.channel> | null = null;

/**
 * Initialisiert Doc-AI Sync Listener (Call in App.tsx)
 */
export function initDocAISyncListener() {
  if (activeChannel) {
    logger.warn('[Doc-AI Sync] Listener bereits aktiv');
    return;
  }

  logger.info('[Doc-AI Sync] Initialisiere Real-Time Listener...');

  activeChannel = supabase
    .channel('doc-ai-queue')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'ai_actions_log',
        filter: 'action_type=eq.doc_validation',
      },
      (payload) => {
        logger.info('[Doc-AI Sync] Neue Validation', { payload });
        handleValidationNotification(payload.new as any);
      }
    )
    .subscribe((status) => {
      logger.info('[Doc-AI Sync] Channel Status', { status });
      
      if (status === 'SUBSCRIBED') {
        logger.info('[Doc-AI Sync] Real-Time Listener aktiv');
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        // SILENT FAIL - Feature ist optional, kein Error-Log nötig
        logger.warn('[Doc-AI Sync] Connection nicht verfügbar (optional feature)');
        activeChannel?.unsubscribe();
        activeChannel = null;
        // KEIN Auto-Retry - Feature ist deaktiviert wenn Tabelle fehlt
      }
    });
}

/**
 * Stoppt Doc-AI Sync Listener
 */
export function stopDocAISyncListener() {
  if (activeChannel) {
    activeChannel.unsubscribe();
    activeChannel = null;
    logger.info('[Doc-AI Sync] Listener gestoppt');
  }
}

/**
 * Verarbeitet eingehende Validation Notifications
 */
function handleValidationNotification(logEntry: any) {
  const metadata = logEntry.metadata as any;
  const actionResult = logEntry.action_result;

  if (actionResult === 'auto_approved') {
    // Auto-Approved → Info-Toast
    handleInfo(
      `${metadata.doc_path} wurde automatisch aktualisiert (${Math.round(metadata.confidence * 100)}% Confidence)`,
      'Doc-AI Sync'
    );
  } else if (actionResult === 'needs_review') {
    // Needs Review → Warning-Toast
    handleWarning(
      `${metadata.doc_path} benötigt Review (${Math.round(metadata.confidence * 100)}% Confidence)`,
      'NeXify Review'
    );
    
    // Optional: Trigger Dashboard-Notification
    // (Kann später mit Badge-Counter erweitert werden)
  }
}

/**
 * Manuelles Triggern eines Validation Requests (für Dev-Tests)
 */
export async function triggerDocValidation(request: ValidationNotification) {
  const { data, error } = await supabase.functions.invoke('doc-ai-sync', {
    body: {
      action: 'validate',
      request: {
        id: crypto.randomUUID(),
        ...request,
        timestamp: new Date().toISOString(),
      },
    },
  });

  if (error) {
    logger.error('[Doc Validation Trigger Error]', error);
    throw error;
  }

  return data;
}
