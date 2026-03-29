-- =====================================================================
-- ShiftBob: Fuld SQL til oversættelser (schema + al seed)
-- Kør hele filen i Supabase SQL Editor mod det rigtige projekt.
-- Idempotent: gentagen kørsel er sikker (ON CONFLICT / CREATE IF NOT EXISTS).
-- Kilde: supabase_i18n_setup.sql + supabase_seed_ui_translations_app.sql
-- supabase_seed_ui_translations_compliance.sql er IKKE nødvendig (overlap med app-seeden).
-- =====================================================================

-- >>> DEL 1: supabase_i18n_setup.sql
-- =====================================================================

-- ShiftBob: Sprog, EU-lande og UI-oversættelser
-- Kan køres før eller efter supabase_workplaces_setup.sql. Hvis workplace_members
-- ikke findes endnu, returnerer is_workplace_admin() false (ingen skriveadgang via RLS).

-- ---------------------------------------------------------------------------
-- Hjælpefunktion: bruger har ADMIN/SUPER_ADMIN i workplace_members ELLER global SUPER_ADMIN i user_roles
-- ---------------------------------------------------------------------------
create or replace function public.is_workplace_admin()
returns boolean
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if to_regclass('public.workplace_members') is not null then
    if exists (
      select 1
      from public.workplace_members wm
      where wm.user_id = auth.uid()
        and wm.role in ('ADMIN', 'SUPER_ADMIN')
    ) then
      return true;
    end if;
  end if;

  if to_regclass('public.user_roles') is not null then
    if exists (
      select 1
      from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.role = 'SUPER_ADMIN'
    ) then
      return true;
    end if;
  end if;

  return false;
end;
$$;

-- ---------------------------------------------------------------------------
-- languages
-- ---------------------------------------------------------------------------
create table if not exists public.languages (
  language_code varchar(35) primary key,
  name text not null,
  primary_language_code varchar(35) references public.languages (language_code) on delete set null
);

comment on table public.languages is 'Sprog med valgfri fallback til et "forældresprog" (fx de-AT → de).';

-- ---------------------------------------------------------------------------
-- eu_countries (country_code: ISO 3166-1 alpha-2)
-- ---------------------------------------------------------------------------
create table if not exists public.eu_countries (
  country_code varchar(2) primary key,
  name text not null,
  primary_language_code varchar(35) not null references public.languages (language_code) on delete restrict
);

comment on table public.eu_countries is 'EU-medlemslande med primært officielt sprog (én kode pr. land).';

-- ---------------------------------------------------------------------------
-- ui_translations
-- ---------------------------------------------------------------------------
create table if not exists public.ui_translations (
  id uuid primary key default gen_random_uuid(),
  translation_key text not null,
  language_code varchar(35) not null references public.languages (language_code) on delete cascade,
  text_value text not null,
  context_description text not null,
  constraint ui_translations_key_lang_unique unique (translation_key, language_code)
);

create index if not exists ui_translations_language_code_idx
  on public.ui_translations (language_code);

comment on table public.ui_translations is 'UI-strenge pr. sprog; translation_key er stabil app-nøgle.';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.languages enable row level security;
alter table public.eu_countries enable row level security;
alter table public.ui_translations enable row level security;

drop policy if exists "languages_select_authenticated" on public.languages;
drop policy if exists "languages_write_admin" on public.languages;

create policy "languages_select_authenticated"
  on public.languages
  for select
  to authenticated
  using (true);

create policy "languages_write_admin"
  on public.languages
  for all
  to authenticated
  using (public.is_workplace_admin())
  with check (public.is_workplace_admin());

drop policy if exists "eu_countries_select_authenticated" on public.eu_countries;
drop policy if exists "eu_countries_write_admin" on public.eu_countries;

create policy "eu_countries_select_authenticated"
  on public.eu_countries
  for select
  to authenticated
  using (true);

create policy "eu_countries_write_admin"
  on public.eu_countries
  for all
  to authenticated
  using (public.is_workplace_admin())
  with check (public.is_workplace_admin());

drop policy if exists "ui_translations_select_authenticated" on public.ui_translations;
drop policy if exists "ui_translations_write_admin" on public.ui_translations;

create policy "ui_translations_select_authenticated"
  on public.ui_translations
  for select
  to authenticated
  using (true);

create policy "ui_translations_write_admin"
  on public.ui_translations
  for all
  to authenticated
  using (public.is_workplace_admin())
  with check (public.is_workplace_admin());

grant select on table public.languages to authenticated;
grant select on table public.eu_countries to authenticated;
grant select on table public.ui_translations to authenticated;
grant insert, update, delete on table public.languages to authenticated;
grant insert, update, delete on table public.eu_countries to authenticated;
grant insert, update, delete on table public.ui_translations to authenticated;

-- ---------------------------------------------------------------------------
-- Data: sprog (en-US først som standardsprog; derefter øvrige primærsprog for EU-27)
-- ---------------------------------------------------------------------------
insert into public.languages (language_code, name, primary_language_code) values
  ('en-US', 'English (United States)', null),
  ('en-IE', 'English (Ireland)', 'en-US'),
  ('de', 'German', null),
  ('de-AT', 'German (Austria)', 'de'),
  ('nl', 'Dutch', null),
  ('nl-BE', 'Dutch (Belgium)', 'nl'),
  ('bg', 'Bulgarian', null),
  ('hr', 'Croatian', null),
  ('cs', 'Czech', null),
  ('da', 'Danish', null),
  ('et', 'Estonian', null),
  ('fi', 'Finnish', null),
  ('fr', 'French', null),
  ('el', 'Greek', null),
  ('hu', 'Hungarian', null),
  ('it', 'Italian', null),
  ('lv', 'Latvian', null),
  ('lt', 'Lithuanian', null),
  ('lb', 'Luxembourgish', null),
  ('mt', 'Maltese', null),
  ('pl', 'Polish', null),
  ('pt', 'Portuguese', null),
  ('ro', 'Romanian', null),
  ('sk', 'Slovak', null),
  ('sl', 'Slovenian', null),
  ('es', 'Spanish', null),
  ('sv', 'Swedish', null)
on conflict (language_code) do nothing;

-- ---------------------------------------------------------------------------
-- Data: EU-27 meddelemslande (2025) og primært officielt sprog
-- ---------------------------------------------------------------------------
insert into public.eu_countries (country_code, name, primary_language_code) values
  ('AT', 'Austria', 'de-AT'),
  ('BE', 'Belgium', 'nl-BE'),
  ('BG', 'Bulgaria', 'bg'),
  ('HR', 'Croatia', 'hr'),
  ('CY', 'Cyprus', 'el'),
  ('CZ', 'Czech Republic', 'cs'),
  ('DK', 'Denmark', 'da'),
  ('EE', 'Estonia', 'et'),
  ('FI', 'Finland', 'fi'),
  ('FR', 'France', 'fr'),
  ('DE', 'Germany', 'de'),
  ('GR', 'Greece', 'el'),
  ('HU', 'Hungary', 'hu'),
  ('IE', 'Ireland', 'en-IE'),
  ('IT', 'Italy', 'it'),
  ('LV', 'Latvia', 'lv'),
  ('LT', 'Lithuania', 'lt'),
  ('LU', 'Luxembourg', 'lb'),
  ('MT', 'Malta', 'mt'),
  ('NL', 'Netherlands', 'nl'),
  ('PL', 'Poland', 'pl'),
  ('PT', 'Portugal', 'pt'),
  ('RO', 'Romania', 'ro'),
  ('SK', 'Slovakia', 'sk'),
  ('SI', 'Slovenia', 'sl'),
  ('ES', 'Spain', 'es'),
  ('SE', 'Sweden', 'sv')
on conflict (country_code) do nothing;

