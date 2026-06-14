"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import {
  assertWorkplaceAdminOrSuperAdmin,
  assertWorkplaceMember,
  isWorkplaceCalendarAdminView,
} from "@/src/lib/workplace-admin-server";
import {
  assertStandardPlanEmployeeCapacity,
} from "@/src/lib/workplace-employee-limit-server";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import {
  normalizeSeasonTemplate,
  type SeasonTemplatePayload,
} from "@/src/types/season-template";
import {
  getConfigDefaultComplianceRules,
  normalizeComplianceRules,
  serializeComplianceRules,
  type ComplianceRule,
} from "@/src/lib/compliance/rules";
import {
  isSubscriptionTier,
  normalizeSubscriptionTier,
  type SubscriptionTier,
} from "@/src/config/subscriptions";
import {
  isEmployeeCountBand,
  isNotificationChannel,
  type EmployeeCountBand,
  type NotificationChannel,
} from "@/src/types/workplace";
import type { CalendarPublicHolidayDef } from "@/src/lib/calendar-holidays";
import {
  incrementWorkplaceActiveEmployeeInvites,
  incrementWorkplaceImportedFilesCount,
  updateLifecycleStage,
} from "@/src/lib/workplace-lifecycle";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

export type WorkplacePublicHolidayDef = CalendarPublicHolidayDef;

async function requireSuperAdmin() {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);
}

