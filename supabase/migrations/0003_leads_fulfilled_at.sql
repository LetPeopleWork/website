alter table public.leads
  add column if not exists fulfilled_at timestamptz;

create policy leads_authenticated_update
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);
