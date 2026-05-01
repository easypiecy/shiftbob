-- Workplace lifecycle + localization fields for automation.
-- Kør på eksisterende databaser.

do $$
begin
  if not exists (
    select 1 from pg_type
    where typnamespace = 'public'::regnamespace
      and typname = 'lifecycle_stage'
  ) then
    create type public.lifecycle_stage as enum (
      'PROSPECT',
      'REGISTERED',
      'ACTIVE_PLANNER',
      'HYBRID_OPERATOR',
      'FULL_PLATFORM'
    );
  end if;
end $$;

alter table public.workplaces
  add column if not exists lifecycle_stage public.lifecycle_stage not null default 'PROSPECT';
alter table public.workplaces
  add column if not exists language varchar(2) not null default 'en';
alter table public.workplaces
  add column if not exists imported_files_count int not null default 0;
alter table public.workplaces
  add column if not exists active_employee_invites int not null default 0;
alter table public.workplaces
  add column if not exists manual_shifts_created_count int not null default 0;
alter table public.workplaces
  add column if not exists subscription_status text not null default 'inactive';
alter table public.workplaces
  add column if not exists subscription_tier text not null default 'FOUNDATION';
alter table public.workplaces
  add column if not exists lifecycle_updated_at timestamptz;
alter table public.workplaces
  add column if not exists employee_swap_permission_level smallint not null default 2;

comment on column public.workplaces.lifecycle_stage is 'Marketing lifecycle-stage for arbejdspladsen.';
comment on column public.workplaces.language is 'ISO 639-1 foretrukket sprog til automation (fx da, en).';
comment on column public.workplaces.imported_files_count is 'Antal importerede planfiler.';
comment on column public.workplaces.active_employee_invites is 'Aktive medarbejderinvitationer.';
comment on column public.workplaces.manual_shifts_created_count is 'Antal manuelt oprettede vagter.';
comment on column public.workplaces.employee_swap_permission_level is '1=autopilot, 2=manuel godkendelse, 3=skrivebeskyttet';
comment on column public.workplaces.subscription_tier is 'Produkt-tier: FOUNDATION, PRO_PLANNER, HYBRID_APP, AUTOPILOT.';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'workplaces_language_iso639_1_check'
  ) then
    alter table public.workplaces
      add constraint workplaces_language_iso639_1_check
      check (language ~ '^[a-z]{2}$');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'workplaces_subscription_tier_check'
  ) then
    alter table public.workplaces
      add constraint workplaces_subscription_tier_check
      check (
        subscription_tier in (
          'FOUNDATION',
          'PRO_PLANNER',
          'HYBRID_APP',
          'AUTOPILOT'
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'workplaces_subscription_status_check'
  ) then
    alter table public.workplaces
      add constraint workplaces_subscription_status_check
      check (subscription_status in ('inactive', 'trialing', 'active', 'past_due', 'canceled'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'workplaces_employee_swap_permission_level_check'
  ) then
    alter table public.workplaces
      add constraint workplaces_employee_swap_permission_level_check
      check (employee_swap_permission_level in (1, 2, 3));
  end if;
end $$;

create table if not exists public.workplace_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  previous_stage public.lifecycle_stage,
  next_stage public.lifecycle_stage not null,
  language varchar(2) not null default 'en',
  event_source text not null default 'system',
  context_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists workplace_lifecycle_events_wp_created_idx
  on public.workplace_lifecycle_events (workplace_id, created_at desc);

alter table public.workplace_lifecycle_events enable row level security;

drop policy if exists "workplace_lifecycle_events_select_admin_wp" on public.workplace_lifecycle_events;
create policy "workplace_lifecycle_events_select_admin_wp"
  on public.workplace_lifecycle_events for select to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_lifecycle_events.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

grant select, insert on public.workplace_lifecycle_events to authenticated;
