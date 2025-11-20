/* ==================================================================================
   API CLIENT - HYPERION PHASE 2: Type-Safe Client Factory
   ==================================================================================
   ✅ Zentrale Abstraktion für alle API-Operationen
   ✅ Type-safe mit Supabase-Schema
   ✅ Konsistentes Error-Handling
   ================================================================================== */

import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { logger } from "@/lib/logger";

export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Zentrale Error-Handling Funktion
 */
export function handleApiError(error: Error | unknown, context: string): never {
  const errorToLog = error instanceof Error ? error : new Error(String(error));
  logger.error(`API Error in ${context}`, errorToLog, {
    context,
    errorDetails: error,
  });
  throw error;
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}
