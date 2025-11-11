import { supabase } from '../../integrations/supabase/client'

type MemoryScope = 'global' | 'project' | `user:${string}`

export type AgentMemoryItem<T = unknown> = {
  id: string
  agent_id: string
  scope: MemoryScope
  key: string
  value: T
  tags?: string[]
  created_at: string
  updated_at: string
}

export async function remember<T = unknown>(
  agentId: string,
  scope: MemoryScope,
  key: string,
  value: T,
  tags: string[] = []
) {
  const { data, error } = await supabase
    .from('agent_memory')
    .upsert({ agent_id: agentId, scope, key, value, tags })
    .select('*')
    .single()
  if (error) throw error
  return data as AgentMemoryItem<T>
}

export async function recall<T = unknown>(scope: MemoryScope, key: string) {
  const { data, error } = await supabase
    .from('agent_memory')
    .select('*')
    .eq('scope', scope)
    .eq('key', key)
    .maybeSingle()
  if (error) throw error
  return (data ?? null) as AgentMemoryItem<T> | null
}

export async function searchMemory<T = unknown>(opts: {
  scope?: MemoryScope
  tag?: string
  keys?: string[]
}) {
  let q = supabase.from('agent_memory').select('*')
  if (opts.scope) q = q.eq('scope', opts.scope)
  if (opts.tag) q = q.contains('tags', [opts.tag])
  if (opts.keys && opts.keys.length > 0) q = q.in('key', opts.keys)
  const { data, error } = await q
  if (error) throw error
  return data as AgentMemoryItem<T>[]
}

export const AgentMemory = { remember, recall, search: searchMemory }
