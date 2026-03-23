-- Fremtidsplanlægning: ufrigivet kalendervindue, sæson-skabelon, frigivelsesdato.
-- Kør i Supabase SQL Editor efter supabase_workplaces_setup.sql.

alter table public.workplaces
  add column if not exists future_planning_weeks integer not null default 8
    check (future_planning_weeks >= 1 and future_planning_weeks <= 104);

alter table public.workplaces
  add column if not exists calendar_released_until date;

alter table public.workplaces
  add column if not exists season_template_json jsonb not null default '{}'::jsonb;

comment on column public.workplaces.future_planning_weeks is
  'Antal uger af ikke-frigivet kalender som vises under Administrator → Fremtiden.';
comment on column public.workplaces.calendar_released_until is
  'Sidste dato medarbejdere kan se planlagt (inkl.). Efter denne dato er vagter kun synlige for admin indtil frigivelse.';
comment on column public.workplaces.season_template_json is
  'Sæson-skabelon: perioder med krav pr. ugedag (medarbejdere, typer, vagttyper).';
