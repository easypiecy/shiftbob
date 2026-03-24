-- ShiftBob: Brugerprofil (navn, adresse, mobil, CV-sti) — primært Super Admin-redigering via service role.
-- Kør i Supabase SQL Editor efter supabase_roles_setup.sql.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  street_name text,
  street_number text,
  postal_code text,
  city text,
  mobile_phone text,
  note text,
  cv_storage_path text,
  updated_at timestamptz not null default now()
);

create index if not exists user_profiles_updated_idx
  on public.user_profiles (updated_at desc);

comment on table public.user_profiles is 'Persondata pr. login-bruger; CV ligger i Storage-bucket user-cvs.';
comment on column public.user_profiles.note is 'Intern note om medarbejderen (kun Super Admin).';
comment on column public.user_profiles.cv_storage_path is 'Sti i bucket user-cvs (fx {user_id}/fil.pdf).';

alter table public.user_profiles enable row level security;

-- Ingen policies: kun service role (server) tilgår tabellen via admin-klient.
revoke all on public.user_profiles from authenticated;
grant select, insert, update, delete on public.user_profiles to service_role;

-- Storage: privat bucket til CV (upload/download via service role + signed URLs fra app)
insert into storage.buckets (id, name, public)
values ('user-cvs', 'user-cvs', false)
on conflict (id) do nothing;
