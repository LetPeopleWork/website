create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  kind text,
  answers jsonb not null,
  raw_sum int,
  score int,
  band text,
  created_at timestamptz not null default now()
);

create index if not exists responses_source_created_at_idx
  on public.responses (source, created_at);

alter table public.responses enable row level security;

create policy responses_anon_insert
  on public.responses
  for insert
  to anon
  with check (source in ('readiness-assessment'));

create policy responses_authenticated_select
  on public.responses
  for select
  to authenticated
  using (true);
