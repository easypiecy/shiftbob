-- Tildel SUPER_ADMIN til philip.schoenbaum@gmail.com
-- Kør i Supabase SQL Editor (postgres/service role — INSERT er ikke tilladt for anon).
-- Kræver at brugeren findes i auth.users (har logget ind mindst én gang eller er oprettet).

insert into public.user_roles (user_id, role)
select id, 'SUPER_ADMIN'
from auth.users
where email = lower('philip.schoenbaum@gmail.com')
on conflict (user_id, role) do nothing;

-- Verificér (valgfrit):
-- select u.email, ur.role
-- from public.user_roles ur
-- join auth.users u on u.id = ur.user_id
-- where u.email = 'philip.schoenbaum@gmail.com';
