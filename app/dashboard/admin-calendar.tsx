"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import {
  getWorkplaceDepartmentsOverview,
  type WorkplaceDepartmentRow,
  type WorkplaceEmployeeTypeRow,
  type WorkplaceMemberDepartmentsRow,
  type WorkplaceShiftTypeRow,
} from "@/src/app/super-admin/workplaces/actions";
import {
  getWorkplaceShiftsInRange,
  type WorkplaceShiftRow,
} from "@/src/app/dashboard/workplace-shifts-actions";
import EmployeeCalendarNameCell from "@/app/dashboard/employee-calendar-name-cell";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

type CalendarViewMode = "rolling" | "month30";

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Lokal kalenderdag som YYYY-MM-DD */
function dayKeyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function expandAround(center: Date, beforeAfter: number): Date[] {
  const c = startOfDay(new Date(center));
  const out: Date[] = [];
  for (let i = -beforeAfter; i <= beforeAfter; i++) {
    out.push(addDays(c, i));
  }
  return out;
}

function formatDayHeader(d: Date): string {
  return new Intl.DateTimeFormat("da-DK", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(d);
}

function formatTimeNow(): string {
  return new Intl.DateTimeFormat("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function localSlotRangeMs(dayStart: Date, hour: number): { start: number; end: number } {
  const s = new Date(dayStart);
  s.setHours(hour, 0, 0, 0);
  const e = new Date(s);
  e.setHours(hour + 1, 0, 0, 0);
  return { start: s.getTime(), end: e.getTime() };
}

function shiftOverlapsSlot(
  shift: WorkplaceShiftRow,
  userId: string,
  dayStart: Date,
  hour: number
): boolean {
  if (shift.user_id !== userId) return false;
  const { start, end } = localSlotRangeMs(dayStart, hour);
  const a = new Date(shift.starts_at).getTime();
  const b = new Date(shift.ends_at).getTime();
  return a < end && b > start;
}

function firstDepartmentLabel(
  m: WorkplaceMemberDepartmentsRow,
  deptById: Map<string, WorkplaceDepartmentRow>
): string {
  const names = m.department_ids
    .map((id) => deptById.get(id)?.name ?? "")
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "da"));
  return names[0] ?? "";
}

type EmployeeSortKey = "name_asc" | "name_desc" | "department" | "employee_type";

function distinctEmployeesOnShiftForDay(
  shifts: WorkplaceShiftRow[],
  day: Date
): number {
  const ds = startOfDay(day).getTime();
  const de = addDays(startOfDay(day), 1).getTime();
  const set = new Set<string>();
  for (const s of shifts) {
    const a = new Date(s.starts_at).getTime();
    const b = new Date(s.ends_at).getTime();
    if (a < de && b > ds) set.add(s.user_id);
  }
  return set.size;
}

type Props = {
  workplaceId: string;
};

const HOUR_COL = 28;
const DAY_PX = 24 * HOUR_COL;