-- ---------------------------------------------------------------------------
-- Data: UI-tekster (Login + Select Role) — language_code = en-US
-- ---------------------------------------------------------------------------
insert into public.ui_translations (translation_key, language_code, text_value, context_description) values
  ('login.logo.aria_label', 'en-US', 'ShiftBob', 'Accessible name for the decorative ShiftBob logo image on the login screen (aria-label / role=img).'),
  ('login.title', 'en-US', 'ShiftBob Login', 'Main heading (h2) at the top of the login page below the logo.'),
  ('login.subtitle', 'en-US', 'Use your email and password to continue.', 'Supporting paragraph under the login title explaining email/password sign-in.'),
  ('login.oauth.google', 'en-US', 'Continue with Google', 'Label on the primary OAuth button that starts Google sign-in.'),
  ('login.oauth.facebook', 'en-US', 'Continue with Facebook', 'Label on the OAuth button that starts Facebook sign-in.'),
  ('login.oauth.redirecting', 'en-US', 'Redirecting…', 'Loading label shown on Google and Facebook buttons while the OAuth redirect is in progress.'),
  ('login.divider.email', 'en-US', 'or with email', 'Small uppercase text in the horizontal divider between social login and the email form.'),
  ('login.email.label', 'en-US', 'Email', 'The visible label for the email input field on the main login form.'),
  ('login.email.placeholder', 'en-US', 'you@example.com', 'Placeholder text inside the email input suggesting an example address.'),
  ('login.password.label', 'en-US', 'Password', 'The visible label for the password input field on the login form.'),
  ('login.password.placeholder', 'en-US', '••••••••', 'Masked placeholder characters in the password field indicating hidden input.'),
  ('login.button.submit', 'en-US', 'Log in', 'Primary submit button text for the email/password login form when idle.'),
  ('login.button.submit.loading', 'en-US', 'Logging in…', 'Primary submit button text while the email/password sign-in request is in progress.'),
  ('login.button.signup', 'en-US', 'Create new account', 'Secondary button that triggers user registration with the entered email and password.'),
  ('login.button.signup.loading', 'en-US', 'Creating…', 'Secondary button text while the sign-up request is processing.'),
  ('login.link.home', 'en-US', 'Back to home', 'Footer link under the login card that navigates to the site home page.'),
  ('login.error.oauth_failed', 'en-US', 'Could not sign in with the selected account. Try again.', 'Error banner when returning from OAuth with ?error=auth or equivalent auth failure.'),
  ('login.error.no_workplace', 'en-US', 'You are not assigned to any workplace. Contact an administrator.', 'Error after successful password login when the user has no workplace memberships.'),
  ('login.error.no_roles', 'en-US', 'No roles for the selected workplace. Contact an administrator.', 'Error after login when the user has no roles for the resolved workplace.'),
  ('login.error.fetch', 'en-US', 'Could not load your workplaces or roles. Try again.', 'Error when fetching workplace or role data fails after password login.'),
  ('login.success.signup', 'en-US', 'Account created. Check your email if confirmation is required before you can sign in.', 'Success banner after sign-up when email confirmation may be needed.'),
  ('login.suspense.fallback', 'en-US', 'Loading…', 'Optional loading state for the login page shell while Suspense boundaries resolve (if shown to users).'),

  ('roles.loading', 'en-US', 'Loading your roles…', 'Loading message below the spinner on the select-role page while roles are fetched.'),
  ('roles.auth.required', 'en-US', 'You must be signed in.', 'Message when the select-role page loads without an authenticated session.'),
  ('roles.auth.login_link', 'en-US', 'Go to login', 'Link text that sends the user to the login page from the unauthenticated select-role state.'),
  ('roles.error.no_roles', 'en-US', 'No roles for this workplace. Contact an administrator.', 'Error message in the red alert when the user has zero roles for the active workplace.'),
  ('roles.error.no_roles.select_workplace', 'en-US', 'Choose workplace', 'Button/link label to navigate to workplace selection from the no-roles error state.'),
  ('roles.error.fetch', 'en-US', 'Could not load roles. Try again later.', 'Message when fetching roles from the server fails.'),
  ('roles.retry', 'en-US', 'Try again', 'Button label to refresh or retry after a fetch error on the select-role page.'),
  ('roles.title', 'en-US', 'Choose active role', 'Main heading (h1) on the select-role page when multiple roles are available.'),
  ('roles.subtitle', 'en-US', 'You have multiple roles at this workplace. Choose which one you want to work as now.', 'Subtitle explaining why the user must pick a role.'),
  ('roles.card.cta', 'en-US', 'Choose this role →', 'Call-to-action line at the bottom of each role selection card.'),
  ('roles.sign_out', 'en-US', 'Log out', 'Text for the sign-out control at the bottom of the select-role page.'),

  ('roles.role.super_admin.badge', 'en-US', 'SUPER ADMIN', 'Uppercase badge line on a role card for the SUPER_ADMIN role (derived from the role id with spaces).'),
  ('roles.role.admin.badge', 'en-US', 'ADMIN', 'Uppercase badge line on a role card for the ADMIN role.'),
  ('roles.role.manager.badge', 'en-US', 'MANAGER', 'Uppercase badge line on a role card for the MANAGER role.'),
  ('roles.role.employee.badge', 'en-US', 'EMPLOYEE', 'Uppercase badge line on a role card for the EMPLOYEE role.'),

  ('roles.role.super_admin.title', 'en-US', 'Super admin', 'Short title for the SUPER_ADMIN role on the role selection card.'),
  ('roles.role.super_admin.description', 'en-US', 'Full access to the system and configuration.', 'Description body for the SUPER_ADMIN role on the role selection card.'),
  ('roles.role.admin.title', 'en-US', 'Administrator', 'Short title for the ADMIN role on the role selection card.'),
  ('roles.role.admin.description', 'en-US', 'Manage users and high-level settings.', 'Description body for the ADMIN role on the role selection card.'),
  ('roles.role.manager.title', 'en-US', 'Manager', 'Short title for the MANAGER role on the role selection card.'),
  ('roles.role.manager.description', 'en-US', 'Lead schedules and teams.', 'Description body for the MANAGER role on the role selection card.'),
  ('roles.role.employee.title', 'en-US', 'Employee', 'Short title for the EMPLOYEE role on the role selection card.'),
  ('roles.role.employee.description', 'en-US', 'Standard access to your own shifts and tasks.', 'Description body for the EMPLOYEE role on the role selection card.')
on conflict (translation_key, language_code) do nothing;


-- =====================================================================
-- >>> DEL 2: supabase_seed_ui_translations_app.sql
-- =====================================================================

-- Udvider ui_translations med app-strenge (admin, dashboard, upload, fremtiden m.m.).
-- Kør i Supabase SQL Editor efter supabase_i18n_setup.sql.
-- Idempotent: opdaterer tekst ved gentagen kørsel.
--
-- Fejlfinding: ERROR 42601 "syntax error at end of input" (ofte LINE 0):
--   • Kopiér HELE filen fra "insert" til og med "context_description = excluded.context_description;"
--     — en afkortet paste (uden sidste værdi-rækker eller uden "on conflict ... do update ...;")
--     giver netop "unexpected end of input".
--   • Brug "Run" med hele editoren fyldt, eller marker eksplicit fra "insert" til afsluttende ";"

insert into public.ui_translations (translation_key, language_code, text_value, context_description) values

-- Shell / fælles
('common.brand_name', 'en-US', 'ShiftBob', 'Product name; logo alt text and metadata.'),
('common.brand_name', 'da', 'ShiftBob', 'Produktnavn; logo alt-tekst og metadata.'),
('common.menu.close_overlay', 'en-US', 'Close menu', 'Mobile overlay behind sidebar: closes menu.'),
('common.menu.close_overlay', 'da', 'Luk menu', 'Mobil overlay bag sidemenu.'),
('common.menu.hide_sidebar', 'en-US', 'Collapse menu', 'Sidebar control to hide the navigation.'),
('common.menu.hide_sidebar', 'da', 'Skjul menu', 'Knap der skjuler sidemenuen.'),
('common.menu.show_sidebar', 'en-US', 'Show menu', 'Floating button when sidebar is collapsed.'),
('common.menu.show_sidebar', 'da', 'Vis menu', 'Flydende knap når menuen er skjult.'),
('common.logout', 'en-US', 'Log out', 'Sign out button label.'),
('common.logout', 'da', 'Log ud', 'Log ud-knap.'),
('common.logout.loading', 'en-US', 'Signing out…', 'Sign-out button while request is in progress.'),
('common.logout.loading', 'da', 'Logger ud…', 'Log ud-knap under anmodning.'),

