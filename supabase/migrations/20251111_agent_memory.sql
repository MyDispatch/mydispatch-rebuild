-- Agent Memory Schema for Autonomous Knowledge Persistence
-- Version: 1.0.0 | Date: 2025-11-11

create table if not exists public.agent_memory (
  id uuid primary key default gen_random_uuid(),
  agent_id text not null,
  scope text not null, -- e.g. 'global' | 'project' | 'user:{id}'
  key text not null,
  value jsonb not null,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_agent_memory_scope_key
  on public.agent_memory (scope, key);

create index if not exists idx_agent_memory_tags
  on public.agent_memory using gin (tags);

comment on table public.agent_memory is 'Persistent agent memory for long-term knowledge management.';

-- RLS: allow authenticated users to read/write their project/user scoped memory
alter table public.agent_memory enable row level security;

create policy agent_memory_read on public.agent_memory
  for select using (
    auth.role() = 'service_role' or
    (scope like 'user:%' and split_part(scope, ':', 2) = auth.uid()::text) or
    scope = 'project'
  );

create policy agent_memory_write on public.agent_memory
  for insert with check (
    auth.role() = 'service_role' or
    (scope like 'user:%' and split_part(scope, ':', 2) = auth.uid()::text) or
    scope = 'project'
  );

create policy agent_memory_update on public.agent_memory
  for update using (
    auth.role() = 'service_role' or
    (scope like 'user:%' and split_part(scope, ':', 2) = auth.uid()::text) or
    scope = 'project'
  ) with check (
    auth.role() = 'service_role' or
    (scope like 'user:%' and split_part(scope, ':', 2) = auth.uid()::text) or
    scope = 'project'
  );

-- Trigger to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_agent_memory_updated_at on public.agent_memory;
create trigger trg_agent_memory_updated_at
before update on public.agent_memory
for each row execute procedure public.set_updated_at();