function revalidateWorkplaceDetailPages(workplaceId: string) {
  revalidatePath(`/super-admin/workplaces/${workplaceId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/indstillinger");
  revalidatePath("/dashboard/fremtiden");
}

const COMPLIANCE_PROFILE_KEY_DEFAULT = "default";

export type ComplianceRulesResolution = {
  rules: ComplianceRule[];
  source: "workplace_override" | "global_default" | "config_default";
};

/** PostgREST / Postgres når tabeller ikke findes eller cache er forældet */
function isMissingSchemaError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("could not find") ||
    m.includes("does not exist") ||
    m.includes("42p01") ||
    m.includes("undefined table") ||
    (m.includes("relation") && m.includes("does not exist"))
  );
}

function extractMissingWorkplacesColumn(message: string): string | null {
  const match =
    /Could not find the '([^']+)' column of 'workplaces'/i.exec(message) ??
    /column "([^"]+)" of relation "workplaces" does not exist/i.exec(message);
  return match?.[1] ?? null;
}

async function readGlobalComplianceRules(
  admin: ReturnType<typeof getAdminClient>
): Promise<{ rules: ComplianceRule[]; source: "global_default" | "config_default" }> {
  const cfg = getConfigDefaultComplianceRules();
  const { data, error } = await admin
    .from("compliance_rule_profiles")
    .select("rules_json")
    .eq("profile_key", COMPLIANCE_PROFILE_KEY_DEFAULT)
    .maybeSingle();
  if (error) {
    if (isMissingSchemaError(error.message)) {
      return { rules: cfg, source: "config_default" };
    }
    throw new Error(error.message);
  }
  const parsed = normalizeComplianceRules(data?.rules_json ?? null);
  if (parsed.length === 0) {
    return { rules: cfg, source: "config_default" };
  }
  return { rules: parsed, source: "global_default" };
}

export type WorkplaceRow = {
  id: string;
  name: string;
  company_name: string | null;
  city: string | null;
  created_at: string;
};

export type WorkplaceDetail = {
  id: string;
  name: string;
  company_name: string | null;
  vat_number: string | null;
  street_name: string | null;
  street_number: string | null;
  address_extra: string | null;
  postal_code: string | null;
  city: string | null;
  country_code: string | null;
  contact_email: string | null;
  phone: string | null;
  employee_count_band: EmployeeCountBand;
  stripe_customer_id: string | null;
  lifecycle_stage: string;
  language: string;
  imported_files_count: number;
  active_employee_invites: number;
  manual_shifts_created_count: number;
  subscription_status: string;
  subscription_tier: SubscriptionTier;
  lifecycle_updated_at: string | null;
  /** 1=autopilot, 2=manual kontrol, 3=skrivebeskyttet */
  employee_swap_permission_level: number;
  push_include_shift_type_ids: string[];
  push_include_employee_type_ids: string[];
  created_at: string;
  /** Ufrigivet kalender-vindue (uger), standard 8 */
  future_planning_weeks: number;
  /** Sidste dato medarbejdere kan se; derefter kun admin indtil frigivelse */
  calendar_released_until: string | null;
  /** Sæson-skabelon (perioder / ugedage) */
  season_template_json: SeasonTemplatePayload;
  /** Arbejdspladsens lokale regel-override (null = brug global standard) */
  compliance_rules_override_json: ComplianceRule[] | null;
};

export type TypeTemplateRow = {
  id: string;
  name: string;
  slug: string;
  /** Stabil import-kode for vagttyper (fx ST001). Null for typer uden standardkode. */
  import_code?: string | null;
  sort_order: number;
  /** Vagttyper — hex (#rrggbb) */
  calendar_color: string | null;
  /** Medarbejdertyper — none | stripes | dots | grid | diagonal */
  calendar_pattern: string | null;
};

export type WorkplaceEmployeeTypeRow = {
  id: string;
  template_id: string | null;
  label: string;
  sort_order: number;
  calendar_pattern: string | null;
};

export type WorkplaceShiftTypeRow = {
  id: string;
  template_id: string | null;
  label: string;
  /** Afledt fra skabelon-kode når muligt (fx ST001). */
  import_code?: string | null;
  sort_order: number;
  calendar_color: string | null;
};

export type WorkplaceApiKeyMeta = {
  id: string;
  key_prefix: string;
  label: string;
  created_at: string;
  revoked_at: string | null;
};

export type WorkplaceDepartmentRow = {
  id: string;
  workplace_id: string;
  name: string;
  created_at: string;
};

export type EuCountryOptionRow = {
  country_code: string;
  name: string;
};

/** Medlem med e-mail og liste af afdelings-id’er på samme arbejdsplads */
export type WorkplaceMemberDepartmentsRow = {
  /** Række-id i workplace_members (bruges som kort medarbejder-id i kalender for EMPLOYEE-visning) */
  workplace_member_id: string;
  user_id: string;
  email: string | null;
  role: string;
  department_ids: string[];
  /** Valgfri — kræver `supabase_patch_workplace_members_employee_type.sql` */
  employee_type_id: string | null;
  /** Vist navn: override → OAuth (Google/Facebook) → e-mail */
  display_name: string;
  oauth_display_name: string | null;
  display_name_override: string | null;
};

/** Navn fra OAuth-provider (user_metadata), typisk Google/Facebook */
function oauthDisplayNameFromUserMetadata(
  meta: Record<string, unknown> | undefined
): string | null {
  if (!meta) return null;
  const full = meta.full_name ?? meta.name;
  if (typeof full === "string" && full.trim()) return full.trim();
  const given = meta.given_name;
  const family = meta.family_name;
  if (typeof given === "string" && typeof family === "string") {
    const g = given.trim();
    const f = family.trim();
    if (g && f) return `${g} ${f}`;
    if (g) return g;
    if (f) return f;
  }
  if (typeof given === "string" && given.trim()) return given.trim();
  if (typeof family === "string" && family.trim()) return family.trim();
  const pref = meta.preferred_username;
  if (typeof pref === "string" && pref.trim()) return pref.trim();
  return null;
}

function resolveMemberDisplayName(
  oauthName: string | null,
  override: string | null | undefined,
  email: string | null,
  userId: string
): { display_name: string; oauth_display_name: string | null; display_name_override: string | null } {
  const ovr = override?.trim() ? override.trim() : null;
  const oauth = oauthName?.trim() ? oauthName.trim() : null;
  const mail = email?.trim() ? email.trim() : null;
  const display =
    ovr ?? oauth ?? mail ?? `${userId.slice(0, 8)}…`;
  return {
    display_name: display,
    oauth_display_name: oauth,
    display_name_override: ovr,
  };
}

function normalizeTemplateMatchKey(value: string | null | undefined): string {
  return (value ?? "").trim().toLocaleLowerCase("da");
}

const LEGACY_SHIFT_LABEL_TO_STANDARD = new Map<string, string>([
  ["dag", "Normal"],
  ["day", "Normal"],
  ["aften", "Normal"],
  ["evening", "Normal"],
  ["nat", "Normal"],
  ["night", "Normal"],
  ["syg", "Sygdom"],
  ["sygemelding", "Sygdom"],
  ["sick", "Sygdom"],
  ["akut vagt", "Akut"],
  ["vikar vagt", "Ledig"],
  ["fridag", "Ferie"],
  ["fri", "Ferie"],
]);

const SHIFT_IMPORT_CODE_TO_STANDARD_LABEL = new Map<string, string>([
  ["ST001", "Morning"],
  ["ST002", "Day"],
  ["ST003", "Midday"],
  ["ST004", "Afternoon"],
  ["ST005", "Night"],
  ["ST006", "Long"],
  ["ST007", "Short"],
  ["ST008", "Split 1"],
  ["ST009", "Split 2"],
  ["ST010", "On-Call"],
  ["ST011", "Day Off"],
  ["ST012", "Vacation"],
  ["ST013", "Sick"],
  ["ST014", "Child Sick"],
  ["ST015", "Training"],
  ["ST016", "Comp. Off"],
  ["ST017", "Shift Swap"],
  ["ST018", "Open Shift"],
  ["ST019", "Urgent"],
]);

const SHIFT_IDENTIFIER_TO_IMPORT_CODE = new Map<string, string>([
  ["st001", "ST001"],
  ["morning", "ST001"],
  ["morgen", "ST001"],
  ["st002", "ST002"],
  ["day", "ST002"],
  ["dag", "ST002"],
  ["normal", "ST002"],
  ["st003", "ST003"],
  ["midday", "ST003"],
  ["middag", "ST003"],
  ["st004", "ST004"],
  ["afternoon", "ST004"],
  ["aften", "ST004"],
  ["st005", "ST005"],
  ["night", "ST005"],
  ["nat", "ST005"],
  ["st006", "ST006"],
  ["long", "ST006"],
  ["lang", "ST006"],
  ["st007", "ST007"],
  ["short", "ST007"],
  ["kort", "ST007"],
  ["st008", "ST008"],
  ["split1", "ST008"],
  ["split 1", "ST008"],
  ["split_1", "ST008"],
  ["st009", "ST009"],
  ["split2", "ST009"],
  ["split 2", "ST009"],
  ["split_2", "ST009"],
  ["st010", "ST010"],
  ["on-call", "ST010"],
  ["on call", "ST010"],
  ["on_call", "ST010"],
  ["st011", "ST011"],
  ["off", "ST011"],
  ["day off", "ST011"],
  ["fridag", "ST011"],
  ["fri", "ST011"],
  ["st012", "ST012"],
  ["vacation", "ST012"],
  ["ferie", "ST012"],
  ["st013", "ST013"],
  ["sick", "ST013"],
  ["syg", "ST013"],
  ["sygdom", "ST013"],
  ["st014", "ST014"],
  ["child-sick", "ST014"],
  ["child sick", "ST014"],
  ["child_sick", "ST014"],
  ["child_sick_day", "ST014"],
  ["barn 1. sygedag", "ST014"],
  ["st015", "ST015"],
  ["training", "ST015"],
  ["træning", "ST015"],
  ["st016", "ST016"],
  ["comp-off", "ST016"],
  ["comp off", "ST016"],
  ["comp_off", "ST016"],
  ["afspadsering", "ST016"],
  ["st017", "ST017"],
  ["swap", "ST017"],
  ["bytte", "ST017"],
  ["shift swap", "ST017"],
  ["st018", "ST018"],
  ["open", "ST018"],
  ["open shift", "ST018"],
  ["ledig", "ST018"],
  ["st019", "ST019"],
  ["urgent", "ST019"],
  ["akut", "ST019"],
]);

function inferShiftImportCode(value: string | null | undefined): string | null {
  const key = normalizeTemplateMatchKey(value).replace(/_/g, " ");
  if (!key) return null;
  const compact = key.replace(/\s+/g, "");
  return (
    SHIFT_IDENTIFIER_TO_IMPORT_CODE.get(key) ??
    SHIFT_IDENTIFIER_TO_IMPORT_CODE.get(compact) ??
    null
  );
}

const LEGACY_EMPLOYEE_LABEL_TO_STANDARD = new Map<string, string>([
  ["permanent", "Fuldtid"],
  ["fastansat", "Fuldtid"],
  ["parttime", "Deltid"],
  ["deltidsansat", "Deltid"],
  ["trainee", "Elev"],
  ["praktikant", "Elev"],
  ["temporary", "Vikar"],
  ["ung", "Ung (under 18)"],
  ["youth", "Ung (under 18)"],
]);

function fallbackHolidayDefsForCountry(
  countryCode: string
): WorkplacePublicHolidayDef[] {
  if (countryCode !== "DK") return [];
  return [
    { holiday_rule: "fixed", month: 1, day: 1, easter_offset_days: null, display_name: "Nytårsdag" },
    { holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: -3, display_name: "Skærtorsdag" },
    { holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: -2, display_name: "Langfredag" },
    { holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 0, display_name: "Påskedag" },
    { holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 1, display_name: "2. påskedag" },
    { holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 26, display_name: "Store bededag" },
    { holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 39, display_name: "Kristi himmelfartsdag" },
    { holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 49, display_name: "Pinsedag" },
    { holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 50, display_name: "2. pinsedag" },
    { holiday_rule: "fixed", month: 6, day: 5, easter_offset_days: null, display_name: "Grundlovsdag" },
    { holiday_rule: "fixed", month: 12, day: 24, easter_offset_days: null, display_name: "Juleaften" },
    { holiday_rule: "fixed", month: 12, day: 25, easter_offset_days: null, display_name: "1. juledag" },
    { holiday_rule: "fixed", month: 12, day: 26, easter_offset_days: null, display_name: "2. juledag" },
    { holiday_rule: "fixed", month: 12, day: 31, easter_offset_days: null, display_name: "Nytårsaften" },
  ];
}

function parseSemicolonCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === "\"") {
      const next = line[i + 1];
      if (inQuotes && next === "\"") {
        cur += "\"";
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ";" && !inQuotes) {
      cells.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

async function listAuthUsersByEmailLower(
  admin: ReturnType<typeof getAdminClient>
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  let page = 1;
  const perPage = 1000;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      break;
    }
    const users = data.users ?? [];
    for (const user of users) {
      const email = (user.email ?? "").trim().toLowerCase();
      if (!email) continue;
      out.set(email, user.id);
    }
    if (users.length < perPage) break;
    page += 1;
    if (page > 100) break;
  }
  return out;
}

export type WorkplaceMemberImportRowResult = {
  line: number;
  email: string;
  status: "created_invited" | "added_existing" | "already_member" | "error";
  message: string;
  activationLink: string | null;
};

async function assertDepartmentIdsBelongToWorkplace(
  admin: ReturnType<typeof getAdminClient>,
  workplaceId: string,
  departmentIds: string[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const unique = [...new Set(departmentIds)].filter(Boolean);
  if (unique.length === 0) {
    return { ok: true };
  }
  const { data, error } = await admin
    .from("workplace_departments")
    .select("id")
    .eq("workplace_id", workplaceId)
    .in("id", unique);
  if (error) {
    return { ok: false, error: error.message };
  }
  const found = new Set((data ?? []).map((r) => r.id as string));
  for (const id of unique) {
    if (!found.has(id)) {
      return {
        ok: false,
        error:
          "Én eller flere afdelinger tilhører ikke denne arbejdsplads (ugyldigt id).",
      };
    }
  }
  return { ok: true };
}

export type CreateWorkplaceInput = {
  name: string;
  company_name: string;
  vat_number?: string;
  street_name?: string;
  street_number?: string;
  address_extra?: string;
  postal_code?: string;
  city?: string;
  country_code?: string;
  contact_email?: string;
  phone?: string;
  employee_count_band: EmployeeCountBand;
  notification_channel: NotificationChannel;
};

export async function getWorkplaces(): Promise<
  { ok: true; data: WorkplaceRow[] } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("workplaces")
      .select("id, name, company_name, city, created_at")
      .order("name");

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, data: (data ?? []) as WorkplaceRow[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function listEuCountriesForWorkplace(
  workplaceId: string
): Promise<{ ok: true; data: EuCountryOptionRow[] } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("eu_countries")
      .select("country_code, name")
      .order("name", { ascending: true });
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return { ok: true, data: [] };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true, data: (data ?? []) as EuCountryOptionRow[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

/**
 * @returns `null` hvis OK, ellers en advarsels-tekst (arbejdspladsen er stadig oprettet).
 */
/**
 * Indsætter manglende rækker fra standardkataloget (idempotent — springer skabeloner over der allerede findes).
 */
async function copyTemplatesToWorkplace(
  workplaceId: string
): Promise<string | null> {
  const admin = getAdminClient();

  const { data: existingEmp } = await admin
    .from("workplace_employee_types")
    .select("template_id")
    .eq("workplace_id", workplaceId);
  const existingEmpTemplateIds = new Set(
    (existingEmp ?? [])
      .map((r) => r.template_id)
      .filter((id): id is string => Boolean(id))
  );

  const { data: existingShift } = await admin
    .from("workplace_shift_types")
    .select("template_id")
    .eq("workplace_id", workplaceId);
  const existingShiftTemplateIds = new Set(
    (existingShift ?? [])
      .map((r) => r.template_id)
      .filter((id): id is string => Boolean(id))
  );

  const { data: et, error: e1 } = await admin
    .from("employee_type_templates")
    .select("id, name, sort_order, calendar_pattern")
    .order("sort_order");
  if (e1) {
    if (isMissingSchemaError(e1.message)) {
      return "Kør supabase_workplace_extended.sql i Supabase SQL Editor. Hvis tabellen findes: Project Settings → API → Reload schema.";
    }
    return `Kunne ikke hente medarbejder-skabeloner: ${e1.message}`;
  }

  const { data: st, error: e2 } = await admin
    .from("shift_type_templates")
    .select("id, name, sort_order, calendar_color")
    .order("sort_order");
  if (e2) {
    if (isMissingSchemaError(e2.message)) {
      return "Kør supabase_workplace_extended.sql i Supabase SQL Editor. Hvis tabellen findes: Project Settings → API → Reload schema.";
    }
    return `Kunne ikke hente vagt-skabeloner: ${e2.message}`;
  }

  for (const row of et ?? []) {
    const tid = row.id as string;
    if (existingEmpTemplateIds.has(tid)) continue;
    const { error } = await admin.from("workplace_employee_types").insert({
      workplace_id: workplaceId,
      template_id: tid,
      label: row.name as string,
      sort_order: row.sort_order as number,
      calendar_pattern: (row as { calendar_pattern?: string | null }).calendar_pattern ?? "none",
    });
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return "Kør supabase_workplace_extended.sql (workplace_employee_types). Eller Reload schema under API-indstillinger.";
      }
      return `Kunne ikke kopiere medarbejder-typer: ${error.message}`;
    }
  }

  for (const row of st ?? []) {
    const tid = row.id as string;
    if (existingShiftTemplateIds.has(tid)) continue;
    const { error } = await admin.from("workplace_shift_types").insert({
      workplace_id: workplaceId,
      template_id: tid,
      label: row.name as string,
      sort_order: row.sort_order as number,
      calendar_color: (row as { calendar_color?: string | null }).calendar_color ?? "#94a3b8",
    });
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return "Kør supabase_workplace_extended.sql (workplace_shift_types). Eller Reload schema under API-indstillinger.";
      }
      return `Kunne ikke kopiere vagttyper: ${error.message}`;
    }
  }

  return null;
}

/** Super Admin: kopier manglende standardtyper til arbejdspladsen (fx før notifikationsfiltre kan bruges). */
export async function copyWorkplaceTemplatesFromStandards(
  workplaceId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const warn = await copyTemplatesToWorkplace(workplaceId);
    if (warn) {
      return { ok: false, error: warn };
    }
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function createWorkplace(
  input: CreateWorkplaceInput
): Promise<
  | { ok: true; data: WorkplaceRow; warning?: string }
  | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const name = input.name.trim();
    const companyName = input.company_name.trim();
    if (!name || !companyName) {
      return { ok: false, error: "Navn og firmanavn skal udfyldes." };
    }
    if (!isEmployeeCountBand(input.employee_count_band)) {
      return { ok: false, error: "Ugyldigt interval for antal ansatte." };
    }
    if (!isNotificationChannel(input.notification_channel)) {
      return { ok: false, error: "Ugyldig notifikationsindstilling." };
    }

    const admin = getAdminClient();
    const language = input.country_code?.trim().toUpperCase() === "DK" ? "da" : "en";
    const { data, error } = await admin
      .from("workplaces")
      .insert({
        name,
        company_name: companyName,
        vat_number: input.vat_number?.trim() || null,
        street_name: input.street_name?.trim() || null,
        street_number: input.street_number?.trim() || null,
        address_extra: input.address_extra?.trim() || null,
        postal_code: input.postal_code?.trim() || null,
        city: input.city?.trim() || null,
        country_code: input.country_code?.trim().toUpperCase() || null,
        contact_email: input.contact_email?.trim() || null,
        phone: input.phone?.trim() || null,
        employee_count_band: input.employee_count_band,
        notification_channel: input.notification_channel,
        language,
      })
      .select("id, name, company_name, city, created_at")
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    const row = data as WorkplaceRow;
    const copyWarning = await copyTemplatesToWorkplace(row.id);
    await updateLifecycleStage(row.id, {
      source: "workplace_created",
      context: { language, employee_count_band: input.employee_count_band },
    });

    revalidatePath("/super-admin/users");
    revalidatePath("/super-admin/workplaces");
    return {
      ok: true,
      data: row,
      ...(copyWarning ? { warning: copyWarning } : {}),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

/** Bagudkompatibel: kun navn (bruger defaults for band og notifikation) */
export async function createWorkplaceLegacy(
  name: string
): Promise<
  | { ok: true; data: WorkplaceRow; warning?: string }
  | { ok: false; error: string }
> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, error: "Navn kan ikke være tomt." };
  }
  return createWorkplace({
    name: trimmed,
    company_name: trimmed,
    employee_count_band: "5-20",
    notification_channel: "push",
  });
}

function mapDetail(row: Record<string, unknown>): WorkplaceDetail {
  const fw = row.future_planning_weeks;
  const importedFilesCountRaw = row.imported_files_count;
  const activeInvitesRaw = row.active_employee_invites;
  const manualShiftsRaw = row.manual_shifts_created_count;
  const swapPermissionRaw = row.employee_swap_permission_level;
  return {
    id: row.id as string,
    name: row.name as string,
    company_name: (row.company_name as string) ?? null,
    vat_number: (row.vat_number as string) ?? null,
    street_name: (row.street_name as string) ?? null,
    street_number: (row.street_number as string) ?? null,
    address_extra: (row.address_extra as string) ?? null,
    postal_code: (row.postal_code as string) ?? null,
    city: (row.city as string) ?? null,
    country_code: (row.country_code as string) ?? null,
    contact_email: (row.contact_email as string) ?? null,
    phone: (row.phone as string) ?? null,
    employee_count_band: row.employee_count_band as EmployeeCountBand,
    stripe_customer_id: (row.stripe_customer_id as string) ?? null,
    lifecycle_stage: String(row.lifecycle_stage ?? "PROSPECT"),
    language: String(row.language ?? "en"),
    imported_files_count:
      typeof importedFilesCountRaw === "number" && Number.isFinite(importedFilesCountRaw)
        ? importedFilesCountRaw
        : 0,
    active_employee_invites:
      typeof activeInvitesRaw === "number" && Number.isFinite(activeInvitesRaw)
        ? activeInvitesRaw
        : 0,
    manual_shifts_created_count:
      typeof manualShiftsRaw === "number" && Number.isFinite(manualShiftsRaw)
        ? manualShiftsRaw
        : 0,
    subscription_status: String(row.subscription_status ?? "inactive"),
    subscription_tier: normalizeSubscriptionTier(
      typeof row.subscription_tier === "string" ? row.subscription_tier : null
    ),
    lifecycle_updated_at:
      row.lifecycle_updated_at == null ? null : String(row.lifecycle_updated_at),
    employee_swap_permission_level:
      typeof swapPermissionRaw === "number" && Number.isFinite(swapPermissionRaw)
        ? Math.min(3, Math.max(1, Math.trunc(swapPermissionRaw)))
        : 2,
    push_include_shift_type_ids: (row.push_include_shift_type_ids as string[]) ?? [],
    push_include_employee_type_ids:
      (row.push_include_employee_type_ids as string[]) ?? [],
    created_at: row.created_at as string,
    future_planning_weeks:
      typeof fw === "number" && Number.isFinite(fw) ? fw : 8,
    calendar_released_until:
      row.calendar_released_until == null || row.calendar_released_until === ""
        ? null
        : String(row.calendar_released_until).slice(0, 10),
    season_template_json: normalizeSeasonTemplate(row.season_template_json),
    compliance_rules_override_json: (() => {
      const parsed = normalizeComplianceRules(row.compliance_rules_override_json);
      return parsed.length > 0 ? parsed : null;
    })(),
  };
}

const WORKPLACE_DETAIL_SELECT_BASE =
  "id, name, company_name, vat_number, street_name, street_number, address_extra, postal_code, city, country_code, contact_email, phone, employee_count_band, stripe_customer_id, lifecycle_stage, language, imported_files_count, active_employee_invites, manual_shifts_created_count, subscription_status, subscription_tier, lifecycle_updated_at, employee_swap_permission_level, push_include_shift_type_ids, push_include_employee_type_ids, created_at";

const WORKPLACE_DETAIL_SELECT_LEGACY =
  "id, name, company_name, vat_number, street_name, street_number, address_extra, postal_code, city, country_code, contact_email, phone, employee_count_band, stripe_customer_id, push_include_shift_type_ids, push_include_employee_type_ids, created_at";

const WORKPLACE_DETAIL_SELECT_EXTENDED = `${WORKPLACE_DETAIL_SELECT_BASE}, future_planning_weeks, calendar_released_until, season_template_json, compliance_rules_override_json`;

export async function getWorkplaceById(
  id: string
): Promise<
  { ok: true; data: WorkplaceDetail } | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(id);
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("workplaces")
      .select(WORKPLACE_DETAIL_SELECT_EXTENDED)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      if (/column|does not exist|schema cache/i.test(error.message)) {
        const { data: d2, error: e2 } = await admin
          .from("workplaces")
          .select(WORKPLACE_DETAIL_SELECT_LEGACY)
          .eq("id", id)
          .maybeSingle();
        if (e2 || !d2) {
          return { ok: false, error: error.message };
        }
        return {
          ok: true,
          data: mapDetail({
            ...(d2 as Record<string, unknown>),
            future_planning_weeks: 8,
            calendar_released_until: null,
            season_template_json: {},
            compliance_rules_override_json: null,
          }),
        };
      }
      return { ok: false, error: error.message };
    }
    if (!data) {
      return { ok: false, error: "Arbejdsplads ikke fundet." };
    }
    return { ok: true, data: mapDetail(data as Record<string, unknown>) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function getGlobalComplianceRulesForSuperAdmin(): Promise<
  { ok: true; rules: ComplianceRule[]; source: "global_default" | "config_default" } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const global = await readGlobalComplianceRules(admin);
    return { ok: true, rules: global.rules, source: global.source };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function saveGlobalComplianceRulesForSuperAdmin(
  rules: ComplianceRule[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const normalized = normalizeComplianceRules(rules);
    if (normalized.length === 0) {
      return { ok: false, error: "Regelsaet kan ikke vaere tomt." };
    }
    const admin = getAdminClient();
    const { error } = await admin.from("compliance_rule_profiles").upsert(
      {
        profile_key: COMPLIANCE_PROFILE_KEY_DEFAULT,
        rules_json: serializeComplianceRules(normalized),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_key" }
    );
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Compliance rule profile-tabellen mangler. Koer SQL-patchen for compliance rules og reload schema.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/workplace-templates");
    revalidatePath("/dashboard/indstillinger");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function getWorkplaceComplianceRules(
  workplaceId: string
): Promise<{ ok: true; data: ComplianceRulesResolution } | { ok: false; error: string }> {
  try {
    await assertWorkplaceMember(workplaceId);
    const admin = getAdminClient();
    const global = await readGlobalComplianceRules(admin);
    const { data: wp, error } = await admin
      .from("workplaces")
      .select("compliance_rules_override_json")
      .eq("id", workplaceId)
      .maybeSingle();
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return { ok: true, data: { rules: global.rules, source: global.source } };
      }
      return { ok: false, error: error.message };
    }
    const override = normalizeComplianceRules(wp?.compliance_rules_override_json ?? null);
    if (override.length > 0) {
      return {
        ok: true,
        data: { rules: override, source: "workplace_override" },
      };
    }
    return { ok: true, data: { rules: global.rules, source: global.source } };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function saveWorkplaceComplianceRules(
  workplaceId: string,
  rules: ComplianceRule[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const normalized = normalizeComplianceRules(rules);
    if (normalized.length === 0) {
      return { ok: false, error: "Regelsaet kan ikke vaere tomt." };
    }
    const admin = getAdminClient();
    const { error } = await admin
      .from("workplaces")
      .update({
        compliance_rules_override_json: serializeComplianceRules(normalized),
      })
      .eq("id", workplaceId);
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Workplace-kolonnen for compliance override mangler. Koer SQL-patchen for compliance rules og reload schema.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function resetWorkplaceComplianceRulesToDefault(
  workplaceId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const { error } = await admin
      .from("workplaces")
      .update({ compliance_rules_override_json: null })
      .eq("id", workplaceId);
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Workplace-kolonnen for compliance override mangler. Koer SQL-patchen for compliance rules og reload schema.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function getWorkplaceTypes(
  workplaceId: string
): Promise<
  | {
      ok: true;
      employeeTypes: WorkplaceEmployeeTypeRow[];
      shiftTypes: WorkplaceShiftTypeRow[];
    }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const [eRes, sRes] = await Promise.all([
      admin
        .from("workplace_employee_types")
        .select("id, template_id, label, sort_order, calendar_pattern")
        .eq("workplace_id", workplaceId)
        .order("sort_order"),
      admin
        .from("workplace_shift_types")
        .select("id, template_id, label, sort_order, calendar_color")
        .eq("workplace_id", workplaceId)
        .order("sort_order"),
    ]);
    if (eRes.error) {
      if (isMissingSchemaError(eRes.error.message)) {
        return { ok: true, employeeTypes: [], shiftTypes: [] };
      }
      return { ok: false, error: eRes.error.message };
    }
    if (sRes.error) {
      if (isMissingSchemaError(sRes.error.message)) {
        return {
          ok: true,
          employeeTypes: (eRes.data ?? []) as WorkplaceEmployeeTypeRow[],
          shiftTypes: [],
        };
      }
      return { ok: false, error: sRes.error.message };
    }
    const rawEmployeeTypes = (eRes.data ?? []) as WorkplaceEmployeeTypeRow[];
    const rawShiftTypes = (sRes.data ?? []) as WorkplaceShiftTypeRow[];
    const [employeeTemplateRes, shiftTemplateRes] = await Promise.all([
      admin.from("employee_type_templates").select("id, name, calendar_pattern"),
      admin.from("shift_type_templates").select("id, name, slug, import_code, calendar_color"),
    ]);
    const employeeTemplateById = new Map<string, { name: string; pattern: string | null }>();
    const employeeTemplateByName = new Map<string, { name: string; pattern: string | null }>();
    if (!employeeTemplateRes.error) {
      for (const row of employeeTemplateRes.data ?? []) {
        const id = String(row.id ?? "");
        const name = String(row.name ?? "").trim();
        if (!name) continue;
        const normalized = normalizeTemplateMatchKey(name);
        const template = {
          name,
          pattern: (row.calendar_pattern as string | null) ?? "none",
        };
        if (id) employeeTemplateById.set(id, template);
        if (normalized && !employeeTemplateByName.has(normalized)) {
          employeeTemplateByName.set(normalized, template);
        }
      }
    }
    const shiftTemplateById = new Map<string, { name: string; color: string | null; import_code: string | null }>();
    const shiftTemplateByName = new Map<string, { name: string; color: string | null; import_code: string | null }>();
    const shiftTemplateByImportCode = new Map<
      string,
      { name: string; color: string | null; import_code: string | null }
    >();
    if (!shiftTemplateRes.error) {
      for (const row of shiftTemplateRes.data ?? []) {
        const id = String(row.id ?? "");
        const name = String(row.name ?? "").trim();
        if (!name) continue;
        const normalized = normalizeTemplateMatchKey(name);
        const slug = String(row.slug ?? "").trim();
        const import_code =
          (row.import_code as string | null) ??
          inferShiftImportCode(slug) ??
          inferShiftImportCode(name);
        const template = {
          name,
          color: (row.calendar_color as string | null) ?? "#94a3b8",
          import_code,
        };
        if (id) shiftTemplateById.set(id, template);
        if (normalized && !shiftTemplateByName.has(normalized)) {
          shiftTemplateByName.set(normalized, template);
        }
        if (import_code && !shiftTemplateByImportCode.has(import_code)) {
          shiftTemplateByImportCode.set(import_code, template);
        }
      }
    }
    const employeeTypes = rawEmployeeTypes.map((row) => {
      const key = normalizeTemplateMatchKey(row.label);
      const legacy = LEGACY_EMPLOYEE_LABEL_TO_STANDARD.get(key);
      const byTemplateId = row.template_id ? employeeTemplateById.get(row.template_id) : undefined;
      const byTemplateName = employeeTemplateByName.get(legacy ? normalizeTemplateMatchKey(legacy) : key);
      return {
        ...row,
        label: byTemplateId?.name ?? byTemplateName?.name ?? legacy ?? row.label,
        calendar_pattern:
          byTemplateId?.pattern ?? byTemplateName?.pattern ?? row.calendar_pattern ?? "none",
      };
    });
    const shiftTypes = rawShiftTypes.map((row) => {
      const key = normalizeTemplateMatchKey(row.label);
      const legacy = LEGACY_SHIFT_LABEL_TO_STANDARD.get(key);
      const byTemplateId = row.template_id ? shiftTemplateById.get(row.template_id) : undefined;
      const importCode =
        byTemplateId?.import_code ??
        inferShiftImportCode(legacy ?? row.label);
      const byTemplateCode =
        importCode ? shiftTemplateByImportCode.get(importCode) : undefined;
      const byTemplateName = shiftTemplateByName.get(
        legacy ? normalizeTemplateMatchKey(legacy) : key
      );
      const canonicalByCode = importCode
        ? SHIFT_IMPORT_CODE_TO_STANDARD_LABEL.get(importCode)
        : undefined;
      return {
        ...row,
        import_code: importCode ?? null,
        label:
          byTemplateId?.name ??
          byTemplateCode?.name ??
          byTemplateName?.name ??
          canonicalByCode ??
          legacy ??
          row.label,
        calendar_color:
          byTemplateId?.color ??
          byTemplateCode?.color ??
          byTemplateName?.color ??
          row.calendar_color ??
          "#94a3b8",
      };
    });

    return {
      ok: true,
      employeeTypes,
      shiftTypes,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

async function nextWorkplaceEmployeeSortOrder(
  workplaceId: string
): Promise<number> {
  const admin = getAdminClient();
  const { data } = await admin
    .from("workplace_employee_types")
    .select("sort_order")
    .eq("workplace_id", workplaceId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return ((data?.sort_order as number | undefined) ?? 0) + 10;
}

async function nextWorkplaceShiftSortOrder(
  workplaceId: string
): Promise<number> {
  const admin = getAdminClient();
  const { data } = await admin
    .from("workplace_shift_types")
    .select("sort_order")
    .eq("workplace_id", workplaceId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return ((data?.sort_order as number | undefined) ?? 0) + 10;
}

/** Egen type (uden skabelon); bruges når arbejdspladsen tilføjer egne typer. */
export async function createWorkplaceEmployeeType(
  workplaceId: string,
  input: { label: string }
): Promise<
  | { ok: true; data: WorkplaceEmployeeTypeRow }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const label = input.label.trim();
    if (!label) {
      return { ok: false, error: "Navn skal udfyldes." };
    }
    const admin = getAdminClient();
    const sort_order = await nextWorkplaceEmployeeSortOrder(workplaceId);
    const { data, error } = await admin
      .from("workplace_employee_types")
      .insert({
        workplace_id: workplaceId,
        template_id: null,
        label,
        sort_order,
      })
      .select("id, template_id, label, sort_order, calendar_pattern")
      .single();
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Tabellen findes ikke. Kør supabase_workplace_extended.sql og reload schema.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true, data: data as WorkplaceEmployeeTypeRow };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function createWorkplaceShiftType(
  workplaceId: string,
  input: { label: string }
): Promise<
  | { ok: true; data: WorkplaceShiftTypeRow }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const label = input.label.trim();
    if (!label) {
      return { ok: false, error: "Navn skal udfyldes." };
    }
    const admin = getAdminClient();
    const sort_order = await nextWorkplaceShiftSortOrder(workplaceId);
    const { data, error } = await admin
      .from("workplace_shift_types")
      .insert({
        workplace_id: workplaceId,
        template_id: null,
        label,
        sort_order,
      })
      .select("id, template_id, label, sort_order, calendar_color")
      .single();
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Tabellen findes ikke. Kør supabase_workplace_extended.sql og reload schema.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true, data: data as WorkplaceShiftTypeRow };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export type UpdateWorkplaceInput = Partial<{
  name: string;
  company_name: string;
  vat_number: string | null;
  street_name: string | null;
  street_number: string | null;
  address_extra: string | null;
  postal_code: string | null;
  city: string | null;
  country_code: string | null;
  contact_email: string | null;
  phone: string | null;
  employee_count_band: EmployeeCountBand;
  stripe_customer_id: string | null;
  language: string;
  subscription_status: string;
  subscription_tier: SubscriptionTier;
  employee_swap_permission_level: number;
  push_include_shift_type_ids: string[];
  push_include_employee_type_ids: string[];
  future_planning_weeks: number;
  calendar_released_until: string | null;
  season_template_json: SeasonTemplatePayload;
}>;

export async function updateWorkplace(
  id: string,
  patch: UpdateWorkplaceInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(id);
    if (patch.employee_count_band !== undefined) {
      if (!isEmployeeCountBand(patch.employee_count_band)) {
        return { ok: false, error: "Ugyldigt interval for antal ansatte." };
      }
    }
    if (patch.future_planning_weeks !== undefined) {
      const w = patch.future_planning_weeks;
      if (!Number.isFinite(w) || w < 1 || w > 104) {
        return { ok: false, error: "Antal uger skal være mellem 1 og 104." };
      }
    }
    if (patch.employee_swap_permission_level !== undefined) {
      const v = Number(patch.employee_swap_permission_level);
      if (!Number.isFinite(v) || ![1, 2, 3].includes(Math.trunc(v))) {
        return { ok: false, error: "Bytte-rettighed skal være 1, 2 eller 3." };
      }
    }
    if (
      patch.subscription_tier !== undefined &&
      !isSubscriptionTier(patch.subscription_tier)
    ) {
      return { ok: false, error: "Ugyldigt abonnement-tier." };
    }
    const admin = getAdminClient();
    const row: Record<string, unknown> = { ...patch };
    if (patch.country_code !== undefined && patch.country_code !== null) {
      row.country_code = String(patch.country_code).trim().toUpperCase() || null;
    }
    if (patch.language !== undefined) {
      const lang = String(patch.language ?? "")
        .trim()
        .toLowerCase();
      if (!/^[a-z]{2}$/.test(lang)) {
        return { ok: false, error: "Sprog skal være ISO 639-1 (fx da eller en)." };
      }
      row.language = lang;
    }
    if (patch.employee_swap_permission_level !== undefined) {
      row.employee_swap_permission_level = Math.trunc(
        Number(patch.employee_swap_permission_level)
      );
    }

    const updateRow: Record<string, unknown> = { ...row };
    let lastErrorMessage: string | null = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      const { error } = await admin.from("workplaces").update(updateRow).eq("id", id);
      if (!error) {
        lastErrorMessage = null;
        break;
      }
      lastErrorMessage = error.message;
      const missingColumn = extractMissingWorkplacesColumn(error.message);
      if (!missingColumn || !(missingColumn in updateRow)) {
        break;
      }
      delete updateRow[missingColumn];
    }
    if (lastErrorMessage) {
      return { ok: false, error: lastErrorMessage };
    }
    await updateLifecycleStage(id, {
      source: "workplace_updated",
      context: { updated_fields: Object.keys(updateRow) },
    });
    revalidatePath("/super-admin/users");
    revalidateWorkplaceDetailPages(id);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function listEmployeeTypeTemplates(
  authWorkplaceId?: string
): Promise<
  { ok: true; data: TypeTemplateRow[] } | { ok: false; error: string }
> {
  try {
    if (authWorkplaceId != null && authWorkplaceId.length > 0) {
      await assertWorkplaceAdminOrSuperAdmin(authWorkplaceId);
    } else {
      await requireSuperAdmin();
    }
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("employee_type_templates")
      .select("id, name, slug, sort_order, calendar_pattern")
      .order("sort_order");
    if (error) {
      return { ok: false, error: error.message };
    }
    const rows = (data ?? []) as Record<string, unknown>[];
    return {
      ok: true,
      data: rows.map((r) => ({
        id: r.id as string,
        name: r.name as string,
        slug: r.slug as string,
        sort_order: r.sort_order as number,
        calendar_color: null,
        calendar_pattern: (r.calendar_pattern as string | null) ?? "none",
      })) as TypeTemplateRow[],
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function listShiftTypeTemplates(
  authWorkplaceId?: string
): Promise<
  { ok: true; data: TypeTemplateRow[] } | { ok: false; error: string }
> {
  try {
    if (authWorkplaceId != null && authWorkplaceId.length > 0) {
      await assertWorkplaceAdminOrSuperAdmin(authWorkplaceId);
    } else {
      await requireSuperAdmin();
    }
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("shift_type_templates")
      .select("id, name, slug, import_code, sort_order, calendar_color")
      .order("sort_order");
    if (error) {
      return { ok: false, error: error.message };
    }
    const rows = (data ?? []) as Record<string, unknown>[];
    return {
      ok: true,
      data: rows.map((r) => ({
        id: r.id as string,
        name: r.name as string,
        slug: r.slug as string,
        import_code: (r.import_code as string | null) ?? null,
        sort_order: r.sort_order as number,
        calendar_color: (r.calendar_color as string | null) ?? "#94a3b8",
        calendar_pattern: null,
      })) as TypeTemplateRow[],
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

function slugifyTemplateLabel(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
  return s || "type";
}

function isValidTemplateSlug(slug: string): boolean {
  return /^[a-z0-9_]+$/.test(slug) && slug.length >= 1 && slug.length <= 80;
}

async function nextEmployeeTemplateSortOrder(admin: ReturnType<typeof getAdminClient>): Promise<number> {
  const { data } = await admin
    .from("employee_type_templates")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return ((data?.sort_order as number | undefined) ?? 0) + 10;
}

async function nextShiftTemplateSortOrder(admin: ReturnType<typeof getAdminClient>): Promise<number> {
  const { data } = await admin
    .from("shift_type_templates")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return ((data?.sort_order as number | undefined) ?? 0) + 10;
}

export async function createEmployeeTypeTemplate(input: {
  name: string;
  slug?: string;
  sort_order?: number;
  calendar_pattern?: string;
}): Promise<{ ok: true; data: TypeTemplateRow } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const name = input.name.trim();
    if (!name) {
      return { ok: false, error: "Navn skal udfyldes." };
    }
    const slug = (input.slug?.trim() || slugifyTemplateLabel(name)).toLowerCase();
    if (!isValidTemplateSlug(slug)) {
      return {
        ok: false,
        error: "Slug må kun indeholde små bogstaver, tal og _ (fx dag_aften).",
      };
    }
    const admin = getAdminClient();
    const sort_order =
      input.sort_order !== undefined
        ? input.sort_order
        : await nextEmployeeTemplateSortOrder(admin);
    const calendar_pattern = input.calendar_pattern?.trim() || "none";
    const { data, error } = await admin
      .from("employee_type_templates")
      .insert({ name, slug, sort_order, calendar_pattern })
      .select("id, name, slug, sort_order, calendar_pattern")
      .single();
    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Slug findes allerede — vælg et andet." };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/workplace-templates");
    const row = data as Record<string, unknown>;
    return {
      ok: true,
      data: {
        id: row.id as string,
        name: row.name as string,
        slug: row.slug as string,
        sort_order: row.sort_order as number,
        calendar_color: null,
        calendar_pattern: (row.calendar_pattern as string) ?? "none",
      },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function updateEmployeeTypeTemplate(
  id: string,
  patch: {
    name?: string;
    slug?: string;
    sort_order?: number;
    calendar_pattern?: string;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) {
      const name = patch.name.trim();
      if (!name) {
        return { ok: false, error: "Navn kan ikke være tomt." };
      }
      row.name = name;
    }
    if (patch.slug !== undefined) {
      const slug = patch.slug.trim().toLowerCase();
      if (!isValidTemplateSlug(slug)) {
        return {
          ok: false,
          error: "Slug må kun indeholde små bogstaver, tal og _.",
        };
      }
      row.slug = slug;
    }
    if (patch.sort_order !== undefined) {
      row.sort_order = patch.sort_order;
    }
    if (patch.calendar_pattern !== undefined) {
      row.calendar_pattern = patch.calendar_pattern.trim() || "none";
    }
    if (Object.keys(row).length === 0) {
      return { ok: true };
    }
    const admin = getAdminClient();
    const { error } = await admin
      .from("employee_type_templates")
      .update(row)
      .eq("id", id);
    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Slug findes allerede." };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/workplace-templates");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function deleteEmployeeTypeTemplate(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { error } = await admin.from("employee_type_templates").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/workplace-templates");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function createShiftTypeTemplate(input: {
  name: string;
  slug?: string;
  import_code?: string;
  sort_order?: number;
  calendar_color?: string;
}): Promise<{ ok: true; data: TypeTemplateRow } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const name = input.name.trim();
    if (!name) {
      return { ok: false, error: "Navn skal udfyldes." };
    }
    const slug = (input.slug?.trim() || slugifyTemplateLabel(name)).toLowerCase();
    if (!isValidTemplateSlug(slug)) {
      return {
        ok: false,
        error: "Slug må kun indeholde små bogstaver, tal og _ (fx dag_aften).",
      };
    }
    const admin = getAdminClient();
    const sort_order =
      input.sort_order !== undefined
        ? input.sort_order
        : await nextShiftTemplateSortOrder(admin);
    const calendar_color = (input.calendar_color?.trim() || "#94a3b8").slice(0, 16);
    const inferredCode = inferShiftImportCode(input.import_code ?? slug ?? name);
    const import_code = inferredCode ? inferredCode.toUpperCase() : null;
    const { data, error } = await admin
      .from("shift_type_templates")
      .insert({ name, slug, import_code, sort_order, calendar_color })
      .select("id, name, slug, import_code, sort_order, calendar_color")
      .single();
    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Slug eller import-kode findes allerede — vælg en anden." };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/workplace-templates");
    const row = data as Record<string, unknown>;
    return {
      ok: true,
      data: {
        id: row.id as string,
        name: row.name as string,
        slug: row.slug as string,
        import_code: (row.import_code as string | null) ?? null,
        sort_order: row.sort_order as number,
        calendar_color: (row.calendar_color as string) ?? "#94a3b8",
        calendar_pattern: null,
      },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function updateShiftTypeTemplate(
  id: string,
  patch: {
    name?: string;
    slug?: string;
    sort_order?: number;
    calendar_color?: string;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) {
      const name = patch.name.trim();
      if (!name) {
        return { ok: false, error: "Navn kan ikke være tomt." };
      }
      row.name = name;
    }
    if (patch.slug !== undefined) {
      const slug = patch.slug.trim().toLowerCase();
      if (!isValidTemplateSlug(slug)) {
        return {
          ok: false,
          error: "Slug må kun indeholde små bogstaver, tal og _.",
        };
      }
      row.slug = slug;
    }
    if (patch.sort_order !== undefined) {
      row.sort_order = patch.sort_order;
    }
    if (patch.calendar_color !== undefined) {
      row.calendar_color = patch.calendar_color.trim().slice(0, 16) || "#94a3b8";
    }
    if (Object.keys(row).length === 0) {
      return { ok: true };
    }
    const admin = getAdminClient();
    const { error } = await admin.from("shift_type_templates").update(row).eq("id", id);
    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "Slug findes allerede." };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/workplace-templates");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function deleteShiftTypeTemplate(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { error } = await admin.from("shift_type_templates").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/workplace-templates");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function listWorkplaceApiKeys(
  workplaceId: string
): Promise<
  { ok: true; data: WorkplaceApiKeyMeta[] } | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("workplace_api_keys")
      .select("id, key_prefix, label, created_at, revoked_at")
      .eq("workplace_id", workplaceId)
      .order("created_at", { ascending: false });
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return { ok: true, data: [] };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true, data: (data ?? []) as WorkplaceApiKeyMeta[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function generateWorkplaceApiKey(
  workplaceId: string,
  label: string
): Promise<
  | { ok: true; secret: string; prefix: string }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const trimmed = label.trim() || "API";
    const raw = randomBytes(32).toString("hex");
    const secret = `sb_live_${raw}`;
    const prefix = secret.slice(0, 16);
    const keyHash = createHash("sha256").update(secret).digest("hex");

    const admin = getAdminClient();
    const { error } = await admin.from("workplace_api_keys").insert({
      workplace_id: workplaceId,
      key_prefix: prefix,
      key_hash: keyHash,
      label: trimmed,
    });
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "API-nøgle-tabellen findes ikke. Kør supabase_workplace_extended.sql og Reload schema under API-indstillinger.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true, secret, prefix };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

/** Super Admin: afdelinger + medlemskaber til UI (validerer workplace_id i alle skrivekald). */
export async function getWorkplaceDepartmentsOverview(
  workplaceId: string,
  options?: { access?: "admin_console" | "calendar_member" }
): Promise<
  | {
      ok: true;
      departments: WorkplaceDepartmentRow[];
      members: WorkplaceMemberDepartmentsRow[];
      shiftTypes: WorkplaceShiftTypeRow[];
      employeeTypes: WorkplaceEmployeeTypeRow[];
      country_code: string | null;
      public_holidays: WorkplacePublicHolidayDef[];
    }
  | { ok: false; error: string }
> {
  const startedAtMs = Date.now();
  try {
    const access = options?.access ?? "admin_console";
    if (access === "admin_console") {
      await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    } else {
      await assertWorkplaceMember(workplaceId);
    }
    const admin = getAdminClient();
    const [dRes, mRes, dmRes, pRes, eTypesRes, sTypesRes, wpRes] = await Promise.all([
      admin
        .from("workplace_departments")
        .select("id, workplace_id, name, created_at")
        .eq("workplace_id", workplaceId)
        .order("name"),
      admin
        .from("workplace_members")
        .select("id, user_id, role, employee_type_id")
        .eq("workplace_id", workplaceId)
        .order("role"),
      admin
        .from("workplace_department_members")
        .select("user_id, department_id")
        .eq("workplace_id", workplaceId),
      admin
        .from("workplace_member_calendar_profiles")
        .select("user_id, display_name_override")
        .eq("workplace_id", workplaceId),
      admin
        .from("workplace_employee_types")
        .select("id, template_id, label, sort_order, calendar_pattern")
        .eq("workplace_id", workplaceId)
        .order("sort_order"),
      admin
        .from("workplace_shift_types")
        .select("id, template_id, label, sort_order, calendar_color")
        .eq("workplace_id", workplaceId)
        .order("sort_order"),
      admin.from("workplaces").select("country_code").eq("id", workplaceId).maybeSingle(),
    ]);

    if (dRes.error) {
      if (isMissingSchemaError(dRes.error.message)) {
        return {
          ok: true,
          departments: [],
          members: [],
          shiftTypes: [],
          employeeTypes: [],
          country_code: null,
          public_holidays: [],
        };
      }
      return { ok: false, error: dRes.error.message };
    }

    type OverviewMemberRow = {
      id: string;
      user_id: string;
      role: string;
      employee_type_id?: string | null;
    };
    let memberRows = (mRes.data ?? []) as OverviewMemberRow[];
    if (mRes.error) {
      const retry = await admin
        .from("workplace_members")
        .select("id, user_id, role")
        .eq("workplace_id", workplaceId)
        .order("role");
      if (retry.error) {
        return { ok: false, error: mRes.error.message };
      }
      memberRows = (retry.data ?? []) as OverviewMemberRow[];
    }

    if (dmRes.error) {
      if (isMissingSchemaError(dmRes.error.message)) {
        return {
          ok: true,
          departments: (dRes.data ?? []) as WorkplaceDepartmentRow[],
          members: [],
          shiftTypes: [],
          employeeTypes: [],
          country_code: null,
          public_holidays: [],
        };
      }
      return { ok: false, error: dmRes.error.message };
    }

    let shiftTypes: WorkplaceShiftTypeRow[] = [];
    let employeeTypes: WorkplaceEmployeeTypeRow[] = [];
    if (eTypesRes.error) {
      if (!isMissingSchemaError(eTypesRes.error.message)) {
        return { ok: false, error: eTypesRes.error.message };
      }
    } else {
      employeeTypes = (eTypesRes.data ?? []) as WorkplaceEmployeeTypeRow[];
    }
    if (sTypesRes.error) {
      if (!isMissingSchemaError(sTypesRes.error.message)) {
        return { ok: false, error: sTypesRes.error.message };
      }
    } else {
      shiftTypes = (sTypesRes.data ?? []) as WorkplaceShiftTypeRow[];
    }

    const [employeeTemplateRes, shiftTemplateRes] = await Promise.all([
      admin.from("employee_type_templates").select("id, name, calendar_pattern"),
      admin.from("shift_type_templates").select("id, name, slug, import_code, calendar_color"),
    ]);
    const employeeTemplateById = new Map<string, { name: string; pattern: string | null }>();
    const employeeTemplateByName = new Map<string, { name: string; pattern: string | null }>();
    if (!employeeTemplateRes.error) {
      for (const row of employeeTemplateRes.data ?? []) {
        const id = String(row.id ?? "");
        const name = String(row.name ?? "").trim();
        if (!name) continue;
        const normalized = normalizeTemplateMatchKey(name);
        const template = {
          name,
          pattern: (row.calendar_pattern as string | null) ?? "none",
        };
        if (id) employeeTemplateById.set(id, template);
        if (normalized && !employeeTemplateByName.has(normalized)) {
          employeeTemplateByName.set(normalized, template);
        }
      }
    }
    const shiftTemplateById = new Map<string, { name: string; color: string | null; import_code: string | null }>();
    const shiftTemplateByName = new Map<string, { name: string; color: string | null; import_code: string | null }>();
    const shiftTemplateByImportCode = new Map<
      string,
      { name: string; color: string | null; import_code: string | null }
    >();
    if (!shiftTemplateRes.error) {
      for (const row of shiftTemplateRes.data ?? []) {
        const id = String(row.id ?? "");
        const name = String(row.name ?? "").trim();
        if (!name) continue;
        const normalized = normalizeTemplateMatchKey(name);
        const slug = String(row.slug ?? "").trim();
        const import_code =
          (row.import_code as string | null) ??
          inferShiftImportCode(slug) ??
          inferShiftImportCode(name);
        const template = {
          name,
          color: (row.calendar_color as string | null) ?? "#94a3b8",
          import_code,
        };
        if (id) shiftTemplateById.set(id, template);
        if (normalized && !shiftTemplateByName.has(normalized)) {
          shiftTemplateByName.set(normalized, template);
        }
        if (import_code && !shiftTemplateByImportCode.has(import_code)) {
          shiftTemplateByImportCode.set(import_code, template);
        }
      }
    }
    employeeTypes = employeeTypes.map((row) => {
      const key = normalizeTemplateMatchKey(row.label);
      const legacy = LEGACY_EMPLOYEE_LABEL_TO_STANDARD.get(key);
      const byTemplateId = row.template_id ? employeeTemplateById.get(row.template_id) : undefined;
      const byTemplateName = employeeTemplateByName.get(legacy ? normalizeTemplateMatchKey(legacy) : key);
      return {
        ...row,
        label: byTemplateId?.name ?? byTemplateName?.name ?? legacy ?? row.label,
        calendar_pattern:
          byTemplateId?.pattern ?? byTemplateName?.pattern ?? row.calendar_pattern ?? "none",
      };
    });
    shiftTypes = shiftTypes.map((row) => {
      const key = normalizeTemplateMatchKey(row.label);
      const legacy = LEGACY_SHIFT_LABEL_TO_STANDARD.get(key);
      const byTemplateId = row.template_id ? shiftTemplateById.get(row.template_id) : undefined;
      const importCode =
        byTemplateId?.import_code ??
        inferShiftImportCode(legacy ?? row.label);
      const byTemplateCode =
        importCode ? shiftTemplateByImportCode.get(importCode) : undefined;
      const byTemplateName = shiftTemplateByName.get(
        legacy ? normalizeTemplateMatchKey(legacy) : key
      );
      const canonicalByCode = importCode
        ? SHIFT_IMPORT_CODE_TO_STANDARD_LABEL.get(importCode)
        : undefined;
      return {
        ...row,
        import_code: importCode ?? null,
        label:
          byTemplateId?.name ??
          byTemplateCode?.name ??
          byTemplateName?.name ??
          canonicalByCode ??
          legacy ??
          row.label,
        calendar_color:
          byTemplateId?.color ??
          byTemplateCode?.color ??
          byTemplateName?.color ??
          row.calendar_color ??
          "#94a3b8",
      };
    });

    if (pRes.error && !isMissingSchemaError(pRes.error.message)) {
      return { ok: false, error: pRes.error.message };
    }

    if (wpRes.error && !isMissingSchemaError(wpRes.error.message)) {
      return { ok: false, error: wpRes.error.message };
    }

    const overrideByUser = new Map<string, string | null>();
    if (!pRes.error) {
      for (const row of pRes.data ?? []) {
        overrideByUser.set(
          row.user_id as string,
          (row.display_name_override as string | null) ?? null
        );
      }
    }

    const deptByUser = new Map<string, string[]>();
    for (const row of dmRes.data ?? []) {
      const uid = row.user_id as string;
      const did = row.department_id as string;
      const arr = deptByUser.get(uid) ?? [];
      arr.push(did);
      deptByUser.set(uid, arr);
    }

    const usersById = new Map<
      string,
      { email: string | null; userMetadata: Record<string, unknown> | undefined }
    >();
    await Promise.all(
      memberRows.map(async (m) => {
        const uid = m.user_id as string;
        const { data: u } = await admin.auth.admin.getUserById(uid);
        usersById.set(uid, {
          email: u.user?.email ?? null,
          userMetadata: u.user?.user_metadata as Record<string, unknown> | undefined,
        });
      })
    );

    let members: WorkplaceMemberDepartmentsRow[] = [];
    const employeeTypeIdByLabel = new Map<string, string>();
    for (const type of employeeTypes) {
      const labelKey = normalizeTemplateMatchKey(type.label);
      if (labelKey) employeeTypeIdByLabel.set(labelKey, type.id);
    }
    const EMPLOYEE_TYPE_FALLBACKS = new Map<string, string>([
      ["fuldtid", "fuldtid"],
      ["full_time", "fuldtid"],
      ["full time", "fuldtid"],
      ["fulltime", "fuldtid"],
      ["full-time", "fuldtid"],
      ["permanent", "fuldtid"],
      ["deltid", "deltid"],
      ["part_time", "deltid"],
      ["part time", "deltid"],
      ["parttime", "deltid"],
      ["part-time", "deltid"],
      ["elev", "elev"],
      ["trainee", "elev"],
      ["vikar", "vikar"],
      ["temp", "vikar"],
      ["substitute", "vikar"],
      ["ung", "ung (under 18)"],
      ["youth", "ung (under 18)"],
      ["youth_u18", "ung (under 18)"],
    ]);
    for (const m of memberRows) {
      const uid = m.user_id as string;
      const userData = usersById.get(uid);
      const email = userData?.email ?? null;
      const oauthName = oauthDisplayNameFromUserMetadata(userData?.userMetadata);
      const override = overrideByUser.get(uid);
      const resolved = resolveMemberDisplayName(oauthName, override, email, uid);
      const empTypeRaw = m.employee_type_id;
      let inferredEmployeeTypeId: string | null = null;
      if (empTypeRaw == null) {
        const importedType = userData?.userMetadata?.import_employee_type;
        const importedKey = normalizeTemplateMatchKey(
          typeof importedType === "string" ? importedType : ""
        );
        const fallbackKey = EMPLOYEE_TYPE_FALLBACKS.get(importedKey) ?? importedKey;
        inferredEmployeeTypeId = fallbackKey
          ? (employeeTypeIdByLabel.get(fallbackKey) ?? null)
          : null;
      }
      members.push({
        workplace_member_id: m.id,
        user_id: uid,
        email,
        role: m.role as string,
        department_ids: deptByUser.get(uid) ?? [],
        employee_type_id:
          empTypeRaw === undefined || empTypeRaw === null
            ? inferredEmployeeTypeId
            : String(empTypeRaw),
        display_name: resolved.display_name,
        oauth_display_name: resolved.oauth_display_name,
        display_name_override: resolved.display_name_override,
      });
    }

    if (access === "calendar_member") {
      const adminCalendar =
        await isWorkplaceCalendarAdminView(workplaceId);
      if (!adminCalendar) {
        members = members.map((row) => ({ ...row, email: null }));
      }
    }

    let country_code: string | null = null;
    if (!wpRes.error && wpRes.data) {
      const raw = (wpRes.data as { country_code?: string | null }).country_code;
      const cc = typeof raw === "string" ? raw.trim().toUpperCase() : "";
      country_code = cc.length === 2 ? cc : null;
    }

    let public_holidays: WorkplacePublicHolidayDef[] = [];
    if (country_code) {
      const hRes = await admin
        .from("country_public_holidays")
        .select(
          "holiday_rule, month, day, easter_offset_days, display_name, sort_order"
        )
        .eq("country_code", country_code)
        .order("sort_order", { ascending: true });
      if (hRes.error) {
        if (!isMissingSchemaError(hRes.error.message)) {
          return { ok: false, error: hRes.error.message };
        }
      } else {
        public_holidays = (hRes.data ?? []).map((row) => ({
          holiday_rule: row.holiday_rule as
            | "fixed"
            | "easter_offset"
            | "nth_weekday"
            | "fixed_offset",
          month: row.month == null ? null : Number(row.month),
          day: row.day == null ? null : Number(row.day),
          easter_offset_days:
            row.easter_offset_days == null ? null : Number(row.easter_offset_days),
          display_name: String(row.display_name ?? ""),
        }));
      }
    }
    if (public_holidays.length === 0 && country_code) {
      public_holidays = fallbackHolidayDefsForCountry(country_code);
    }

    return {
      ok: true,
      departments: (dRes.data ?? []) as WorkplaceDepartmentRow[],
      members,
      shiftTypes,
      employeeTypes,
      country_code,
      public_holidays,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  } finally {
    if (process.env.NODE_ENV !== "production") {
      const elapsedMs = Date.now() - startedAtMs;
      console.info(
        `[calendar-server] getWorkplaceDepartmentsOverview wp=${workplaceId} ms=${elapsedMs}`
      );
    }
  }
}

export async function createWorkplaceDepartment(
  workplaceId: string,
  input: { name: string }
): Promise<
  | { ok: true; data: WorkplaceDepartmentRow }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const name = input.name.trim();
    if (!name) {
      return { ok: false, error: "Navn skal udfyldes." };
    }
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("workplace_departments")
      .insert({ workplace_id: workplaceId, name })
      .select("id, workplace_id, name, created_at")
      .single();
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Tabellen findes ikke. Kør supabase_departments_setup.sql og reload schema.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true, data: data as WorkplaceDepartmentRow };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function deleteWorkplaceDepartment(
  workplaceId: string,
  departmentId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const { error } = await admin
      .from("workplace_departments")
      .delete()
      .eq("id", departmentId)
      .eq("workplace_id", workplaceId);
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Tabellen findes ikke. Kør supabase_departments_setup.sql og reload schema.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function resetWorkplaceCalendarData(
  workplaceId: string
): Promise<
  | {
      ok: true;
      deletedShifts: number;
      deletedEmployees: number;
      deletedDepartments: number;
    }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();

    const { data: employeeRows, error: employeeRowsErr } = await admin
      .from("workplace_members")
      .select("user_id")
      .eq("workplace_id", workplaceId)
      .eq("role", "EMPLOYEE");
    if (employeeRowsErr) {
      return { ok: false, error: employeeRowsErr.message };
    }
    const employeeUserIds = (employeeRows ?? []).map((row) => String(row.user_id));

    let deletedShifts = 0;
    const shiftsRes = await admin
      .from("workplace_shifts")
      .delete()
      .eq("workplace_id", workplaceId)
      .select("id");
    if (shiftsRes.error) {
      if (!isMissingSchemaError(shiftsRes.error.message)) {
        return { ok: false, error: shiftsRes.error.message };
      }
    } else {
      deletedShifts = (shiftsRes.data ?? []).length;
    }

    if (employeeUserIds.length > 0) {
      const deptMembersRes = await admin
        .from("workplace_department_members")
        .delete()
        .eq("workplace_id", workplaceId)
        .in("user_id", employeeUserIds)
        .select("user_id");
      if (deptMembersRes.error && !isMissingSchemaError(deptMembersRes.error.message)) {
        return { ok: false, error: deptMembersRes.error.message };
      }

      const prefRes = await admin
        .from("workplace_member_preferences")
        .delete()
        .eq("workplace_id", workplaceId)
        .in("user_id", employeeUserIds)
        .select("user_id");
      if (prefRes.error && !isMissingSchemaError(prefRes.error.message)) {
        return { ok: false, error: prefRes.error.message };
      }

      const profileRes = await admin
        .from("workplace_member_calendar_profiles")
        .delete()
        .eq("workplace_id", workplaceId)
        .in("user_id", employeeUserIds)
        .select("user_id");
      if (profileRes.error && !isMissingSchemaError(profileRes.error.message)) {
        return { ok: false, error: profileRes.error.message };
      }
    }

    let deletedEmployees = 0;
    const membersRes = await admin
      .from("workplace_members")
      .delete()
      .eq("workplace_id", workplaceId)
      .eq("role", "EMPLOYEE")
      .select("user_id");
    if (membersRes.error) {
      return { ok: false, error: membersRes.error.message };
    }
    deletedEmployees = (membersRes.data ?? []).length;

    const deptRes = await admin
      .from("workplace_departments")
      .delete()
      .eq("workplace_id", workplaceId)
      .select("id");
    if (deptRes.error) {
      if (!isMissingSchemaError(deptRes.error.message)) {
        return { ok: false, error: deptRes.error.message };
      }
      return { ok: true, deletedShifts, deletedEmployees, deletedDepartments: 0 };
    }
    const deletedDepartments = (deptRes.data ?? []).length;

    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true, deletedShifts, deletedEmployees, deletedDepartments };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

/**
 * Erstatter afdelingstilknytninger for de angivne brugere. Alle department_ids valideres mod
 * `workplace_departments` for `workplaceId`; brugere skal være i `workplace_members`.
 */
export async function saveWorkplaceDepartmentMemberships(
  workplaceId: string,
  assignments: { userId: string; departmentIds: string[] }[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const allDeptIds = assignments.flatMap((a) => a.departmentIds);
    const deptCheck = await assertDepartmentIdsBelongToWorkplace(
      admin,
      workplaceId,
      allDeptIds
    );
    if (!deptCheck.ok) {
      return deptCheck;
    }

    const userIds = [...new Set(assignments.map((a) => a.userId))];
    const { data: wmRows, error: wmErr } = await admin
      .from("workplace_members")
      .select("user_id")
      .eq("workplace_id", workplaceId)
      .in("user_id", userIds);
    if (wmErr) {
      return { ok: false, error: wmErr.message };
    }
    const allowedUsers = new Set((wmRows ?? []).map((r) => r.user_id as string));
    for (const uid of userIds) {
      if (!allowedUsers.has(uid)) {
        return {
          ok: false,
          error: "Én eller flere brugere er ikke medlem af denne arbejdsplads.",
        };
      }
    }

    for (const { userId, departmentIds } of assignments) {
      const desired = new Set(departmentIds);
      const { data: current, error: cErr } = await admin
        .from("workplace_department_members")
        .select("department_id")
        .eq("workplace_id", workplaceId)
        .eq("user_id", userId);
      if (cErr) {
        if (isMissingSchemaError(cErr.message)) {
          return {
            ok: false,
            error:
              "Kør supabase_departments_setup.sql (workplace_department_members) og reload schema.",
          };
        }
        return { ok: false, error: cErr.message };
      }
      const currentIds = new Set(
        (current ?? []).map((r) => r.department_id as string)
      );
      const toRemove = [...currentIds].filter((id) => !desired.has(id));
      const toAdd = [...desired].filter((id) => !currentIds.has(id));

      if (toRemove.length > 0) {
        const { error: delErr } = await admin
          .from("workplace_department_members")
          .delete()
          .eq("workplace_id", workplaceId)
          .eq("user_id", userId)
          .in("department_id", toRemove);
        if (delErr) {
          return { ok: false, error: delErr.message };
        }
      }
      if (toAdd.length > 0) {
        const rows = toAdd.map((department_id) => ({
          workplace_id: workplaceId,
          user_id: userId,
          department_id,
        }));
        const { error: insErr } = await admin
          .from("workplace_department_members")
          .insert(rows);
        if (insErr) {
          return { ok: false, error: insErr.message };
        }
      }
    }

    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function revokeWorkplaceApiKey(
  keyId: string,
  workplaceId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const { error } = await admin
      .from("workplace_api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", keyId)
      .eq("workplace_id", workplaceId);
    if (error) {
      return { ok: false, error: error.message };
    }
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function importWorkplaceMembersFromCsv(
  workplaceId: string,
  csvText: string
): Promise<
  | {
      ok: true;
      results: WorkplaceMemberImportRowResult[];
      summary: { createdInvited: number; addedExisting: number; alreadyMember: number; errors: number };
    }
  | { ok: false; error: string; employeeLimitExceeded?: boolean }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const raw = csvText.trim();
    if (!raw) {
      return { ok: false, error: "Indsæt CSV-indhold først." };
    }

    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length < 2) {
      return { ok: false, error: "CSV skal indeholde header + mindst én data-række." };
    }

    const header = parseSemicolonCsvLine(lines[0]).map((x) => x.toLowerCase());
    const expectedHeader = [
      "first_name",
      "last_name",
      "email",
      "mobile_phone",
      "street_name",
      "street_number",
      "postal_code",
      "city",
      "country",
      "employee_type",
      "note",
    ];
    const badHeader =
      header.length !== expectedHeader.length ||
      expectedHeader.some((h, i) => header[i] !== h);
    if (badHeader) {
      return {
        ok: false,
        error: `Forkert format. Brug header: ${expectedHeader.join(";")}`,
      };
    }

    const admin = getAdminClient();
    const [employeeTypeRes, membershipRes, authByEmail] = await Promise.all([
      admin
        .from("workplace_employee_types")
        .select("id, label")
        .eq("workplace_id", workplaceId),
      admin
        .from("workplace_members")
        .select("user_id")
        .eq("workplace_id", workplaceId),
      listAuthUsersByEmailLower(admin),
    ]);

    if (employeeTypeRes.error) {
      return { ok: false, error: employeeTypeRes.error.message };
    }
    if (membershipRes.error) {
      return { ok: false, error: membershipRes.error.message };
    }

    const employeeTypeByLabel = new Map<string, string>();
    for (const row of employeeTypeRes.data ?? []) {
      const key = normalizeTemplateMatchKey(row.label as string);
      employeeTypeByLabel.set(key, row.id as string);
    }
    const memberUserIds = new Set((membershipRes.data ?? []).map((x) => x.user_id as string));

    let prospectiveNewMembers = 0;
    for (let idx = 1; idx < lines.length; idx += 1) {
      const cells = parseSemicolonCsvLine(lines[idx]);
      if (cells.length !== expectedHeader.length) continue;
      const email = (cells[2] ?? "").trim().toLowerCase();
      const firstName = cells[0]?.trim() ?? "";
      const lastName = cells[1]?.trim() ?? "";
      const employeeTypeLabel = cells[9]?.trim() ?? "";
      if (!firstName || !lastName || !email || !employeeTypeLabel) continue;
      if (!employeeTypeByLabel.has(normalizeTemplateMatchKey(employeeTypeLabel))) continue;
      const existingUserId = authByEmail.get(email) ?? null;
      if (existingUserId && memberUserIds.has(existingUserId)) continue;
      prospectiveNewMembers += 1;
    }

    const capacity = await assertStandardPlanEmployeeCapacity(
      workplaceId,
      prospectiveNewMembers
    );
    if (!capacity.ok) {
      return {
        ok: false,
        error: capacity.error,
        employeeLimitExceeded: true,
      };
    }

    const seenEmails = new Set<string>();
    const results: WorkplaceMemberImportRowResult[] = [];
    let createdInvited = 0;
    let addedExisting = 0;
    let alreadyMember = 0;
    let errors = 0;
    let successfulInviteCount = 0;

    for (let idx = 1; idx < lines.length; idx += 1) {
      const lineNo = idx + 1;
      const cells = parseSemicolonCsvLine(lines[idx]);
      const email = (cells[2] ?? "").trim().toLowerCase();
      if (cells.length !== expectedHeader.length) {
        results.push({
          line: lineNo,
          email,
          status: "error",
          message: "Forkert antal felter på linjen.",
          activationLink: null,
        });
        errors += 1;
        continue;
      }

      const firstName = cells[0]?.trim() ?? "";
      const lastName = cells[1]?.trim() ?? "";
      const mobilePhone = cells[3]?.trim() ?? "";
      const streetName = cells[4]?.trim() ?? "";
      const streetNumber = cells[5]?.trim() ?? "";
      const postalCode = cells[6]?.trim() ?? "";
      const city = cells[7]?.trim() ?? "";
      const country = cells[8]?.trim() ?? "";
      const employeeTypeLabel = cells[9]?.trim() ?? "";
      const note = cells[10]?.trim() || null;

      if (!firstName || !lastName || !email || !mobilePhone || !streetName || !streetNumber || !postalCode || !city || !country || !employeeTypeLabel) {
        results.push({
          line: lineNo,
          email,
          status: "error",
          message: "Obligatoriske felter mangler.",
          activationLink: null,
        });
        errors += 1;
        continue;
      }
      if (seenEmails.has(email)) {
        results.push({
          line: lineNo,
          email,
          status: "error",
          message: "E-mail optræder flere gange i samme import.",
          activationLink: null,
        });
        errors += 1;
        continue;
      }
      seenEmails.add(email);

      const employeeTypeId = employeeTypeByLabel.get(
        normalizeTemplateMatchKey(employeeTypeLabel)
      );
      if (!employeeTypeId) {
        results.push({
          line: lineNo,
          email,
          status: "error",
          message: `Ukendt medarbejdertype: ${employeeTypeLabel}`,
          activationLink: null,
        });
        errors += 1;
        continue;
      }

      let userId = authByEmail.get(email) ?? null;
      let isNewUser = false;
      if (!userId) {
        const tempPassword = randomBytes(24).toString("base64url");
        const created = await admin.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: false,
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
          },
        });
        if (created.error || !created.data.user) {
          results.push({
            line: lineNo,
            email,
            status: "error",
            message: created.error?.message ?? "Kunne ikke oprette bruger.",
            activationLink: null,
          });
          errors += 1;
          continue;
        }
        userId = created.data.user.id;
        authByEmail.set(email, userId);
        isNewUser = true;
      }

      if (memberUserIds.has(userId)) {
        results.push({
          line: lineNo,
          email,
          status: "already_member",
          message: "Brugeren er allerede medlem af arbejdspladsen.",
          activationLink: null,
        });
        alreadyMember += 1;
        continue;
      }

      const { error: memberErr } = await admin.from("workplace_members").upsert(
        {
          workplace_id: workplaceId,
          user_id: userId,
          role: "EMPLOYEE",
          employee_type_id: employeeTypeId,
        },
        { onConflict: "user_id,workplace_id" }
      );
      if (memberErr) {
        results.push({
          line: lineNo,
          email,
          status: "error",
          message: memberErr.message,
          activationLink: null,
        });
        errors += 1;
        continue;
      }
      memberUserIds.add(userId);

      const { error: profileErr } = await admin.from("user_profiles").upsert(
        {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          mobile_phone: mobilePhone,
          street_name: streetName,
          street_number: streetNumber,
          postal_code: postalCode,
          city,
          country,
          note,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (profileErr) {
        results.push({
          line: lineNo,
          email,
          status: "error",
          message: profileErr.message,
          activationLink: null,
        });
        errors += 1;
        continue;
      }

      if (isNewUser) {
        const invite = await admin.auth.admin.generateLink({
          type: "magiclink",
          email,
        });
        const activationLink = invite.data?.properties?.action_link ?? null;
        if (invite.error || !activationLink) {
          results.push({
            line: lineNo,
            email,
            status: "error",
            message:
              invite.error?.message ?? "Bruger oprettet, men invitation-link kunne ikke genereres.",
            activationLink: null,
          });
          errors += 1;
          continue;
        }
        results.push({
          line: lineNo,
          email,
          status: "created_invited",
          message: "Ny medarbejder oprettet og aktiveringslink genereret.",
          activationLink,
        });
        createdInvited += 1;
        successfulInviteCount += 1;
      } else {
        results.push({
          line: lineNo,
          email,
          status: "added_existing",
          message: "Eksisterende bruger tilknyttet arbejdspladsen.",
          activationLink: null,
        });
        addedExisting += 1;
      }
    }

    if (successfulInviteCount > 0) {
      await incrementWorkplaceActiveEmployeeInvites(workplaceId, successfulInviteCount, {
        source: "members_csv_import",
      });
    } else {
      await updateLifecycleStage(workplaceId, {
        source: "members_csv_import",
        context: { successfulInviteCount: 0 },
      });
    }

    revalidateWorkplaceDetailPages(workplaceId);
    return {
      ok: true,
      results,
      summary: { createdInvited, addedExisting, alreadyMember, errors },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function registerWorkplaceImportUpload(
  workplaceId: string,
  input: { fileName: string; source?: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const fileName = input.fileName.trim();
    if (!fileName) {
      return { ok: false, error: "Filnavn mangler." };
    }

    const source = input.source?.trim() || "shift_schedule_upload";
    const res = await incrementWorkplaceImportedFilesCount(workplaceId, 1, {
      fileName,
      source,
    });
    if (!res.ok) return res;
    revalidateWorkplaceDetailPages(workplaceId);
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function exportWorkplaceCsv(
  workplaceId: string
): Promise<
  { ok: true; csv: string; filename: string } | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const { data: wp, error: wErr } = await admin
      .from("workplaces")
      .select("name, company_name")
      .eq("id", workplaceId)
      .maybeSingle();
    if (wErr) {
      return { ok: false, error: wErr.message };
    }
    if (!wp) {
      return { ok: false, error: "Arbejdsplads ikke fundet." };
    }

    const { data: members, error: mErr } = await admin
      .from("workplace_members")
      .select("user_id, role")
      .eq("workplace_id", workplaceId);
    if (mErr) {
      return { ok: false, error: mErr.message };
    }

    const lines: string[] = ["user_id,email,role"];
    for (const m of members ?? []) {
      const uid = m.user_id as string;
      const { data: u } = await admin.auth.admin.getUserById(uid);
      const email = u.user?.email ?? "";
      lines.push(
        `${uid},"${String(email).replace(/"/g, '""')}",${m.role as string}`
      );
    }

    const safeName = String(wp.company_name ?? wp.name).replace(
      /[^\wæøåÆØÅ\- ]+/gi,
      "_"
    );
    return {
      ok: true,
      csv: lines.join("\n"),
      filename: `shiftbob-${safeName}-medlemmer.csv`,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