-- Administrator dashboard menu
('admin.nav.calendar', 'en-US', 'Calendar', 'Admin sidebar: main calendar.'),
('admin.nav.calendar', 'da', 'Kalender', 'Admin-menu: kalender.'),
('admin.nav.future', 'en-US', 'Future', 'Admin sidebar: unreleased planning horizon.'),
('admin.nav.future', 'da', 'Fremtiden', 'Admin-menu: fremtidsplanlægning.'),
('admin.nav.notifications', 'en-US', 'Notifications', 'Admin sidebar.'),
('admin.nav.notifications', 'da', 'Notifikationer', 'Admin-menu.'),
('admin.nav.rules', 'en-US', 'Rules', 'Admin sidebar: collective agreement / rules.'),
('admin.nav.rules', 'da', 'Regler', 'Admin-menu.'),
('admin.nav.data_export', 'en-US', 'Data export', 'Admin sidebar.'),
('admin.nav.data_export', 'da', 'Data eksport', 'Admin-menu.'),
('admin.nav.compliance', 'en-US', 'Compliance', 'Admin sidebar navigation label (AdminWorkspaceShell → /dashboard/compliance). Short noun; legal/regulatory documentation area (GDPR, EU AI Act, tenant-specific notes). Not a certification or guarantee of compliance.'),
('admin.nav.compliance', 'da', 'Compliance', 'Admin-menu: link til /dashboard/compliance. Kort navn; lov-/GDPR-/AI-orienteret dokumentation — ikke en erklæring om at krav er opfyldt.'),
('admin.nav.settings', 'en-US', 'Settings', 'Admin sidebar.'),
('admin.nav.settings', 'da', 'Indstillinger', 'Admin-menu.'),
('admin.sidebar.administrator', 'en-US', 'Administrator', 'Small label under logo in admin shell.'),
('admin.sidebar.administrator', 'da', 'Administrator', 'Label under logo.'),
('admin.sidebar.switch_workplace', 'en-US', 'Switch workplace', 'Title and aria on building icon to change workplace.'),
('admin.sidebar.switch_workplace', 'da', 'Skift arbejdsplads', 'Titel/aria ved arbejdsplads-ikon.'),

-- Super Admin menu
('super_admin.badge', 'en-US', 'Super Admin', 'Uppercase label under logo in super-admin shell.'),
('super_admin.badge', 'da', 'Super Admin', 'Label under logo.'),
('super_admin.nav.overview', 'en-US', 'Overview', 'Super-admin sidebar link to /super-admin.'),
('super_admin.nav.overview', 'da', 'Oversigt', 'Super-admin menu.'),
('super_admin.nav.users_workplaces', 'en-US', 'Users & workplaces', 'Super-admin sidebar.'),
('super_admin.nav.users_workplaces', 'da', 'Brugere & arbejdspladser', 'Super-admin menu.'),
('super_admin.nav.templates', 'en-US', 'Standard shift and employee types', 'Super-admin sidebar.'),
('super_admin.nav.templates', 'da', 'Standard vagt- og medarbejdertyper', 'Super-admin menu.'),
('super_admin.nav.holidays', 'en-US', 'Public holidays', 'Super-admin sidebar: EU country holidays.'),
('super_admin.nav.holidays', 'da', 'Helligdage', 'Super-admin menu.'),
('super_admin.nav.languages', 'en-US', 'Languages & translations', 'Super-admin sidebar.'),
('super_admin.nav.languages', 'da', 'Sprog & oversættelser', 'Super-admin menu.'),
('super_admin.holidays.title', 'en-US', 'Public holidays (EU-27)', 'Super-admin holidays page h1.'),
('super_admin.holidays.title', 'da', 'Helligdage (EU-27)', 'Overskrift.'),
('super_admin.holidays.intro', 'en-US', 'Public holidays per country. Names and date rules can be edited here. Easter-related rows use Western Easter (may differ for Orthodox calendars — adjust manually).', 'Intro paragraph.'),
('super_admin.holidays.intro', 'da', 'Offentlige helligdage pr. land. Navne og dato-regler kan rettes her. Påske-relaterede rækker bruger vestlig påske (kan afvige for ortodoks kalender — ret manuelt).', 'Intro.'),
('super_admin.holidays.country_label', 'en-US', 'Country', 'Label for country select.'),
('super_admin.holidays.country_label', 'da', 'Land', 'Label.'),
('super_admin.holidays.loading', 'en-US', 'Loading…', 'Loading state.'),
('super_admin.holidays.loading', 'da', 'Henter…', 'Loader.'),
('super_admin.holidays.col_stable', 'en-US', 'Code', 'Table column: stable_code.'),
('super_admin.holidays.col_stable', 'da', 'Kode', 'Kolonne.'),
('super_admin.holidays.col_name', 'en-US', 'Name', 'Table column.'),
('super_admin.holidays.col_name', 'da', 'Navn', 'Kolonne.'),
('super_admin.holidays.col_rule', 'en-US', 'Rule', 'Table column.'),
('super_admin.holidays.col_rule', 'da', 'Regel', 'Kolonne.'),
('super_admin.holidays.col_date', 'en-US', 'Date / offset', 'Table column.'),
('super_admin.holidays.col_date', 'da', 'Dato / offset', 'Kolonne.'),
('super_admin.holidays.col_sort', 'en-US', 'Sort', 'Table column sort_order.'),
('super_admin.holidays.col_sort', 'da', 'Sort', 'Kolonne.'),
('super_admin.holidays.col_actions', 'en-US', 'Actions', 'Table header.'),
('super_admin.holidays.col_actions', 'da', '', 'Tom — ikoner.'),
('super_admin.holidays.save', 'en-US', 'Save', 'Button.'),
('super_admin.holidays.save', 'da', 'Gem', 'Knap.'),
('super_admin.holidays.delete', 'en-US', 'Delete', 'Aria delete.'),
('super_admin.holidays.delete', 'da', 'Slet', 'Aria.'),
('super_admin.holidays.rule_fixed', 'en-US', 'Fixed date', 'Holiday rule option.'),
('super_admin.holidays.rule_fixed', 'da', 'Fast dato', 'Regel.'),
('super_admin.holidays.rule_easter', 'en-US', 'Easter offset', 'Holiday rule option.'),
('super_admin.holidays.rule_easter', 'da', 'Påske-offset', 'Regel.'),
('super_admin.holidays.offset_hint', 'en-US', 'Days from Easter Sunday (e.g. -2, 1, 39)', 'Input title.'),
('super_admin.holidays.offset_hint', 'da', 'Dage fra påskesøndag (fx -2, 1, 39)', 'Titel.'),
('super_admin.holidays.add_section', 'en-US', 'Add holiday', 'Section title.'),
('super_admin.holidays.add_section', 'da', 'Tilføj helligdag', 'Sektion.'),
('super_admin.holidays.new_stable', 'en-US', 'Stable code (optional)', 'Form label.'),
('super_admin.holidays.new_stable', 'da', 'Stabil kode (valgfri)', 'Label.'),
('super_admin.holidays.new_name', 'en-US', 'Name', 'Form label.'),
('super_admin.holidays.new_name', 'da', 'Navn', 'Label.'),
('super_admin.holidays.add', 'en-US', 'Add', 'Submit button.'),
('super_admin.holidays.add', 'da', 'Tilføj', 'Knap.'),
('super_admin.holidays.confirm_delete', 'en-US', 'Delete this holiday?', 'confirm() dialog.'),
('super_admin.holidays.confirm_delete', 'da', 'Slet denne helligdag?', 'Bekræft.'),
('super_admin.holidays.no_countries', 'en-US', 'No EU countries in the database — run supabase_i18n_setup.sql first.', 'Empty state.'),
('super_admin.holidays.no_countries', 'da', 'Ingen EU-lande i databasen — kør supabase_i18n_setup.sql først.', 'Tom tilstand.'),

-- Layout theme picker
('layout.theme.group_aria', 'en-US', 'Page layout', 'aria-label on theme button group.'),
('layout.theme.group_aria', 'da', 'Side-layout', 'aria-label på temavælger.'),
('layout.theme.dark', 'en-US', 'Dark layout', 'Theme name: dark mode.'),
('layout.theme.dark', 'da', 'Mørkt layout', 'Tema.'),
('layout.theme.light', 'en-US', 'Light layout', 'Theme name: light mode.'),
('layout.theme.light', 'da', 'Lyst layout', 'Tema.'),
('layout.theme.unicorn', 'en-US', 'Unicorn layout', 'Theme name: colorful.'),
('layout.theme.unicorn', 'da', 'Unicorn-layout', 'Tema.'),

