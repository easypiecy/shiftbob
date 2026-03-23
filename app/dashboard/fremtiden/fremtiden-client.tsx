"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, Loader2, Sparkles, Unlock } from "lucide-react";
import type {
  WorkplaceEmployeeTypeRow,
  WorkplaceShiftTypeRow,
} from "@/src/app/super-admin/workplaces/actions";
import {
  generateAiPlanPreview,
  getFuturePlanningSnapshot,
  loadUnreleasedShiftsForWindow,
  releaseCalendarWeeks,
  saveSeasonTemplate,
  type FuturePlanningSnapshot,
} from "@/src/app/dashboard/future-workplace-actions";
import { useTranslations } from "@/src/contexts/translations-context";
import {
  createEmptySeasonPeriod,
  SEASON_WEEKDAY_KEYS,
  type SeasonDaySlot,
  type SeasonPeriod,
  type SeasonTemplatePayload,
  type SeasonWeekdayKey,
} from "@/src/types/season-template";

const WEEK_KEYS = SEASON_WEEKDAY_KEYS;

type Props = {
  workplaceId: string;
  workplaceName: string;
  initialSnapshot: FuturePlanningSnapshot;
  employeeTypes: WorkplaceEmployeeTypeRow[];
  shiftTypes: WorkplaceShiftTypeRow[];
  seasonTemplate: SeasonTemplatePayload;
};

function emptySlot(): SeasonDaySlot {
  return {};
}

