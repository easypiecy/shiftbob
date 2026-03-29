-- Super Admin notification broadcast
-- ------------------------------------------------------------
-- Kør denne i Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.super_admin_notification_batches (
  id uuid primary key default gen_random_uuid(),
  created_by_user_id uuid not null references auth.users(id) on delete cascade,
  title_original text not null,
  body_original text not null,
  source_language_code varchar(35) not null default 'da',
  target_scope jsonb not null default '{}'::jsonb,
  recipients_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists super_admin_notification_batches_created_idx
  on public.super_admin_notification_batches (created_at desc);

create table if not exists public.super_admin_notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.super_admin_notification_batches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  workplace_id uuid not null references public.workplaces(id) on delete cascade,
  role text not null check (role in ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')),
  language_code varchar(35) not null,
  title_translated text not null,
  body_translated text not null,
  status text not null default 'queued' check (status in ('queued', 'sent', 'failed')),
  error_message text null,
  created_at timestamptz not null default now()
);

create index if not exists super_admin_notification_deliveries_batch_idx
  on public.super_admin_notification_deliveries (batch_id);
create index if not exists super_admin_notification_deliveries_user_idx
  on public.super_admin_notification_deliveries (user_id, created_at desc);

alter table public.super_admin_notification_batches enable row level security;
alter table public.super_admin_notification_deliveries enable row level security;

drop policy if exists "super_admin_notification_batches_select_auth" on public.super_admin_notification_batches;
create policy "super_admin_notification_batches_select_auth"
  on public.super_admin_notification_batches
  for select
  to authenticated
  using (true);

drop policy if exists "super_admin_notification_batches_write_admin" on public.super_admin_notification_batches;
create policy "super_admin_notification_batches_write_admin"
  on public.super_admin_notification_batches
  for all
  to authenticated
  using (public.is_workplace_admin())
  with check (public.is_workplace_admin());

drop policy if exists "super_admin_notification_deliveries_select_auth" on public.super_admin_notification_deliveries;
create policy "super_admin_notification_deliveries_select_auth"
  on public.super_admin_notification_deliveries
  for select
  to authenticated
  using (true);

drop policy if exists "super_admin_notification_deliveries_write_admin" on public.super_admin_notification_deliveries;
create policy "super_admin_notification_deliveries_write_admin"
  on public.super_admin_notification_deliveries
  for all
  to authenticated
  using (public.is_workplace_admin())
  with check (public.is_workplace_admin());

grant select, insert, update, delete
  on public.super_admin_notification_batches
  to authenticated;
grant select, insert, update, delete
  on public.super_admin_notification_deliveries
  to authenticated;
