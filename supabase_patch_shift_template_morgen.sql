-- Tilføj/opdater standard vagttype "Morning" med stabil import-kode ST001.
alter table public.shift_type_templates
  add column if not exists import_code text;

insert into public.shift_type_templates (name, slug, import_code, sort_order, calendar_color) values
  ('Morning', 'morning', 'ST001', 10, '#fde68a')
on conflict (slug) do update set
  name = excluded.name,
  import_code = excluded.import_code,
  sort_order = excluded.sort_order,
  calendar_color = excluded.calendar_color;
