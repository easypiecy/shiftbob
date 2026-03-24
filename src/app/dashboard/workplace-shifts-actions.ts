"use server";

import {
  assertWorkplaceMember,
  isWorkplaceCalendarAdminView,
} from "@/src/lib/workplace-admin-server";
import { getAdminClient } from "@/src/utils/supabase/admin";

export async function getCalendarViewerNameMode(workplaceId: string): Promise<
  { ok: true; adminView: boolean } | { ok: false; error: string }
> {
  try {
    await assertWorkplaceMember(workplaceId);
    const adminView = await isWorkplaceCalendarAdminView(workplaceId);
    return { ok: true, adminView };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

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

export type WorkplaceShiftRow = {
  id: string;
  workplace_id: string;
  department_id: string | null;
  user_id: string;
  shift_type_id: string | null;
  starts_at: string;
  ends_at: string;
};

/**
 * Henter vagter der overlapper [rangeStartIso, rangeEndIso) (typisk UTC fra klientens lokale dage).
 * Ved valgt afdeling: kun vagter med samme department_id.
 */
export async function getWorkplaceShiftsInRange(
  workplaceId: string,
  departmentId: string | null,
  rangeStartIso: string,
  rangeEndIso: string
): Promise<
  | { ok: true; shifts: WorkplaceShiftRow[] }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceMember(workplaceId);
    const admin = getAdminClient();
    let q = admin
      .from("workplace_shifts")
      .select("id, workplace_id, department_id, user_id, shift_type_id, starts_at, ends_at")
      .eq("workplace_id", workplaceId)
      .lt("starts_at", rangeEndIso)
      .gt("ends_at", rangeStartIso);
    if (departmentId) {
      q = q.eq("department_id", departmentId);
    }
    const { data, error } = await q.order("starts_at");
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return { ok: true, shifts: [] };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true, shifts: (data ?? []) as WorkplaceShiftRow[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
