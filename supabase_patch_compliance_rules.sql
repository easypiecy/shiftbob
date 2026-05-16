-- Global standard profiles for compliance rules.
create table if not exists public.compliance_rule_profiles (
  profile_key text primary key,
  rules_json jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Workplace-level optional override.
alter table public.workplaces
  add column if not exists compliance_rules_override_json jsonb null;

-- Keep updated_at fresh when global defaults are changed.
create or replace function public.touch_compliance_rule_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_compliance_rule_profiles_updated_at on public.compliance_rule_profiles;
create trigger trg_touch_compliance_rule_profiles_updated_at
before update on public.compliance_rule_profiles
for each row
execute function public.touch_compliance_rule_profiles_updated_at();

-- Seed default profile from application config if empty.
insert into public.compliance_rule_profiles (profile_key, rules_json)
values
(
  'default',
  '[
    {"rule_id":"eu_gap_between_shifts_11h","type":"gap_between_shifts","severity":"ERROR","enabled":true,"min_gap_hours":11},
    {"rule_id":"eu_weekly_rest_35h","type":"weekly_rest","severity":"ERROR","enabled":true,"window_days":7,"min_consecutive_hours":35},
    {"rule_id":"eu_max_weekly_avg_48h_17w","type":"max_weekly_hours","severity":"ERROR","enabled":true,"average_window_weeks":17,"max_hours":48},
    {"rule_id":"eu_max_daily_hours_10h","type":"max_daily_hours","severity":"WARNING","enabled":true,"max_hours":10},
    {"rule_id":"eu_max_consecutive_days_6","type":"max_consecutive_days","severity":"WARNING","enabled":true,"max_days":6},
    {"rule_id":"eu_mandatory_break_6h","type":"mandatory_break","severity":"ERROR","enabled":true,"shift_length_threshold_hours":6,"min_break_minutes":30},
    {"rule_id":"eu_mandatory_break_9h","type":"mandatory_break","severity":"ERROR","enabled":true,"shift_length_threshold_hours":9,"min_break_minutes":45}
  ]'::jsonb
)
on conflict (profile_key) do nothing;
