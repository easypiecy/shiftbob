-- ShiftBob: Intern note på brugerprofil (Super Admin).
-- Kør i Supabase SQL Editor efter supabase_user_profiles.sql.

alter table public.user_profiles
  add column if not exists note text;

comment on column public.user_profiles.note is 'Intern note om medarbejderen (kun service role / Super Admin UI).';
