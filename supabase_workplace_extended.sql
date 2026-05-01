-- ShiftBob: Udvid arbejdsplads med firma, adresse, indstillinger, typer og API-nøgler.
-- Kør i Supabase SQL Editor efter supabase_workplaces_setup.sql.

-- ---------------------------------------------------------------------------
-- Udvid workplaces
-- ---------------------------------------------------------------------------
alter table public.workplaces add column if not exists company_name text;
alter table public.workplaces add column if not exists vat_number text;
alter table public.workplaces add column if not exists street_name text;
alter table public.workplaces add column if not exists street_number text;
alter table public.workplaces add column if not exists address_extra text;
alter table public.workplaces add column if not exists postal_code text;
alter table public.workplaces add column if not exists city text;
alter table public.workplaces add column if not exists country_code varchar(2);
alter table public.workplaces add column if not exists contact_email text;
alter table public.workplaces add column if not exists phone text;

alter table public.workplaces add column if not exists employee_count_band text
  not null default '5-20';

alter table public.workplaces add column if not exists notification_channel text
  not null default 'push';

alter table public.workplaces add column if not exists stripe_customer_id text;

alter table public.workplaces add column if not exists push_include_shift_type_ids uuid[]
  not null default '{}';

alter table public.workplaces add column if not exists push_include_employee_type_ids uuid[]
  not null default '{}';

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

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'workplaces_employee_count_band_check'
  ) then
    alter table public.workplaces
      add constraint workplaces_employee_count_band_check
      check (employee_count_band in ('5-20', '21-50', '51-150', '151+'));
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
    where conname = 'workplaces_notification_channel_check'
  ) then
    alter table public.workplaces
      add constraint workplaces_notification_channel_check
      check (notification_channel in ('push', 'sms'));
  end if;
end $$;

comment on column public.workplaces.company_name is 'Officielt firmanavn (kan matche name)';
comment on column public.workplaces.push_include_shift_type_ids is 'Tom = ingen filter på vagttyper; ellers kun disse workplace_shift_types.id';
comment on column public.workplaces.push_include_employee_type_ids is 'Tom = ingen filter på medarbejdertyper; ellers kun disse workplace_employee_types.id';
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

-- ---------------------------------------------------------------------------
-- Standardtyper (Super Admin)
-- ---------------------------------------------------------------------------
create table if not exists public.employee_type_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  sort_order int not null default 0,
  calendar_pattern text not null default 'none',
  created_at timestamptz not null default now(),
  constraint employee_type_templates_slug_unique unique (slug),
  constraint employee_type_templates_calendar_pattern_check
    check (calendar_pattern in ('none', 'stripes', 'dots', 'grid', 'diagonal'))
);

create table if not exists public.shift_type_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  import_code text,
  sort_order int not null default 0,
  calendar_color text not null default '#22c55e',
  created_at timestamptz not null default now(),
  constraint shift_type_templates_slug_unique unique (slug),
  constraint shift_type_templates_import_code_unique unique (import_code)
);

create index if not exists employee_type_templates_sort_idx
  on public.employee_type_templates (sort_order);

create index if not exists shift_type_templates_sort_idx
  on public.shift_type_templates (sort_order);

-- ---------------------------------------------------------------------------
-- Arbejdspladsens kopier af typer (til kalender / filtre)
-- ---------------------------------------------------------------------------
create table if not exists public.workplace_employee_types (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  template_id uuid references public.employee_type_templates (id) on delete set null,
  label text not null,
  sort_order int not null default 0,
  calendar_pattern text,
  created_at timestamptz not null default now(),
  constraint workplace_employee_types_calendar_pattern_check
    check (calendar_pattern is null or calendar_pattern in ('none', 'stripes', 'dots', 'grid', 'diagonal'))
);

create table if not exists public.workplace_shift_types (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  template_id uuid references public.shift_type_templates (id) on delete set null,
  label text not null,
  sort_order int not null default 0,
  calendar_color text,
  created_at timestamptz not null default now()
);

create index if not exists workplace_employee_types_wp_idx
  on public.workplace_employee_types (workplace_id);

create index if not exists workplace_shift_types_wp_idx
  on public.workplace_shift_types (workplace_id);

