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
('da', 'Compliance', 'Hjælper ShiftBob med compliance?', 'Ja. ShiftBob validerer løbende vagtplaner mod EU-lignende hviletidsregler og blokerer problematiske bytter, før de bliver brud.', array['compliance', 'eu', 'regler'], 20),
('da', 'Medarbejder-app', 'Får medarbejdere en mobilapp?', 'Ja. Medarbejdere får iOS- og Android-adgang til vagtoversigt, bytteanmodninger, ledige vagter og push-notifikationer.', array['mobil', 'app', 'medarbejdere'], 30),
('da', 'Prismodel', 'Hvordan er prisstrukturen?', 'I kan starte gratis og opgradere til betalte planer efter behov og app-brug. Vi anbefaler den rigtige plan efter en kort intro-snak.', array['pris', 'planer'], 40),
('en-US', 'FAQ: Basic plan price', 'What does the Basic plan cost?', 'The free Basic plan costs 0 EUR and can be used forever.', array['faq_v2', 'pricing', 'basic'], 1),
('en-US', 'FAQ: Basic included', 'What is included in the free Basic plan?', 'The free Basic plan includes a professional spreadsheet template, Excel and Google Sheets compatibility, clear shift-type overview, built-in hour calculations, and one free compliance check per day.', array['faq_v2', 'basic', 'features'], 2),
('en-US', 'FAQ: Pro Planner price', 'How much is Pro Planner?', 'Pro Planner is 49 EUR per month.', array['faq_v2', 'pricing', 'pro_planner'], 3),
('en-US', 'FAQ: Pro Planner included', 'What is included in Pro Planner?', 'Pro Planner includes everything from Basic plus unlimited EU compliance checks, cloud storage of past schedules, priority email support, and free app access for 3 employees.', array['faq_v2', 'pro_planner', 'features'], 4),
('en-US', 'FAQ: Hybrid App price', 'How much is Hybrid App?', 'Hybrid App is 29 EUR per month plus 1 EUR per user.', array['faq_v2', 'pricing', 'hybrid_app'], 5),
('en-US', 'FAQ: Hybrid App included', 'What do we get with Hybrid App?', 'Hybrid App includes everything in Basic and Pro Planner plus iOS/Android employee app access, in-app shift swap tools, approval dashboard, push reminders, and seasonal pause flexibility.', array['faq_v2', 'hybrid_app', 'features'], 6),
('en-US', 'FAQ: Autopilot price', 'How much is Autopilot?', 'Autopilot is 59 EUR per month plus 1 EUR per user.', array['faq_v2', 'pricing', 'autopilot'], 7),
('en-US', 'FAQ: Autopilot included', 'What is included in Autopilot?', 'Autopilot includes all previous plan features plus automatic shift generation, preference matching, advanced employee options, open-shift publishing, time export, custom shift types, and API access.', array['faq_v2', 'autopilot', 'features'], 8),
('en-US', 'FAQ: Spreadsheet vs online', 'Do we need to leave Excel?', 'No. You can stay in Excel/Google Sheets with Basic, Pro Planner, or Hybrid App. Autopilot is the fully online option if you want to leave spreadsheets.', array['faq_v2', 'excel', 'autopilot'], 9),
('en-US', 'FAQ: Employee app platforms', 'Is the employee app available on iOS and Android?', 'Yes. The employee app is available on both App Store and Google Play.', array['faq_v2', 'mobile', 'ios', 'android'], 10),
('en-US', 'FAQ: Compliance 11-hour rule', 'How do you handle the 11-hour rule?', 'ShiftBob checks schedules for compliance and prevents swaps or picks that violate rules such as the 11-hour daily rest requirement.', array['faq_v2', 'compliance', '11-hour'], 11),
('en-US', 'FAQ: EU languages', 'How many languages do you support?', 'ShiftBob supports all EU languages in the product experience.', array['faq_v2', 'languages', 'eu'], 12),
('en-US', 'FAQ: Who is this for?', 'Who is ShiftBob made for?', 'ShiftBob is made for managers who plan shifts, need compliance confidence, and want better communication with their teams.', array['faq_v2', 'target_group', 'managers'], 13),
('en-US', 'FAQ: Onboarding speed', 'How fast can we get started?', 'Most teams can start quickly by selecting a plan and using existing scheduling data right away.', array['faq_v2', 'onboarding', 'setup'], 14),
('da', 'FAQ: Basic pris', 'Hvad koster Basic-planen?', 'Den gratis Basic-plan koster 0 EUR og kan bruges uden tidsbegrænsning.', array['faq_v2', 'pris', 'basic'], 1),
('da', 'FAQ: Basic indhold', 'Hvad er inkluderet i den gratis Basic-plan?', 'Den gratis Basic-plan indeholder professionel vagtplansskabelon, kompatibilitet med Excel og Google Sheets, tydeligt overblik over vagttyper, indbygget timeberegning samt ét gratis compliance-tjek pr. dag.', array['faq_v2', 'basic', 'funktioner'], 2),
('da', 'FAQ: Pro Planner pris', 'Hvad koster Pro Planner?', 'Pro Planner koster 49 EUR pr. måned.', array['faq_v2', 'pris', 'pro_planner'], 3),
('da', 'FAQ: Pro Planner indhold', 'Hvad er inkluderet i Pro Planner?', 'Pro Planner indeholder alt fra Basic samt ubegrænsede EU-compliance tjek, cloud-lagring af tidligere vagtplaner, prioriteret e-mail support og gratis app-adgang for 3 medarbejdere.', array['faq_v2', 'pro_planner', 'funktioner'], 4),
('da', 'FAQ: Hybrid App pris', 'Hvad koster Hybrid App?', 'Hybrid App koster 29 EUR pr. måned plus 1 EUR pr. bruger.', array['faq_v2', 'pris', 'hybrid_app'], 5),
('da', 'FAQ: Hybrid App indhold', 'Hvad får vi i Hybrid App?', 'Hybrid App indeholder alt i Basic og Pro Planner samt iOS/Android app til medarbejdere, værktøjer til vagtbytte i appen, godkendelsesdashboard, push-påmindelser og mulighed for sæsonpause.', array['faq_v2', 'hybrid_app', 'funktioner'], 6),
('da', 'FAQ: Autopilot pris', 'Hvad koster Autopilot?', 'Autopilot koster 59 EUR pr. måned plus 1 EUR pr. bruger.', array['faq_v2', 'pris', 'autopilot'], 7),
('da', 'FAQ: Autopilot indhold', 'Hvad er inkluderet i Autopilot?', 'Autopilot indeholder alle tidligere funktioner samt automatisk vagtgenerering, match med medarbejderpræferencer, avancerede medarbejderindstillinger, publicering af ledige vagter, tidseksport, egne vagttyper og API-adgang.', array['faq_v2', 'autopilot', 'funktioner'], 8),
('da', 'FAQ: Excel eller online', 'Skal vi stoppe med Excel?', 'Nej. I kan fortsætte i Excel/Google Sheets med Basic, Pro Planner eller Hybrid App. Autopilot er den fulde online-løsning, hvis I vil væk fra regneark.', array['faq_v2', 'excel', 'autopilot'], 9),
('da', 'FAQ: Medarbejderapp platforme', 'Er medarbejderappen til både iOS og Android?', 'Ja. Medarbejderappen findes både i App Store og Google Play.', array['faq_v2', 'mobil', 'ios', 'android'], 10),
('da', 'FAQ: 11-timers-reglen', 'Hvordan håndterer I 11-timers-reglen?', 'ShiftBob tjekker vagtplaner for compliance og forhindrer bytter/overtagelser, der bryder regler som fx 11-timers daglig hvile.', array['faq_v2', 'compliance', '11-timers'], 11),
('da', 'FAQ: EU-sprog', 'Hvor mange sprog understøtter I?', 'ShiftBob understøtter alle EU-sprog i produktoplevelsen.', array['faq_v2', 'sprog', 'eu'], 12),
('da', 'FAQ: Hvem passer ShiftBob til?', 'Hvem er ShiftBob lavet til?', 'ShiftBob er lavet til ledere der planlægger vagter, vil være trygge ved compliance og ønsker bedre kommunikation med deres teams.', array['faq_v2', 'målgruppe', 'ledere'], 13),
('da', 'FAQ: Opstartshastighed', 'Hvor hurtigt kan vi komme i gang?', 'De fleste teams kan komme hurtigt i gang ved at vælge en plan og bruge deres eksisterende planlægningsdata med det samme.', array['faq_v2', 'onboarding', 'opstart'], 14)
on conflict do nothing;
