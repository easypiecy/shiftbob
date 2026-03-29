> **CURSOR AI INSTRUCTION:** Before writing any Supabase queries or altering the database, you MUST consult this file to ensure correct table names, column names, and relations. If you create a new table or modify an existing schema during our conversation, you MUST immediately update this file to reflect the changes.

# ShiftBob — database master reference

Single source of truth for `public` schema objects defined in this repo’s SQL scripts. Execution order recommended for fresh environments:

1. `supabase_roles_setup.sql` — legacy/global RBAC (`user_roles`)
2. `supabase_workplaces_setup.sql` — multi-tenant workplaces and membership
3. `supabase_workplace_extended.sql` — firma/adresse, `notification_channel`, standardtyper, workplace-typer, API-nøgler, push-filtre (kør efter 2)
4. `supabase_departments_setup.sql` — afdelinger pr. arbejdsplads + `workplace_department_members` (kør efter 3)
5. `supabase_i18n_setup.sql` — languages, EU countries, UI translations (defines `is_workplace_admin()`)
6. `supabase_workplace_shifts.sql` — planlagte vagter (`workplace_shifts`) til kalender (kør efter `supabase_departments_setup.sql`)
7. `supabase_user_ui_preferences.sql` — bruger-UI (`user_ui_preferences`: layout/tema) — kør efter `supabase_workplaces_setup.sql`
8. `supabase_workplace_join_requests.sql` — OAuth/ny bruger: `workplace_join_requests`, `workplaces.allow_join_requests`, `workplace_members.profile_onboarding_completed`, RPC `list_workplaces_open_for_join()` og `request_workplace_join(uuid)` (kør efter `supabase_workplaces_setup.sql`, gerne efter `supabase_workplace_extended.sql`)

**Eksisterende databaser (migration / patch):**

| Script | Formål |
|--------|--------|
| `supabase_patch_workplace_notification_cleanup.sql` | Opdatér `notification_channel` (`none` → `push`), constraint kun `push`/`sms`, fjern `push_send_none` hvis den findes |
| `supabase_super_admin_notifications_setup.sql` | Super Admin notifikationsudsendelse: batches + deliveries-log (målretning, oversatte tekster pr. modtager) |
| `supabase_patch_is_workplace_admin_user_roles.sql` | Synk `public.is_workplace_admin()` med `user_roles` (samme som opdateret `supabase_i18n_setup.sql`) |
| `supabase_departments_setup.sql` | Afdelinger (`workplace_departments`) og medlemskaber (`workplace_department_members`); trigger + RLS |
| `supabase_patch_workplace_members_select_own.sql` | Ret `workplace_members` SELECT-RLS så brugeren altid kan læse egne rækker (klient `fetchUserWorkplaces` m.m.) |
| `supabase_rpc_workplace_session_reads.sql` | RPC’er `get_my_workplaces`, `get_my_roles_for_workplace`, `has_super_admin_membership` (SECURITY DEFINER, filtrerer på `auth.uid()`) — app bruger dem først så arbejdsplads/roller virker selv ved RLS-problemer |
| `supabase_seed_philip_workplace_member.sql` | Dev: tilknyt `philip.schoenbaum@gmail.com` til en arbejdsplads (`ADMIN`) — se `user_roles`-kun Super Admin viser ikke arbejdspladser uden `workplace_members` |
| `supabase_patch_workplace_future_planning.sql` | `future_planning_weeks`, `calendar_released_until`, `season_template_json` på `workplaces` (Fremtiden / frigivelse) |
| `supabase_seed_ui_translations_app.sql` | Udvider `ui_translations` med app-strenge (`en-US` + `da`): admin-menu, super-admin-menu, layout-tema, upload, dashboard-sider, Fremtiden, indstillinger, Compliance m.m. — idempotent (`ON CONFLICT DO UPDATE`). Kør efter `supabase_i18n_setup.sql`. |
| `supabase_seed_ui_translations_compliance.sql` | Kun Compliance + `admin.nav.compliance` i `ui_translations` (samme som del af app-seed). Alternativ: `npm run seed:compliance-translations` med `SUPABASE_SERVICE_ROLE_KEY` i `.env.local` — nødvendigt for at rækkerne vises i `/super-admin/translations` (kildesprog `en-US`). |
| `supabase_reload_api_schema.sql` | Valgfrit: `NOTIFY pgrst, 'reload schema';` hvis API stadig mangler ny tabel i cache |
| `supabase_workplace_join_requests.sql` | Anmodning om adgang til arbejdsplads (pending → godkend/afvis), profil-onboarding-flag på `workplace_members` |

