-- ShiftBob: Farve på vagttyper og mønster på medarbejdertyper (kalender + skabeloner).
-- Kør i Supabase SQL Editor efter supabase_workplace_extended.sql.
-- (Undgår DO $$ … $$ — nogle editorer splitter forkert på semikolon.)

-- Skabeloner (Super Admin)
alter table public.shift_type_templates
  add column if not exists calendar_color text not null default '#22c55e';

alter table public.employee_type_templates
  add column if not exists calendar_pattern text not null default 'none';

alter table public.employee_type_templates
  drop constraint if exists employee_type_templates_calendar_pattern_check;

alter table public.employee_type_templates
  add constraint employee_type_templates_calendar_pattern_check
  check (calendar_pattern in ('none', 'stripes', 'dots', 'grid', 'diagonal'));

comment on column public.shift_type_templates.calendar_color is 'CSS hex (#rrggbb) — baggrundsfarve for vagt i kalenderen.';
comment on column public.employee_type_templates.calendar_pattern is 'Mønster oven på vagtfarve: none | stripes | dots | grid | diagonal.';

-- Arbejdsplads-kopier
alter table public.workplace_shift_types
  add column if not exists calendar_color text;

alter table public.workplace_employee_types
  add column if not exists calendar_pattern text;

alter table public.workplace_employee_types
  drop constraint if exists workplace_employee_types_calendar_pattern_check;

alter table public.workplace_employee_types
  add constraint workplace_employee_types_calendar_pattern_check
  check (calendar_pattern is null or calendar_pattern in ('none', 'stripes', 'dots', 'grid', 'diagonal'));

comment on column public.workplace_shift_types.calendar_color is 'Kopieret fra skabelon; bruges i kalender (fallback til neutral hvis null).';
comment on column public.workplace_employee_types.calendar_pattern is 'Kopieret fra skabelon; bruges i kalender (fallback til none hvis null).';

-- Eksisterende rækker: defaults
update public.workplace_shift_types wst
set calendar_color = stt.calendar_color
from public.shift_type_templates stt
where wst.template_id = stt.id
  and (wst.calendar_color is null or wst.calendar_color = '');

update public.workplace_employee_types wet
set calendar_pattern = ett.calendar_pattern
from public.employee_type_templates ett
where wet.template_id = ett.id
  and wet.calendar_pattern is null;

-- Kendte skabeloner: farver og mønstre
update public.shift_type_templates set calendar_color = '#475569' where slug = 'normal';
update public.shift_type_templates set calendar_color = '#22c55e' where slug = 'open';
update public.shift_type_templates set calendar_color = '#f97316' where slug = 'urgent';
update public.shift_type_templates set calendar_color = '#f59e0b' where slug = 'swap';
update public.shift_type_templates set calendar_color = '#8b5cf6' where slug = 'sick';
update public.shift_type_templates set calendar_color = '#9ca3af' where slug = 'vacation';
update public.shift_type_templates set calendar_color = '#c4b5fd' where slug = 'child_sick_day';

update public.employee_type_templates set calendar_pattern = 'none' where slug = 'full_time';
update public.employee_type_templates set calendar_pattern = 'none' where slug = 'part_time';
update public.employee_type_templates set calendar_pattern = 'stripes' where slug = 'trainee';
update public.employee_type_templates set calendar_pattern = 'dots' where slug = 'temp';
update public.employee_type_templates set calendar_pattern = 'grid' where slug = 'youth_u18';
