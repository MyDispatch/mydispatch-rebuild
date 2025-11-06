/* ==================================================================================
   API BASE & ERROR HANDLER - V3.0
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { ProductionErrorMonitor } from '@/utils/errorMonitoring';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Formatiert einen unbekannten Fehler in ein PostgrestError-Objekt.
 * @param error - Der unbekannte Fehler.
 * @returns Ein formatiertes PostgrestError-Objekt.
 */
function formatToPostgrestError(error: unknown): PostgrestError {
  if (error && typeof error === 'object' && 'message' in error) {
    const err = error as Partial<PostgrestError>;
    return {
      message: err.message || 'An unknown error occurred',
      details: err.details || '',
      hint: err.hint || '',
      code: err.code || '500',
      name: 'PostgrestError', // Default name
    };
  }
  return {
    message: 'An unexpected error occurred',
    details: String(error),
    hint: '',
    code: '500',
    name: 'PostgrestError',
  };
}

/**
 * Ein generischer Wrapper für Supabase-Abfragen, der Fehler behandelt.
 * @param query - Die Supabase-Abfrage als Promise.
 * @returns Ein Objekt mit `data` und `error`.
 */
export async function handleSupabaseQuery<T>(
  query: PromiseLike<{ data: T; error: PostgrestError | null }>
): Promise<{ data: T | null; error: PostgrestError | null }> {
  try {
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return { data, error: null };
  } catch (error: unknown) {
    const formattedError = formatToPostgrestError(error);
    ProductionErrorMonitor.reportError(formattedError, 'supabase_query');
    return {
      data: null,
      error: formattedError,
    };
  }
}

/**
 * Die zentrale API-Instanz.
 */
export const api = {
  supabase,
};

export default api;