`supabase_verify.sql` contains read-only diagnostic queries; it does not define schema.

---

## App navigation & roller (menuer)

Rolle-værdier i databasen (`workplace_members.role`, `user_roles.role`) er de samme som i appen: `SUPER_ADMIN` · `ADMIN` · `MANAGER` · `EMPLOYEE`. Den **aktive rolle** i klienten gemmes i cookien `active_role` (se `src/lib/roles.ts`) og styrer bl.a. arbejdsplads-admin-menuen.

### Super Admin (globalt)

- **Adgang:** mindst én `SUPER_ADMIN`-rolle i `workplace_members` **eller** i `user_roles` — logik i `src/lib/super-admin.ts` (`hasSuperAdminAccess` / `assertSuperAdminAccess`).
- **Efter login:** Super Admin-brugere sendes til **`/select-workplace`**, hvor de vælger enten **Super Admin** (systemportal) eller en **arbejdsplads** (derefter rolle som ved andre brugere). `routeAfterLogin` i `src/lib/workplaces.ts` peger herhen i stedet for direkte til `/super-admin`.
- **Arbejdspladslisten** på den side kommer fra **`workplace_members`** (`fetchUserWorkplaces`). Global **`user_roles` Super Admin alene** giver **ikke** automatisk rækker dér — tilknyt i Super Admin UI eller kør f.eks. `supabase_seed_philip_workplace_member.sql` i dev.
- **Layout:** `app/super-admin/layout.tsx` beskytter hele `/super-admin/*`; indhold i `SuperAdminShell` (`app/super-admin/super-admin-shell.tsx`).
- **Sidemenu / oversigt** (samme destinationer som forsiden `/super-admin`):

| Menupunkt | Route |
|-----------|--------|
| Oversigt | `/super-admin` |
| Brugere & arbejdspladser | `/super-admin/users` (faner: arbejdspladser og brugere; herfra også **ny arbejdsplads**) |
| Standard vagt- og medarbejdertyper | `/super-admin/workplace-templates` |
| Sprog & oversættelser | `/super-admin/translations` |

- **Understier:** Redigering af én arbejdsplads (firma, typer, push-filtre, API-nøgler, **afdelinger** m.m.) ligger under `/super-admin/workplaces/[id]`; **opret ny arbejdsplads** under `/super-admin/workplaces/new` — begge hører under menupunktet *Brugere & arbejdspladser* i navigationen.

### Arbejdsplads-administrator (`ADMIN`)

Når cookien `active_role` er **`ADMIN`**, vises sidemenuen **Administrator** (`AdminWorkspaceShell`, `src/components/admin-workspace-shell.tsx`) på:

- `/dashboard` (inkl. understier som `/dashboard/indstillinger`, `/dashboard/fremtiden`, `/dashboard/compliance`)
- `/select-workplace`

**Rolle** (admin vs. medarbejder m.m.) vælges ved login på **`/select-role`**, når brugeren har flere roller — ikke via sidemenuen.

**Menupunkter:**