-- Upload panel
('upload.dropzone.cta', 'en-US', 'Drag a file here or click to choose', 'File drop zone helper text.'),
('upload.dropzone.cta', 'da', 'Træk fil hertil eller klik for at vælge', 'Filzone.'),
('upload.selected_prefix', 'en-US', 'Selected:', 'Prefix before chosen file name.'),
('upload.selected_prefix', 'da', 'Valgt:', 'Præfiks før filnavn.'),
('upload.beta_notice', 'en-US', 'Upload and AI processing are in development — the file is not stored on the server yet. Soon you can save documents and run translation to rules and export templates from here.', 'Amber info box on upload panels.'),
('upload.beta_notice', 'da', 'Upload og AI-behandling er under udvikling — filen gemmes endnu ikke på serveren. Snart kan du gemme dokumenter og køre oversættelse til regler og eksport-skabeloner herfra.', 'Amber boks.'),

-- Rules page
('rules.page.title', 'en-US', 'Rules', 'Dashboard /rules heading.'),
('rules.page.title', 'da', 'Regler', 'Overskrift.'),
('rules.page.intro', 'en-US', 'Upload your local collective agreement or other relevant rule sets. ShiftBob translates the document into mathematical formulas and rules that control the calendar (e.g. rest periods, max hours) and trigger warnings in notifications when violated.', 'Intro paragraph.'),
('rules.page.intro', 'da', 'Upload den lokale overenskomst eller andre relevante regelsæt. ShiftBob oversætter dokumentet til matematiske formler og regler, der styrer kalenderen (fx hviletid, maks. timer) og udløser advarsler i notifikationer ved overtrædelser.', 'Brødtekst.'),
('rules.page.bullet1', 'en-US', 'Automatic checks of planned shifts against the agreement', 'Bullet list.'),
('rules.page.bullet1', 'da', 'Automatisk kontrol af planlagte vagter mod overenskomsten', 'Punkt.'),
('rules.page.bullet2', 'en-US', 'Alerts to administrators about potential breaches', 'Bullet list.'),
('rules.page.bullet2', 'da', 'Varsler til administratorer ved potentielle brud', 'Punkt.'),
('rules.page.bullet3', 'en-US', 'Basis for future schedule optimisations', 'Bullet list.'),
('rules.page.bullet3', 'da', 'Grundlag for fremtidige optimeringer af vagtplaner', 'Punkt.'),
('rules.upload.label', 'en-US', 'Collective agreement or PDF/Word', 'Upload zone primary label.'),
('rules.upload.label', 'da', 'Overenskomst eller PDF/Word', 'Upload-label.'),
('rules.upload.hint', 'en-US', 'PDF or Word recommended. You can upload multiple versions in steps when the feature is active.', 'Upload hint.'),
('rules.upload.hint', 'da', 'PDF eller Word anbefales. Du kan uploade flere versioner i trin, når funktionen er aktiv.', 'Hjælpetekst.'),

-- Data export page
('data_export.page.title', 'en-US', 'Data export', 'Heading.'),
('data_export.page.title', 'da', 'Data eksport', 'Overskrift.'),
('data_export.page.intro', 'en-US', 'Use AI to structure data as CSV and to build export templates for payroll, BI and other analytics systems. Upload documentation from the payroll system (field descriptions, file formats) so we can map your data correctly.', 'Intro.'),
('data_export.page.intro', 'da', 'Brug AI til at strukturere data som CSV og til at lave eksport-skabeloner til lønsystemer, BI-værktøjer og andre analysesystemer. Upload dokumentation fra lønsystemet (feltbeskrivelser, filformater), så vi kan mappe jeres data korrekt.', 'Brødtekst.'),
('data_export.page.bullet1', 'en-US', 'CSV with columns tailored to your payroll or export needs', 'Bullet.'),
('data_export.page.bullet1', 'da', 'CSV med kolonner tilpasset jeres løn- eller eksportkrav', 'Punkt.'),
('data_export.page.bullet2', 'en-US', 'Saved templates per workplace or integration', 'Bullet.'),
('data_export.page.bullet2', 'da', 'Gemte skabeloner pr. arbejdsplads eller integration', 'Punkt.'),
('data_export.page.bullet3', 'en-US', 'Structuring documentation from third-party systems', 'Bullet.'),
('data_export.page.bullet3', 'da', 'Strukturering af dokumentation fra tredjepartsystemer', 'Punkt.'),
('data_export.section.csv_title', 'en-US', 'Export shift and employee data (CSV)', 'Section heading.'),
('data_export.section.csv_title', 'da', 'Eksporter vagt- og medarbejderdata (CSV)', 'Sektion.'),
('data_export.upload.csv_label', 'en-US', 'CSV or template file', 'Upload label.'),
('data_export.upload.csv_label', 'da', 'CSV eller skabelonfil', 'Upload-label.'),
('data_export.upload.csv_hint', 'en-US', 'When the feature is active, CSV is generated here or downloaded after AI structuring.', 'Hint.'),
('data_export.upload.csv_hint', 'da', 'Når funktionen er aktiv, genereres CSV her eller downloades efter AI-strukturering.', 'Hjælp.'),
('data_export.section.docs_title', 'en-US', 'Documentation from payroll / external system', 'Section heading.'),
('data_export.section.docs_title', 'da', 'Dokumentation fra lønsystem / eksternt system', 'Sektion.'),
('data_export.upload.docs_label', 'en-US', 'PDF, Word, CSV or plain text', 'Upload label.'),
('data_export.upload.docs_label', 'da', 'PDF, Word, CSV eller tekst', 'Upload-label.'),
('data_export.upload.docs_hint', 'en-US', 'Used to learn field names and formats so export matches your system.', 'Hint.'),
('data_export.upload.docs_hint', 'da', 'Bruges til at lære feltnavne og formater, så eksporten matcher jeres system.', 'Hjælp.'),
('data_export.beta_notice', 'en-US', 'Upload and AI processing are in development — files are not stored on the server yet. Soon you can save templates and generate CSV for payroll and analytics here.', 'Bottom notice on data export page.'),
('data_export.beta_notice', 'da', 'Upload og AI-behandling er under udvikling — filer gemmes endnu ikke på serveren. Snart kan du gemme skabeloner og generere CSV til løn og analyse herfra.', 'Bundbesked.'),

-- Notifications page
('notifications.page.title', 'en-US', 'Notifications', 'Heading.'),
('notifications.page.title', 'da', 'Notifikationer', 'Overskrift.'),
('notifications.page.intro', 'en-US', 'Your notifications will appear here when connected.', 'Placeholder text.'),
('notifications.page.intro', 'da', 'Her vises dine notifikationer, når de er tilkoblet.', 'Pladsholder.'),

-- Settings: calendar & future section
('settings.calendar_future.title', 'en-US', 'Calendar & future', 'Workplace settings section heading.'),
('settings.calendar_future.title', 'da', 'Kalender & fremtid', 'Indstillinger sektion.'),
('settings.calendar_future.intro_prefix', 'en-US', 'Set how many weeks of the unreleased calendar you see under', 'Paragraph before Future link in workplace settings.'),
('settings.calendar_future.intro_prefix', 'da', 'Angiv hvor mange uger af den ikke-frigivne kalender du vil se under', 'Brødtekst før link.'),
('settings.calendar_future.intro_suffix', 'en-US', '. The default is 8 weeks.', 'After Future link.'),
('settings.calendar_future.intro_suffix', 'da', '. Standard er 8 uger.', 'Efter link.'),
('settings.calendar_future.weeks_label', 'en-US', 'Weeks ahead (planning window)', 'Number input label.'),
('settings.calendar_future.weeks_label', 'da', 'Uger frem (planlægningsvindue)', 'Felt-label.'),

-- Weekdays (Monday = 0 … Sunday = 6), labels for season grid
('calendar.weekday.0', 'en-US', 'Monday', 'Weekday column; planning grid.'),
('calendar.weekday.0', 'da', 'Mandag', 'Ugedag.'),
('calendar.weekday.1', 'en-US', 'Tuesday', 'Weekday.'),
('calendar.weekday.1', 'da', 'Tirsdag', 'Ugedag.'),
('calendar.weekday.2', 'en-US', 'Wednesday', 'Weekday.'),
('calendar.weekday.2', 'da', 'Onsdag', 'Ugedag.'),
('calendar.weekday.3', 'en-US', 'Thursday', 'Weekday.'),
('calendar.weekday.3', 'da', 'Torsdag', 'Ugedag.'),
('calendar.weekday.4', 'en-US', 'Friday', 'Weekday.'),
('calendar.weekday.4', 'da', 'Fredag', 'Ugedag.'),
('calendar.weekday.5', 'en-US', 'Saturday', 'Weekday.'),
('calendar.weekday.5', 'da', 'Lørdag', 'Ugedag.'),
('calendar.weekday.6', 'en-US', 'Sunday', 'Weekday.'),
('calendar.weekday.6', 'da', 'Søndag', 'Ugedag.'),

