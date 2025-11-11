import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { hasEnvVars } from "@/lib/utils";

/**
 * Liefert einen lauffähigen Supabase-Client. Wenn notwendige Env Vars fehlen,
 * wird ein No-Op-Client zurückgegeben, damit der Build nicht fehlschlägt.
 */
export function createClient(): SupabaseClient<any> {
  if (hasEnvVars) {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  // No-Op Fallback für Build-Zeit ohne Env Vars
  const noop = {
    from() {
      return {
        select: async () => ({ data: [], error: null }),
        eq: async () => ({ data: [], error: null }),
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null }),
      } as any;
    },
  } as unknown as SupabaseClient<any>;

  return noop;
}
