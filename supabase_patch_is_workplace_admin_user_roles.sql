-- Valgfri patch: udvid is_workplace_admin() så global SUPER_ADMIN i user_roles også kan skrive
-- via RLS (uden service role). Kør i Supabase SQL Editor efter supabase_roles_setup.sql.
-- App'en bruger service role til Super Admin-gem alligevel; denne patch er til konsistens / andre klienter.

create or replace function public.is_workplace_admin()
returns boolean
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if to_regclass('public.workplace_members') is not null then
    if exists (
      select 1
      from public.workplace_members wm
      where wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    ) then
      return true;
    end if;
  end if;

  if to_regclass('public.user_roles') is not null then
    if exists (
      select 1
      from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.role = 'SUPER_ADMIN'
    ) then
      return true;
    end if;
  end if;

  return false;
end;
$$;
