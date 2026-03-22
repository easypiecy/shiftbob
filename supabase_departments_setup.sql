-- ShiftBob: Afdelinger (departments) pr. arbejdsplads + medlemskaber.
-- Kør i Supabase SQL Editor efter supabase_workplace_extended.sql.

-- ---------------------------------------------------------------------------
-- Afdelinger
-- ---------------------------------------------------------------------------
create table if not exists public.workplace_departments (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists workplace_departments_workplace_id_idx
  on public.workplace_departments (workplace_id);

-- ---------------------------------------------------------------------------
-- Medlem ↔ afdeling (en bruger kan være i flere afdelinger på samme arbejdsplads)
-- ---------------------------------------------------------------------------
create table if not exists public.workplace_department_members (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.workplace_departments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint workplace_department_members_user_dept_unique unique (user_id, department_id)
);

create index if not exists workplace_department_members_workplace_idx
  on public.workplace_department_members (workplace_id);

create index if not exists workplace_department_members_user_idx
  on public.workplace_department_members (user_id);

create index if not exists workplace_department_members_dept_idx
  on public.workplace_department_members (department_id);

-- Én trigger: sæt workplace_id fra afdeling + verificér at bruger er medlem af arbejdspladsen
create or replace function public.workplace_department_members_validate()
returns trigger
language plpgsql
as $$
declare
  w uuid;
begin
  select wd.workplace_id into w
  from public.workplace_departments wd
  where wd.id = new.department_id;
  if w is null then
    raise exception 'Ugyldig department_id';
  end if;
  new.workplace_id := w;
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

create trigger workplace_department_members_validate_trg
  before insert or update on public.workplace_department_members
  for each row
  execute procedure public.workplace_department_members_validate();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.workplace_departments enable row level security;
alter table public.workplace_department_members enable row level security;

drop policy if exists "workplace_departments_select_member" on public.workplace_departments;
create policy "workplace_departments_select_member"
  on public.workplace_departments for select to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_departments.workplace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workplace_departments_insert_admin" on public.workplace_departments;
create policy "workplace_departments_insert_admin"
  on public.workplace_departments for insert to authenticated
  with check (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_departments.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

drop policy if exists "workplace_departments_update_admin" on public.workplace_departments;
create policy "workplace_departments_update_admin"
  on public.workplace_departments for update to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_departments.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  )
  with check (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_departments.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

drop policy if exists "workplace_departments_delete_admin" on public.workplace_departments;
create policy "workplace_departments_delete_admin"
  on public.workplace_departments for delete to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_departments.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

drop policy if exists "workplace_department_members_select_member" on public.workplace_department_members;
create policy "workplace_department_members_select_member"
  on public.workplace_department_members for select to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_department_members.workplace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workplace_department_members_insert_admin" on public.workplace_department_members;
create policy "workplace_department_members_insert_admin"
  on public.workplace_department_members for insert to authenticated
  with check (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_department_members.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

drop policy if exists "workplace_department_members_update_admin" on public.workplace_department_members;
create policy "workplace_department_members_update_admin"
  on public.workplace_department_members for update to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_department_members.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  )
  with check (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_department_members.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

drop policy if exists "workplace_department_members_delete_admin" on public.workplace_department_members;
create policy "workplace_department_members_delete_admin"
  on public.workplace_department_members for delete to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_department_members.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

grant select, insert, update, delete on public.workplace_departments to authenticated;
grant select, insert, update, delete on public.workplace_department_members to authenticated;

comment on table public.workplace_departments is 'Afdelinger under en arbejdsplads';
comment on table public.workplace_department_members is 'Kobling: bruger i afdeling (samme arbejdsplads)';