-- Future planning page (Fremtiden)
('future.page.title', 'en-US', 'Future', 'Page h1.'),
('future.page.title', 'da', 'Fremtiden', 'Side.'),
('future.page.intro', 'en-US', 'Here you see the part of the calendar not yet released to employees. When you are ready, release weeks and send a message to everyone (push when integration is ready).', 'Intro.'),
('future.page.intro', 'da', 'Her ser du den del af kalenderen som endnu ikke er frigivet til medarbejdere. Når du er tilfreds, kan du frigive uger og sende en besked til alle (push, når integration er klar).', 'Intro.'),
('future.page.settings_before_link', 'en-US', 'The number of weeks in the window is set under', 'Text before Settings link.'),
('future.page.settings_before_link', 'da', 'Antal uger i vinduet styres under', 'Tekst før Indstillinger-link.'),
('future.page.settings_after_link', 'en-US', '(default 8 weeks).', 'Text after Settings link.'),
('future.page.settings_after_link', 'da', '(standard 8 uger).', 'Tekst efter link.'),
('future.status.title', 'en-US', 'Status', 'Section h2.'),
('future.status.title', 'da', 'Status', 'Sektion.'),
('future.status.released_until', 'en-US', 'Released through', 'DL term.'),
('future.status.released_until', 'da', 'Frigivet til og med', 'DL.'),
('future.status.none_released', 'en-US', '— (nothing released yet)', 'When calendar_released_until is null.'),
('future.status.none_released', 'da', '— (intet frigivet endnu)', 'Placeholder.'),
('future.status.window', 'en-US', 'Planning window (unreleased)', 'DL term.'),
('future.status.window', 'da', 'Planlægningsvindue (ufrigivet)', 'DL.'),
('future.status.shifts', 'en-US', 'Shifts in window', 'DL term.'),
('future.status.shifts', 'da', 'Vagter i vinduet', 'DL.'),
('future.status.company', 'en-US', 'Company', 'DL term.'),
('future.status.company', 'da', 'Virksomhed', 'DL.'),
('future.ai.title', 'en-US', 'Generate plan (AI)', 'Section heading.'),
('future.ai.title', 'da', 'Generer plan (AI)', 'Sektion.'),
('future.ai.intro', 'en-US', 'Runs a quick analysis of double bookings and your season template for the selected number of weeks from the first unreleased day.', 'Help text.'),
('future.ai.intro', 'da', 'Kører en hurtig analyse af dobbeltbookinger og din sæson-skabelon for det valgte antal uger fra første ufrigivne dag.', 'Hjælp.'),
('future.ai.weeks_label', 'en-US', 'Number of weeks', 'Form label.'),
('future.ai.weeks_label', 'da', 'Antal uger', 'Label.'),
('future.ai.run', 'en-US', 'Run analysis', 'Button.'),
('future.ai.run', 'da', 'Kør analyse', 'Knap.'),
('future.ai.shifts_now', 'en-US', 'Shifts in unreleased window now:', 'Small status line before count.'),
('future.ai.shifts_now', 'da', 'Vagter i ufrigivet vindue nu:', 'Status.'),
('future.season.title', 'en-US', 'Season template', 'Section heading.'),
('future.season.title', 'da', 'Sæson-skabelon', 'Sektion.'),
('future.season.intro', 'en-US', 'Define periods with date ranges and requirements per weekday: minimum shifts, distribution across employee and shift types.', 'Intro.'),
('future.season.intro', 'da', 'Definér perioder med dato-interval og krav pr. ugedag: mindst antal vagter, fordeling på medarbejder- og vagttyper.', 'Intro.'),
('future.season.empty_periods', 'en-US', 'No periods yet.', 'Empty state.'),
('future.season.empty_periods', 'da', 'Ingen perioder endnu.', 'Tom tilstand.'),
('future.season.name', 'en-US', 'Name', 'Form label.'),
('future.season.name', 'da', 'Navn', 'Label.'),
('future.season.from', 'en-US', 'From', 'Date label.'),
('future.season.from', 'da', 'Fra', 'Label.'),
('future.season.to', 'en-US', 'To', 'Date label.'),
('future.season.to', 'da', 'Til', 'Label.'),
('future.season.remove_period', 'en-US', 'Remove period', 'Button.'),
('future.season.remove_period', 'da', 'Fjern periode', 'Knap.'),
('future.season.weekday_col', 'en-US', 'Weekday', 'Table header.'),
('future.season.weekday_col', 'da', 'Ugedag', 'Tabel.'),
('future.season.min_shifts', 'en-US', 'Min. shifts', 'Table header.'),
('future.season.min_shifts', 'da', 'Min. vagter', 'Tabel.'),
('future.season.shift_prefix', 'en-US', 'S:', 'Prefix before shift type name in column header (short for Shift).'),
('future.season.shift_prefix', 'da', 'V:', 'Præfiks før vagttype-kolonne.'),
('future.season.add_period', 'en-US', '+ Add period', 'Button.'),
('future.season.add_period', 'da', '+ Tilføj periode', 'Knap.'),
('future.season.save', 'en-US', 'Save template', 'Button.'),
('future.season.save', 'da', 'Gem skabelon', 'Knap.'),
('future.season.save_success', 'en-US', 'Season template saved.', 'Toast after successful save.'),
('future.season.save_success', 'da', 'Sæson-skabelon gemt.', 'Besked efter gem.'),
('future.release.success_detail', 'en-US', 'Calendar released through {date}. Push: «{message}» (real push integration coming later — message logged on the server).', 'After release; replace {date} and {message}.'),
('future.release.success_detail', 'da', 'Kalender frigivet til og med {date}. Push: «{message}» (integration af rigtig push kommer senere — beskeden er logget på serveren).', 'Efter frigivelse.'),
('future.season.period_new', 'en-US', 'New period', 'Default name when adding a period.'),
('future.season.period_new', 'da', 'Ny periode', 'Standardperiode-navn.'),
('future.release.title', 'en-US', 'Release calendar', 'Section heading.'),
('future.release.title', 'da', 'Frigiv kalender', 'Sektion.'),
('future.release.intro', 'en-US', 'Move the release date forward by the selected number of weeks (from the first unreleased day). All members receive the message: «We have just released X more weeks to the calendar. Best regards, {company}»', 'Note: {company} is replaced in code with workplace name.'),
('future.release.intro', 'da', 'Flyt frigivelsesdatoen frem med det valgte antal uger (fra første ufrigivne dag). Alle medlemmer får beskeden: «Vi har netop frigivet X uger mere til kalenderen. Mvh. {company}»', 'Pladsholder {company}.'),
('future.release.weeks_label', 'en-US', 'Weeks to release', 'Form label.'),
('future.release.weeks_label', 'da', 'Uger at frigive', 'Label.'),
('future.release.cta', 'en-US', 'Release and send message', 'Primary button.'),
('future.release.cta', 'da', 'Frigiv og send besked', 'Knap.'),
('future.release.confirm', 'en-US', 'Release {weeks} week(s) to all employees? They can only see shifts after the previous release date.', 'Confirm dialog; {weeks} replaced in code.'),
('future.release.confirm', 'da', 'Frigiv {weeks} uge(r) til alle medarbejdere? De kan først se vagter efter den hidtidige frigivelsesdato.', 'Bekræftelse.'),

