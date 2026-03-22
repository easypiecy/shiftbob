-- ShiftBob: Valgfrit vist navn pr. medarbejder pr. arbejdsplads (kalender m.m.).
-- Kør i Supabase SQL Editor efter supabase_workplaces_setup.sql og supabase_departments_setup.sql.

create table if not exists public.workplace_member_calendar_profiles (
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name_override text,
  updated_at timestamptz not null default now(),
  primary key (workplace_id, user_id)
);

create index if not exists workplace_member_calendar_profiles_workplace_idx
  on public.workplace_member_calendar_profiles (workplace_id);

comment on table public.workplace_member_calendar_profiles is
  'Kalender-/UI-navn pr. tenant; hvis NULL slettes rækken og bruges OAuth-navn eller e-mail.';

-- ---------------------------------------------------------------------------
-- Trigger: kun brugere der allerede er workplace_members
-- ---------------------------------------------------------------------------
create or replace function public.workplace_member_calendar_profiles_validate()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1
    from public.workplace_members wm
    where wm.workplace_id = new.workplace_id
      and wm.user_id = new.user_id
  ) then
    raise exception 'Bruger er ikke medlem af denne arbejdsplads';
  end if;
  return new;
end;
$$;

drop trigger if exists workplace_member_calendar_profiles_validate_trg
  on public.workplace_member_calendar_profiles;

create trigger workplace_member_calendar_profiles_validate_trg
  before insert or update on public.workplace_member_calendar_profiles
  for each row
  execute procedure public.workplace_member_calendar_profiles_validate();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.workplace_member_calendar_profiles enable row level security;

drop policy if exists "workplace_member_calendar_profiles_select_member"
  on public.workplace_member_calendar_profiles;
create policy "workplace_member_calendar_profiles_select_member"
  on public.workplace_member_calendar_profiles for select to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_member_calendar_profiles.workplace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workplace_member_calendar_profiles_insert_admin"
  on public.workplace_member_calendar_profiles;
create policy "workplace_member_calendar_profiles_insert_admin"
  on public.workplace_member_calendar_profiles for insert to authenticated
  with check (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_member_calendar_profiles.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

drop policy if exists "workplace_member_calendar_profiles_update_admin"
  on public.workplace_member_calendar_profiles;
create policy "workplace_member_calendar_profiles_update_admin"
  on public.workplace_member_calendar_profiles for update to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_member_calendar_profiles.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  )
  with check (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_member_calendar_profiles.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

drop policy if exists "workplace_member_calendar_profiles_delete_admin"
  on public.workplace_member_calendar_profiles;
create policy "workplace_member_calendar_profiles_delete_admin"
  on public.workplace_member_calendar_profiles for delete to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_member_calendar_profiles.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

grant select, insert, update, delete on public.workplace_member_calendar_profiles to authenticated;
