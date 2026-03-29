-- ShiftBob: EU-landes helligdage (redigerbare). Kør efter supabase_i18n_setup.sql (eu_countries).
-- Idempotent: ON CONFLICT opdaterer visningsnavn og regel-felter.

-- ---------------------------------------------------------------------------
-- Super admin (workplace SUPER_ADMIN eller global user_roles SUPER_ADMIN)
-- ---------------------------------------------------------------------------
create or replace function public.is_super_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.role = 'SUPER_ADMIN'
    ),
    false
  )
  or coalesce(
    exists (
      select 1
      from public.workplace_members wm
      where wm.user_id = auth.uid()
        and wm.role = 'SUPER_ADMIN'
    ),
    false
  );
$$;

grant execute on function public.is_super_admin_user() to authenticated;

-- ---------------------------------------------------------------------------
-- country_public_holidays
-- ---------------------------------------------------------------------------
create table if not exists public.country_public_holidays (
  id uuid primary key default gen_random_uuid(),
  country_code varchar(2) not null references public.eu_countries (country_code) on delete cascade,
  stable_code text not null,
  holiday_rule text not null,
  month smallint,
  day smallint,
  easter_offset_days integer,
  display_name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint country_public_holidays_rule_check
    check (holiday_rule in ('fixed', 'easter_offset')),
  constraint country_public_holidays_fixed_check
    check (
      holiday_rule <> 'fixed'
      or (month is not null and day is not null and easter_offset_days is null)
    ),
  constraint country_public_holidays_easter_check
    check (
      holiday_rule <> 'easter_offset'
      or (month is null and day is null and easter_offset_days is not null)
    ),
  constraint country_public_holidays_month_check
    check (month is null or (month >= 1 and month <= 12)),
  constraint country_public_holidays_day_check
    check (day is null or (day >= 1 and day <= 31)),
  constraint country_public_holidays_stable_unique unique (country_code, stable_code)
);

create index if not exists country_public_holidays_country_idx
  on public.country_public_holidays (country_code);

comment on table public.country_public_holidays is 'Officielle/offentlige helligdage pr. EU-land; display_name og regler kan rettes i Super Admin.';
comment on column public.country_public_holidays.stable_code is 'Stabil app-nøgle pr. land (fx new_year, easter_monday); unik sammen med country_code.';
comment on column public.country_public_holidays.holiday_rule is 'fixed: month+day hvert år; easter_offset: dage fra påskesøndag (vestlig beregning).';
comment on column public.country_public_holidays.easter_offset_days is 'Fx -2 god fredag, +1 2. påskedag, +39 Kristi himmelfart, +50 2. pinsedag.';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.country_public_holidays enable row level security;

drop policy if exists "country_public_holidays_select_auth" on public.country_public_holidays;
create policy "country_public_holidays_select_auth"
  on public.country_public_holidays
  for select
  to authenticated
  using (true);

drop policy if exists "country_public_holidays_write_super_admin" on public.country_public_holidays;
create policy "country_public_holidays_write_super_admin"
  on public.country_public_holidays
  for all
  to authenticated
  using (public.is_super_admin_user())
  with check (public.is_super_admin_user());

grant select, insert, update, delete on public.country_public_holidays to authenticated;

-- ---------------------------------------------------------------------------
-- Seed: fælles for alle eu_countries
-- ---------------------------------------------------------------------------
insert into public.country_public_holidays (
  country_code, stable_code, holiday_rule, month, day, easter_offset_days, display_name, sort_order
)
select
  c.country_code,
  v.stable_code,
  v.holiday_rule,
  v.month,
  v.day,
  v.easter_offset_days,
  v.display_name,
  v.sort_order
