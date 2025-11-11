// MyDispatch Supabase Client Configuration (hardened)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getSupabaseEnv } from './env';

const { url, anonKey, usedDefaultAnon, isOfflineDev } = getSupabaseEnv();

// Developer-facing diagnostics
if (isOfflineDev) {
  console.warn('[MyDispatch] Supabase läuft im Offline-Dev-Modus: fehlende/Default-ENV erkannt.', {
    url,
    anonKeyPresent: !!anonKey,
    usedDefaultAnon,
  });
  // Optional Flag für Debugging
  // @ts-expect-error runtime flag
  (globalThis as any).__MYDISPATCH_OFFLINE_DEV__ = true;
}

// Fail-fast in Production bei fehlender Konfiguration
if (!url || !anonKey) {
  const message = '[MyDispatch] Supabase ENV fehlt: Bitte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY setzen.';
  // In Dev: warnen, in Prod: eindeutiger Fehler
  if (import.meta.env.DEV) {
    console.error(message);
  } else {
    throw new Error(message);
  }
}

// Erzeuge den Supabase-Client – im Offline-Dev mit reduzierter Persistenz
export const supabase = createClient<Database>(url ?? 'http://localhost', anonKey ?? 'anon', {
  auth: {
    storage: isOfflineDev ? undefined : localStorage,
    persistSession: !isOfflineDev,
    autoRefreshToken: !isOfflineDev,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': `mydispatch-${import.meta.env.MODE}`,
    },
  },
});
