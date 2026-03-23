-- ShiftBob: OAuth/ny bruger — anmodning om adgang til arbejdsplads, admin godkender.
-- Kør efter supabase_workplaces_setup.sql (og gerne supabase_workplace_extended.sql).

alter table public.workplaces
  add column if not exists allow_join_requests boolean not null default true;

comment on column public.workplaces.allow_join_requests is
  'Når true, vises arbejdspladsen for brugere uden medlemskab (anmod om adgang).';

alter table public.workplace_members
  add column if not exists profile_onboarding_completed boolean not null default true;

comment on column public.workplace_members.profile_onboarding_completed is
  'Falsk efter godkendt join-anmodning indtil brugeren har udfyldt profil (afdeling, type m.v.).';

create table if not exists public.workplace_join_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id),
  constraint workplace_join_requests_user_wp_unique unique (user_id, workplace_id)
);

create index if not exists workplace_join_requests_user_idx
  on public.workplace_join_requests (user_id, status);

create index if not exists workplace_join_requests_wp_idx
  on public.workplace_join_requests (workplace_id, status);

alter table public.workplace_join_requests enable row level security;

drop policy if exists "workplace_join_requests_select_own" on public.workplace_join_requests;
drop policy if exists "workplace_join_requests_select_admin_wp" on public.workplace_join_requests;
drop policy if exists "workplace_join_requests_insert_own" on public.workplace_join_requests;
drop policy if exists "workplace_join_requests_update_admin" on public.workplace_join_requests;

create policy "workplace_join_requests_select_own"
  on public.workplace_join_requests
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "workplace_join_requests_select_admin_wp"
  on public.workplace_join_requests
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = workplace_join_requests.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

create policy "workplace_join_requests_insert_own"
  on public.workplace_join_requests
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
  );

create policy "workplace_join_requests_update_admin"
  on public.workplace_join_requests
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = workplace_join_requests.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

grant select, insert, update on public.workplace_join_requests to authenticated;

create or replace function public.list_workplaces_open_for_join()
returns table (id uuid, name text)
language sql
security definer
set search_path = public
stable
as $$
  select w.id, w.name
  from public.workplaces w
  where coalesce(w.allow_join_requests, true) = true
  order by w.name;
$$;

grant execute on function public.list_workplaces_open_for_join() to authenticated;

drop function if exists public.request_workplace_join(uuid);

create or replace function public.request_workplace_join(p_workplace_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  wp_exists boolean;
  already_member boolean;
  rid uuid;
  st text;
begin
  if uid is null then
    return json_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  select exists(
    select 1 from public.workplaces w
    where w.id = p_workplace_id and coalesce(w.allow_join_requests, true)
  ) into wp_exists;

  if not wp_exists then
    return json_build_object('ok', false, 'error', 'workplace_not_found_or_closed');
  end if;

  select exists(
    select 1 from public.workplace_members wm
    where wm.user_id = uid and wm.workplace_id = p_workplace_id
  ) into already_member;

  if already_member then
    return json_build_object('ok', false, 'error', 'already_member');
  end if;

  select j.id, j.status into rid, st
  from public.workplace_join_requests j
  where j.user_id = uid and j.workplace_id = p_workplace_id;

  if rid is not null then
    if st = 'pending' then
      return json_build_object('ok', true, 'request_id', rid, 'note', 'already_pending');
    end if;
    if st = 'approved' then
      return json_build_object('ok', false, 'error', 'already_approved');
    end if;
    if st = 'rejected' then
      update public.workplace_join_requests
        set status = 'pending',
            reviewed_at = null,
            reviewed_by = null,
            created_at = now()
      where id = rid;
      return json_build_object('ok', true, 'request_id', rid, 'note', 'resubmitted');
    end if;
  end if;

  insert into public.workplace_join_requests (user_id, workplace_id, status)
  values (uid, p_workplace_id, 'pending')
  returning id into rid;

  return json_build_object('ok', true, 'request_id', rid);
end;
$$;

grant execute on function public.request_workplace_join(uuid) to authenticated;
