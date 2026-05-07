-- Synk standard vagttype-koder (import_code) med XLS-format.
-- Matcher primært på navn i shift_type_templates.name.
-- Idempotent: kan køres flere gange sikkert.

alter table public.shift_type_templates
  add column if not exists import_code text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'shift_type_templates_import_code_unique'
  ) then
    alter table public.shift_type_templates
      add constraint shift_type_templates_import_code_unique unique (import_code);
  end if;
end $$;

with mapping(name, slug, import_code, sort_order, calendar_color) as (
  values
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
),
updated as (
  update public.shift_type_templates st
  set
    import_code = m.import_code,
    name = m.name,
    sort_order = m.sort_order
  from mapping m
  where lower(trim(st.name)) = lower(trim(m.name))
  returning st.id
)
insert into public.shift_type_templates (name, slug, import_code, sort_order, calendar_color)
select m.name, m.slug, m.import_code, m.sort_order, m.calendar_color
from mapping m
where not exists (
  select 1
  from public.shift_type_templates st
  where lower(trim(st.name)) = lower(trim(m.name))
)
on conflict (slug) do update
set
  name = excluded.name,
  import_code = excluded.import_code,
  sort_order = excluded.sort_order,
  calendar_color = excluded.calendar_color;
