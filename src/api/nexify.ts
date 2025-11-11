import { logger } from '@/lib/logger';
import { getSupabaseEnv } from '@/integrations/supabase/env';

// Zentrale Ableitung der Function-API-Basis aus validierten ENV-Werten
const { url: SUPABASE_URL, anonKey: ANON_KEY, isOfflineDev } = getSupabaseEnv();

const SUPABASE_HOST = (() => {
  if (!SUPABASE_URL) return '';
  try {
    const u = new URL(SUPABASE_URL);
    return u.host || SUPABASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
  } catch {
    return SUPABASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
})();

const API_BASE = () => (!isOfflineDev && SUPABASE_HOST ? `https://${SUPABASE_HOST}/functions/v1` : '');

export interface WikiSearchResult {
  title: string;
  snippet?: string;
  url?: string;
  relevance?: number;
  category?: string;
}

export interface WikiSessionData {
  recent_learnings: any[];
  critical_issues: any[];
  active_components: any[];
  best_practices: any[];
  automation_patterns: any[];
}

export interface NexifyResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  requestId?: string;
}

async function fetchJson<T>(url: string): Promise<NexifyResponse<T>> {
  const headers: Record<string, string> = {};
  if (ANON_KEY) {
    headers['apikey'] = ANON_KEY;
    headers['Authorization'] = `Bearer ${ANON_KEY}`;
  }
  const res = await fetch(url, { headers });
  const json = await res.json();
  return json as NexifyResponse<T>;
}

async function tryBrainQuerySearch(q: string, limit = 5): Promise<NexifyResponse<{ results: WikiSearchResult[] }>> {
  const base = API_BASE();
  if (!base) {
    logger.warn('brain-query skipped: Supabase ENV invalid or offline');
    return { success: false, error: 'supabase env invalid/offline' };
  }
  const url = `${base}/brain-query?q=${encodeURIComponent(q)}&limit=${limit}`;
  try {
    const result = await fetchJson<{ results: WikiSearchResult[] }>(url);
    return result;
  } catch (e) {
    logger.warn('brain-query unreachable, falling back to nexify-api', e);
    return { success: false, error: 'brain-query unreachable' };
  }
}

async function tryNexifyApiSearch(q: string, limit = 5): Promise<NexifyResponse<{ results: WikiSearchResult[] }>> {
  const base = API_BASE();
  if (!base) {
    return { success: false, error: 'supabase env invalid/offline' };
  }
  const url = `${base}/nexify-api/wiki/search?q=${encodeURIComponent(q)}&limit=${limit}`;
  return fetchJson<{ results: WikiSearchResult[] }>(url);
}

export async function searchWiki(q: string, limit = 5): Promise<NexifyResponse<{ results: WikiSearchResult[] }>> {
  const primary = await tryBrainQuerySearch(q, limit);
  if (primary.success) return primary;
  return tryNexifyApiSearch(q, limit);
}

export async function loadWikiSessionInit(): Promise<NexifyResponse<{ session_data: WikiSessionData }>> {
  const base = API_BASE();
  if (!base) {
    return { success: false, error: 'supabase env invalid/offline' };
  }
  const url = `${base}/nexify-api/wiki/session-init`;
  return fetchJson<{ session_data: WikiSessionData }>(url);
}
