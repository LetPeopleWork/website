-- The assessment bands were renamed (Output-focused -> Drifting,
-- Probabilistic -> Predictable). Bring historical rows onto the new names so
-- they tally in the dashboard band distribution.
update public.responses set band = 'Drifting' where band = 'Output-focused';
update public.responses set band = 'Predictable' where band = 'Probabilistic';
update public.leads set band = 'Drifting' where band = 'Output-focused';
update public.leads set band = 'Predictable' where band = 'Probabilistic';
