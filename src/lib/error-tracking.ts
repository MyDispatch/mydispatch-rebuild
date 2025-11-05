/* ==================================================================================
   ERROR TRACKING V18.5.1
   ==================================================================================
   Supabase-basiertes Error-Tracking für MyDispatch
   - Frontend-Fehler tracken
   - Supabase-basierte Speicherung
   - Production-optimiert
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ErrorLogInsert = Database['public']['Tables']['error_logs']['Insert'];

/**
 * Loggt einen Fehler zu Supabase
 */
export async function logError(
  error: Error | string,
  componentName?: string,
  additionalInfo?: Record<string, unknown>
) {
  try {
    if (import.meta.env.DEV) {
      const { logError } = await import('@/lib/logger');
      logError('Error (DEV)', error instanceof Error ? error : new Error(String(error)), { componentName, additionalInfo });
      return;
    }

    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    // ✅ V18.5.2: FRÜHE FILTERUNG - Ignoriere bekannte harmlose Fehler
    const ignorePatterns = [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
      'ChunkLoadError',
      'Failed to fetch',
      'Script error', // Cross-Origin-Script-Errors (z.B. HERE Maps)
    ];

    if (ignorePatterns.some(pattern => errorMessage.includes(pattern))) {
      return; // Silent fail - nicht loggen
    }

    const errorLog: ErrorLogInsert = {
      error_message: errorMessage,
      error_stack: errorStack,
      error_category: 'runtime', // Default category
      component_name: componentName,
      device_info: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      context: additionalInfo ? JSON.parse(JSON.stringify(additionalInfo)) : null,
      severity: 'error'
    };

    await supabase
      .from('error_logs')
      .insert(errorLog);

    // ✅ Nur noch echte Fehler loggen (nach Filter)
    const { logError: log } = await import('@/lib/logger');
    log('Error logged', new Error(errorMessage));
  } catch (err) {
    // Silent fail - Error-Tracking darf App nicht crashen
    const { logError: log } = await import('@/lib/logger');
    log('Failed to log error', err as Error);
  }
}

/**
 * Loggt einen Warning (nicht-kritischer Fehler)
 */
export async function logWarning(
  message: string,
  componentName?: string,
  additionalInfo?: Record<string, unknown>
) {
  try {
    if (import.meta.env.DEV) {
      const { logWarning } = await import('@/lib/logger');
      logWarning('Warning (DEV)', { message, componentName, additionalInfo });
      return;
    }

    // ✅ V18.5.2: FRÜHE FILTERUNG auch für Warnings
    const ignorePatterns = [
      'ResizeObserver loop limit exceeded',
      'Script error',
    ];

    if (ignorePatterns.some(pattern => message.includes(pattern))) {
      return; // Silent fail
    }

    // Ähnlich wie logError, aber mit lower severity
    const warningLog: ErrorLogInsert = {
      error_message: message,
      error_category: 'warning',
      component_name: componentName,
      device_info: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      context: additionalInfo ? JSON.parse(JSON.stringify(additionalInfo)) : null,
      severity: 'warning'
    };

    await supabase
      .from('error_logs')
      .insert(warningLog);
  } catch (err) {
    const { logError } = await import('@/lib/logger');
    logError('Failed to log warning', err as Error);
  }
}

/**
 * Global Error Handler
 * Fängt unhandled errors und rejections
 */
export function initGlobalErrorHandlers() {
  // ✅ V18.5.2: VERBESSERTE FILTERUNG - Ignoriere Cross-Origin-Script-Errors
  window.addEventListener('error', (event) => {
    // Cross-Origin-Script-Errors haben event.message === "Script error."
    if (event.message === 'Script error.' || event.message === 'Script error') {
      return; // Silent fail - nicht loggen
    }

    logError(
      event.error || new Error(event.message),
      undefined,
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      undefined,
      { reason: event.reason }
    );
  });

  import('@/lib/logger').then(({ logInfo }) => {
    logInfo('Global error handlers initialized (V18.5.2)');
  });
}
