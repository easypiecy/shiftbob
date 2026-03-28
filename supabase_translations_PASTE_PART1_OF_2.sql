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
