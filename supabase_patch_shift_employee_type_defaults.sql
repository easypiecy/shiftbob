-- Opdater standard "Vagttyper" og "Medarbejdertyper" til ny visuel kodning.
-- Kør på eksisterende databaser.

-- 1) Forsøg at "genbruge" ældre skabeloner ved at omdøbe slugs (bevarer template_id relationer).
update public.shift_type_templates
set slug = 'normal', name = 'Normal', sort_order = 10, calendar_color = '#475569'
where slug = 'day'
  and not exists (select 1 from public.shift_type_templates where slug = 'normal');

update public.shift_type_templates
set slug = 'open', name = 'Ledig', sort_order = 20, calendar_color = '#22c55e'
where slug = 'evening'
  and not exists (select 1 from public.shift_type_templates where slug = 'open');

update public.shift_type_templates
set slug = 'urgent', name = 'Akut', sort_order = 30, calendar_color = '#f97316'
where slug = 'night'
  and not exists (select 1 from public.shift_type_templates where slug = 'urgent');

update public.shift_type_templates
set slug = 'swap', name = 'Bytte', sort_order = 40, calendar_color = '#f59e0b'
where slug = 'weekend'
  and not exists (select 1 from public.shift_type_templates where slug = 'swap');

update public.shift_type_templates
set slug = 'sick', name = 'Sygdom', sort_order = 50, calendar_color = '#8b5cf6'
where slug = 'morning'
  and not exists (select 1 from public.shift_type_templates where slug = 'sick');

update public.employee_type_templates
set slug = 'full_time', name = 'Fuldtid', sort_order = 10, calendar_pattern = 'none'
where slug = 'permanent'
  and not exists (select 1 from public.employee_type_templates where slug = 'full_time');

update public.employee_type_templates
set slug = 'temp', name = 'Vikar', sort_order = 40, calendar_pattern = 'dots'
where slug = 'substitute'
  and not exists (select 1 from public.employee_type_templates where slug = 'temp');

-- 2) Sikr at hele det nye standardsæt findes (idempotent).
insert into public.shift_type_templates (name, slug, sort_order, calendar_color) values
  ('Normal', 'normal', 10, '#475569'),
  ('Ledig', 'open', 20, '#22c55e'),
  ('Akut', 'urgent', 30, '#f97316'),
  ('Bytte', 'swap', 40, '#f59e0b'),
  ('Sygdom', 'sick', 50, '#8b5cf6'),
  ('Ferie', 'vacation', 60, '#9ca3af'),
  ('Barn 1. sygedag', 'child_sick_day', 70, '#c4b5fd')
on conflict (slug) do update
set
  name = excluded.name,
  sort_order = excluded.sort_order,
  calendar_color = excluded.calendar_color;

insert into public.employee_type_templates (name, slug, sort_order, calendar_pattern) values
  ('Fuldtid', 'full_time', 10, 'none'),
  ('Deltid', 'part_time', 20, 'none'),
  ('Elev', 'trainee', 30, 'stripes'),
  ('Vikar', 'temp', 40, 'dots'),
  ('Ung (under 18)', 'youth_u18', 50, 'grid')
on conflict (slug) do update
set
  name = excluded.name,
  sort_order = excluded.sort_order,
  calendar_pattern = excluded.calendar_pattern;

-- 3) Demotér ældre legacy-skabeloner i sortering (så de ikke står øverst i UI).
update public.shift_type_templates
set sort_order = greatest(sort_order, 900)
where slug in ('day', 'evening', 'night', 'weekend', 'morning');

update public.employee_type_templates
set sort_order = greatest(sort_order, 900)
where slug in ('permanent', 'substitute');

-- 4) Synk workplace-kopier fra template (hvis template_id findes).
update public.workplace_shift_types wst
set
  label = stt.name,
  sort_order = stt.sort_order,
  calendar_color = stt.calendar_color
from public.shift_type_templates stt
where wst.template_id = stt.id;

update public.workplace_employee_types wet
set
  label = ett.name,
  sort_order = ett.sort_order,
  calendar_pattern = ett.calendar_pattern
from public.employee_type_templates ett
where wet.template_id = ett.id;

-- 5) Best-effort for workplaces uden template_id (match på label).
update public.workplace_shift_types
set label = 'Normal', calendar_color = '#475569'
where template_id is null and lower(label) in ('dag', 'normal');

update public.workplace_shift_types
set label = 'Ledig', calendar_color = '#22c55e'
where template_id is null and lower(label) in ('ledig', 'open');

update public.workplace_shift_types
set label = 'Akut', calendar_color = '#f97316'
where template_id is null and lower(label) in ('akut', 'urgent');

update public.workplace_shift_types
set label = 'Bytte', calendar_color = '#f59e0b'
where template_id is null and lower(label) in ('bytte', 'swap');

update public.workplace_shift_types
set label = 'Sygdom', calendar_color = '#8b5cf6'
where template_id is null and lower(label) in ('sygdom', 'sick');

update public.workplace_shift_types
set label = 'Ferie', calendar_color = '#9ca3af'
where template_id is null and lower(label) in ('ferie', 'vacation');

update public.workplace_shift_types
set label = 'Barn 1. sygedag', calendar_color = '#c4b5fd'
where template_id is null and lower(label) in ('barn 1. sygedag', 'child sick day', 'child_sick_day');

update public.workplace_employee_types
set label = 'Fuldtid', calendar_pattern = 'none'
where template_id is null and lower(label) in ('fuldtid', 'fastansat', 'permanent');

update public.workplace_employee_types
set label = 'Deltid', calendar_pattern = 'none'
where template_id is null and lower(label) in ('deltid', 'part time', 'part_time');

update public.workplace_employee_types
set label = 'Elev', calendar_pattern = 'stripes'
where template_id is null and lower(label) in ('elev', 'elev / lærling', 'trainee');

update public.workplace_employee_types
set label = 'Vikar', calendar_pattern = 'dots'
where template_id is null and lower(label) in ('vikar', 'temp', 'substitute');

update public.workplace_employee_types
set label = 'Ung (under 18)', calendar_pattern = 'grid'
where template_id is null and lower(label) in ('ung', 'ung (under 18)', 'youth_u18');
