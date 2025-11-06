/* ==================================================================================
   ERROR HANDLER - V18.2.19 (SMI-Integration)
   ==================================================================================
   Zentrale Fehlerbehandlung mit:
   - Toast-Notifications
   - Automatic Semantic Memory Storage
   - Agent Learning Integration
   ================================================================================== */

import { toast } from 'sonner';
import { logError } from './logger';

interface ErrorHandlerOptions {
  title?: string;
  showToast?: boolean;
  logToSupabase?: boolean;
}

/**
 * Zentrale Fehlerbehandlung
 * Ersetzt alle console.error() Aufrufe + Automatic SMI Storage
 */
export const handleError = (
  error: unknown,
  defaultMessage: string,
  options: ErrorHandlerOptions = {}
) => {
  const {
    title = 'Fehler',
    showToast = true,
    logToSupabase = true,
  } = options;

  const errorMessage = error instanceof Error ? error.message : defaultMessage;

  // Toast anzeigen
  if (showToast) {
    toast.error(title, {
      description: errorMessage,
      duration: 5000,
    });
  }

  // Zu Supabase loggen
  if (logToSupabase) {
    logError(
      defaultMessage,
      error instanceof Error ? error : undefined,
      {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
        } : error,
      }
    );
  }
};

/**
 * Success Handler
 */
export const handleSuccess = (message: string, title = 'Erfolg') => {
  toast.success(title, {
    description: message,
    duration: 3000,
  });
};

/**
 * Info Handler
 */
export const handleInfo = (message: string, title = 'Info') => {
  toast.info(title, {
    description: message,
    duration: 4000,
  });
};

/**
 * Warning Handler
 */
export const handleWarning = (message: string, title = 'Warnung') => {
  toast.warning(title, {
    description: message,
    duration: 5000,
  });
};

export const handleAsyncError = async (promise: Promise<any>) => {
  try {
    return await promise;
  } catch (error) {
    console.error('Async Error:', error);
    throw error;
  }
};
