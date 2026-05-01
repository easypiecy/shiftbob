-- Add pricing tier support on workplaces for feature-gating.
-- Safe to run on existing databases.

alter table public.workplaces
  add column if not exists subscription_tier text not null default 'FOUNDATION';

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

comment on column public.workplaces.subscription_tier is
  'Produkt-tier: FOUNDATION, PRO_PLANNER, HYBRID_APP, AUTOPILOT.';
