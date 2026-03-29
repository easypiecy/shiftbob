-- Udvid helligdags-regelmotor med flere regeltyper.
-- Kør denne på eksisterende databaser, der allerede har country_public_holidays.

alter table public.country_public_holidays
  drop constraint if exists country_public_holidays_rule_check;

alter table public.country_public_holidays
  drop constraint if exists country_public_holidays_fixed_check;

alter table public.country_public_holidays
  drop constraint if exists country_public_holidays_easter_check;

alter table public.country_public_holidays
  drop constraint if exists country_public_holidays_nth_weekday_check;

alter table public.country_public_holidays
  drop constraint if exists country_public_holidays_fixed_offset_check;

alter table public.country_public_holidays
  add constraint country_public_holidays_rule_check
  check (holiday_rule in ('fixed', 'easter_offset', 'nth_weekday', 'fixed_offset'));

alter table public.country_public_holidays
  add constraint country_public_holidays_fixed_check
  check (
    holiday_rule <> 'fixed'
    or (month is not null and day is not null and easter_offset_days is null)
  );

alter table public.country_public_holidays
  add constraint country_public_holidays_easter_check
  check (
    holiday_rule <> 'easter_offset'
    or (month is null and day is null and easter_offset_days is not null)
  );

alter table public.country_public_holidays
  add constraint country_public_holidays_nth_weekday_check
  check (
    holiday_rule <> 'nth_weekday'
    or (
      month is not null and month between 1 and 12
      and day is not null and day between 0 and 6
      and easter_offset_days is not null and (easter_offset_days = -1 or easter_offset_days between 1 and 5)
    )
  );

alter table public.country_public_holidays
  add constraint country_public_holidays_fixed_offset_check
  check (
    holiday_rule <> 'fixed_offset'
    or (month is not null and day is not null and easter_offset_days is not null)
  );
