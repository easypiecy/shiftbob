-- Tilføj standard vagttype «Morgen» (tidlig morgen). Kør efter supabase_workplace_extended.sql.
insert into public.shift_type_templates (name, slug, sort_order, calendar_color) values
  ('Morgen', 'morning', 5, '#fbbf24')
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order,
  calendar_color = excluded.calendar_color;