| Menupunkt | Route |
|-----------|--------|
| Kalender | `/dashboard` |
| Fremtiden | `/dashboard/fremtiden` |
| Notifikationer | `/dashboard/notifikationer` |
| Adgangsanmodninger | `/dashboard/join-requests` (godkend/afvis OAuth-brugere uden medlemskab) |
| Regler | `/dashboard/regler` |
| Data eksport | `/dashboard/data-eksport` |
| Compliance | `/dashboard/compliance` (rullende lov-/GDPR-/AI-dokumentation; aktiv arbejdsplads fra `active_workplace`-cookie) |
| Indstillinger | `/dashboard/indstillinger` (samme arbejdsplads-UI som Super Admin `/super-admin/workplaces/[id]`; kræver `active_workplace`-cookie; herunder **Side-layout** / tema i `user_ui_preferences` og **Kalender & fremtid** / `future_planning_weeks` i `workplaces`) |
| Skift arbejdsplads | Ikon ved **Administrator** → `/select-workplace` |

Øvrige roller (`MANAGER`, `EMPLOYEE`) får **ikke** denne menu; de ser kun sideindhold uden administrator-skallen.

---

## Supabase Auth: `auth.users`

| Aspect | Detail |
|--------|--------|
| **Schema** | `auth` (managed by Supabase Auth) |
| **Role** | Canonical identity for end users. `id` (UUID) is the user primary key used across our `public` tables. |
| **Typical columns** | `id`, `email`, `encrypted_password`, `email_confirmed_at`, `created_at`, provider metadata, etc. (exact set is Supabase version–dependent). |

**Relations from this project:** `public.user_roles.user_id`, `public.workplace_members.user_id` reference `auth.users(id)` with `ON DELETE CASCADE`.

**Note:** Do not create foreign keys *to* our app tables from `auth.users` in migrations you own; always reference `auth.users` from `public`.

---

## Role enum values (text check constraints)

Where `role` appears (`user_roles.role`, `workplace_members.role`), allowed values are:

`SUPER_ADMIN` · `ADMIN` · `MANAGER` · `EMPLOYEE`

---

## `public.user_roles`

| | |
|---|---|
| **Source** | `supabase_roles_setup.sql` |
| **Purpose** | **Legacy / global RBAC** — multiple roles per user without workplace scope. The app’s primary access model is `workplace_members`; this table may still exist for tooling or migration. |

### Columns

| Column | Type | Keys | Notes |
|--------|------|------|--------|
| `id` | `uuid` | **PK**, default `gen_random_uuid()` | Surrogate key |
| `user_id` | `uuid` | **FK** → `auth.users(id)` `ON DELETE CASCADE` | |
| `role` | `text` | — | Check: `SUPER_ADMIN` … `EMPLOYEE` |
| `created_at` | `timestamptz` | — | Default `now()` |

**Constraints:** `UNIQUE (user_id, role)` — one row per (user, role).

**Index:** `user_roles_user_id_idx` on `(user_id)`.

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `user_roles_select_own` | `SELECT` | `auth.uid() = user_id` |

**Grants:** `SELECT` to `authenticated` only (no `INSERT`/`UPDATE`/`DELETE` for `authenticated` in script — writes typically via SQL Editor with elevated privileges or service role).

---

## `public.workplaces`

| | |
|---|---|
| **Source** | `supabase_workplaces_setup.sql` + `supabase_workplace_extended.sql` |
| **Purpose** | **Multi-tenant** — tenant + firma, adresse, Stripe, notifikationer, push-filtre. |

