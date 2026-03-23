"use server";

import { revalidatePath } from "next/cache";
import { assertWorkplaceAdminOrSuperAdmin } from "@/src/lib/workplace-admin-server";
import {
  addDaysYmd,
  compareYmd,
  formatDateInCopenhagen,
  todayInCopenhagen,
  weekdayMon0FromYmd,
} from "@/src/lib/date-dk";
import { getAdminClient } from "@/src/utils/supabase/admin";
import type { WorkplaceShiftRow } from "@/src/app/dashboard/workplace-shifts-actions";
import { getWorkplaceShiftsInRange } from "@/src/app/dashboard/workplace-shifts-actions";
import {
  normalizeSeasonTemplate,
  type SeasonTemplatePayload,
  type SeasonWeekdayKey,
} from "@/src/types/season-template";
import { updateWorkplace } from "@/src/app/super-admin/workplaces/actions";

export type FuturePlanningSnapshot = {
  future_planning_weeks: number;
  calendar_released_until: string | null;
  today: string;
  firstUnreleasedDay: string;
  windowEnd: string;
  shiftCountInWindow: number;
};

function firstUnreleasedDate(
  releasedUntil: string | null,
  today: string
): string {
  if (!releasedUntil) {
    return today;
  }
  if (compareYmd(releasedUntil, today) < 0) {
    return today;
  }
  return addDaysYmd(releasedUntil, 1);
}

function windowEndFromStart(
  firstUnreleased: string,
  weeks: number
): string {
  return addDaysYmd(firstUnreleased, weeks * 7 - 1);
}

function shiftLocalStartDate(s: WorkplaceShiftRow): string {
  return formatDateInCopenhagen(new Date(s.starts_at));
}

function shiftsInYmdWindow(
  shifts: WorkplaceShiftRow[],
  from: string,
  to: string
): WorkplaceShiftRow[] {
  return shifts.filter((s) => {
    const d = shiftLocalStartDate(s);
    return compareYmd(d, from) >= 0 && compareYmd(d, to) <= 0;
  });
}

