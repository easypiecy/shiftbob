import { getAdminClient } from "@/src/utils/supabase/admin";

export const LIFECYCLE_STAGES = [
  "PROSPECT",
  "REGISTERED",
  "ACTIVE_PLANNER",
  "HYBRID_OPERATOR",
  "FULL_PLATFORM",
] as const;

export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

export const DEFAULT_FULL_PLATFORM_MANUAL_SHIFT_THRESHOLD = 25;

type LifecycleSnapshot = {
  lifecycle_stage: LifecycleStage | null;
  language: string | null;
  imported_files_count: number | null;
  active_employee_invites: number | null;
  manual_shifts_created_count: number | null;
  subscription_status: string | null;
};

function normalizeLanguageCode(value: string | null | undefined): string {
  const raw = String(value ?? "").trim().toLowerCase();
  if (/^[a-z]{2}$/.test(raw)) return raw;
  return "en";
}

function toInt(value: number | null | undefined): number {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.trunc(n));
}

function deriveLifecycleStage(input: {
  importedFilesCount: number;
  activeEmployeeInvites: number;
  manualShiftsCreatedCount: number;
  subscriptionStatus: string;
  fullPlatformManualShiftThreshold: number;
}): LifecycleStage {
  const importedFilesCount = toInt(input.importedFilesCount);
  const activeEmployeeInvites = toInt(input.activeEmployeeInvites);
  const manualShiftsCreatedCount = toInt(input.manualShiftsCreatedCount);
  const subscriptionStatus = String(input.subscriptionStatus ?? "").trim().toLowerCase();

  if (
    importedFilesCount === 0 &&
    manualShiftsCreatedCount > input.fullPlatformManualShiftThreshold
  ) {
    return "FULL_PLATFORM";
  }

  if (activeEmployeeInvites > 0 && subscriptionStatus === "active") {
    return "HYBRID_OPERATOR";
  }

  if (importedFilesCount > 0) {
    return "ACTIVE_PLANNER";
  }

  return "REGISTERED";
}

async function logLifecycleTransition(input: {
  companyId: string;
  previousStage: LifecycleStage | null;
  nextStage: LifecycleStage;
  language: string;
  source: string;
  context?: Record<string, unknown>;
}): Promise<void> {
  const admin = getAdminClient();
  await admin.from("workplace_lifecycle_events").insert({
    workplace_id: input.companyId,
    previous_stage: input.previousStage,
    next_stage: input.nextStage,
    language: input.language,
    event_source: input.source,
    context_json: input.context ?? {},
  });
}

export async function updateLifecycleStage(
  companyId: string,
  opts?: {
    source?: string;
    fullPlatformManualShiftThreshold?: number;
    context?: Record<string, unknown>;
  }
): Promise<{ ok: true; stage: LifecycleStage; changed: boolean } | { ok: false; error: string }> {
  try {
    const admin = getAdminClient();
    const source = opts?.source?.trim() || "system";
    const fullPlatformThreshold =
      opts?.fullPlatformManualShiftThreshold ?? DEFAULT_FULL_PLATFORM_MANUAL_SHIFT_THRESHOLD;

    const { data, error } = await admin
      .from("workplaces")
      .select(
        "lifecycle_stage, language, imported_files_count, active_employee_invites, manual_shifts_created_count, subscription_status"
      )
      .eq("id", companyId)
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: "Workplace not found." };

    const snapshot = data as LifecycleSnapshot;
    const nextStage = deriveLifecycleStage({
      importedFilesCount: snapshot.imported_files_count ?? 0,
      activeEmployeeInvites: snapshot.active_employee_invites ?? 0,
      manualShiftsCreatedCount: snapshot.manual_shifts_created_count ?? 0,
      subscriptionStatus: snapshot.subscription_status ?? "inactive",
      fullPlatformManualShiftThreshold: fullPlatformThreshold,
    });
    const previousStage = snapshot.lifecycle_stage;
    const changed = previousStage !== nextStage;

    if (changed) {
      const { error: updateErr } = await admin
        .from("workplaces")
        .update({
          lifecycle_stage: nextStage,
          lifecycle_updated_at: new Date().toISOString(),
        })
        .eq("id", companyId);
      if (updateErr) return { ok: false, error: updateErr.message };

      await logLifecycleTransition({
        companyId,
        previousStage,
        nextStage,
        language: normalizeLanguageCode(snapshot.language),
        source,
        context: opts?.context,
      });
    }

    return { ok: true, stage: nextStage, changed };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown lifecycle error";
    return { ok: false, error: msg };
  }
}

export async function incrementWorkplaceImportedFilesCount(
  companyId: string,
  delta = 1,
  context?: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const admin = getAdminClient();
    const amount = Math.max(1, Math.trunc(delta || 1));
    const { data, error } = await admin
      .from("workplaces")
      .select("imported_files_count")
      .eq("id", companyId)
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: "Workplace not found." };
    const current = toInt((data as { imported_files_count?: number | null }).imported_files_count);

    const { error: updateErr } = await admin
      .from("workplaces")
      .update({ imported_files_count: current + amount })
      .eq("id", companyId);
    if (updateErr) return { ok: false, error: updateErr.message };

    await updateLifecycleStage(companyId, {
      source: "file_uploaded",
      context: { amount, ...(context ?? {}) },
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown lifecycle error";
    return { ok: false, error: msg };
  }
}

export async function incrementWorkplaceActiveEmployeeInvites(
  companyId: string,
  delta = 1,
  context?: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const admin = getAdminClient();
    const amount = Math.max(1, Math.trunc(delta || 1));
    const { data, error } = await admin
      .from("workplaces")
      .select("active_employee_invites")
      .eq("id", companyId)
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: "Workplace not found." };
    const current = toInt((data as { active_employee_invites?: number | null }).active_employee_invites);

    const { error: updateErr } = await admin
      .from("workplaces")
      .update({ active_employee_invites: current + amount })
      .eq("id", companyId);
    if (updateErr) return { ok: false, error: updateErr.message };

    await updateLifecycleStage(companyId, {
      source: "employee_invited",
      context: { amount, ...(context ?? {}) },
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown lifecycle error";
    return { ok: false, error: msg };
  }
}

export async function incrementWorkplaceManualShiftsCreatedCount(
  companyId: string,
  delta = 1,
  context?: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const admin = getAdminClient();
    const amount = Math.max(1, Math.trunc(delta || 1));
    const { data, error } = await admin
      .from("workplaces")
      .select("manual_shifts_created_count")
      .eq("id", companyId)
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: "Workplace not found." };
    const current = toInt(
      (data as { manual_shifts_created_count?: number | null }).manual_shifts_created_count
    );

    const { error: updateErr } = await admin
      .from("workplaces")
      .update({ manual_shifts_created_count: current + amount })
      .eq("id", companyId);
    if (updateErr) return { ok: false, error: updateErr.message };

    await updateLifecycleStage(companyId, {
      source: "manual_shift_created",
      context: { amount, ...(context ?? {}) },
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown lifecycle error";
    return { ok: false, error: msg };
  }
}