### Columns (udvalg)

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` | **PK** |
| `name` | `text` | Visningsnavn |
| `company_name`, `vat_number` | `text` | Firma / CVR |
| Adresse | | `street_name`, `street_number`, `address_extra`, `postal_code`, `city`, `country_code` |
| `contact_email`, `phone` | `text` | |
| `employee_count_band` | `text` | `5-20` … `151+` |
| `notification_channel` | `text` | Check: `push` · `sms` — default `push` (værdien `none` findes ikke i nye scripts) |
| `stripe_customer_id` | `text` | Stripe |
| `push_include_shift_type_ids` | `uuid[]` | Tom = intet filter på vagttyper; ellers kun disse `workplace_shift_types.id` (Push/SMS-målgruppe) |
| `push_include_employee_type_ids` | `uuid[]` | Samme for medarbejdertyper → `workplace_employee_types.id` |
| `future_planning_weeks` | `integer` | Default `8`, check `1…104` — antal uger af ufrigivet kalender vist under **Administrator → Fremtiden** |
| `calendar_released_until` | `date` | Valgfri — sidste dato medarbejdere kan se planlagte vagter; efter denne dato er planen kun synlig for admin indtil frigivelse |
| `season_template_json` | `jsonb` | Sæson-skabelon (perioder, krav pr. ugedag) til AI-analyse og planlægning |
| `created_at` | `timestamptz` | |

**Fjernet fra nuværende schema:** kolonnen `push_send_none` bruges ikke længere (styring via typer/kanal; patch ovenfor dropper den på gamle DB’er).

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `workplaces_select_member` | `SELECT` | User may read a workplace if they have **any** row in `workplace_members` for that `workplaces.id` |

**Grants:** `SELECT` to `authenticated`. No insert/update/delete policies in script — tenant creation is out of band (e.g. service role / Super Admin UI).

**App:** `src/app/super-admin/workplaces/actions.ts` — `/super-admin/users`, `/super-admin/workplaces/new`, `/super-admin/workplaces/[id]` (inkl. afdelinger), `/super-admin/workplace-templates` (CRUD på standardtyper). `exportWorkplaceCsv` findes i samme modul til CSV-eksport (kan kaldes fra arbejdsplads-admin senere).

---

## `public.workplace_departments`

| | |
|---|---|
| **Source** | `supabase_departments_setup.sql` |
| **Purpose** | **Afdelinger** under én arbejdsplads (fx Køkken, Bar). Én række pr. afdeling pr. tenant. |

### Columns

| Column | Type | Keys | Notes |
|--------|------|------|--------|
| `id` | `uuid` | **PK**, default `gen_random_uuid()` | |
| `workplace_id` | `uuid` | **FK** → `workplaces(id)` `ON DELETE CASCADE` | |
| `name` | `text` | — | Vises i UI |
| `created_at` | `timestamptz` | — | Default `now()` |

**Index:** `(workplace_id)`.

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `workplace_departments_select_member` | `SELECT` | Bruger har række i `workplace_members` for samme `workplace_id` |
| `workplace_departments_insert_admin` | `INSERT` | Samme `workplace_id` og `workplace_members.role` i `ADMIN` · `SUPER_ADMIN` |
| `workplace_departments_update_admin` | `UPDATE` | Som insert (using + with check) |
| `workplace_departments_delete_admin` | `DELETE` | Som insert |

**Grants:** `SELECT`, `INSERT`, `UPDATE`, `DELETE` til `authenticated` (skrivning stadig via RLS). Super Admin UI bruger **service role** og skal stadig validere `workplace_id` i app-laget.

---

## `public.workplace_department_members`

| | |
|---|---|
| **Source** | `supabase_departments_setup.sql` |
| **Purpose** | **Kobling** mellem bruger og afdeling på **samme** arbejdsplads. En bruger kan have flere rækker (flere afdelinger). |

### Columns

| Column | Type | Keys | Notes |
|--------|------|------|--------|
| `id` | `uuid` | **PK**, default `gen_random_uuid()` | |
| `department_id` | `uuid` | **FK** → `workplace_departments(id)` `ON DELETE CASCADE` | |
| `user_id` | `uuid` | **FK** → `auth.users(id)` `ON DELETE CASCADE` | |
| `workplace_id` | `uuid` | **FK** → `workplaces(id)` `ON DELETE CASCADE` | Denormaliseret; sættes af trigger fra afdelingens `workplace_id` |
| `created_at` | `timestamptz` | — | Default `now()` |

**Constraints:** `UNIQUE (user_id, department_id)` — samme bruger kan ikke tilføjes to gange til samme afdeling.

**Indexes:** `(workplace_id)`, `(user_id)`, `(department_id)`.

### Trigger

`workplace_department_members_validate` (BEFORE `INSERT` OR `UPDATE`): sætter `NEW.workplace_id` ud fra `workplace_departments` for `NEW.department_id` og fejler hvis brugeren ikke findes i `workplace_members` for den arbejdsplads. Forhindrer forkert tenant og «løse» koblinger.

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `workplace_department_members_select_member` | `SELECT` | Medlem af samme `workplace_id` som rækken |
| `workplace_department_members_insert_admin` | `INSERT` | `ADMIN` / `SUPER_ADMIN` på `workplace_id` |
| `workplace_department_members_update_admin` | `UPDATE` | Som insert |
| `workplace_department_members_delete_admin` | `DELETE` | Som insert |

**Grants:** `SELECT`, `INSERT`, `UPDATE`, `DELETE` til `authenticated`.

---

## `public.employee_type_templates` og `public.shift_type_templates`

| | |
|---|---|
| **Source** | `supabase_workplace_extended.sql` |
| **Purpose** | **Globale standardtyper** (vedligeholdes i Super Admin). Ved oprettelse af arbejdsplads kopieres rækker til `workplace_employee_types` / `workplace_shift_types` med `template_id` sat; `slug` er unik pr. tabel. |

### Columns (samme form i begge tabeller)

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` | **PK** |
| `name` | `text` | |
| `slug` | `text` | **UNIQUE** |
| `sort_order` | `int` | |
| `created_at` | `timestamptz` | Default `now()` |

