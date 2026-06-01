alter table public.leads
  add column if not exists organization text;
