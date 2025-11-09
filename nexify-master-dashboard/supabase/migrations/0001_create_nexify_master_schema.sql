create schema if not exists nexify_master;
set search_path to nexify_master, public;

create table if not exists master_sessions (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  context_blob jsonb,
  status text not null default 'active'
);

create table if not exists master_notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references master_sessions(id) on delete cascade,
  author text not null,
  body text not null,
  embedding_vector vector(1536),
  created_at timestamptz not null default now()
);

create table if not exists master_workflows (
  id text primary key,
  name text not null,
  description text,
  command text not null,
  guardrails text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists master_plugins (
  id text primary key,
  manifest_json jsonb not null,
  status text not null default 'staging',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists master_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  payload jsonb,
  result text,
  created_at timestamptz not null default now()
);

-- Roles: master (full), observer (readonly)
alter table master_sessions enable row level security;
alter table master_notes enable row level security;
alter table master_workflows enable row level security;
alter table master_plugins enable row level security;
alter table master_audit_log enable row level security;

create policy master_full_access on master_sessions
  for all using (auth.role() = 'master')
  with check (auth.role() = 'master');

create policy master_full_access_notes on master_notes
  for all using (auth.role() = 'master')
  with check (auth.role() = 'master');

create policy master_full_access_workflows on master_workflows
  for all using (auth.role() = 'master')
  with check (auth.role() = 'master');

create policy master_full_access_plugins on master_plugins
  for all using (auth.role() = 'master')
  with check (auth.role() = 'master');

create policy master_full_access_audit on master_audit_log
  for all using (auth.role() = 'master')
  with check (auth.role() = 'master');

create policy observer_read_sessions on master_sessions
  for select using (auth.role() in ('master', 'observer'));

create policy observer_read_notes on master_notes
  for select using (auth.role() in ('master', 'observer'));

create policy observer_read_workflows on master_workflows
  for select using (auth.role() in ('master', 'observer'));

create policy observer_read_plugins on master_plugins
  for select using (auth.role() in ('master', 'observer'));

create policy observer_read_audit on master_audit_log
  for select using (auth.role() in ('master', 'observer'));

comment on schema nexify_master is 'Eigenständiger Bereich für NeXifyAI MASTER Dashboard';
