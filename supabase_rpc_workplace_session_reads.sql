-- Læsning af arbejdspladser og roller for den loggede bruger uden at afhænge af RLS på
-- workplace_members (politikken kan give tomme resultater ved self-join i nogle Postgres/Supabase-konfigurationer).
-- Funktionerne filtrerer strengt på auth.uid() — ingen data for andre brugere.
-- Kør i Supabase SQL Editor efter supabase_workplaces_setup.sql.

create or replace function public.get_my_workplaces()
returns table (
  id uuid,
  name text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select w.id, w.name, w.created_at
  from public.workplaces w
  inner join public.workplace_members wm
    on wm.workplace_id = w.id and wm.user_id = auth.uid()
  order by w.name;
$$;

grant execute on function public.get_my_workplaces() to authenticated;

create or replace function public.get_my_roles_for_workplace(p_workplace_id uuid)
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    array_agg(distinct wm.role),
    '{}'::text[]
  )
  from public.workplace_members wm
  where wm.user_id = auth.uid()
    and wm.workplace_id = p_workplace_id;
$$;

grant execute on function public.get_my_roles_for_workplace(uuid) to authenticated;

create or replace function public.has_super_admin_membership()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.workplace_members wm
    where wm.user_id = auth.uid()
      and wm.role = 'SUPER_ADMIN'
  );
$$;

grant execute on function public.has_super_admin_membership() to authenticated;
