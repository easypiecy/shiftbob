-- ShiftBob: Planlagte vagter pr. arbejdsplads (kalender).
-- Kør i Supabase SQL Editor efter supabase_departments_setup.sql (afdelinger + FK).

create table if not exists public.workplace_shifts (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  department_id uuid references public.workplace_departments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  shift_type_id uuid references public.workplace_shift_types (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint workplace_shifts_end_after_start check (ends_at > starts_at)
);

create index if not exists workplace_shifts_wp_range_idx
  on public.workplace_shifts (workplace_id, starts_at, ends_at);

create index if not exists workplace_shifts_dept_idx
  on public.workplace_shifts (department_id);

alter table public.workplace_shifts enable row level security;

drop policy if exists "workplace_shifts_select_member" on public.workplace_shifts;
create policy "workplace_shifts_select_member"
  on public.workplace_shifts for select to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_shifts.workplace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workplace_shifts_insert_admin" on public.workplace_shifts;
create policy "workplace_shifts_insert_admin"
  on public.workplace_shifts for insert to authenticated
  with check (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_shifts.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

drop policy if exists "workplace_shifts_update_admin" on public.workplace_shifts;
create policy "workplace_shifts_update_admin"
  on public.workplace_shifts for update to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_shifts.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  )
  with check (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_shifts.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

drop policy if exists "workplace_shifts_delete_admin" on public.workplace_shifts;
create policy "workplace_shifts_delete_admin"
  on public.workplace_shifts for delete to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_shifts.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

grant select, insert, update, delete on public.workplace_shifts to authenticated;
