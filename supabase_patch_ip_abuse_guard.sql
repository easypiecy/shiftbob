-- IP-baseret daglig beskyttelse mod misbrug af gratis Basic og compliance-tjek.
-- Kør i Supabase SQL Editor.

create table if not exists public.ip_free_tier_guard (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  action_type text not null check (action_type in ('basic_signup', 'foundation_compliance_check')),
  usage_day date not null default ((timezone('utc', now()))::date),
  hit_count integer not null default 1 check (hit_count > 0),
  first_hit_at timestamptz not null default now(),
  last_hit_at timestamptz not null default now(),
  constraint ip_free_tier_guard_unique unique (ip_address, action_type, usage_day)
);

create index if not exists ip_free_tier_guard_lookup_idx
  on public.ip_free_tier_guard (ip_address, action_type, usage_day desc);

comment on table public.ip_free_tier_guard is
  'Daglig IP-begrænsning for gratis Basic-signup og Foundation compliance-tjek. Kun service role.';

alter table public.ip_free_tier_guard enable row level security;
