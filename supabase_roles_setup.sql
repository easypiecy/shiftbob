-- ShiftBob RBAC: brugerroller knyttet til auth.users
-- Kør dette i Supabase SQL Editor (eller via migration).

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  constraint user_roles_role_check check (
    role in (
      'SUPER_ADMIN',
      'ADMIN',
      'MANAGER',
      'EMPLOYEE'
    )
  ),
  constraint user_roles_user_role_unique unique (user_id, role)
);

create index if not exists user_roles_user_id_idx on public.user_roles (user_id);

alter table public.user_roles enable row level security;

drop policy if exists "user_roles_select_own" on public.user_roles;

-- Brugere kan kun læse egne roller
create policy "user_roles_select_own"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

grant select on table public.user_roles to authenticated;

comment on table public.user_roles is 'Tildelte roller pr. bruger (flere rækker pr. bruger muligt)';

-- ---------------------------------------------------------------------------
-- EKSEMPLER: Tildel roller (kør efter behov – ikke en del af selve skemaet)
-- ---------------------------------------------------------------------------
--
-- Fejl 22P02: Et UUID må KUN indeholde cifrene 0-9 og bogstaverne a-f (hex).
-- Brug ALDRIG pladsholdere som "xxxxxxxx-...." (x er ugyldigt) eller <uuid>.
--
-- A) Via e-mail (anbefalet – ingen manuel UUID):
--
-- insert into public.user_roles (user_id, role)
-- select id, 'EMPLOYEE'
-- from auth.users
-- where email = 'din@email.dk'
-- on conflict (user_id, role) do nothing;
--
-- B) Med ID fra Dashboard → Authentication → Users (erstat UUID med dit kopierede id):
--
-- insert into public.user_roles (user_id, role)
-- values ('00000000-0000-0000-0000-000000000001'::uuid, 'EMPLOYEE')
-- on conflict (user_id, role) do nothing;
--
--    Skift '00000000-0000-0000-0000-000000000001' til dit rigtige bruger-id.
--    Gyldigt UUID = kun 0-9 og a-f (fx f4c89c1e-3b2a-4d1e-9c7a-1234567890ab).
--
-- C) Flere roller til samme bruger (via e-mail):
--
-- insert into public.user_roles (user_id, role)
-- select id, role
-- from auth.users
-- cross join (values ('EMPLOYEE'), ('MANAGER')) as r(role)
-- where email = 'din@email.dk'
-- on conflict (user_id, role) do nothing;