-- Compliance (lovpligtig / rullende dokumentation). Kildesprog i /super-admin/translations er en-US — kør seed hvis nøgler mangler.
('compliance.page.title', 'en-US', 'Compliance', 'Page title (h1) on /dashboard/compliance (admin area). Should align with sidebar label admin.nav.compliance.'),
('compliance.page.title', 'da', 'Compliance', 'Overskrift på compliance-siden; samme begreb som admin-menuen.'),
('compliance.page.intro', 'en-US', 'This area provides rolling, legally oriented documentation for ShiftBob: transparency about how the system works, references to AI and data-protection requirements, and a section for your organisation’s use of the product. Content will be updated as legislation and product features evolve.', 'Lead paragraph under h1 on /dashboard/compliance. Neutral, informational tone (not legal advice). Mentions ShiftBob as product name; describes rolling updates and tenant-specific section.'),
('compliance.page.intro', 'da', 'Her finder du løbende, lovmæssigt orienteret dokumentation for ShiftBob: transparens om systemets virkemåde, henvisning til krav om kunstig intelligens og databeskyttelse samt et afsnit om jeres konkrete brug. Indholdet opdateres, efterhånden som lovgivning og produktet udvikler sig.', 'Indledning; produktnavn ShiftBob bevares.'),
('compliance.section.system_title', 'en-US', 'System overview & transparency', 'First main section heading (h2) on /dashboard/compliance: high-level description of the system and transparency.'),
('compliance.section.system_title', 'da', 'Overordnet system og transparens', 'Sektionsoverskrift (h2).'),
('compliance.section.system_body', 'en-US', 'ShiftBob is a workplace scheduling application. Data is processed to provide calendars, roles, notifications and (where enabled) AI-assisted features such as plan suggestions or text generation. Processing is limited to what is needed for these purposes. Technical and organisational measures follow the design of the underlying platform (e.g. Supabase: authentication, row-level security, encryption in transit). This description is high-level; detailed data-flow diagrams and subprocessors can be listed here as the documentation matures.', 'Body under system section. Keep ShiftBob and Supabase as proper nouns. RLS = row-level security; explain or expand in target language if needed. Not legal advice.'),
('compliance.section.system_body', 'da', 'ShiftBob er en arbejdsplads-app til vagtplanlægning. Data behandles for at levere kalendere, roller, notifikationer og (hvor det er slået til) AI-understøttede funktioner såsom planforslag eller tekstgenerering. Behandlingen er begrænset til det, der er nødvendigt for disse formål. Tekniske og organisatoriske foranstaltninger følger den underliggende platforms udformning (fx Supabase: login, række-sikkerhed, kryptering under transport). Beskrivelsen er overordnet; detaljerede dataflows og underdatabehandlere kan uddybes her, efterhånden som dokumentationen modnes.', 'Brødtekst; produkt- og platformnavne bevares.'),
('compliance.section.ai_title', 'en-US', 'Artificial intelligence (EU AI Act)', 'Section heading (h2): AI use and EU Artificial Intelligence Act framing.'),
('compliance.section.ai_title', 'da', 'Kunstig intelligens (EU’s AI-forordning)', 'Sektionsoverskrift (h2).'),
('compliance.section.ai_body', 'en-US', 'Where ShiftBob uses AI (e.g. schedule explanations, import helpers, or future planning tools), outputs support human decisions and should be verified by responsible staff. High-risk automated decisions without human oversight are not the intended use. As EU AI Act obligations are clarified for your sector and deployment, this section will summarise the role of AI in the product, logging where applicable, and how to exercise rights or contest outcomes. Update this page after legal review.', 'Body: human oversight, not standalone high-risk automation; obligations may evolve; recommend legal review. Formal compliance-oriented tone.'),
('compliance.section.ai_body', 'da', 'Når ShiftBob anvender AI (fx forklaringer af planer, import-hjælp eller fremtidige planlægningsværktøjer), er resultaterne et beslutningsgrundlag for mennesker og bør kontrolleres af ansvarlige medarbejdere. Fuldt automatiserede afgørelser uden menneskelig inddragelse er ikke den tilsigtede anvendelse. Efterhånden som forpligtelser under EU’s AI-forordning afklares for jeres sektor og drift, vil dette afsnit blive opdateret med produktets rolle, relevant logning og hvordan brugerne kan gøre indsigelse. Indhold bør juridisk kvalificeres.', 'Brødtekst; formel tone.'),
('compliance.section.gdpr_title', 'en-US', 'Personal data & GDPR', 'Section heading (h2): GDPR and personal data processing.'),
('compliance.section.gdpr_title', 'da', 'Persondata og GDPR', 'Sektionsoverskrift (h2).'),
('compliance.section.gdpr_body', 'en-US', 'ShiftBob processes personal data such as identity, contact, work role, schedule and preferences to deliver the service. The data controller for your organisation’s use is typically your employer or the entity named in the agreement; ShiftBob acts according to the agreed setup (often as processor when we provide the software). Lawful bases, retention, transfers, DPIA and records of processing should be documented in your organisation’s privacy materials and cross-referenced here. Data subjects’ rights (access, rectification, erasure, restriction, portability, objection) are supported through account and admin flows where technically possible.', 'Body: controller vs processor (typical pattern), DPIA, RoPA, data subject rights. EU GDPR framing; not legal advice; customer must document their own legal basis.'),
('compliance.section.gdpr_body', 'da', 'ShiftBob behandler personoplysninger såsom identitet, kontakt, arbejdsrolle, vagtplan og præferencer for at levere tjenesten. Dataansvarlig for jeres brug er typisk arbejdsgiveren eller den enhed, der fremgår af aftalen; ShiftBob agerer efter den aftalte rolle (ofte som databehandler). Lovlige grunde, opbevaring, overførsler, DPIA og behandlingsaktiviteter bør dokumenteres i jeres egen privatlivs-/compliance-materiale og kan refereres her. Registreredes rettigheder (indsigt, berigtigelse, sletning, begrænsning, dataportabilitet, indsigelse) understøttes gennem konto- og admin-flows, hvor det er teknisk muligt.', 'Brødtekst.'),
('compliance.section.tenant_title', 'en-US', 'Your organisation’s use', 'Section heading (h2): customer/tenant-specific compliance and usage.'),
('compliance.section.tenant_title', 'da', 'Jeres brug af systemet', 'Sektionsoverskrift (h2).'),
('compliance.section.tenant_body', 'en-US', 'Active workplace: {workplace}. This section will hold customer-specific compliance artefacts: configuration of AI features, data categories in use, retention choices, DPIA excerpts, and audit trails as they become available in the product. Until automated exports are linked here, document decisions internally and keep this page as the single entry point for regulators and DPO reviews.', 'Body; placeholder {workplace} is replaced in code with the active workplace display name — preserve {workplace} exactly in all translations.'),
('compliance.section.tenant_body', 'da', 'Aktiv arbejdsplads: {workplace}. Dette afsnit skal indeholde kundespecifik compliance: aktivering af AI-funktioner, hvilke datakategorier I bruger, opbevaringsvalg, uddrag af DPIA og revisionspor, efterhånden som det bliver tilgængeligt i produktet. Indtil automatiske udtræk kobles på, bør I dokumentere beslutninger internt og bruge denne side som fælles indgang for tilsyn og DPO-gennemgang.', 'Bevar pladsholderen {workplace} uændret.'),
('compliance.footer.rolling', 'en-US', 'Rolling compliance: this page is a living document. Last content review: not yet recorded — assign ownership in your organisation.', 'Footer on /dashboard/compliance: reminds that content is a living document; internal process note.'),
('compliance.footer.rolling', 'da', 'Rullende compliance: denne side er et levende dokument. Seneste indholdsgennemgang: ikke registreret — udpeg ansvarlig i organisationen.', 'Bundnote; meta om vedligeholdelse.'),

