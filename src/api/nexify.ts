import { logger } from '@/lib/logger';

const API_BASE = (projectRef?: string) =>
  `https://${projectRef || import.meta.env.VITE_SUPABASE_URL?.split('https://')[1]}.supabase.co/functions/v1`;

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

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
  const url = `${base}/nexify-api/wiki/session-init`;
  return fetchJson<{ session_data: WikiSessionData }>(url);
}

