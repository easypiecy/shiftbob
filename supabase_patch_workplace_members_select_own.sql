-- Patch: Brugere skal kunne læse deres egen række i workplace_members fra klienten (anon + JWT).
-- Uden `user_id = auth.uid()` kan SELECT med kun EXISTS over samme tabel give tomme resultater (RLS/self-join).
-- Kør i Supabase SQL Editor på eksisterende databaser efter supabase_workplaces_setup.sql.

drop policy if exists "workplace_members_select_shared" on public.workplace_members;

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