-- ---------------------------------------------------------------------------
-- API-nøgler (kun hash gemmes)
-- ---------------------------------------------------------------------------
create table if not exists public.workplace_api_keys (
  id uuid primary key default gen_random_uuid(),
  workplace_id uuid not null references public.workplaces (id) on delete cascade,
  key_prefix text not null,
  key_hash text not null,
  label text not null default 'default',
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists workplace_api_keys_wp_idx
  on public.workplace_api_keys (workplace_id);

-- ---------------------------------------------------------------------------
-- RLS (læs som medlem af arbejdspladsen; skriv via service role i app)
-- ---------------------------------------------------------------------------
alter table public.employee_type_templates enable row level security;
alter table public.shift_type_templates enable row level security;
alter table public.workplace_employee_types enable row level security;
alter table public.workplace_shift_types enable row level security;
alter table public.workplace_api_keys enable row level security;
alter table public.workplace_lifecycle_events enable row level security;

drop policy if exists "employee_type_templates_select_auth" on public.employee_type_templates;
create policy "employee_type_templates_select_auth"
  on public.employee_type_templates for select to authenticated using (true);

drop policy if exists "shift_type_templates_select_auth" on public.shift_type_templates;
create policy "shift_type_templates_select_auth"
  on public.shift_type_templates for select to authenticated using (true);

drop policy if exists "workplace_employee_types_select_member" on public.workplace_employee_types;
create policy "workplace_employee_types_select_member"
  on public.workplace_employee_types for select to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_employee_types.workplace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workplace_shift_types_select_member" on public.workplace_shift_types;
create policy "workplace_shift_types_select_member"
  on public.workplace_shift_types for select to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_shift_types.workplace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workplace_api_keys_select_admin_wp" on public.workplace_api_keys;
create policy "workplace_api_keys_select_admin_wp"
  on public.workplace_api_keys for select to authenticated
  using (
    exists (
      select 1 from public.workplace_members wm
      where wm.workplace_id = workplace_api_keys.workplace_id
        and wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    )
  );

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

grant select on public.employee_type_templates to authenticated;
grant select on public.shift_type_templates to authenticated;
grant select on public.workplace_employee_types to authenticated;
grant select on public.workplace_shift_types to authenticated;
grant select on public.workplace_api_keys to authenticated;
grant select, insert on public.workplace_lifecycle_events to authenticated;

-- ---------------------------------------------------------------------------
-- Seed: standardtyper (kan redigeres i Super Admin)
-- ---------------------------------------------------------------------------
insert into public.employee_type_templates (name, slug, sort_order, calendar_pattern) values
  ('Fuldtid', 'full_time', 10, 'none'),
  ('Deltid', 'part_time', 20, 'none'),
  ('Elev', 'trainee', 30, 'stripes'),
  ('Vikar', 'temp', 40, 'dots'),
  ('Ung (under 18)', 'youth_u18', 50, 'grid')
on conflict (slug) do nothing;

insert into public.shift_type_templates (name, slug, import_code, sort_order, calendar_color) values
  ('Morning', 'morning', 'ST001', 10, '#fde68a'),
  ('Day', 'day', 'ST002', 20, '#fef3c7'),
  ('Midday', 'midday', 'ST003', 30, '#fde68a'),
  ('Afternoon', 'afternoon', 'ST004', 40, '#fbcfe8'),
  ('Night', 'night', 'ST005', 50, '#bfdbfe'),
  ('Long', 'long', 'ST006', 60, '#fef3c7'),
  ('Short', 'short', 'ST007', 70, '#d9f99d'),
  ('Split 1', 'split_1', 'ST008', 80, '#c7d2fe'),
  ('Split 2', 'split_2', 'ST009', 90, '#c7d2fe'),
  ('On-Call', 'on_call', 'ST010', 100, '#e5e7eb'),
  ('Day Off', 'off', 'ST011', 110, '#f3f4f6'),
  ('Vacation', 'vacation', 'ST012', 120, '#bfdbfe'),
  ('Sick', 'sick', 'ST013', 130, '#fecaca'),
  ('Child Sick', 'child_sick', 'ST014', 140, '#fecdd3'),
  ('Training', 'training', 'ST015', 150, '#d1fae5'),
  ('Comp. Off', 'comp_off', 'ST016', 160, '#e5e7eb'),
  ('Shift Swap', 'swap', 'ST017', 170, '#f5d0fe'),
  ('Open Shift', 'open', 'ST018', 180, '#d9f99d'),
  ('Urgent', 'urgent', 'ST019', 190, '#fecdd3')
on conflict (slug) do nothing;
