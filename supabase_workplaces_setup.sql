-- ShiftBob: Multi-tenant arbejdspladser + én rolle pr. bruger pr. arbejdsplads
-- Kør i Supabase SQL Editor efter supabase_roles_setup.sql.
-- Én række pr. (user_id, workplace_id); skift rolle = UPDATE samme række (app bruger upsert).

create table if not exists public.workplaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workplace_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  constraint workplace_members_role_check check (
    role in (
      'SUPER_ADMIN',
      'ADMIN',
      'MANAGER',
      'EMPLOYEE'
    )
  ),
  constraint workplace_members_user_workplace_unique unique (user_id, workplace_id)
);

create index if not exists workplace_members_user_id_idx
  on public.workplace_members (user_id);

create index if not exists workplace_members_workplace_id_idx
  on public.workplace_members (workplace_id);

alter table public.workplaces enable row level security;
alter table public.workplace_members enable row level security;

drop policy if exists "workplaces_select_member" on public.workplaces;
drop policy if exists "workplace_members_select_shared" on public.workplace_members;

-- Arbejdspladser: læs kun hvis brugeren er medlem
create policy "workplaces_select_member"
  on public.workplaces
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = workplaces.id
        and wm.user_id = auth.uid()
    )
  );

-- Medlemmer: egen række altid synlig; øvrige i samme tenant via EXISTS (undgår RLS-recursion)
create policy "workplace_members_select_shared"
  on public.workplace_members
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1
      from public.workplace_members wm
      where wm.workplace_id = workplace_members.workplace_id
        and wm.user_id = auth.uid()
    )
  );

grant select on table public.workplaces to authenticated;
grant select on table public.workplace_members to authenticated;

comment on table public.workplaces is 'Tenant / arbejdsplads';
comment on table public.workplace_members is 'Medlemskab: én rolle pr. bruger pr. arbejdsplads';
