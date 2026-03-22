-- Tilknyt philip.schoenbaum@gmail.com til mindst én arbejdsplads i workplace_members.
-- Uden det returnerer klienten ingen arbejdspladser (fetchUserWorkplaces læser kun workplace_members).
-- Global SUPER_ADMIN i user_roles giver ikke automatisk rækker her.
--
-- Kræver: bruger findes i auth.users (har logget ind mindst én gang).
-- Kør i Supabase SQL Editor (postgres / service role — INSERT i workplace_members er ikke RLS for authenticated).

-- 1) Opret demo-arbejdsplads kun hvis der ikke findes nogen endnu
insert into public.workplaces (name)
select 'ShiftBob Demo'
where not exists (select 1 from public.workplaces limit 1);

-- 2) Medlemskab: ADMIN på første arbejdsplads (alfabetisk efter navn)
insert into public.workplace_members (user_id, workplace_id, role)
select u.id, w.id, 'ADMIN'
from auth.users u
cross join lateral (
  select id from public.workplaces order by name asc limit 1
) w
where lower(u.email) = lower('philip.schoenbaum@gmail.com')
on conflict (user_id, workplace_id) do update set role = excluded.role;

-- Verificér (valgfrit):
-- select u.email, p.name as workplace, wm.role
-- from public.workplace_members wm
-- join auth.users u on u.id = wm.user_id
-- join public.workplaces p on p.id = wm.workplace_id
-- where lower(u.email) = lower('philip.schoenbaum@gmail.com');
