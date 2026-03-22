-- ShiftBob: Bruger-UI-præferencer (layout/tema) gemt på profilen.
-- Kør i Supabase SQL Editor efter supabase_workplaces_setup.sql (auth.users findes).

create table if not exists public.user_ui_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  layout_theme text not null default 'dark'
    check (layout_theme in ('dark', 'light', 'unicorn')),
  updated_at timestamptz not null default now()
);

alter table public.user_ui_preferences enable row level security;

drop policy if exists "user_ui_preferences_select_own" on public.user_ui_preferences;
create policy "user_ui_preferences_select_own"
  on public.user_ui_preferences for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user_ui_preferences_insert_own" on public.user_ui_preferences;
create policy "user_ui_preferences_insert_own"
  on public.user_ui_preferences for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "user_ui_preferences_update_own" on public.user_ui_preferences;
create policy "user_ui_preferences_update_own"
  on public.user_ui_preferences for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.user_ui_preferences to authenticated;

-- Opfrisk PostgREST (API) schema-cache så tabellen findes straks i klienten
notify pgrst, 'reload schema';
