-- Opdater standard "Vagttyper" og "Medarbejdertyper" til ny visuel kodning.
-- Kør på eksisterende databaser.

alter table public.shift_type_templates
  add column if not exists import_code text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'shift_type_templates_import_code_unique'
  ) then
    alter table public.shift_type_templates
      add constraint shift_type_templates_import_code_unique unique (import_code);
  end if;
end $$;

-- 1) Forsøg at "genbruge" ældre skabeloner ved at omdøbe slugs (bevarer template_id relationer).
update public.shift_type_templates
set slug = 'day', name = 'Day', import_code = 'ST002', sort_order = 20, calendar_color = '#fef3c7'
where slug = 'day'
  and not exists (select 1 from public.shift_type_templates where slug = 'day' and import_code = 'ST002');

update public.shift_type_templates
set slug = 'afternoon', name = 'Afternoon', import_code = 'ST004', sort_order = 40, calendar_color = '#fbcfe8'
where slug = 'evening'
  and not exists (select 1 from public.shift_type_templates where slug = 'afternoon');

update public.shift_type_templates
set slug = 'night', name = 'Night', import_code = 'ST005', sort_order = 50, calendar_color = '#bfdbfe'
where slug = 'night'
  and not exists (select 1 from public.shift_type_templates where slug = 'night' and import_code = 'ST005');

update public.shift_type_templates
set slug = 'split_2', name = 'Split 2', import_code = 'ST009', sort_order = 90, calendar_color = '#c7d2fe'
where slug = 'weekend'
  and not exists (select 1 from public.shift_type_templates where slug = 'split_2');

update public.shift_type_templates
set slug = 'morning', name = 'Morning', import_code = 'ST001', sort_order = 10, calendar_color = '#fde68a'
where slug = 'morning'
  and not exists (select 1 from public.shift_type_templates where slug = 'morning' and import_code = 'ST001');

update public.employee_type_templates
set slug = 'full_time', name = 'Fuldtid', sort_order = 10, calendar_pattern = 'none'
where slug = 'permanent'
  and not exists (select 1 from public.employee_type_templates where slug = 'full_time');

update public.employee_type_templates
set slug = 'temp', name = 'Vikar', sort_order = 40, calendar_pattern = 'dots'
where slug = 'substitute'
  and not exists (select 1 from public.employee_type_templates where slug = 'temp');

-- 2) Sikr at hele det nye standardsæt findes (idempotent).
insert into public.shift_type_templates (name, slug, import_code, sort_order, calendar_color) values
  ('Morning', 'morning', 'ST001', 10, '#fde68a'),
  ('Day', 'day', 'ST002', 20, '#fef3c7'),
  ('Midday', 'midday', 'ST003', 30, '#fde68a'),
  ('Afternoon', 'afternoon', 'ST004', 40, '#fbcfe8'),
  ('Night', 'night', 'ST005', 50, '#bfdbfe'),
  ('Long', 'long', 'ST006', 60, '#fef3c7'),
  ('Short', 'short', 'ST007', 70, '#d9f99d'),
  ('Split 1', 'split_1', 'ST008', 80, '#c7d2fe'),
  ('Split 2', 'split_2', 'ST009', 90, '#c7d2fe'),
  ('On-Call', 'on_call', 'ST010', 100, '#e5e7eb'),
  ('Day Off', 'off', 'ST011', 110, '#f3f4f6'),
  ('Vacation', 'vacation', 'ST012', 120, '#bfdbfe'),
  ('Sick', 'sick', 'ST013', 130, '#fecaca'),
  ('Child Sick', 'child_sick', 'ST014', 140, '#fecdd3'),
  ('Training', 'training', 'ST015', 150, '#d1fae5'),
  ('Comp. Off', 'comp_off', 'ST016', 160, '#e5e7eb'),
  ('Shift Swap', 'swap', 'ST017', 170, '#f5d0fe'),
  ('Open Shift', 'open', 'ST018', 180, '#d9f99d'),
  ('Urgent', 'urgent', 'ST019', 190, '#fecdd3')
on conflict (slug) do update
set
  name = excluded.name,
  import_code = excluded.import_code,
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
where slug in ('evening', 'weekend', 'normal', 'child_sick_day');

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
set label = 'Day', calendar_color = '#fef3c7'
where template_id is null and lower(label) in ('dag', 'day', 'normal');

update public.workplace_shift_types
set label = 'Open Shift', calendar_color = '#d9f99d'
where template_id is null and lower(label) in ('ledig', 'open shift', 'open');

update public.workplace_shift_types
set label = 'Urgent', calendar_color = '#fecdd3'
where template_id is null and lower(label) in ('akut', 'urgent');

update public.workplace_shift_types
set label = 'Shift Swap', calendar_color = '#f5d0fe'
where template_id is null and lower(label) in ('bytte', 'shift swap', 'swap');

update public.workplace_shift_types
set label = 'Sick', calendar_color = '#fecaca'
where template_id is null and lower(label) in ('sygdom', 'sick');

update public.workplace_shift_types
set label = 'Vacation', calendar_color = '#bfdbfe'
where template_id is null and lower(label) in ('ferie', 'vacation');

update public.workplace_shift_types
set label = 'Child Sick', calendar_color = '#fecdd3'
where template_id is null and lower(label) in ('barn 1. sygedag', 'child sick day', 'child_sick_day', 'child sick');

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
