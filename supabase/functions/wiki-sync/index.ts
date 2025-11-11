// deno-lint-ignore-file no-explicit-any
// Wiki Sync Edge Function: Upsert MD-2024 docs into wiki_documents
// Trigger: HTTP POST with payload { docs: Array<WikiDocPayload> }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface WikiDocPayload {
  path: string;
  title: string;
  status?: 'Draft' | 'Production-Ready';
  version?: string;
  date?: string;
  author?: string;
  summary?: string;
  sections?: Record<string, string | undefined>;
  references?: string[] | Record<string, unknown>;
  tags?: string[];
  content_md?: string;
  content_hash?: string;
}

function getSupabase() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}

export async function handler(req: Request): Promise<Response> {
  // Simple GET listing endpoint for wiki_documents (service role read)
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url);
      const limit = Math.min(Number(url.searchParams.get('limit') ?? '50'), 200);
      const q = url.searchParams.get('q')?.trim();
      const supabase = getSupabase();
      let query = supabase
        .from('wiki_documents')
        .select('path,title,status,version,date,author,tags', { count: 'exact' })
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (q) {
        // Basic filter on title and path; for production use full-text
        query = query.ilike('title', `%${q}%`);
      }

      const { data, error, count } = await query;
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
      return new Response(JSON.stringify({ ok: true, count, items: data ?? [] }), {
        headers: { 'content-type': 'application/json' },
        status: 200,
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
    }
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), { status: 400 });
  }

  const docs: WikiDocPayload[] = Array.isArray(payload?.docs) ? payload.docs : [];
  if (docs.length === 0) {
    return new Response(JSON.stringify({ error: 'No docs provided' }), { status: 400 });
  }

  const supabase = getSupabase();
  let inserted = 0, updated = 0;
  const errors: Array<{ path: string; message: string }> = [];

  for (const doc of docs) {
    const record = {
      path: doc.path,
      title: doc.title,
      status: doc.status,
      version: doc.version,
      date: doc.date ? new Date(doc.date) : null,
      author: doc.author,
      summary: doc.summary,
      sections: doc.sections ?? null,
      references: doc.references ?? null,
      tags: doc.tags ?? null,
      content_md: doc.content_md ?? null,
      content_hash: doc.content_hash ?? null,
    };

    const { data, error } = await supabase
      .from('wiki_documents')
      .upsert(record, { onConflict: 'path' })
      .select('*')
      .single();

    if (error) {
      errors.push({ path: doc.path, message: error.message });
    } else {
      if (data?.created_at === data?.updated_at) inserted++; else updated++;
    }
  }

  // Log sync run
  await supabase.from('wiki_sync_runs').insert({
    environment: 'edge_function',
    files_processed: docs.length,
    inserted_count: inserted,
    updated_count: updated,
    errors,
  });

  return new Response(JSON.stringify({ ok: true, inserted, updated, errors }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
}

// Default export for Supabase Edge Functions runtime
export default handler;