export default function AdminCalendar({ workplaceId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<WorkplaceDepartmentRow[]>([]);
  const [members, setMembers] = useState<WorkplaceMemberDepartmentsRow[]>([]);
  const [shiftTypes, setShiftTypes] = useState<WorkplaceShiftTypeRow[]>([]);
  const [employeeTypes, setEmployeeTypes] = useState<WorkplaceEmployeeTypeRow[]>([]);

  const [viewMode, setViewMode] = useState<CalendarViewMode>("rolling");
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()));
  const [rollingDays, setRollingDays] = useState<Date[]>(() =>
    expandAround(startOfDay(new Date()), 3)
  );
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [employeeQuery, setEmployeeQuery] = useState("");
  /** Filtrér celler i gitteret efter vagttype (alle / én type / uden type) */
  const [filterShiftTypeId, setFilterShiftTypeId] = useState<string | null>(null);
  /** Filtrér medarbejderrækker efter medarbejdertype */
  const [filterEmployeeTypeId, setFilterEmployeeTypeId] = useState<string | null>(null);
  const [employeeSort, setEmployeeSort] = useState<EmployeeSortKey>("name_asc");
  const [clock, setClock] = useState(formatTimeNow);
  const [addShiftOpen, setAddShiftOpen] = useState(false);

  const [rollingShifts, setRollingShifts] = useState<WorkplaceShiftRow[]>([]);
  const [monthShifts, setMonthShifts] = useState<WorkplaceShiftRow[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const rollingDaysRef = useRef(rollingDays);

  useEffect(() => {
    rollingDaysRef.current = rollingDays;
  }, [rollingDays]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getWorkplaceDepartmentsOverview(workplaceId);
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setDepartments(res.departments);
    setMembers(res.members);
    setShiftTypes(res.shiftTypes);
    setEmployeeTypes(res.employeeTypes);
    setLoading(false);
  }, [workplaceId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatTimeNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (departments.length === 0) {
      setSelectedDeptId(null);
      return;
    }
    if (departments.length === 1) {
      setSelectedDeptId(departments[0].id);
      return;
    }
    setSelectedDeptId((prev) => {
      if (prev && departments.some((d) => d.id === prev)) return prev;
      return null;
    });
  }, [departments]);

  useEffect(() => {
    if (viewMode !== "rolling" || rollingDays.length === 0) return;
    const first = rollingDays[0];
    const last = rollingDays[rollingDays.length - 1];
    const rangeStartIso = startOfDay(first).toISOString();
    const rangeEndIso = addDays(startOfDay(last), 1).toISOString();
    let cancelled = false;
    void (async () => {
      const res = await getWorkplaceShiftsInRange(
        workplaceId,
        selectedDeptId,
        rangeStartIso,
        rangeEndIso
      );
      if (!cancelled && res.ok) setRollingShifts(res.shifts);
    })();
    return () => {
      cancelled = true;
    };
  }, [viewMode, rollingDays, workplaceId, selectedDeptId]);

  useEffect(() => {
    if (viewMode !== "month30") return;
    const rangeStartIso = startOfDay(anchorDate).toISOString();
    const rangeEndIso = addDays(startOfDay(anchorDate), 30).toISOString();
    let cancelled = false;
    void (async () => {
      const res = await getWorkplaceShiftsInRange(
        workplaceId,
        selectedDeptId,
        rangeStartIso,
        rangeEndIso
      );
      if (!cancelled && res.ok) setMonthShifts(res.shifts);
    })();
    return () => {
      cancelled = true;
    };
  }, [viewMode, anchorDate, workplaceId, selectedDeptId]);

  const departmentFiltered = useMemo(() => {
    if (departments.length === 0) return members;
    if (!selectedDeptId) return members;
    return members.filter((m) => m.department_ids.includes(selectedDeptId));
  }, [members, departments, selectedDeptId]);

  const departmentById = useMemo(() => {
    const m = new Map<string, WorkplaceDepartmentRow>();
    for (const d of departments) m.set(d.id, d);
    return m;
  }, [departments]);

  const visibleEmployees = useMemo(() => {
    let list = departmentFiltered;
    if (filterEmployeeTypeId) {
      if (filterEmployeeTypeId === "__none__") {
        list = list.filter((m) => !m.employee_type_id);
      } else {
        list = list.filter((m) => m.employee_type_id === filterEmployeeTypeId);
      }
    }
    const q = employeeQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => {
        const label = `${m.display_name} ${m.email ?? ""} ${m.user_id}`.toLowerCase();
        return label.includes(q);
      });
    }
    const empTypeLabel = (id: string | null) =>
      id ? (employeeTypes.find((e) => e.id === id)?.label ?? "") : "";
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (employeeSort) {
        case "name_asc":
          return a.display_name.localeCompare(b.display_name, "da");
        case "name_desc":
          return b.display_name.localeCompare(a.display_name, "da");
        case "department": {
          const cmp = firstDepartmentLabel(a, departmentById).localeCompare(
            firstDepartmentLabel(b, departmentById),
            "da"
          );
          return cmp !== 0 ? cmp : a.display_name.localeCompare(b.display_name, "da");
        }
        case "employee_type": {
          const cmp = empTypeLabel(a.employee_type_id).localeCompare(
            empTypeLabel(b.employee_type_id),
            "da"
          );
          return cmp !== 0 ? cmp : a.display_name.localeCompare(b.display_name, "da");
        }
        default:
          return 0;
      }
    });
    return sorted;
  }, [
    departmentFiltered,
    employeeQuery,
    filterEmployeeTypeId,
    employeeSort,
    employeeTypes,
    departmentById,
  ]);

  const rollingShiftsFiltered = useMemo(() => {
    if (!filterShiftTypeId) return rollingShifts;
    if (filterShiftTypeId === "__none__") {
      return rollingShifts.filter((s) => !s.shift_type_id);
    }
    return rollingShifts.filter((s) => s.shift_type_id === filterShiftTypeId);
  }, [rollingShifts, filterShiftTypeId]);

  const monthShiftsFiltered = useMemo(() => {
    if (!filterShiftTypeId) return monthShifts;
    if (filterShiftTypeId === "__none__") {
      return monthShifts.filter((s) => !s.shift_type_id);
    }
    return monthShifts.filter((s) => s.shift_type_id === filterShiftTypeId);
  }, [monthShifts, filterShiftTypeId]);

  const days30 = useMemo(() => {
    const out: Date[] = [];
    for (let i = 0; i < 30; i++) {
      out.push(addDays(startOfDay(anchorDate), i));
    }
    return out;
  }, [anchorDate]);

  const countsByDayKey = useMemo(() => {
    const m: Record<string, number> = {};
    for (const d of days30) {
      m[dayKeyLocal(d)] = distinctEmployeesOnShiftForDay(monthShiftsFiltered, d);
    }
    return m;
  }, [days30, monthShiftsFiltered]);

  function goToday() {
    const t = startOfDay(new Date());
    setAnchorDate(t);
    if (viewMode === "rolling") {
      setRollingDays(expandAround(t, 3));
    }
  }

  function shiftPeriod(dir: -1 | 1) {
    if (viewMode === "rolling") {
      setAnchorDate((a) => {
        const a2 = addDays(startOfDay(a), dir * 7);
        setRollingDays(expandAround(a2, 3));
        return a2;
      });
    } else {
      setAnchorDate((a) => addDays(startOfDay(a), dir * 30));
    }
  }

  function openRollingForDay(d: Date) {
    const day = startOfDay(d);
    setAnchorDate(day);
    setRollingDays(expandAround(day, 3));
    setViewMode("rolling");
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ left: DAY_PX * 3, behavior: "smooth" });
    });
  }

  const onHorizontalScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || viewMode !== "rolling") return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const threshold = 360;
    const days = rollingDaysRef.current;
    if (days.length === 0) return;
    if (scrollWidth <= clientWidth) return;

    const distEnd = scrollWidth - scrollLeft - clientWidth;
    const distStart = scrollLeft;

    if (distEnd < threshold && distStart > 0) {
      const last = days[days.length - 1];
      const next = addDays(last, 1);
      setRollingDays((prev) => {
        if (dayKeyLocal(prev[prev.length - 1]) === dayKeyLocal(next)) return prev;
        return [...prev, next];
      });
    }

    if (distStart < threshold && distStart > 0) {
      const first = days[0];
      const prev = addDays(first, -1);
      setRollingDays((d) => {
        if (dayKeyLocal(d[0]) === dayKeyLocal(prev)) return d;
        return [prev, ...d];
      });
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollLeft += DAY_PX;
      });
    }
  }, [viewMode]);

  const totalHourCols = rollingDays.length * 24;
  const hourColWidth = HOUR_COL;

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        {error}
      </div>
    );
  }

  const showDeptDropdown = departments.length > 1;
  const shellClass = viewMode === "rolling" ? "w-full" : "mx-auto w-full max-w-[1600px]";
  const calendarOuterClass =
    viewMode === "rolling" ? shellClass : "mx-auto w-full max-w-[1600px]";

  return (
    <div className="relative flex flex-col gap-4">
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${shellClass}`}
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Kalender
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Tid nu:{" "}
            <span className="tabular-nums text-zinc-700 dark:text-zinc-300">{clock}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setViewMode("rolling")}
              className={
                viewMode === "rolling"
                  ? "rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                  : "rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }
            >
              Rullende
            </button>
            <button
              type="button"
              onClick={() => setViewMode("month30")}
              className={
                viewMode === "month30"
                  ? "rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                  : "rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }
            >
              30 dage
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => shiftPeriod(-1)}
              className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label={viewMode === "rolling" ? "Forrige uge" : "Forrige 30 dage"}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToday}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Gå til i dag
            </button>
            <button
              type="button"
              onClick={() => shiftPeriod(1)}
              className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label={viewMode === "rolling" ? "Næste uge" : "Næste 30 dage"}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end ${shellClass}`}>
        {showDeptDropdown ? (
          <label className="flex min-w-[200px] flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Afdeling</span>
            <select
              value={selectedDeptId ?? ""}
              onChange={(e) => setSelectedDeptId(e.target.value || null)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="">Alle afdelinger</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Medarbejdere (søgning)
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={employeeQuery}
              onChange={(e) => setEmployeeQuery(e.target.value)}
              placeholder="Filtrér synlige rækker…"
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              autoComplete="off"
            />
          </div>
        </label>

        <label className="flex min-w-[180px] flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Sortér efter</span>
          <select
            value={employeeSort}
            onChange={(e) => setEmployeeSort(e.target.value as EmployeeSortKey)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <option value="name_asc">Navn A–Å</option>
            <option value="name_desc">Navn Å–A</option>
            <option value="department">Afdeling</option>
            <option value="employee_type">Medarbejdertype</option>
          </select>
        </label>

        {shiftTypes.length > 0 ? (
          <label className="flex min-w-[200px] flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Vagttype (visning)</span>
            <select
              value={filterShiftTypeId ?? ""}
              onChange={(e) => setFilterShiftTypeId(e.target.value || null)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="">Alle vagttyper</option>
              <option value="__none__">Uden vagttype</option>
              {shiftTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {employeeTypes.length > 0 ? (
          <label className="flex min-w-[200px] flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Medarbejdertype</span>
            <select
              value={filterEmployeeTypeId ?? ""}
              onChange={(e) => setFilterEmployeeTypeId(e.target.value || null)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="">Alle</option>
              <option value="__none__">Uden medarbejdertype</option>
              {employeeTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {viewMode === "month30" ? (
        <div className={calendarOuterClass}>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-4">
            <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
              Antal forskellige medarbejdere med vagt pr. dag. Klik en dag for rullende visning.
            </p>
            <div className="grid grid-cols-7 gap-2">
              {days30.map((d) => {
                const key = dayKeyLocal(d);
                const n = countsByDayKey[key] ?? 0;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => openRollingForDay(d)}
                    className="flex min-h-[88px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50/80 px-1 py-2 text-center transition hover:border-zinc-400 hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
                  >
                    <span className="text-[10px] font-medium leading-tight text-zinc-500 dark:text-zinc-400">
                      {formatDayHeader(d)}
                    </span>
                    <span className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                      {n}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">på vagt</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className={calendarOuterClass}>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div
              ref={scrollRef}
              className="overflow-x-auto px-3"
              onScroll={onHorizontalScroll}
            >
              <table
                className="admin-shift-calendar w-full min-w-[720px] table-fixed border-collapse"
                style={{ minWidth: 200 + totalHourCols * hourColWidth }}
              >
                <colgroup>
                  <col style={{ width: 200 }} />
                  {Array.from({ length: totalHourCols }).map((_, i) => (
                    <col
                      key={i}
                      style={{ width: `calc((100% - 200px) / ${totalHourCols})` }}
                    />
                  ))}
                </colgroup>
                <thead className="sticky top-0 z-20 bg-zinc-100 dark:bg-zinc-800/95">
                  <tr>
                    <th
                      rowSpan={2}
                      className="sticky left-0 z-30 w-[200px] min-w-[200px] max-w-[200px] border-b border-r border-zinc-200 bg-zinc-100 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      Medarbejder
                    </th>
                    {rollingDays.map((d) => (
                      <th
                        key={dayKeyLocal(d)}
                        colSpan={24}
                        className="border-b border-zinc-200 px-3 py-2 text-center text-xs font-semibold whitespace-nowrap text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
                      >
                        {formatDayHeader(d)}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {rollingDays.map((d) =>
                      HOURS.map((h) => (
                        <th
                          key={`${dayKeyLocal(d)}-${h}`}
                          className="border-b border-zinc-200 px-0 py-2 text-center text-[10px] font-medium whitespace-nowrap tabular-nums text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                        >
                          {h}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visibleEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={1 + totalHourCols}
                        className="border-b border-zinc-100 px-3 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800"
                      >
                        Ingen medarbejdere matcher filteret for den valgte afdeling.
                      </td>
                    </tr>
                  ) : (
                    visibleEmployees.map((emp) => (
                      <tr
                        key={emp.user_id}
                        className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                      >
                        <td className="sticky left-0 z-10 w-[200px] min-w-[200px] max-w-[200px] border-b border-r border-zinc-100 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                          <EmployeeCalendarNameCell
                            workplaceId={workplaceId}
                            emp={emp}
                            onSaved={() => void load()}
                          />
                        </td>
                        {rollingDays.flatMap((d) =>
                          HOURS.map((h) => {
                            const has = rollingShiftsFiltered.some((s) =>
                              shiftOverlapsSlot(s, emp.user_id, d, h)
                            );
                            return (
                              <td
                                key={`${emp.user_id}-${dayKeyLocal(d)}-${h}`}
                                className={
                                  has
                                    ? "border-b border-l border-emerald-200/80 bg-emerald-500/15 px-0 py-2 dark:border-emerald-900/50 dark:bg-emerald-500/10"
                                    : "border-b border-l border-zinc-100 bg-zinc-50/50 px-0 py-2 dark:border-zinc-800 dark:bg-zinc-950/50"
                                }
                              >
                                <span className="sr-only">
                                  {has ? "Vagt" : "Ledig"} {h}:00
                                </span>
                              </td>
                            );
                          })
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <p className={`text-xs text-zinc-500 dark:text-zinc-400 ${shellClass}`}>
        {viewMode === "rolling"
          ? "Rul vandret for at se flere dage — vagter hentes automatisk for de dage, du scroller til."
          : "Klik en dag for at åbne rullende visning med timegitter for den dag."}
      </p>

      <button
        type="button"
        onClick={() => setAddShiftOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg ring-2 ring-white/20 transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-zinc-900/30 dark:hover:bg-white dark:focus-visible:outline-zinc-100"
        aria-label="Tilføj vagt"
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>

      {addShiftOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            aria-label="Luk dialog"
            onClick={() => setAddShiftOpen(false)}
          />
          <div
            className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-shift-title"
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id="add-shift-title"
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
              >
                Tilføj vagt
              </h2>
              <button
                type="button"
                onClick={() => setAddShiftOpen(false)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                aria-label="Luk"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Opret en medarbejder-vagt for den valgte arbejdsplads. Gem til databasen tilkobles i næste
              skridt.
            </p>
            <button
              type="button"
              onClick={() => setAddShiftOpen(false)}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Luk
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