**Indexes:** `(sort_order)`.

### RLS

| Policy | Command | Rule |
|--------|---------|--------|
| `employee_type_templates_select_auth` / `shift_type_templates_select_auth` | `SELECT` | Alle `authenticated` (`using (true)`) |

**Grants:** `SELECT` til `authenticated`. **INSERT/UPDATE/DELETE** sker via **service role** (Super Admin UI), ikke RLS for skrivning.

---

## `public.workplace_employee_types` og `public.workplace_shift_types`

| | |
|---|---|
| **Source** | `supabase_workplace_extended.sql` |
| **Purpose** | Typer **pr. tenant** — labels til UI, filtre og `workplaces.push_include_*` (UUID’er peger på `id` her). `template_id` er `NULL` for egne typer tilføjet på arbejdspladsen. |

### Columns (samme form i begge tabeller)

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` | **PK** |
| `workplace_id` | `uuid` | **FK** → `workplaces(id)` `ON DELETE CASCADE` |
| `template_id` | `uuid` | **FK** → `employee_type_templates` / `shift_type_templates` `ON DELETE SET NULL` |
| `label` | `text` | |
| `sort_order` | `int` | |
| `created_at` | `timestamptz` | |

**Indexes:** `(workplace_id)`.

### RLS

| Policy | Command | Rule |
|--------|---------|--------|
| `workplace_*_types_select_member` | `SELECT` | Bruger er medlem af samme `workplace_id` |

**Grants:** `SELECT` til `authenticated`. Indsættelse/kopiering fra skabeloner: **service role** (fx Super Admin).

---

## `public.workplace_api_keys`

| | |
|---|---|
| **Source** | `supabase_workplace_extended.sql` |
| **Purpose** | API-nøgler pr. arbejdsplads — **hemmeligheden gemmes ikke**; kun `key_prefix` og `key_hash`. |

### Columns

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` | **PK** |
| `workplace_id` | `uuid` | **FK** → `workplaces(id)` `ON DELETE CASCADE` |
| `key_prefix` | `text` | Til visning |
| `key_hash` | `text` | Fx SHA-256 af hemmelighed |
| `label` | `text` | Default `'default'` |
| `created_at` | `timestamptz` | |
| `revoked_at` | `timestamptz` | `NULL` = aktiv |