export async function getFuturePlanningSnapshot(
  workplaceId: string
): Promise<
  | { ok: true; data: FuturePlanningSnapshot }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("workplaces")
      .select("future_planning_weeks, calendar_released_until")
      .eq("id", workplaceId)
      .maybeSingle();

    if (error) {
      if (/column|does not exist|schema cache/i.test(error.message)) {
        const today = todayInCopenhagen();
        const weeks = 8;
        const first = firstUnreleasedDate(null, today);
        const end = windowEndFromStart(first, weeks);
        return {
          ok: true,
          data: {
            future_planning_weeks: weeks,
            calendar_released_until: null,
            today,
            firstUnreleasedDay: first,
            windowEnd: end,
            shiftCountInWindow: 0,
          },
        };
      }
      return { ok: false, error: error.message };
    }

    const row = data as {
      future_planning_weeks?: number;
      calendar_released_until?: string | null;
    };
    const futureWeeks = row.future_planning_weeks ?? 8;
    const released = row.calendar_released_until ?? null;
    const today = todayInCopenhagen();
    const first = firstUnreleasedDate(released, today);
    const end = windowEndFromStart(first, futureWeeks);

    const rangeStartIso = `${addDaysYmd(first, -1)}T00:00:00.000Z`;
    const rangeEndIso = `${addDaysYmd(end, 2)}T00:00:00.000Z`;
    const shiftsRes = await getWorkplaceShiftsInRange(
      workplaceId,
      null,
      rangeStartIso,
      rangeEndIso
    );
    const inWin =
      shiftsRes.ok === true
        ? shiftsInYmdWindow(shiftsRes.shifts, first, end)
        : [];

    return {
      ok: true,
      data: {
        future_planning_weeks: futureWeeks,
        calendar_released_until: released,
        today,
        firstUnreleasedDay: first,
        windowEnd: end,
        shiftCountInWindow: inWin.length,
      },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function loadUnreleasedShiftsForWindow(
  workplaceId: string
): Promise<
  | { ok: true; shifts: WorkplaceShiftRow[] }
  | { ok: false; error: string }
> {
  const snap = await getFuturePlanningSnapshot(workplaceId);
  if (!snap.ok) return snap;
  const { firstUnreleasedDay, windowEnd } = snap.data;
  const rangeStartIso = `${addDaysYmd(firstUnreleasedDay, -1)}T00:00:00.000Z`;
  const rangeEndIso = `${addDaysYmd(windowEnd, 2)}T00:00:00.000Z`;
  const shiftsRes = await getWorkplaceShiftsInRange(
    workplaceId,
    null,
    rangeStartIso,
    rangeEndIso
  );
  if (!shiftsRes.ok) return shiftsRes;
  return {
    ok: true,
    shifts: shiftsInYmdWindow(
      shiftsRes.shifts,
      firstUnreleasedDay,
      windowEnd
    ),
  };
}

function findActivePeriodForDate(
  template: SeasonTemplatePayload,
  ymd: string
): (typeof template.periods)[0] | null {
  for (const p of template.periods) {
    if (!p.dateFrom || !p.dateTo) continue;
    if (compareYmd(ymd, p.dateFrom) >= 0 && compareYmd(ymd, p.dateTo) <= 0) {
      return p;
    }
  }
  return null;
}

/**
 * Heuristisk: dobbeltbookinger + skabelon vs. dækning (min. medarbejdere / typer).
 */
export async function generateAiPlanPreview(
  workplaceId: string,
  planWeeks: number
): Promise<
  | { ok: true; conflicts: string[] }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const admin = getAdminClient();
    const { data: wp, error } = await admin
      .from("workplaces")
      .select("calendar_released_until, season_template_json, future_planning_weeks")
      .eq("id", workplaceId)
      .maybeSingle();

    if (error && !/column|does not exist|schema cache/i.test(error.message)) {
      return { ok: false, error: error.message };
    }

    const row = (wp ?? {}) as {
      calendar_released_until?: string | null;
      season_template_json?: unknown;
      future_planning_weeks?: number;
    };
    const released = row.calendar_released_until ?? null;
    const today = todayInCopenhagen();
    const first = firstUnreleasedDate(released, today);
    const planEnd = addDaysYmd(first, Math.max(1, planWeeks) * 7 - 1);

    const rangeStartIso = `${addDaysYmd(first, -1)}T00:00:00.000Z`;
    const rangeEndIso = `${addDaysYmd(planEnd, 2)}T00:00:00.000Z`;
    const shiftsRes = await getWorkplaceShiftsInRange(
      workplaceId,
      null,
      rangeStartIso,
      rangeEndIso
    );
    if (!shiftsRes.ok) return shiftsRes;

    const shifts = shiftsInYmdWindow(shiftsRes.shifts, first, planEnd);
    const conflicts: string[] = [];

    const byUserDay = new Map<string, WorkplaceShiftRow[]>();
    for (const s of shifts) {
      const d = shiftLocalStartDate(s);
      const key = `${s.user_id}|${d}`;
      const arr = byUserDay.get(key) ?? [];
      arr.push(s);
      byUserDay.set(key, arr);
    }
    for (const [key, arr] of byUserDay) {
      if (arr.length < 2) continue;
      arr.sort(
        (a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      );
      for (let i = 1; i < arr.length; i++) {
        const prev = arr[i - 1]!;
        const cur = arr[i]!;
        if (new Date(cur.starts_at) < new Date(prev.ends_at)) {
          const day = key.split("|")[1];
          conflicts.push(
            `Dobbeltbooking: samme medarbejder ${day} (overlap mellem vagter).`
          );
          break;
        }
      }
    }

    const template = normalizeSeasonTemplate(row.season_template_json);
    let dayCursor = first;
    let guard = 0;
    while (compareYmd(dayCursor, planEnd) <= 0 && guard < 400) {
      guard++;
      const period = findActivePeriodForDate(template, dayCursor);
      if (period) {
        const wk = String(weekdayMon0FromYmd(dayCursor)) as SeasonWeekdayKey;
        const slot = period.weekdays[wk];
        if (slot?.minEmployees != null && slot.minEmployees > 0) {
          const dayShifts = shifts.filter(
            (s) => shiftLocalStartDate(s) === dayCursor
          );
          if (dayShifts.length < slot.minEmployees) {
            conflicts.push(
              `${dayCursor}: skabelon kræver mindst ${slot.minEmployees} vagt(er); der er ${dayShifts.length}.`
            );
          }
        }
      }
      const next = addDaysYmd(dayCursor, 1);
      if (next === dayCursor) break;
      dayCursor = next;
    }

    if (conflicts.length === 0) {
      conflicts.push(
        "Ingen åbenlyse konflikter i det valgte vindue ud fra skabelon og dobbeltbooking — gennemgå manuelt før frigivelse."
      );
    }

    return { ok: true, conflicts };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

/**
 * Frigør N uger fra første ufrigivne dag og køer push til medlemmer (stub indtil Expo/FCM).
 */
export async function releaseCalendarWeeks(
  workplaceId: string,
  weeks: number
): Promise<
  | {
      ok: true;
      newReleasedUntil: string;
      pushMessage: string;
      pushDelivered: false;
    }
  | { ok: false; error: string }
> {
  try {
    await assertWorkplaceAdminOrSuperAdmin(workplaceId);
    const w = Math.min(104, Math.max(1, Math.floor(weeks)));
    const admin = getAdminClient();
    const { data: wp, error } = await admin
      .from("workplaces")
      .select("name, company_name, calendar_released_until")
      .eq("id", workplaceId)
      .maybeSingle();

    if (error && !/column|does not exist|schema cache/i.test(error.message)) {
      return { ok: false, error: error.message };
    }

    const row = (wp ?? {}) as {
      name?: string;
      company_name?: string | null;
      calendar_released_until?: string | null;
    };
    const today = todayInCopenhagen();
    const first = firstUnreleasedDate(row.calendar_released_until ?? null, today);
    const newReleasedUntil = addDaysYmd(first, w * 7 - 1);

    const company = (row.company_name ?? row.name ?? "Arbejdsplads").trim();
    const pushMessage = `Vi har netop frigivet ${w} uger mere til kalenderen. Mvh. ${company}`;

    const patchRes = await updateWorkplace(workplaceId, {
      calendar_released_until: newReleasedUntil,
    });
    if (!patchRes.ok) {
      return patchRes;
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/fremtiden");

    await notifyWorkplaceMembersPushStub(workplaceId, pushMessage);

    return {
      ok: true,
      newReleasedUntil,
      pushMessage,
      pushDelivered: false,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

/** Erstat med rigtig push (Expo/FCM) når enhedstokens findes. */
async function notifyWorkplaceMembersPushStub(
  workplaceId: string,
  body: string
): Promise<void> {
  const admin = getAdminClient();
  const { data: members } = await admin
    .from("workplace_members")
    .select("user_id")
    .eq("workplace_id", workplaceId);
  const n = members?.length ?? 0;
  console.info(
    `[push stub] workplace=${workplaceId} members=${n} message=${JSON.stringify(body)}`
  );
}

export async function saveSeasonTemplate(
  workplaceId: string,
  template: SeasonTemplatePayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = normalizeSeasonTemplate(template);
  const res = await updateWorkplace(workplaceId, {
    season_template_json: normalized,
  });
  if (!res.ok) return res;
  revalidatePath("/dashboard/fremtiden");
  return { ok: true };
}
