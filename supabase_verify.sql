-- ShiftBob: Kør disse queries i Supabase SQL Editor for at tjekke opsætning.
-- De ændrer ikke data (kun læsning / katalog).

-- 1) Tabel findes og kolonner
select
  table_schema,
  table_name,
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'user_roles'
order by ordinal_position;

-- 2) RLS er slået til
select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'user_roles';

-- 3) Policies på user_roles
select
  pol.polname as policy_name,
  pol.polcmd as command,
  pg_get_expr(pol.polqual, pol.polrelid) as using_expression
from pg_policy pol
join pg_class cls on cls.oid = pol.polrelid
join pg_namespace nsp on nsp.oid = cls.relnamespace
where nsp.nspname = 'public'
  and cls.relname = 'user_roles';

-- 4) Antal roller pr. bruger (hurtigt overblik)
select
  user_id,
  count(*) as role_count,
  array_agg(role order by role) as roles
from public.user_roles
group by user_id
order by role_count desc;

-- 5) Brugere uden nogen rolle (bør være tom hvis alle har mindst én)
select u.id, u.email
from auth.users u
left join public.user_roles ur on ur.user_id = u.id
where ur.id is null;

-- 6) Arbejdsplads-medlemskab for én bruger (udskift email)
-- Tomt resultat = ingen rækker i workplace_members → ingen kort på /select-workplace
select u.email, p.name as workplace, wm.role
from auth.users u
join public.workplace_members wm on wm.user_id = u.id
join public.workplaces p on p.id = wm.workplace_id
where lower(u.email) = lower('philip.schoenbaum@gmail.com')
order by p.name;