-- Workplace settings: bulk import employees (semicolon CSV)
('settings.members_import.title', 'en-US', 'Import employees', 'Heading in workplace settings import box.'),
('settings.members_import.title', 'da', 'Importér medarbejdere', 'Overskrift.'),
('settings.members_import.intro', 'en-US', 'Use the format below. New employees are created and receive an activation link; existing users are linked to the workplace.', 'Intro under import heading.'),
('settings.members_import.intro', 'da', 'Brug formatet nedenfor. Nye medarbejdere oprettes og får aktiveringslink; eksisterende brugere tilknyttes arbejdspladsen.', 'Intro.'),
('settings.members_import.format_title', 'en-US', 'Predefined format (semicolon-separated)', 'Label above format example.'),
('settings.members_import.format_title', 'da', 'Prædefineret format (semicolon-separeret)', 'Label.'),
('settings.members_import.header_example', 'en-US', 'first_name;last_name;email;mobile_phone;street_name;street_number;postal_code;city;country;employee_type;note', 'CSV header line shown as monospace example — keep keys in English.'),
('settings.members_import.header_example', 'da', 'first_name;last_name;email;mobile_phone;street_name;street_number;postal_code;city;country;employee_type;note', 'Header-linje (engelske feltnavne).'),
('settings.members_import.row_example', 'en-US', 'Anna;Jensen;anna@company.com;+4522334455;Main St;12;8000;Aarhus;DK;Cook;Afternoons only', 'Example data row.'),
('settings.members_import.row_example', 'da', 'Anna;Jensen;anna@firma.dk;+4522334455;Nørregade;12;8000;Aarhus;DK;Kok;Kan kun arbejde eftermiddag', 'Eksempelrække.'),
('settings.members_import.placeholder', 'en-US', 'Paste rows in the format above…', 'Textarea placeholder.'),
('settings.members_import.placeholder', 'da', 'Indsæt rækker i formatet ovenfor…', 'Pladsholder.'),
('settings.members_import.cta', 'en-US', 'Start import', 'Primary button.'),
('settings.members_import.cta', 'da', 'Start import', 'Knap.'),
('settings.members_import.done_msg', 'en-US', 'Import completed.', 'Toast after import run.'),
('settings.members_import.done_msg', 'da', 'Import gennemført.', 'Besked.'),
('settings.members_import.summary_new', 'en-US', 'New + invited', 'Import summary segment label.'),
('settings.members_import.summary_new', 'da', 'Nye+inviteret', 'Sammenfatning.'),
('settings.members_import.summary_linked', 'en-US', 'Linked existing', 'Import summary segment.'),
('settings.members_import.summary_linked', 'da', 'Tilknyttet eksisterende', 'Sammenfatning.'),
('settings.members_import.summary_member', 'en-US', 'Already member', 'Import summary segment.'),
('settings.members_import.summary_member', 'da', 'Allerede medlem', 'Sammenfatning.'),
('settings.members_import.summary_errors', 'en-US', 'Errors', 'Import summary segment.'),
('settings.members_import.summary_errors', 'da', 'Fejl', 'Sammenfatning.'),
('settings.members_import.col_line', 'en-US', 'Line', 'Import results table header.'),
('settings.members_import.col_line', 'da', 'Linje', 'Tabel.'),
('settings.members_import.col_email', 'en-US', 'Email', 'Import results table header.'),
('settings.members_import.col_email', 'da', 'E-mail', 'Tabel.'),
('settings.members_import.col_status', 'en-US', 'Status', 'Import results table header.'),
('settings.members_import.col_status', 'da', 'Status', 'Tabel.'),
('settings.members_import.col_message', 'en-US', 'Message', 'Import results table header.'),
('settings.members_import.col_message', 'da', 'Besked', 'Tabel.'),
('settings.members_import.col_link', 'en-US', 'Activation link', 'Import results table header.'),
('settings.members_import.col_link', 'da', 'Aktiveringslink', 'Tabel.'),
('settings.members_import.link_open', 'en-US', 'Open link', 'Link text in import results.'),
('settings.members_import.link_open', 'da', 'Åbn link', 'Linktekst.'),
('settings.members_import.status.created_invited', 'en-US', 'New (invited)', 'Import result row status.'),
('settings.members_import.status.created_invited', 'da', 'Ny (inviteret)', 'Status.'),
('settings.members_import.status.added_existing', 'en-US', 'Linked existing user', 'Import result.'),
('settings.members_import.status.added_existing', 'da', 'Tilknyttet eksisterende bruger', 'Status.'),
('settings.members_import.status.already_member', 'en-US', 'Already a member', 'Import result.'),
('settings.members_import.status.already_member', 'da', 'Allerede medlem', 'Status.'),
('settings.members_import.status.error', 'en-US', 'Error', 'Import result.'),
('settings.members_import.status.error', 'da', 'Fejl', 'Status.'),

-- Admin calendar: toolbar, month summary, drag overlay (hold synk med supabase_seed_ui_translations_app.sql)
('calendar.page.title', 'en-US', 'Calendar', 'Main h1 on workplace shift calendar.'),
('calendar.page.title', 'da', 'Kalender', 'Overskrift.'),
('calendar.time_now_label', 'en-US', 'Time now:', 'Prefix before live clock.'),
('calendar.time_now_label', 'da', 'Tid nu:', 'Præfiks før ur.'),
('calendar.view.rolling', 'en-US', 'Rolling', 'Rolling week(s) view toggle.'),
('calendar.view.rolling', 'da', 'Rullende', 'Visning.'),
('calendar.view.month30', 'en-US', '30 days', '30-day summary view toggle.'),
('calendar.view.month30', 'da', '30 dage', 'Visning.'),
('calendar.nav.prev_week_aria', 'en-US', 'Previous week', 'Chevron back in rolling mode.'),
('calendar.nav.prev_week_aria', 'da', 'Forrige uge', 'Aria.'),
('calendar.nav.prev_month30_aria', 'en-US', 'Previous 30 days', 'Chevron back in month view.'),
('calendar.nav.prev_month30_aria', 'da', 'Forrige 30 dage', 'Aria.'),
('calendar.nav.next_week_aria', 'en-US', 'Next week', 'Chevron forward rolling.'),
('calendar.nav.next_week_aria', 'da', 'Næste uge', 'Aria.'),
('calendar.nav.next_month30_aria', 'en-US', 'Next 30 days', 'Chevron forward month view.'),
('calendar.nav.next_month30_aria', 'da', 'Næste 30 dage', 'Aria.'),
('calendar.nav.go_today', 'en-US', 'Go to today', 'Center period on today.'),
('calendar.nav.go_today', 'da', 'Gå til i dag', 'Knap.'),
('calendar.filter.department_aria', 'en-US', 'Department', 'Department select aria-label.'),
('calendar.filter.department_aria', 'da', 'Afdeling', 'Aria.'),
('calendar.filter.all_departments', 'en-US', 'All departments', 'Default option.'),
('calendar.filter.all_departments', 'da', 'Alle afdelinger', 'Filter.'),
('calendar.filter.rows_placeholder', 'en-US', 'Filter visible rows…', 'Employee name search placeholder.'),
('calendar.filter.rows_placeholder', 'da', 'Filtrér synlige rækker…', 'Søgning.'),
('calendar.filter.shift_type_aria', 'en-US', 'Filter by shift type', 'Shift type select aria-label.'),
('calendar.filter.shift_type_aria', 'da', 'Filtrer vagttype', 'Aria.'),
('calendar.filter.all_shift_types', 'en-US', 'All shift types', 'Default option.'),
('calendar.filter.all_shift_types', 'da', 'Alle vagttyper', 'Filter.'),
('calendar.filter.employee_type_aria', 'en-US', 'Filter by employee type', 'Employee type select aria-label.'),
('calendar.filter.employee_type_aria', 'da', 'Filtrer medarbejdertype', 'Aria.'),
('calendar.loader_aria', 'en-US', 'Loading calendar', 'Loader region aria-label.'),
('calendar.loader_aria', 'da', 'Kalender indlæses', 'Aria.'),
('calendar.month30.intro', 'en-US', 'Number of distinct employees on shift per day. Click a day for rolling view.', 'Help text above 30-day grid.'),
('calendar.month30.intro', 'da', 'Antal forskellige medarbejdere med vagt pr. dag. Klik en dag for rullende visning.', 'Hjælp.'),
('calendar.month30.on_shift_label', 'en-US', 'on shift', 'Caption under count in month cells.'),
('calendar.month30.on_shift_label', 'da', 'på vagt', 'Tekst.'),
('calendar.drag.mode_move', 'en-US', 'Move shift', 'Drag overlay when moving shift.'),
('calendar.drag.mode_move', 'da', 'Flyt vagt', 'Overlay.'),
('calendar.drag.mode_resize_start', 'en-US', 'Adjust start', 'Drag resize start.'),
('calendar.drag.mode_resize_start', 'da', 'Juster start', 'Overlay.'),
('calendar.drag.mode_resize_end', 'en-US', 'Adjust end', 'Drag resize end.'),
('calendar.drag.mode_resize_end', 'da', 'Juster slut', 'Overlay.'),
('calendar.shift_hover.employee', 'en-US', 'Employee', 'Tooltip line label.'),
('calendar.shift_hover.employee', 'da', 'Medarbejder', 'Label.'),
('calendar.shift_hover.department', 'en-US', 'Department', 'Tooltip line label.'),
('calendar.shift_hover.department', 'da', 'Afdeling', 'Label.'),
('calendar.shift_hover.employee_type', 'en-US', 'Employee type', 'Tooltip line label.'),
('calendar.shift_hover.employee_type', 'da', 'Medarbejdertype', 'Label.'),
('calendar.shift_hover.shift_type', 'en-US', 'Shift type', 'Tooltip line label.'),
('calendar.shift_hover.shift_type', 'da', 'Vagttype', 'Label.'),
('calendar.shift_hover.time', 'en-US', 'Time', 'Tooltip line before formatted range.'),
('calendar.shift_hover.time', 'da', 'Tid', 'Label.'),

