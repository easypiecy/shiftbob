-- SalesBot setup (manifest + knowledge base)
-- ------------------------------------------------------------
-- Kør denne i Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.salesbot_manifests (
  id uuid primary key default gen_random_uuid(),
  bot_name text not null default 'SalesBot',
  welcome_message text not null,
  tone_of_voice text not null default 'Helpful, concise, sales-oriented',
  cta_label text not null default 'Book a free intro',
  cta_href text not null default '/login',
  fallback_reply text not null,
  updated_by_user_id uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salesbot_knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  language_code varchar(35) not null default 'en-US',
  title text not null,
  question text not null,
  answer text not null,
  tags text[] not null default '{}'::text[],
  sort_order integer not null default 100,
  active boolean not null default true,
  created_by_user_id uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists salesbot_knowledge_entries_lang_idx
  on public.salesbot_knowledge_entries (language_code, active, sort_order, created_at desc);

alter table public.salesbot_manifests enable row level security;
alter table public.salesbot_knowledge_entries enable row level security;

drop policy if exists "salesbot_manifests_select_public" on public.salesbot_manifests;
create policy "salesbot_manifests_select_public"
  on public.salesbot_manifests
  for select
  to anon, authenticated
  using (true);

drop policy if exists "salesbot_manifests_write_super_admin" on public.salesbot_manifests;
create policy "salesbot_manifests_write_super_admin"
  on public.salesbot_manifests
  for all
  to authenticated
  using (public.has_super_admin_membership())
  with check (public.has_super_admin_membership());

drop policy if exists "salesbot_knowledge_entries_select_public" on public.salesbot_knowledge_entries;
create policy "salesbot_knowledge_entries_select_public"
  on public.salesbot_knowledge_entries
  for select
  to anon, authenticated
  using (active = true or public.has_super_admin_membership());

drop policy if exists "salesbot_knowledge_entries_write_super_admin" on public.salesbot_knowledge_entries;
create policy "salesbot_knowledge_entries_write_super_admin"
  on public.salesbot_knowledge_entries
  for all
  to authenticated
  using (public.has_super_admin_membership())
  with check (public.has_super_admin_membership());

grant select on public.salesbot_manifests to anon, authenticated;
grant select on public.salesbot_knowledge_entries to anon, authenticated;
grant insert, update, delete on public.salesbot_manifests to authenticated;
grant insert, update, delete on public.salesbot_knowledge_entries to authenticated;

insert into public.salesbot_manifests (
  bot_name,
  welcome_message,
  tone_of_voice,
  cta_label,
  cta_href,
  fallback_reply
)
select
  'SalesBot',
  'Hi! I can help you understand ShiftBob pricing, onboarding, and how we modernize your shift planning in minutes.',
  'Helpful, concise, sales-oriented',
  'Book a free intro',
  '/login',
  'I do not have that specific answer yet. Book a free intro and we can show your exact setup.'
where not exists (select 1 from public.salesbot_manifests);

insert into public.salesbot_knowledge_entries (
  language_code,
  title,
  question,
  answer,
  tags,
  sort_order
) values
('en-US', 'Spreadsheet upload', 'How do we start with ShiftBob?', 'Upload your existing Excel or Google Sheets planning file, and ShiftBob converts it into a modern flow with compliance checks and mobile access for your team.', array['onboarding', 'excel', 'setup'], 10),
('en-US', 'Compliance', 'Does ShiftBob help with compliance?', 'Yes. ShiftBob continuously validates schedules against EU-style rest rules, and blocks problematic swaps before they become violations.', array['compliance', 'eu', 'labor-law'], 20),
('en-US', 'Employee app', 'Do employees get a mobile app?', 'Yes. Employees get iOS and Android access for shift overview, swap requests, open shifts, and push notifications.', array['mobile', 'app', 'employees'], 30),
('en-US', 'Pricing model', 'How is pricing structured?', 'You can start free and then move to paid tiers based on workflow and app usage. We can recommend the right tier after a short intro call.', array['pricing', 'plans'], 40),
('da', 'Opstart fra regneark', 'Hvordan kommer vi i gang med ShiftBob?', 'Upload jeres eksisterende Excel- eller Google Sheets-plan, så konverterer ShiftBob den til et moderne flow med compliance-tjek og mobil adgang til teamet.', array['onboarding', 'excel', 'opstart'], 10),
('da', 'Compliance', 'Hjælper ShiftBob med compliance?', 'Ja. ShiftBob validerer løbende vagtplaner mod EU-lignende hviletidsregler og blokerer problematiske bytter, før de bliver brud.', array['compliance', 'eu', 'regler'], 20),
('da', 'Medarbejder-app', 'Får medarbejdere en mobilapp?', 'Ja. Medarbejdere får iOS- og Android-adgang til vagtoversigt, bytteanmodninger, ledige vagter og push-notifikationer.', array['mobil', 'app', 'medarbejdere'], 30),
('da', 'Prismodel', 'Hvordan er prisstrukturen?', 'I kan starte gratis og opgradere til betalte planer efter behov og app-brug. Vi anbefaler den rigtige plan efter en kort intro-snak.', array['pris', 'planer'], 40)
on conflict do nothing;
