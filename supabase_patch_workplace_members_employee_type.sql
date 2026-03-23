-- Valgfri: medarbejdertype pr. medlem (til kalenderfilter / sortering).
-- Kræver supabase_workplace_extended.sql (workplace_employee_types).
-- Kør i Supabase SQL Editor, derefter evt. NOTIFY pgrst reload schema.

alter table public.workplace_members
  add column if not exists employee_type_id uuid references public.workplace_employee_types (id) on delete set null;

comment on column public.workplace_members.employee_type_id is 'Valgfri kobling til workplace_employee_types for samme arbejdsplads (workplace_id matcher implicit via medlemskabet).';
