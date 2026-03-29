-- Support ticket system (Super Admin)
-- ------------------------------------------------------------
-- Kør denne i Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.support_mailbox_configs (
  id uuid primary key default gen_random_uuid(),
  protocol text not null check (protocol in ('imap', 'pop3')),
  host text not null,
  port integer not null check (port > 0 and port <= 65535),
  username text not null,
  auth_secret text null,
  mailbox_name text not null default 'INBOX',
  use_tls boolean not null default true,
  active boolean not null default false,
  poll_every_minutes integer not null default 5 check (poll_every_minutes between 1 and 1440),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  channel text not null default 'email' check (channel in ('email', 'web')),
  status text not null default 'open' check (status in ('open', 'pending', 'resolved', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  sender_email text not null,
  sender_name text null,
  language_original text not null default 'unknown',
  subject_original text not null,
  body_original text not null,
  subject_translated text not null default '',
  body_translated text not null default '',
  labels text[] not null default '{}',
  workplace_id uuid null references public.workplaces(id) on delete set null,
  workplace_admin_user_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_tickets_created_idx
  on public.support_tickets (created_at desc);
create index if not exists support_tickets_status_idx
  on public.support_tickets (status);
create index if not exists support_tickets_sender_idx
  on public.support_tickets (lower(sender_email));

create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  direction text not null check (direction in ('incoming', 'outgoing')),
  sender_email text null,
  language_original text not null default 'unknown',
  language_target text null,
  body_original text not null,
  body_translated text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists support_ticket_messages_ticket_idx
  on public.support_ticket_messages (ticket_id, created_at asc);

create table if not exists public.support_reply_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  language_code text not null default 'en-US',
  body_template text not null,
  trigger_words text[] not null default '{}',
  trigger_phrases text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_reply_templates_active_idx
  on public.support_reply_templates (active, created_at desc);

alter table public.support_mailbox_configs enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;
alter table public.support_reply_templates enable row level security;

drop policy if exists "support_mailbox_configs_select_auth" on public.support_mailbox_configs;
create policy "support_mailbox_configs_select_auth"
  on public.support_mailbox_configs
  for select
  to authenticated
  using (true);

drop policy if exists "support_mailbox_configs_write_admin" on public.support_mailbox_configs;
create policy "support_mailbox_configs_write_admin"
  on public.support_mailbox_configs
  for all
  to authenticated
  using (public.is_workplace_admin())
  with check (public.is_workplace_admin());

drop policy if exists "support_tickets_select_auth" on public.support_tickets;
create policy "support_tickets_select_auth"
  on public.support_tickets
  for select
  to authenticated
  using (true);

drop policy if exists "support_tickets_write_admin" on public.support_tickets;
create policy "support_tickets_write_admin"
  on public.support_tickets
  for all
  to authenticated
  using (public.is_workplace_admin())
  with check (public.is_workplace_admin());

drop policy if exists "support_ticket_messages_select_auth" on public.support_ticket_messages;
create policy "support_ticket_messages_select_auth"
  on public.support_ticket_messages
  for select
  to authenticated
  using (true);

drop policy if exists "support_ticket_messages_write_admin" on public.support_ticket_messages;
create policy "support_ticket_messages_write_admin"
  on public.support_ticket_messages
  for all
  to authenticated
  using (public.is_workplace_admin())
  with check (public.is_workplace_admin());

drop policy if exists "support_reply_templates_select_auth" on public.support_reply_templates;
create policy "support_reply_templates_select_auth"
  on public.support_reply_templates
  for select
  to authenticated
  using (true);

drop policy if exists "support_reply_templates_write_admin" on public.support_reply_templates;
create policy "support_reply_templates_write_admin"
  on public.support_reply_templates
  for all
  to authenticated
  using (public.is_workplace_admin())
  with check (public.is_workplace_admin());

grant select, insert, update, delete on public.support_mailbox_configs to authenticated;
grant select, insert, update, delete on public.support_tickets to authenticated;
grant select, insert, update, delete on public.support_ticket_messages to authenticated;
grant select, insert, update, delete on public.support_reply_templates to authenticated;