from public.eu_countries c
cross join (values
  ('new_year', 'fixed', 1::smallint, 1::smallint, null::integer, 'New Year''s Day', 10),
  ('labour_day', 'fixed', 5::smallint, 1::smallint, null, 'Labour Day', 20),
  ('christmas_day', 'fixed', 12::smallint, 25::smallint, null, 'Christmas Day', 200),
  ('christmas_second', 'fixed', 12::smallint, 26::smallint, null, 'Second day of Christmas', 210),
  ('good_friday', 'easter_offset', null::smallint, null::smallint, -2, 'Good Friday', 35),
  ('easter_monday', 'easter_offset', null, null, 1, 'Easter Monday', 36),
  ('ascension_day', 'easter_offset', null, null, 39, 'Ascension Day', 37),
  ('whit_monday', 'easter_offset', null, null, 50, 'Whit Monday', 38)
) as v(stable_code, holiday_rule, month, day, easter_offset_days, display_name, sort_order)
on conflict (country_code, stable_code) do update set
  holiday_rule = excluded.holiday_rule,
  month = excluded.month,
  day = excluded.day,
  easter_offset_days = excluded.easter_offset_days,
  display_name = excluded.display_name,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Seed: primære nationale helligdage (én pr. land; suppler eller ret i UI)
-- ---------------------------------------------------------------------------
insert into public.country_public_holidays (
  country_code, stable_code, holiday_rule, month, day, easter_offset_days, display_name, sort_order
) values
  ('AT', 'national_holiday', 'fixed', 10, 26, null, 'National Day (Austria)', 100),
  ('BE', 'national_holiday', 'fixed', 7, 21, null, 'National Day (Belgium)', 100),
  ('BG', 'national_holiday', 'fixed', 3, 3, null, 'Liberation Day (Bulgaria)', 100),
  ('HR', 'national_holiday', 'fixed', 6, 25, null, 'Statehood Day (Croatia)', 100),
  ('CY', 'national_holiday', 'fixed', 10, 1, null, 'Cyprus Independence Day', 100),
  ('CZ', 'national_holiday', 'fixed', 10, 28, null, 'Independent Czech State Day', 100),
  ('DK', 'national_holiday', 'fixed', 6, 5, null, 'Constitution Day (Denmark)', 100),
  ('EE', 'national_holiday', 'fixed', 2, 24, null, 'Independence Day (Estonia)', 100),
  ('FI', 'national_holiday', 'fixed', 12, 6, null, 'Independence Day (Finland)', 100),
  ('FR', 'national_holiday', 'fixed', 7, 14, null, 'Bastille Day', 100),
  ('DE', 'national_holiday', 'fixed', 10, 3, null, 'German Unity Day', 100),
  ('GR', 'national_holiday', 'fixed', 3, 25, null, 'Independence Day (Greece)', 100),
  ('HU', 'national_holiday', 'fixed', 3, 15, null, '1848 Revolution Memorial Day', 100),
  ('IE', 'national_holiday', 'fixed', 3, 17, null, 'St Patrick''s Day', 100),
  ('IT', 'national_holiday', 'fixed', 6, 2, null, 'Republic Day (Italy)', 100),
  ('LV', 'national_holiday', 'fixed', 11, 18, null, 'Proclamation Day (Latvia)', 100),
  ('LT', 'national_holiday', 'fixed', 2, 16, null, 'Restoration of the State Day', 100),
  ('LU', 'national_holiday', 'fixed', 6, 23, null, 'Grand Duke''s Official Birthday', 100),
  ('MT', 'national_holiday', 'fixed', 9, 8, null, 'Victory Day (Malta)', 100),
  ('NL', 'national_holiday', 'fixed', 4, 27, null, 'King''s Day (Netherlands)', 100),
  ('PL', 'national_holiday', 'fixed', 11, 11, null, 'Independence Day (Poland)', 100),
  ('PT', 'national_holiday', 'fixed', 6, 10, null, 'Portugal Day', 100),
  ('RO', 'national_holiday', 'fixed', 12, 1, null, 'Great Union Day (Romania)', 100),
  ('SK', 'national_holiday', 'fixed', 8, 29, null, 'Slovak National Uprising anniversary', 100),
  ('SI', 'national_holiday', 'fixed', 6, 25, null, 'Statehood Day (Slovenia)', 100),
  ('ES', 'national_holiday', 'fixed', 10, 12, null, 'Hispanic Day (Spain)', 100),
  ('SE', 'national_holiday', 'fixed', 6, 6, null, 'National Day (Sweden)', 100)
on conflict (country_code, stable_code) do update set
  holiday_rule = excluded.holiday_rule,
  month = excluded.month,
  day = excluded.day,
  easter_offset_days = excluded.easter_offset_days,
  display_name = excluded.display_name,
  sort_order = excluded.sort_order,
  updated_at = now();
