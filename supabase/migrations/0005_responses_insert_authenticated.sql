-- The forecasting assessment is public, but a signed-in team member taking it
-- sends the authenticated role, which the anon-only insert policy did not cover
-- (RLS policies are role-specific). Allow both anon and authenticated to insert
-- a readiness-assessment response.
drop policy if exists responses_anon_insert on public.responses;

create policy responses_anon_insert
  on public.responses
  for insert
  to anon, authenticated
  with check (source in ('readiness-assessment'));