**Index:** `(workplace_id)`.

### RLS

| Policy | Command | Rule |
|--------|---------|--------|
| `workplace_api_keys_select_admin_wp` | `SELECT` | Medlem med rolle `ADMIN` eller `SUPER_ADMIN` på samme arbejdsplads |

**Grants:** `SELECT` til `authenticated`. Oprettelse via **service role** (Super Admin).

---

## `public.workplace_members`

| | |
|---|---|
| **Source** | `supabase_workplaces_setup.sql` |
| **Purpose** | **Multi-tenant RBAC** — exactly **one role per user per workplace**. Changing role updates the same row (app uses `upsert` on `(user_id, workplace_id)`). |

### Columns

| Column | Type | Keys | Notes |
|--------|------|------|--------|
| `id` | `uuid` | **PK**, default `gen_random_uuid()` | Surrogate key |
| `user_id` | `uuid` | — | **FK** → `auth.users(id)` `ON DELETE CASCADE` |
| `workplace_id` | `uuid` | — | **FK** → `public.workplaces(id)` `ON DELETE CASCADE` |
| `role` | `text` | — | Check: `SUPER_ADMIN` … `EMPLOYEE` |
| `created_at` | `timestamptz` | — | Default `now()` |

**Uniqueness:** `UNIQUE (user_id, workplace_id)` — at most one membership row per pair.

**Indexes:** `(user_id)`, `(workplace_id)`.

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `workplace_members_select_shared` | `SELECT` | `user_id = auth.uid()` **eller** EXISTS medlem på samme `workplace_id` (kollegaer). Første led sikrer at egen række altid kan læses fra app-klienten uden RLS-recursion. |

**Grants:** `SELECT` to `authenticated`. Writes for onboarding use the **service role** (Super Admin “Tilknyt arbejdsplads”), not client RLS.

**Used by:** `public.is_workplace_admin()` (see below) for `ADMIN` / `SUPER_ADMIN` anywhere.

---

## Database function: `public.is_workplace_admin()`

| | |
|---|---|
| **Source** | `supabase_i18n_setup.sql` |
| **Returns** | `boolean` |
| **Logic** | `true` if `auth.uid()` has `ADMIN` or `SUPER_ADMIN` in `workplace_members`, **or** `SUPER_ADMIN` in `user_roles` (når tabellen findes). Ellers `false`. |

Used by i18n RLS write policies. Super Admin UI gemmer oversættelser med **service role** efter server-side check, så `user_roles`-kun Super Admin stadig kan gemme uden at matche denne funktion.

**Patch til eksisterende DB:** `supabase_patch_is_workplace_admin_user_roles.sql` (samme funktion som i opdateret `supabase_i18n_setup.sql`).

---

## `public.languages`

| | |
|---|---|
| **Source** | `supabase_i18n_setup.sql` |
| **Purpose** | **i18n** — supported language codes and optional fallback chain (e.g. `de-AT` → `de`). |

### Columns

| Column | Type | Keys | Notes |
|--------|------|------|--------|
| `language_code` | `varchar(35)` | **PK** | e.g. `en-US`, `de-AT` |
| `name` | `text` | — | Human-readable name |
| `primary_language_code` | `varchar(35)` | **FK** → `public.languages(language_code)` `ON DELETE SET NULL` | Optional parent language for fallback |

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `languages_select_authenticated` | `SELECT` | All `authenticated` users (`using (true)`) |
| `languages_write_admin` | `ALL` (incl. SELECT for matching rows) | `public.is_workplace_admin()` |

**Grants:** `SELECT`, `INSERT`, `UPDATE`, `DELETE` to `authenticated` (writes still gated by RLS).

---

## `public.eu_countries`

| | |
|---|---|
| **Source** | `supabase_i18n_setup.sql` |
| **Purpose** | **i18n / reference** — EU member states with a primary official language code. |

### Columns