export default function FremtidenClient({
  workplaceId,
  workplaceName,
  initialSnapshot,
  employeeTypes,
  shiftTypes,
  seasonTemplate: initialSeason,
}: Props) {
  const { t: tr } = useTranslations();
  const router = useRouter();
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [season, setSeason] = useState<SeasonTemplatePayload>(initialSeason);

  useEffect(() => {
    setSnapshot(initialSnapshot);
  }, [initialSnapshot]);

  useEffect(() => {
    setSeason(initialSeason);
  }, [initialSeason]);
  const [planWeeks, setPlanWeeks] = useState(4);
  const [releaseWeeks, setReleaseWeeks] = useState(4);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [shiftPreview, setShiftPreview] = useState<number | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const rangeLabel = useMemo(() => {
    return `${snapshot.firstUnreleasedDay} → ${snapshot.windowEnd}`;
  }, [snapshot.firstUnreleasedDay, snapshot.windowEnd]);

  const reloadSnapshot = useCallback(async () => {
    const res = await getFuturePlanningSnapshot(workplaceId);
    if (res.ok) setSnapshot(res.data);
  }, [workplaceId]);

  const runAi = useCallback(async () => {
    setMsg(null);
    setBusy("ai");
    try {
      const res = await generateAiPlanPreview(workplaceId, planWeeks);
      if (!res.ok) {
        setMsg(res.error);
        setConflicts([]);
        return;
      }
      setConflicts(res.conflicts);
      const sh = await loadUnreleasedShiftsForWindow(workplaceId);
      setShiftPreview(sh.ok ? sh.shifts.length : null);
    } finally {
      setBusy(null);
    }
  }, [workplaceId, planWeeks]);

  const saveTemplate = useCallback(async () => {
    setMsg(null);
    setBusy("save");
    try {
      const res = await saveSeasonTemplate(workplaceId, season);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setMsg(tr("future.season.save_success"));
      router.refresh();
    } finally {
      setBusy(null);
    }
  }, [workplaceId, season, router, tr]);

  const release = useCallback(async () => {
    const confirmText = tr("future.release.confirm").replace(
      "{weeks}",
      String(releaseWeeks)
    );
    if (!window.confirm(confirmText)) {
      return;
    }
    setMsg(null);
    setBusy("release");
    try {
      const res = await releaseCalendarWeeks(workplaceId, releaseWeeks);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setMsg(
        tr("future.release.success_detail")
          .replace("{date}", res.newReleasedUntil)
          .replace("{message}", res.pushMessage)
      );
      await reloadSnapshot();
      router.refresh();
    } finally {
      setBusy(null);
    }
  }, [workplaceId, releaseWeeks, reloadSnapshot, router, tr]);

  function updatePeriod(id: string, patch: Partial<SeasonPeriod>) {
    setSeason((prev) => ({
      ...prev,
      periods: prev.periods.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      ),
    }));
  }

  function updateDaySlot(
    periodId: string,
    wk: SeasonWeekdayKey,
    patch: Partial<SeasonDaySlot>
  ) {
    setSeason((prev) => ({
      ...prev,
      periods: prev.periods.map((p) => {
        if (p.id !== periodId) return p;
        const next = { ...p.weekdays };
        const cur: Record<string, unknown> = {
          ...(next[wk] ?? emptySlot()),
        };
        for (const [key, val] of Object.entries(patch)) {
          if (val === undefined) {
            delete cur[key];
          } else {
            cur[key] = val;
          }
        }
        next[wk] = cur as SeasonDaySlot;
        return { ...p, weekdays: next };
      }),
    }));
  }

  function setEmpCount(
    periodId: string,
    wk: SeasonWeekdayKey,
    typeId: string,
    n: number | ""
  ) {
    setSeason((prev) => ({
      ...prev,
      periods: prev.periods.map((p) => {
        if (p.id !== periodId) return p;
        const slot = { ...(p.weekdays[wk] ?? emptySlot()) };
        const counts = { ...slot.employeeTypeCounts };
        if (n === "" || n === 0) delete counts[typeId];
        else counts[typeId] = n;
        slot.employeeTypeCounts =
          Object.keys(counts).length > 0 ? counts : undefined;
        const next = { ...p.weekdays, [wk]: slot };
        return { ...p, weekdays: next };
      }),
    }));
  }

  function setShiftCount(
    periodId: string,
    wk: SeasonWeekdayKey,
    typeId: string,
    n: number | ""
  ) {
    setSeason((prev) => ({
      ...prev,
      periods: prev.periods.map((p) => {
        if (p.id !== periodId) return p;
        const slot = { ...(p.weekdays[wk] ?? emptySlot()) };
        const counts = { ...slot.shiftTypeCounts };
        if (n === "" || n === 0) delete counts[typeId];
        else counts[typeId] = n;
        slot.shiftTypeCounts =
          Object.keys(counts).length > 0 ? counts : undefined;
        const next = { ...p.weekdays, [wk]: slot };
        return { ...p, weekdays: next };
      }),
    }));
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
      <div className="mb-8 flex flex-wrap items-start gap-3">
        <CalendarClock className="mt-0.5 h-8 w-8 text-zinc-500" aria-hidden />
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {tr("future.page.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {tr("future.page.intro")}
          </p>
          <p className="mt-3 text-xs text-zinc-500">
            {tr("future.page.settings_before_link")}{" "}
            <Link
              href="/dashboard/indstillinger"
              className="font-medium underline"
            >
              {tr("admin.nav.settings")}
            </Link>{" "}
            {tr("future.page.settings_after_link")}
          </p>
        </div>
      </div>

      <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {tr("future.status.title")}
        </h2>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">{tr("future.status.released_until")}</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">
              {snapshot.calendar_released_until ?? tr("future.status.none_released")}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">{tr("future.status.window")}</dt>
            <dd className="font-mono text-xs text-zinc-800 dark:text-zinc-200">
              {rangeLabel}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">{tr("future.status.shifts")}</dt>
            <dd className="font-medium">{snapshot.shiftCountInWindow}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">{tr("future.status.company")}</dt>
            <dd className="font-medium">{workplaceName}</dd>
          </div>
        </dl>
      </section>

      <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" aria-hidden />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {tr("future.ai.title")}
          </h2>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {tr("future.ai.intro")}
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block w-32">
            <span className="mb-1 block text-xs font-medium text-zinc-500">
              {tr("future.ai.weeks_label")}
            </span>
            <input
              type="number"
              min={1}
              max={52}
              value={planWeeks}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (Number.isFinite(v))
                  setPlanWeeks(Math.min(52, Math.max(1, v)));
              }}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void runAi()}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {busy === "ai" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {tr("future.ai.run")}
          </button>
        </div>
        {shiftPreview !== null ? (
          <p className="mt-2 text-xs text-zinc-500">
            {tr("future.ai.shifts_now")} {shiftPreview}
          </p>
        ) : null}
        {conflicts.length > 0 ? (
          <ul className="mt-4 list-inside list-disc space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            {conflicts.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {tr("future.season.title")}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {tr("future.season.intro")}
        </p>

        <div className="mt-4 space-y-6">
          {season.periods.length === 0 ? (
            <p className="text-sm text-zinc-500">{tr("future.season.empty_periods")}</p>
          ) : null}
          {season.periods.map((period) => (
            <div
              key={period.id}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
            >
              <div className="flex flex-wrap items-end gap-3">
                <label className="min-w-[10rem] flex-1">
                  <span className="mb-1 block text-xs font-medium text-zinc-500">
                    {tr("future.season.name")}
                  </span>
                  <input
                    value={period.name}
                    onChange={(e) =>
                      updatePeriod(period.id, { name: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-medium text-zinc-500">
                    {tr("future.season.from")}
                  </span>
                  <input
                    type="date"
                    value={period.dateFrom}
                    onChange={(e) =>
                      updatePeriod(period.id, { dateFrom: e.target.value })
                    }
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs font-medium text-zinc-500">
                    {tr("future.season.to")}
                  </span>
                  <input
                    type="date"
                    value={period.dateTo}
                    onChange={(e) =>
                      updatePeriod(period.id, { dateTo: e.target.value })
                    }
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
                  />
                </label>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline"
                  onClick={() =>
                    setSeason((p) => ({
                      ...p,
                      periods: p.periods.filter((x) => x.id !== period.id),
                    }))
                  }
                >
                  {tr("future.season.remove_period")}
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="py-2 pr-2 font-medium">
                        {tr("future.season.weekday_col")}
                      </th>
                      <th className="py-2 pr-2 font-medium">
                        {tr("future.season.min_shifts")}
                      </th>
                      {employeeTypes.map((et) => (
                        <th key={et.id} className="py-2 px-1 font-medium">
                          {et.label}
                        </th>
                      ))}
                      {shiftTypes.map((st) => (
                        <th
                          key={st.id}
                          className="py-2 px-1 font-medium text-zinc-600"
                        >
                          {tr("future.season.shift_prefix")} {st.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {WEEK_KEYS.map((wk) => {
                      const slot = period.weekdays[wk] ?? emptySlot();
                      return (
                        <tr
                          key={wk}
                          className="border-b border-zinc-100 dark:border-zinc-800"
                        >
                          <td className="py-2 pr-2 font-medium">
                            {tr(`calendar.weekday.${wk}`)}
                          </td>
                          <td className="py-2 pr-2">
                            <input
                              type="number"
                              min={0}
                              placeholder="0"
                              value={slot.minEmployees ?? ""}
                              onChange={(e) => {
                                const v = parseInt(e.target.value, 10);
                                if (e.target.value === "") {
                                  updateDaySlot(period.id, wk, {
                                    minEmployees: undefined,
                                  });
                                } else if (Number.isFinite(v)) {
                                  if (v <= 0) {
                                    updateDaySlot(period.id, wk, {
                                      minEmployees: undefined,
                                    });
                                  } else {
                                    updateDaySlot(period.id, wk, {
                                      minEmployees: v,
                                    });
                                  }
                                }
                              }}
                              className="w-16 rounded border border-zinc-300 px-1 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                            />
                          </td>
                          {employeeTypes.map((et) => (
                            <td key={et.id} className="px-1 py-2">
                              <input
                                type="number"
                                min={0}
                                placeholder="—"
                                value={slot.employeeTypeCounts?.[et.id] ?? ""}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const v = parseInt(raw, 10);
                                  setEmpCount(
                                    period.id,
                                    wk,
                                    et.id,
                                    raw === "" ? "" : v
                                  );
                                }}
                                className="w-14 rounded border border-zinc-300 px-1 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                              />
                            </td>
                          ))}
                          {shiftTypes.map((st) => (
                            <td key={st.id} className="px-1 py-2">
                              <input
                                type="number"
                                min={0}
                                placeholder="—"
                                value={slot.shiftTypeCounts?.[st.id] ?? ""}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const v = parseInt(raw, 10);
                                  setShiftCount(
                                    period.id,
                                    wk,
                                    st.id,
                                    raw === "" ? "" : v
                                  );
                                }}
                                className="w-14 rounded border border-zinc-300 px-1 py-1 dark:border-zinc-600 dark:bg-zinc-950"
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium dark:border-zinc-600"
            onClick={() =>
              setSeason((p) => ({
                ...p,
                periods: [
                  ...p.periods,
                  createEmptySeasonPeriod(tr("future.season.period_new")),
                ],
              }))
            }
          >
            {tr("future.season.add_period")}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void saveTemplate()}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {busy === "save" ? (
              <Loader2 className="inline h-4 w-4 animate-spin" />
            ) : null}{" "}
            {tr("future.season.save")}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <div className="flex flex-wrap items-center gap-2">
          <Unlock className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
          <h2 className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">
            {tr("future.release.title")}
          </h2>
        </div>
        <p className="mt-2 text-sm text-emerald-900 dark:text-emerald-200/90">
          {tr("future.release.intro").replace("{company}", workplaceName)}
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block w-32">
            <span className="mb-1 block text-xs font-medium text-emerald-800 dark:text-emerald-300">
              {tr("future.release.weeks_label")}
            </span>
            <input
              type="number"
              min={1}
              max={52}
              value={releaseWeeks}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (Number.isFinite(v))
                  setReleaseWeeks(Math.min(52, Math.max(1, v)));
              }}
              className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm dark:border-emerald-800 dark:bg-emerald-950"
            />
          </label>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void release()}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-emerald-600"
          >
            {busy === "release" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
            {tr("future.release.cta")}
          </button>
        </div>
      </section>

      {msg ? (
        <p
          className="mt-6 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          role="status"
        >
          {msg}
        </p>
      ) : null}
    </div>
  );
}
