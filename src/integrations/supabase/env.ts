export type SupabaseEnv = {
  url: string | null;
  anonKey: string | null;
  usedDefaultAnon: boolean;
  isOfflineDev: boolean;
  usingOverride?: boolean;
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
  // Optional browser overrides via localStorage to allow quick fixes without rebuild
  const hasWindow = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  const overrideUrl = hasWindow ? readEnvString(localStorage.getItem('supabase_url')) : null;
  const overrideAnon = hasWindow ? readEnvString(localStorage.getItem('supabase_anon_key')) : null;

  const url = overrideUrl ?? readEnvString(import.meta.env.VITE_SUPABASE_URL);
  const envAnon = overrideAnon ?? readEnvString(import.meta.env.VITE_SUPABASE_ANON_KEY);
  const defaultAnon = readEnvString(import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);
  const anonKey = envAnon ?? defaultAnon ?? null;
  const usedDefaultAnon = !envAnon && !!defaultAnon;
  const explicitOffline = readEnvString(import.meta.env.VITE_OFFLINE_DEV) === 'true';

  const urlValid = isValidSupabaseUrl(url);
  const anonValid = !looksLikePlaceholder(anonKey);

  // Offline-Dev, wenn explizit gesetzt ODER ungültige URL ODER ungültiger Key ODER Default-Key verwendet
  const isOfflineDev = !!explicitOffline || !urlValid || !anonValid || usedDefaultAnon;

  return {
    url: urlValid ? url : null,
    anonKey: anonValid ? anonKey : null,
    usedDefaultAnon,
    isOfflineDev,
    usingOverride: !!overrideUrl || !!overrideAnon,
  };
}

export function isOfflineDev(): boolean {
  return getSupabaseEnv().isOfflineDev;
}

// Helpers to set/clear overrides from UI
export function setSupabaseEnvOverride(params: { url?: string; anonKey?: string }): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  if (params.url) localStorage.setItem('supabase_url', params.url);
  if (params.anonKey) localStorage.setItem('supabase_anon_key', params.anonKey);
}

export function clearSupabaseEnvOverride(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_anon_key');
}

// Origin/Domain diagnostics helpers
export type OriginDiagnostics = {
  origin: string;
  originHost: string;
  originProtocol: 'http:' | 'https:';
  supabaseUrl?: string;
  supabaseHost?: string;
  supabaseProtocol?: 'https:';
  notes: string[];
  ok: boolean;
};

export function getOriginDiagnostics(supabaseUrl?: string | null): OriginDiagnostics {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
  let originHost = 'unknown';
  let originProtocol: 'http:' | 'https:' = 'http:';
  try {
    const o = new URL(origin);
    originHost = o.host;
    originProtocol = (o.protocol === 'https:' ? 'https:' : 'http:');
  } catch {
    // noop
  }

  let supabaseHost: string | undefined;
  let supabaseProtocol: 'https:' | undefined;
  const notes: string[] = [];

  if (supabaseUrl) {
    try {
      const u = new URL(supabaseUrl);
      supabaseHost = u.host;
      supabaseProtocol = 'https:';
      if (!u.host.endsWith('.supabase.co')) {
        notes.push('Supabase-Host sieht ungewöhnlich aus (kein *.supabase.co).');
      }
    } catch {
      notes.push('Supabase-URL ist nicht parsbar.');
    }
  } else {
    notes.push('Supabase-URL fehlt oder ist ungültig.');
  }

  // Heuristiken für Dev-Origins
  const isDevOrigin = originHost === 'localhost' || originHost === '127.0.0.1';
  if (!isDevOrigin) {
    notes.push('Origin ist kein typischer Dev-Host (localhost/127.0.0.1).');
  }
  if (originProtocol !== 'https:' && supabaseProtocol === 'https:') {
    notes.push('Origin nutzt HTTP; Supabase ist HTTPS. Das ist in Dev üblich.');
  }

  const ok = !!supabaseHost && (isDevOrigin || !!originHost);
  return { origin, originHost, originProtocol, supabaseUrl: supabaseUrl || undefined, supabaseHost, supabaseProtocol, notes, ok };
}