| Column | Type | Keys | Notes |
|--------|------|------|--------|
| `country_code` | `varchar(2)` | **PK** | ISO 3166-1 alpha-2 |
| `name` | `text` | — | Country name (seeded in English in SQL) |
| `primary_language_code` | `varchar(35)` | **FK** → `public.languages(language_code)` `ON DELETE RESTRICT` | |

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `eu_countries_select_authenticated` | `SELECT` | All `authenticated` |
| `eu_countries_write_admin` | `ALL` | `public.is_workplace_admin()` |

**Grants:** Same pattern as `languages`.

---

## `public.ui_translations`

| | |
|---|---|
| **Source** | `supabase_i18n_setup.sql` (skema + grunddata: login, rollevalg) + `supabase_seed_ui_translations_app.sql` (resten af appen) |
| **Purpose** | **i18n** — UI strings keyed by stable `translation_key` per `language_code`. |

### App (Next.js)

- **Kilde‑sprog i UI:** `/super-admin/translations` bruger **engelsk** (`en-US`) som kilderækker (se `app/super-admin/translations/page.tsx`).
- **Standardvisning i appen:** Root layout (`app/layout.tsx`) loader **`da`** via `getTranslationsCached()` + service role (`src/lib/translations-server.ts`) og leverer `Record<translation_key, text_value>` til `AppTranslationsProvider` (`src/contexts/translations-context.tsx`). Klientkomponenter bruger `useTranslations()`; serverkomponenter bruger `getTranslationsCached()` + `createTranslator()`.
- **Nøgle‑navne:** punktum‑notation, fx `admin.nav.calendar`, `future.season.title`, `calendar.weekday.0` (mandag … `6` søndag). Oversættelser kan redigeres under **Super Admin → Sprog & oversættelser**; seed‑scriptet kan køres igen for at opdatere tekster uden at slette rækker.

### Columns

| Column | Type | Keys | Notes |
|--------|------|------|--------|
| `id` | `uuid` | **PK**, default `gen_random_uuid()` | |
| `translation_key` | `text` | — | Dotted key, e.g. `login.email.label` |
| `language_code` | `varchar(35)` | **FK** → `public.languages(language_code)` `ON DELETE CASCADE` | |
| `text_value` | `text` | — | Translated string |
| `context_description` | `text` | — | English description for translators / AI |

**Constraints:** `UNIQUE (translation_key, language_code)`.

**Index:** `(language_code)`.

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `ui_translations_select_authenticated` | `SELECT` | All `authenticated` |
| `ui_translations_write_admin` | `ALL` | `public.is_workplace_admin()` |

**Grants:** Same pattern as `languages`.

---

## `public.user_ui_preferences`

| | |
|---|---|
| **Source** | `supabase_user_ui_preferences.sql` |
| **Purpose** | **Bruger-UI** — ét layout-tema pr. bruger (`dark` · `light` · `unicorn`), synkroniseret med cookie `sb_ui_layout_theme` i appen. |

### Columns

| Column | Type | Notes |
|--------|------|--------|
| `user_id` | `uuid` | **PK**, **FK** → `auth.users(id)` |
| `layout_theme` | `text` | Check: `dark` · `light` · `unicorn` |
| `updated_at` | `timestamptz` | |

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `user_ui_preferences_select_own` | `SELECT` | `auth.uid() = user_id` |
| `user_ui_preferences_insert_own` | `INSERT` | `auth.uid() = user_id` |
| `user_ui_preferences_update_own` | `UPDATE` | `auth.uid() = user_id` |

**App:** `src/lib/ui-theme-server.ts`, `src/app/user-ui-actions.ts`, `app/layout.tsx`.

**Opsætning:** Kør hele `supabase_user_ui_preferences.sql` i Supabase **SQL Editor** (én gang pr. projekt). Scriptet afslutter med `NOTIFY pgrst, 'reload schema';` så API’en ser tabellen med det samme. Hvis du stadig får *schema cache* / *could not find the table*, kør linjen `notify pgrst, 'reload schema';` igen, eller vent kort og genindlæs. Indtil tabellen findes, gemmer appen tema i cookien `sb_ui_layout_theme` så layout stadig virker.

