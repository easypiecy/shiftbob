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
  sort_order int not null default 0,
  calendar_color text not null default '#22c55e',
  created_at timestamptz not null default now(),
  constraint shift_type_templates_slug_unique unique (slug)
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

grant select on public.employee_type_templates to authenticated;
grant select on public.shift_type_templates to authenticated;
grant select on public.workplace_employee_types to authenticated;
grant select on public.workplace_shift_types to authenticated;
grant select on public.workplace_api_keys to authenticated;

-- ---------------------------------------------------------------------------
-- Seed: standardtyper (kan redigeres i Super Admin)
-- ---------------------------------------------------------------------------
insert into public.employee_type_templates (name, slug, sort_order, calendar_pattern) values
  ('Fastansat', 'permanent', 10, 'none'),
  ('Deltid', 'part_time', 20, 'stripes'),
  ('Vikar', 'substitute', 30, 'dots'),
  ('Elev / lærling', 'trainee', 40, 'grid')
on conflict (slug) do nothing;

insert into public.shift_type_templates (name, slug, sort_order, calendar_color) values
  ('Morgen', 'morning', 5, '#fbbf24'),
  ('Dag', 'day', 10, '#3b82f6'),
  ('Aften', 'evening', 20, '#f97316'),
  ('Nat', 'night', 30, '#6366f1'),
  ('Weekend', 'weekend', 40, '#14b8a6')
on conflict (slug) do nothing;
