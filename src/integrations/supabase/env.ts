export type SupabaseEnv = {
  url: string | null;
  anonKey: string | null;
  usedDefaultAnon: boolean;
  isOfflineDev: boolean;
};

function readEnvString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function isValidSupabaseUrl(url: string | null): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    // Nur https und *.supabase.co zulassen
    const host = u.host.toLowerCase();
    const isHttps = u.protocol === 'https:';
    const isSupabaseHost = host.endsWith('.supabase.co');
    return isHttps && isSupabaseHost;
  } catch {
    return false;
  }
}

function looksLikePlaceholder(value: string | null): boolean {
  if (!value) return true;
  const v = value.trim();
  // Erkenne generische Platzhalter-/Demo-Werte
  return (
    v.includes('YOUR_') ||
    v.includes('PLACEHOLDER') ||
    v.includes('EXAMPLE') ||
    v === 'anon' ||
    v.length < 24 // Supabase Keys sind i. d. R. deutlich länger
  );
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = readEnvString(import.meta.env.VITE_SUPABASE_URL);
  const envAnon = readEnvString(import.meta.env.VITE_SUPABASE_ANON_KEY);
  const defaultAnon = readEnvString(import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);
  const anonKey = envAnon ?? defaultAnon ?? null;
  const usedDefaultAnon = !envAnon && !!defaultAnon;
  const explicitOffline = readEnvString(import.meta.env.VITE_OFFLINE_DEV) === 'true';

  const urlValid = isValidSupabaseUrl(url);
  const anonValid = !looksLikePlaceholder(anonKey);

  // Offline-Dev, wenn explizit gesetzt ODER ungültige URL ODER ungültiger Key ODER Default-Key verwendet
  const isOfflineDev = !!explicitOffline || !urlValid || !anonValid || usedDefaultAnon;

  return { url: urlValid ? url : null, anonKey: anonValid ? anonKey : null, usedDefaultAnon, isOfflineDev };
}

export function isOfflineDev(): boolean {
  return getSupabaseEnv().isOfflineDev;
}