---

## `public.workplace_shifts`

| | |
|---|---|
| **Source** | `supabase_workplace_shifts.sql` |
| **Purpose** | **Planlagte vagter** pr. arbejdsplads (start/slut, bruger, valgfri afdeling og vagttype). Bruges af administrator-kalenderen (`/dashboard`). |

### Columns

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` | **PK** |
| `workplace_id` | `uuid` | **FK** → `workplaces(id)` |
| `department_id` | `uuid` | **FK** → `workplace_departments(id)` (nullable) |
| `user_id` | `uuid` | **FK** → `auth.users(id)` |
| `shift_type_id` | `uuid` | **FK** → `workplace_shift_types(id)` (nullable) |
| `starts_at` | `timestamptz` | |
| `ends_at` | `timestamptz` | Skal være > `starts_at` |
| `created_at` | `timestamptz` | |

### RLS

| Policy | Command | Rule |
|--------|---------|------|
| `workplace_shifts_select_member` | `SELECT` | Bruger er medlem af `workplace_id` |
| `workplace_shifts_insert_admin` | `INSERT` | `ADMIN` eller `SUPER_ADMIN` på arbejdspladsen |
| `workplace_shifts_update_admin` | `UPDATE` | Samme |
| `workplace_shifts_delete_admin` | `DELETE` | Samme |

**App:** `src/app/dashboard/workplace-shifts-actions.ts` (`getWorkplaceShiftsInRange`).

---

## Entity relationship (summary)

```
auth.users
    ├── user_roles.user_id
    ├── user_ui_preferences.user_id (layout_theme)
    └── workplace_members.user_id ──► workplaces.id
                                              ▲
                                              └── workplace_members.workplace_id
                                              │
workplace_departments.workplace_id ───────────┘
workplace_department_members ──► workplace_departments.id
                                 workplace_department_members.user_id ──► auth.users

workplace_shifts.workplace_id ──► workplaces.id
workplace_shifts.department_id ──► workplace_departments.id
workplace_shifts.user_id ──► auth.users
workplace_shifts.shift_type_id ──► workplace_shift_types.id

employee_type_templates ──► workplace_employee_types.template_id
shift_type_templates      ──► workplace_shift_types.template_id
workplaces.id             ──► workplace_employee_types.workplace_id
                              workplace_shift_types.workplace_id
                              workplace_api_keys.workplace_id

languages.language_code ◄── languages.primary_language_code (self-FK)
    ├── eu_countries.primary_language_code
    └── ui_translations.language_code
```

---

## Quick table index

| Table | Domain |
|-------|--------|
| `auth.users` | Supabase Auth identities |
| `user_roles` | Global roles (legacy RBAC) |
| `workplaces` | Tenants + firma/indstillinger |
| `workplace_members` | Per-tenant membership (one role per user per workplace) |
| `employee_type_templates` / `shift_type_templates` | Super Admin standardtyper |
| `workplace_employee_types` / `workplace_shift_types` | Typer pr. tenant |
| `workplace_api_keys` | API-nøgler (hash) |
| `workplace_departments` | Afdelinger pr. tenant |
| `workplace_department_members` | Bruger ↔ afdeling (samme arbejdsplads) |
| `workplace_shifts` | Planlagte vagter (kalender) |
| `user_ui_preferences` | Bruger-layout/tema (profil) |
| `languages` | Language registry + fallback |
| `eu_countries` | EU countries + primary language |
| `ui_translations` | Localized UI strings |
| `super_admin_notification_batches` | Udsendelses-batches fra Super Admin (original tekst + scope) |
| `super_admin_notification_deliveries` | Modtagerrækker pr. batch (sprog, oversat titel/brødtekst, status) |
