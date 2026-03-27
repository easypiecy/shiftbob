-- ShiftBob: Samlet patch til medarbejder-oprettelse/redigering + præferencer.
-- Kør hele blokken i Supabase SQL Editor.
-- Indeholder:
-- 1) Felter til user_profiles, inkl. country
-- 2) employee_type_id på workplace_members (hvis den mangler)
-- 3) Ny tabel: workplace_member_preferences med prioriteret rækkefølge
-- 4) RLS/policies så medarbejdere kan vedligeholde egne præferencer

begin;

-- 1) user_profiles (idempotent: opret tabel hvis mangler + tilføj evt. manglende kolonner)
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  street_name text,
  street_number text,
  postal_code text,
  city text,
  country text,
  mobile_phone text,
  note text,
  cv_storage_path text,
  updated_at timestamptz not null default now()
);

alter table public.user_profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists street_name text,
  add column if not exists street_number text,
  add column if not exists postal_code text,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists mobile_phone text,
  add column if not exists note text,
  add column if not exists cv_storage_path text,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists user_profiles_updated_idx
  on public.user_profiles (updated_at desc);

alter table public.user_profiles enable row level security;
revoke all on public.user_profiles from authenticated;
grant select, insert, update, delete on public.user_profiles to service_role;

insert into storage.buckets (id, name, public)
values ('user-cvs', 'user-cvs', false)
on conflict (id) do nothing;

-- 2) workplace_members.employee_type_id (til oprettelse/redigering)
alter table public.workplace_members
  add column if not exists employee_type_id uuid references public.workplace_employee_types (id);

create index if not exists workplace_members_workplace_employee_type_idx
  on public.workplace_members (workplace_id, employee_type_id);

-- 3) Ny tabel: prioriterede medarbejder-præferencer pr. arbejdsplads
create table if not exists public.workplace_member_preferences (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  priority integer not null check (priority > 0),
  preference_text text not null check (char_length(btrim(preference_text)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workplace_member_preferences_unique_priority
    unique (workplace_id, user_id, priority)
);

create index if not exists workplace_member_preferences_lookup_idx
  on public.workplace_member_preferences (workplace_id, user_id, priority);

alter table public.workplace_member_preferences enable row level security;

-- 4) RLS/policies:
-- Medarbejderen kan se/indsætte/opdatere/slette egne præferencer,
-- men kun for arbejdspladser hvor vedkommende er medlem.
drop policy if exists "workplace_member_preferences_select_own" on public.workplace_member_preferences;
create policy "workplace_member_preferences_select_own"
  on public.workplace_member_preferences for select to authenticated
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = workplace_member_preferences.workplace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workplace_member_preferences_insert_own" on public.workplace_member_preferences;
create policy "workplace_member_preferences_insert_own"
  on public.workplace_member_preferences for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = workplace_member_preferences.workplace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workplace_member_preferences_update_own" on public.workplace_member_preferences;
create policy "workplace_member_preferences_update_own"
  on public.workplace_member_preferences for update to authenticated
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = workplace_member_preferences.workplace_id
        and wm.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = workplace_member_preferences.workplace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workplace_member_preferences_delete_own" on public.workplace_member_preferences;
create policy "workplace_member_preferences_delete_own"
  on public.workplace_member_preferences for delete to authenticated
  using (
    auth.uid() = user_id
    and exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = workplace_member_preferences.workplace_id
        and wm.user_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.workplace_member_preferences to authenticated;
grant all on public.workplace_member_preferences to service_role;

commit;

-- Opfrisk PostgREST schema-cache
notify pgrst, 'reload schema';
