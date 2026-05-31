create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  email text not null,
  score int,
  band text,
  wants_trial boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists leads_source_created_at_idx
  on public.leads (source, created_at);

alter table public.leads enable row level security;

create policy leads_authenticated_select
  on public.leads
  for select
  to authenticated
  using (true);