-- Admin calendar: employee list + member editor modal
('calendar.employee.search_aria', 'en-US', 'Search employees', 'aria-label on employee search input.'),
('calendar.employee.search_aria', 'da', 'Søg medarbejdere', 'aria-label.'),
('calendar.employee.filter_all_types', 'en-US', 'All employee types', 'Employee type filter default option.'),
('calendar.employee.filter_all_types', 'da', 'Alle medarbejdertyper', 'Filter.'),
('calendar.employee.empty_filter', 'en-US', 'No employees match the filter for the selected department.', 'Empty state in calendar grid.'),
('calendar.employee.empty_filter', 'da', 'Ingen medarbejdere matcher filteret for den valgte afdeling.', 'Tom tilstand.'),
('calendar.employee.add_button', 'en-US', 'Add employee', 'Bottom sticky row button in shift calendar.'),
('calendar.employee.add_button', 'da', 'Tilføj medarbejder', 'Knap.'),

('calendar.member_editor.title_create', 'en-US', 'Add employee', 'Member modal h2 when creating.'),
('calendar.member_editor.title_create', 'da', 'Tilføj medarbejder', 'Modal.'),
('calendar.member_editor.title_edit', 'en-US', 'Edit employee', 'Member modal h2 when editing.'),
('calendar.member_editor.title_edit', 'da', 'Rediger medarbejder', 'Modal.'),
('calendar.member_editor.close_dialog_aria', 'en-US', 'Close employee dialog', 'Backdrop button aria.'),
('calendar.member_editor.close_dialog_aria', 'da', 'Luk medarbejder-dialog', 'Aria.'),
('calendar.member_editor.close_aria', 'en-US', 'Close', 'Close icon button aria.'),
('calendar.member_editor.close_aria', 'da', 'Luk', 'Aria.'),
('calendar.member_editor.loading', 'en-US', 'Loading employee data…', 'Spinner text while fetching member.'),
('calendar.member_editor.loading', 'da', 'Henter medarbejderdata…', 'Loader.'),
('calendar.member_editor.first_name', 'en-US', 'First name *', 'Form label.'),
('calendar.member_editor.first_name', 'da', 'Fornavn *', 'Label.'),
('calendar.member_editor.last_name', 'en-US', 'Last name *', 'Form label.'),
('calendar.member_editor.last_name', 'da', 'Efternavn *', 'Label.'),
('calendar.member_editor.email', 'en-US', 'Email *', 'Form label.'),
('calendar.member_editor.email', 'da', 'Email *', 'Label.'),
('calendar.member_editor.mobile', 'en-US', 'Mobile *', 'Form label.'),
('calendar.member_editor.mobile', 'da', 'Mobilnummer *', 'Label.'),
('calendar.member_editor.street', 'en-US', 'Street *', 'Form label.'),
('calendar.member_editor.street', 'da', 'Vejnavn *', 'Label.'),
('calendar.member_editor.street_no', 'en-US', 'Street no. *', 'Form label.'),
('calendar.member_editor.street_no', 'da', 'Vej nr. *', 'Label.'),
('calendar.member_editor.postal', 'en-US', 'Postal code *', 'Form label.'),
('calendar.member_editor.postal', 'da', 'Postnummer *', 'Label.'),
('calendar.member_editor.city', 'en-US', 'City *', 'Form label.'),
('calendar.member_editor.city', 'da', 'By *', 'Label.'),
('calendar.member_editor.country', 'en-US', 'Country *', 'Form label.'),
('calendar.member_editor.country', 'da', 'Land *', 'Label.'),
('calendar.member_editor.employee_type', 'en-US', 'Employee type *', 'Form label.'),
('calendar.member_editor.employee_type', 'da', 'Medarbejdertype *', 'Label.'),
('calendar.member_editor.employee_type_placeholder', 'en-US', 'Select employee type', 'Select first option.'),
('calendar.member_editor.employee_type_placeholder', 'da', 'Vælg medarbejdertype', 'Select.'),
('calendar.member_editor.note', 'en-US', 'Note', 'Form label.'),
('calendar.member_editor.note', 'da', 'Note', 'Label.'),
('calendar.member_editor.note_placeholder', 'en-US', 'Optional internal note', 'Textarea placeholder.'),
('calendar.member_editor.note_placeholder', 'da', 'Valgfri intern note', 'Pladsholder.'),
('calendar.member_editor.preferences_title', 'en-US', 'Preferences', 'Section title.'),
('calendar.member_editor.preferences_title', 'da', 'Præferencer', 'Sektion.'),
('calendar.member_editor.preferences_add', 'en-US', 'Add', 'Add preference row button.'),
('calendar.member_editor.preferences_add', 'da', 'Tilføj', 'Knap.'),
('calendar.member_editor.preferences_hint', 'en-US', 'Prioritised order. Example: holiday in week 42, no Saturday work.', 'Help text under preferences.'),
('calendar.member_editor.preferences_hint', 'da', 'Prioriteret rækkefølge. Eksempel: Ferie i uge 42, Ikke arbejde lørdage.', 'Hjælp.'),
('calendar.member_editor.preferences_empty', 'en-US', 'No preferences yet.', 'Empty state.'),
('calendar.member_editor.preferences_empty', 'da', 'Ingen præferencer endnu.', 'Tom.'),
('calendar.member_editor.priority_aria', 'en-US', 'Priority', 'aria-label on priority number input.'),
('calendar.member_editor.priority_aria', 'da', 'Prioritet', 'Aria.'),
('calendar.member_editor.preference_placeholder', 'en-US', 'Enter preference…', 'Text input placeholder.'),
('calendar.member_editor.preference_placeholder', 'da', 'Skriv præference…', 'Pladsholder.'),
('calendar.member_editor.remove', 'en-US', 'Remove', 'Remove preference row.'),
('calendar.member_editor.remove', 'da', 'Fjern', 'Knap.'),
('calendar.member_editor.cv_title', 'en-US', 'Upload CV (PDF)', 'CV section title.'),
('calendar.member_editor.cv_title', 'da', 'Upload CV (PDF)', 'Titel.'),
('calendar.member_editor.cv_choose', 'en-US', 'Choose PDF', 'File input label.'),
('calendar.member_editor.cv_choose', 'da', 'Vælg PDF', 'Label.'),
('calendar.member_editor.cv_view_existing', 'en-US', 'View current CV', 'Button to open signed URL.'),
('calendar.member_editor.cv_view_existing', 'da', 'Se nuværende CV', 'Knap.'),
('calendar.member_editor.cancel', 'en-US', 'Cancel', 'Modal footer.'),
('calendar.member_editor.cancel', 'da', 'Annuller', 'Knap.'),
('calendar.member_editor.submit_create', 'en-US', 'Create employee', 'Primary submit when creating.'),
('calendar.member_editor.submit_create', 'da', 'Opret medarbejder', 'Knap.'),
('calendar.member_editor.submit_save', 'en-US', 'Save changes', 'Primary submit when editing.'),
('calendar.member_editor.submit_save', 'da', 'Gem ændringer', 'Knap.'),
('calendar.member_editor.need_employee_type', 'en-US', 'Create at least one employee type first.', 'Warning when no types exist.'),
('calendar.member_editor.need_employee_type', 'da', 'Opret mindst én medarbejdertype først.', 'Advarsel.'),
('calendar.member_editor.create_cv_failed', 'en-US', 'Employee created, but CV upload failed: {detail}', 'Error; replace {detail}.'),
('calendar.member_editor.create_cv_failed', 'da', 'Medarbejder oprettet, men CV upload fejlede: {detail}', 'Fejl.'),
('calendar.member_editor.update_cv_failed', 'en-US', 'Data saved, but CV upload failed: {detail}', 'Error; replace {detail}.'),
('calendar.member_editor.update_cv_failed', 'da', 'Data gemt, men CV upload fejlede: {detail}', 'Fejl.'),

('calendar.name_cell.aria_view', 'en-US', 'Employee {name}', 'Button aria when not editable; replace {name}.'),
('calendar.name_cell.aria_view', 'da', 'Medarbejder {name}', 'Aria.'),
('calendar.name_cell.aria_edit', 'en-US', 'Employee {name}, edit', 'Button aria when editable; replace {name}.'),
('calendar.name_cell.aria_edit', 'da', 'Medarbejder {name}, rediger', 'Aria.')

on conflict (translation_key, language_code) do update set
  text_value = excluded.text_value,
  context_description = excluded.context_description;
