"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import {
  assertWorkplaceAdminOrSuperAdmin,
  assertWorkplaceMember,
  isWorkplaceCalendarAdminView,
} from "@/src/lib/workplace-admin-server";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import {
  normalizeSeasonTemplate,
  type SeasonTemplatePayload,
} from "@/src/types/season-template";
import {
  isEmployeeCountBand,
  isNotificationChannel,
  type EmployeeCountBand,
  type NotificationChannel,
} from "@/src/types/workplace";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

async function requireSuperAdmin() {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);
}

function revalidateWorkplaceDetailPages(workplaceId: string) {
  revalidatePath(`/super-admin/workplaces/${workplaceId}`);
  revalidatePath("/dashboard/indstillinger");
  revalidatePath("/dashboard/fremtiden");
}

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
  push_include_shift_type_ids: string[];
  push_include_employee_type_ids: string[];
  created_at: string;
  /** Ufrigivet kalender-vindue (uger), standard 8 */
  future_planning_weeks: number;
  /** Sidste dato medarbejdere kan se; derefter kun admin indtil frigivelse */
  calendar_released_until: string | null;
  /** Sæson-skabelon (perioder / ugedage) */
  season_template_json: SeasonTemplatePayload;
};

export type TypeTemplateRow = {
  id: string;
  name: string;
  slug: string;
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
      })
      .select("id, name, company_name, city, created_at")
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    const row = data as WorkplaceRow;
    const copyWarning = await copyTemplatesToWorkplace(row.id);

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
  };
}

const WORKPLACE_DETAIL_SELECT_BASE =
  "id, name, company_name, vat_number, street_name, street_number, address_extra, postal_code, city, country_code, contact_email, phone, employee_count_band, stripe_customer_id, push_include_shift_type_ids, push_include_employee_type_ids, created_at";

const WORKPLACE_DETAIL_SELECT_EXTENDED = `${WORKPLACE_DETAIL_SELECT_BASE}, future_planning_weeks, calendar_released_until, season_template_json`;

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
          .select(WORKPLACE_DETAIL_SELECT_BASE)
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
    return {
      ok: true,
      employeeTypes: (eRes.data ?? []) as WorkplaceEmployeeTypeRow[],
      shiftTypes: (sRes.data ?? []) as WorkplaceShiftTypeRow[],
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
    const admin = getAdminClient();
    const row: Record<string, unknown> = { ...patch };
    if (patch.country_code !== undefined && patch.country_code !== null) {
      row.country_code = String(patch.country_code).trim().toUpperCase() || null;
    }

    const { error } = await admin.from("workplaces").update(row).eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }
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
      .select("id, name, slug, sort_order, calendar_color")
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
    const { data, error } = await admin
      .from("shift_type_templates")
      .insert({ name, slug, sort_order, calendar_color })
      .select("id, name, slug, sort_order, calendar_color")
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
    }
  | { ok: false; error: string }
> {
  try {
    const access = options?.access ?? "admin_console";
    if (access === "admin_console") {
      await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    } else {
      await assertWorkplaceMember(workplaceId);
    }
    const admin = getAdminClient();
    const [dRes, mRes, dmRes, pRes, eTypesRes, sTypesRes] = await Promise.all([
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
    ]);

    if (dRes.error) {
      if (isMissingSchemaError(dRes.error.message)) {
        return {
          ok: true,
          departments: [],
          members: [],
          shiftTypes: [],
          employeeTypes: [],
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
      const rawShiftTypes = (sTypesRes.data ?? []) as WorkplaceShiftTypeRow[];
      const templateIds = Array.from(
        new Set(
          rawShiftTypes
            .map((s) => s.template_id)
            .filter((id): id is string => typeof id === "string" && id.length > 0)
        )
      );

      let templateColorById = new Map<string, string>();
      if (templateIds.length > 0) {
        const tRes = await admin
          .from("shift_type_templates")
          .select("id, calendar_color")
          .in("id", templateIds);
        if (!tRes.error) {
          templateColorById = new Map(
            (tRes.data ?? [])
              .map(
                (r) =>
                  [r.id as string, (r.calendar_color as string | null) ?? ""] as [
                    string,
                    string,
                  ]
              )
              .filter((x) => x[1].length > 0)
          );
        }
      }

      shiftTypes = rawShiftTypes.map((s) => ({
        ...s,
        calendar_color:
          (s.template_id ? templateColorById.get(s.template_id) : null) ??
          s.calendar_color ??
          "#94a3b8",
      }));
    }

    if (pRes.error && !isMissingSchemaError(pRes.error.message)) {
      return { ok: false, error: pRes.error.message };
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

    let members: WorkplaceMemberDepartmentsRow[] = [];
    for (const m of memberRows) {
      const uid = m.user_id as string;
      const { data: u } = await admin.auth.admin.getUserById(uid);
      const email = u.user?.email ?? null;
      const meta = u.user?.user_metadata as Record<string, unknown> | undefined;
      const oauthName = oauthDisplayNameFromUserMetadata(meta);
      const override = overrideByUser.get(uid);
      const resolved = resolveMemberDisplayName(
        oauthName,
        override,
        email,
        uid
      );
      const empTypeRaw = m.employee_type_id;
      members.push({
        workplace_member_id: m.id,
        user_id: uid,
        email,
        role: m.role as string,
        department_ids: deptByUser.get(uid) ?? [],
        employee_type_id:
          empTypeRaw === undefined || empTypeRaw === null ? null : String(empTypeRaw),
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

    return {
      ok: true,
      departments: (dRes.data ?? []) as WorkplaceDepartmentRow[],
      members,
      shiftTypes,
      employeeTypes,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
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
