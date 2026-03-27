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

async function assertCalendarAdminForWorkplace(workplaceId: string): Promise<void> {
  await assertWorkplaceMember(workplaceId);
  const adminView = await isWorkplaceCalendarAdminView(workplaceId);
  if (!adminView) {
    throw new Error("Kun administrator/leder kan ændre vagter.");
  }
}

/**
 * Henter vagter der overlapper [rangeStartIso, rangeEndIso) (typisk UTC fra klientens lokale dage).
 * Ved valgt afdeling: kun vagter med samme department_id.
 */
export async function getWorkplaceShiftsInRange(
  workplaceId: string,
  departmentId: string | null,
  rangeStartIso: string,
  rangeEndIso: string,
  userId?: string
): Promise<
  | { ok: true; shifts: WorkplaceShiftRow[] }
  | { ok: false; error: string }
> {
  const startedAtMs = Date.now();
  let status: "ok" | "error" = "ok";
  let rowCount = 0;
  let errorMessage: string | null = null;
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
    if (userId) {
      q = q.eq("user_id", userId);
    }
    const { data, error } = await q.order("starts_at");
    if (error) {
      if (isMissingSchemaError(error.message)) {
        rowCount = 0;
        return { ok: true, shifts: [] };
      }
      status = "error";
      errorMessage = error.message;
      return { ok: false, error: error.message };
    }
    rowCount = (data ?? []).length;
    return { ok: true, shifts: (data ?? []) as WorkplaceShiftRow[] };
  } catch (e) {
    status = "error";
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    errorMessage = msg;
    return { ok: false, error: msg };
  } finally {
    if (process.env.NODE_ENV !== "production") {
      const elapsedMs = Date.now() - startedAtMs;
      const suffix = status === "error" ? ` error="${errorMessage ?? "unknown"}"` : "";
      console.info(
        `[calendar-server] getWorkplaceShiftsInRange wp=${workplaceId} dept=${departmentId ?? "all"} user=${userId ?? "all"} rows=${rowCount} status=${status} ms=${elapsedMs}${suffix}`
      );
    }
  }
}

export async function deleteWorkplaceShift(
  workplaceId: string,
  shiftId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertCalendarAdminForWorkplace(workplaceId);
    const admin = getAdminClient();
    const { error } = await admin
      .from("workplace_shifts")
      .delete()
      .eq("id", shiftId)
      .eq("workplace_id", workplaceId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function reassignWorkplaceShift(
  workplaceId: string,
  shiftId: string,
  replacementUserId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertCalendarAdminForWorkplace(workplaceId);
    const admin = getAdminClient();

    const { data: shift, error: shiftErr } = await admin
      .from("workplace_shifts")
      .select("id, workplace_id, department_id")
      .eq("id", shiftId)
      .eq("workplace_id", workplaceId)
      .maybeSingle();
    if (shiftErr) return { ok: false, error: shiftErr.message };
    if (!shift) return { ok: false, error: "Vagt ikke fundet." };

    const { data: member, error: memberErr } = await admin
      .from("workplace_members")
      .select("user_id")
      .eq("workplace_id", workplaceId)
      .eq("user_id", replacementUserId)
      .maybeSingle();
    if (memberErr) return { ok: false, error: memberErr.message };
    if (!member) {
      return { ok: false, error: "Erstatningsmedarbejder er ikke medlem af arbejdspladsen." };
    }

    const { error } = await admin
      .from("workplace_shifts")
      .update({ user_id: replacementUserId })
      .eq("id", shiftId)
      .eq("workplace_id", workplaceId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function swapWorkplaceShifts(
  workplaceId: string,
  sourceShiftId: string,
  targetShiftId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertCalendarAdminForWorkplace(workplaceId);
    if (sourceShiftId === targetShiftId) {
      return { ok: false, error: "Vælg en anden vagt at bytte med." };
    }
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("workplace_shifts")
      .select("id, workplace_id, user_id")
      .eq("workplace_id", workplaceId)
      .in("id", [sourceShiftId, targetShiftId]);
    if (error) return { ok: false, error: error.message };
    const rows = data ?? [];
    const source = rows.find((r) => r.id === sourceShiftId);
    const target = rows.find((r) => r.id === targetShiftId);
    if (!source || !target) return { ok: false, error: "Kunne ikke finde begge vagter." };

    const { error: e1 } = await admin
      .from("workplace_shifts")
      .update({ user_id: target.user_id as string })
      .eq("id", sourceShiftId)
      .eq("workplace_id", workplaceId);
    if (e1) return { ok: false, error: e1.message };

    const { error: e2 } = await admin
      .from("workplace_shifts")
      .update({ user_id: source.user_id as string })
      .eq("id", targetShiftId)
      .eq("workplace_id", workplaceId);
    if (e2) return { ok: false, error: e2.message };

    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function updateWorkplaceShiftTiming(
  workplaceId: string,
  shiftId: string,
  startsAtIso: string,
  endsAtIso: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertCalendarAdminForWorkplace(workplaceId);
    const s = new Date(startsAtIso).getTime();
    const e = new Date(endsAtIso).getTime();
    if (!Number.isFinite(s) || !Number.isFinite(e)) {
      return { ok: false, error: "Ugyldige dato/tid værdier." };
    }
    if (e <= s) {
      return { ok: false, error: "Sluttid skal være efter starttid." };
    }

    const admin = getAdminClient();
    const { error } = await admin
      .from("workplace_shifts")
      .update({
        starts_at: new Date(s).toISOString(),
        ends_at: new Date(e).toISOString(),
      })
      .eq("id", shiftId)
      .eq("workplace_id", workplaceId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function createWorkplaceShift(
  workplaceId: string,
  input: {
    userId: string;
    departmentId: string | null;
    shiftTypeId: string | null;
    startsAtIso: string;
    endsAtIso: string;
  }
): Promise<{ ok: true; shift: WorkplaceShiftRow } | { ok: false; error: string }> {
  try {
    await assertCalendarAdminForWorkplace(workplaceId);

    const s = new Date(input.startsAtIso).getTime();
    const e = new Date(input.endsAtIso).getTime();
    if (!Number.isFinite(s) || !Number.isFinite(e)) {
      return { ok: false, error: "Ugyldige dato/tid værdier." };
    }
    if (e <= s) {
      return { ok: false, error: "Sluttid skal være efter starttid." };
    }

    const admin = getAdminClient();

    const { data: member, error: memberErr } = await admin
      .from("workplace_members")
      .select("user_id")
      .eq("workplace_id", workplaceId)
      .eq("user_id", input.userId)
      .maybeSingle();
    if (memberErr) return { ok: false, error: memberErr.message };
    if (!member) {
      return { ok: false, error: "Medarbejderen er ikke medlem af arbejdspladsen." };
    }

    const { data, error } = await admin
      .from("workplace_shifts")
      .insert({
        workplace_id: workplaceId,
        department_id: input.departmentId,
        user_id: input.userId,
        shift_type_id: input.shiftTypeId,
        starts_at: new Date(s).toISOString(),
        ends_at: new Date(e).toISOString(),
      })
      .select("id, workplace_id, department_id, user_id, shift_type_id, starts_at, ends_at")
      .single();
    if (error) return { ok: false, error: error.message };

    return { ok: true, shift: data as WorkplaceShiftRow };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
