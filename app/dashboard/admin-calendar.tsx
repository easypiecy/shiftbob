"use client";

import {
  Fragment,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  getWorkplaceDepartmentsOverview,
  type WorkplaceDepartmentRow,
  type WorkplaceEmployeeTypeRow,
  type WorkplaceMemberDepartmentsRow,
  type WorkplaceShiftTypeRow,
} from "@/src/app/super-admin/workplaces/actions";
import {
  createWorkplaceShift,
  deleteWorkplaceShift,
  getCalendarViewerNameMode,
  reassignWorkplaceShift,
  swapWorkplaceShifts,
  updateWorkplaceShiftTiming,
  getWorkplaceShiftsInRange,
  type WorkplaceShiftRow,
} from "@/src/app/dashboard/workplace-shifts-actions";
import EmployeeCalendarNameCell from "@/app/dashboard/employee-calendar-name-cell";
import { shiftCalendarCellStyle } from "@/src/lib/calendar-shift-style";

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

function expandForward(start: Date, count: number): Date[] {
  const s = startOfDay(new Date(start));
  const out: Date[] = [];
  for (let i = 0; i < count; i++) {
    out.push(addDays(s, i));
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

function formatShiftRange(startsAtIso: string, endsAtIso: string): string {
  const s = new Date(startsAtIso);
  const e = new Date(endsAtIso);
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("da-DK", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  return `${fmt(s)} - ${fmt(e)}`;
}

function formatClockDate(iso: string): string {
  return new Intl.DateTimeFormat("da-DK", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function toDateTimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function localInputToIso(value: string, fallbackIso: string): string {
  if (!value) return fallbackIso;
  const ms = new Date(value).getTime();
  if (!Number.isFinite(ms)) return fallbackIso;
  return new Date(ms).toISOString();
}

function touchDistance(
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number }
): number {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
}

function localDateAt(day: Date, hour: number, minute = 0): Date {
  const d = new Date(day);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function shiftSlotKey(userId: string, day: Date, hour: number): string {
  return `${userId}|${dayKeyLocal(day)}|${hour}`;
}

function fallbackPatternByUserId(userId: string): string {
  const list = ["stripes", "dots", "grid", "diagonal"] as const;
  let n = 0;
  for (let i = 0; i < userId.length; i++) {
    n = (n + userId.charCodeAt(i) * (i + 3)) % 997;
  }
  return list[n % list.length];
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

type ShiftDragMode = "move" | "resize_start" | "resize_end";

type ActiveShiftDrag = {
  mode: ShiftDragMode;
  shift: WorkplaceShiftRow;
  pointerStartX: number;
  pxPer5Min: number;
  originalStartMs: number;
  originalEndMs: number;
  nextStartMs: number;
  nextEndMs: number;
};

type CreateShiftDraft = {
  userId: string;
  departmentId: string | null;
  startIso: string;
  endIso: string;
  shiftTypeId: string | null;
};

const BASE_HOUR_COL = 34;
const MIN_HOUR_COL = 22;
const MAX_HOUR_COL = 150;

type ActivePinch = {
  startDistance: number;
  startHourColWidth: number;
  centerXInViewport: number;
  anchorContentX: number;
};

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
    expandForward(startOfDay(new Date()), 7)
  );
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [employeeQuery, setEmployeeQuery] = useState("");
  /** Filtrér celler i gitteret efter vagttype (alle / én type / uden type) */
  const [filterShiftTypeId, setFilterShiftTypeId] = useState<string | null>(null);
  /** Filtrér medarbejderrækker efter medarbejdertype */
  const [filterEmployeeTypeId, setFilterEmployeeTypeId] = useState<string | null>(null);
  const [employeeSort, setEmployeeSort] = useState<EmployeeSortKey>("name_asc");
  const [clock, setClock] = useState(formatTimeNow);
  const [hourColWidth, setHourColWidth] = useState(BASE_HOUR_COL);
  const [createShiftDraft, setCreateShiftDraft] = useState<CreateShiftDraft | null>(null);
  const [createShiftBusy, setCreateShiftBusy] = useState(false);
  const [createShiftMsg, setCreateShiftMsg] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<WorkplaceShiftRow | null>(null);
  const [pendingDeleteShift, setPendingDeleteShift] = useState<WorkplaceShiftRow | null>(null);
  const [shiftActionBusy, setShiftActionBusy] = useState(false);
  const [shiftActionMsg, setShiftActionMsg] = useState<string | null>(null);
  const [replacementUserId, setReplacementUserId] = useState<string>("");
  const [swapTargetShiftId, setSwapTargetShiftId] = useState<string>("");

  const [rollingShifts, setRollingShifts] = useState<WorkplaceShiftRow[]>([]);
  const [monthShifts, setMonthShifts] = useState<WorkplaceShiftRow[]>([]);
  const [loadingDeptIds, setLoadingDeptIds] = useState<string[]>([]);
  const [viewerUserId, setViewerUserId] = useState<string | null>(null);
  const [calendarAdminNameView, setCalendarAdminNameView] = useState(true);
  const [activeShiftDrag, setActiveShiftDrag] = useState<ActiveShiftDrag | null>(null);
  const [isGridPointerActive, setIsGridPointerActive] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragTimeOverlayRef = useRef<HTMLDivElement>(null);
  const rollingDaysRef = useRef(rollingDays);
  const pinchRef = useRef<ActivePinch | null>(null);
  const dragPointerRef = useRef({ x: 0, y: 0 });
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickUntilRef = useRef(0);

  useEffect(() => {
    rollingDaysRef.current = rollingDays;
  }, [rollingDays]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

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

  const loadShiftsRangeDeptByDept = useCallback(
    async (
      rangeStartIso: string,
      rangeEndIso: string,
      onChunk: (rows: WorkplaceShiftRow[]) => void,
      onLoadingDept: (deptId: string | null) => void
    ) => {
      if (selectedDeptId) {
        onLoadingDept(selectedDeptId);
        const res = await getWorkplaceShiftsInRange(
          workplaceId,
          selectedDeptId,
          rangeStartIso,
          rangeEndIso
        );
        if (res.ok) onChunk(res.shifts);
        onLoadingDept(null);
        return;
      }

      if (departments.length === 0) {
        onLoadingDept(null);
        const res = await getWorkplaceShiftsInRange(workplaceId, null, rangeStartIso, rangeEndIso);
        if (res.ok) onChunk(res.shifts);
        return;
      }

      let acc: WorkplaceShiftRow[] = [];
      for (const dept of departments) {
        onLoadingDept(dept.id);
        const res = await getWorkplaceShiftsInRange(
          workplaceId,
          dept.id,
          rangeStartIso,
          rangeEndIso
        );
        if (!res.ok) continue;
        acc = [...acc, ...res.shifts];
        onChunk(acc);
      }
      onLoadingDept(null);
    },
    [selectedDeptId, workplaceId, departments]
  );

  useEffect(() => {
    if (loading) return;
    if (viewMode !== "rolling" || rollingDays.length === 0) return;
    const first = rollingDays[0];
    const last = rollingDays[rollingDays.length - 1];
    const rangeStartIso = startOfDay(first).toISOString();
    const rangeEndIso = addDays(startOfDay(last), 1).toISOString();
    let cancelled = false;
    setRollingShifts([]);
    setLoadingDeptIds([]);
    void (async () => {
      await loadShiftsRangeDeptByDept(
        rangeStartIso,
        rangeEndIso,
        (rows) => {
          if (!cancelled) setRollingShifts(rows);
        },
        (deptId) => {
          if (!cancelled) setLoadingDeptIds(deptId ? [deptId] : []);
        }
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, viewMode, rollingDays, loadShiftsRangeDeptByDept]);

  useEffect(() => {
    if (loading) return;
    if (viewMode !== "month30") return;
    const rangeStartIso = startOfDay(anchorDate).toISOString();
    const rangeEndIso = addDays(startOfDay(anchorDate), 30).toISOString();
    let cancelled = false;
    setMonthShifts([]);
    setLoadingDeptIds([]);
    void (async () => {
      await loadShiftsRangeDeptByDept(
        rangeStartIso,
        rangeEndIso,
        (rows) => {
          if (!cancelled) setMonthShifts(rows);
        },
        (deptId) => {
          if (!cancelled) setLoadingDeptIds(deptId ? [deptId] : []);
        }
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, viewMode, anchorDate, loadShiftsRangeDeptByDept]);

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

  const departmentIdByName = useMemo(() => {
    const m = new Map<string, string>();
    for (const d of departments) m.set(d.name, d.id);
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

  const groupedEmployees = useMemo(() => {
    if (visibleEmployees.length === 0) return [];
    const byDept = new Map<string, WorkplaceMemberDepartmentsRow[]>();
    for (const emp of visibleEmployees) {
      const label = firstDepartmentLabel(emp, departmentById) || "Uden afdeling";
      const arr = byDept.get(label) ?? [];
      arr.push(emp);
      byDept.set(label, arr);
    }

    const groups: { name: string; employees: WorkplaceMemberDepartmentsRow[] }[] = [];
    const preferredOrder = selectedDeptId
      ? [departments.find((d) => d.id === selectedDeptId)?.name ?? ""]
      : departments.map((d) => d.name);

    for (const name of preferredOrder) {
      if (!name) continue;
      const employees = byDept.get(name);
      if (!employees || employees.length === 0) continue;
      groups.push({ name, employees });
      byDept.delete(name);
    }

    for (const [name, employees] of byDept) {
      groups.push({ name, employees });
    }
    return groups;
  }, [visibleEmployees, departmentById, selectedDeptId, departments]);

  const rollingShiftsFiltered = useMemo(() => {
    if (!filterShiftTypeId) return rollingShifts;
    if (filterShiftTypeId === "__none__") {
      return rollingShifts.filter((s) => !s.shift_type_id);
    }
    return rollingShifts.filter((s) => s.shift_type_id === filterShiftTypeId);
  }, [rollingShifts, filterShiftTypeId]);

  const rollingSlotShiftMap = useMemo(() => {
    const map = new Map<string, WorkplaceShiftRow>();
    const starts = new Set<string>();
    const ends = new Set<string>();

    for (const shift of rollingShiftsFiltered) {
      const startMs = new Date(shift.starts_at).getTime();
      const endMs = new Date(shift.ends_at).getTime();
      if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) continue;

      const firstHour = new Date(startMs);
      firstHour.setMinutes(0, 0, 0);
      for (let t = firstHour.getTime(); t < endMs; t += 60 * 60 * 1000) {
        const d = new Date(t);
        const key = shiftSlotKey(shift.user_id, d, d.getHours());
        const existing = map.get(key);
        if (!existing) {
          map.set(key, shift);
          continue;
        }
        const existingStart = new Date(existing.starts_at).getTime();
        if (startMs < existingStart) {
          map.set(key, shift);
        }
      }

      const s = new Date(startMs);
      starts.add(shiftSlotKey(shift.user_id, s, s.getHours()));
      const e = new Date(endMs - 1);
      ends.add(shiftSlotKey(shift.user_id, e, e.getHours()));
    }

    return { map, starts, ends };
  }, [rollingShiftsFiltered]);

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

  const shiftColorById = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of shiftTypes) {
      map.set(t.id, t.calendar_color ?? "#94a3b8");
    }
    return map;
  }, [shiftTypes]);

  const employeePatternById = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of employeeTypes) {
      map.set(t.id, t.calendar_pattern ?? "none");
    }
    return map;
  }, [employeeTypes]);

  const shiftTypeLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of shiftTypes) {
      map.set(t.id, t.label);
    }
    return map;
  }, [shiftTypes]);

  const employeeTypeLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of employeeTypes) {
      map.set(t.id, t.label);
    }
    return map;
  }, [employeeTypes]);

  const memberByUserId = useMemo(() => {
    const map = new Map<string, WorkplaceMemberDepartmentsRow>();
    for (const m of members) {
      map.set(m.user_id, m);
    }
    return map;
  }, [members]);

  const canManageShifts = calendarAdminNameView;

  const replacementCandidates = useMemo(() => {
    if (!selectedShift) return [];
    if (!selectedShift.department_id) {
      return members.filter((m) => m.user_id !== selectedShift.user_id);
    }
    return members.filter(
      (m) =>
        m.user_id !== selectedShift.user_id &&
        m.department_ids.includes(selectedShift.department_id as string)
    );
  }, [selectedShift, members]);

  const swapCandidates = useMemo(() => {
    if (!selectedShift) return [];
    return rollingShiftsFiltered.filter((s) => s.id !== selectedShift.id);
  }, [selectedShift, rollingShiftsFiltered]);

  useEffect(() => {
    if (!selectedShift) return;
    setReplacementUserId((prev) => {
      if (prev && replacementCandidates.some((x) => x.user_id === prev)) return prev;
      return replacementCandidates[0]?.user_id ?? "";
    });
    setSwapTargetShiftId((prev) => {
      if (prev && swapCandidates.some((x) => x.id === prev)) return prev;
      return swapCandidates[0]?.id ?? "";
    });
  }, [selectedShift, replacementCandidates, swapCandidates]);

  function clearLongPressTimer() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  async function deleteShiftLocalAndServer(shiftId: string) {
    setShiftActionBusy(true);
    setShiftActionMsg(null);
    try {
      const res = await deleteWorkplaceShift(workplaceId, shiftId);
      if (!res.ok) {
        setShiftActionMsg(res.error);
        return;
      }
      setRollingShifts((list) => list.filter((s) => s.id !== shiftId));
      setMonthShifts((list) => list.filter((s) => s.id !== shiftId));
      setSelectedShift((s) => (s?.id === shiftId ? null : s));
    } finally {
      setShiftActionBusy(false);
    }
  }

  function handleCellPointerDown(
    e: {
      pointerType?: string;
    },
    shift: WorkplaceShiftRow | null
  ) {
    if (!canManageShifts || !shift) return;
    // Keep long-press delete for touch/pen; avoid desktop mouse delays.
    if (e.pointerType === "mouse") return;
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      suppressClickUntilRef.current = Date.now() + 800;
      setPendingDeleteShift(shift);
    }, 520);
  }

  function handleCellPointerUp() {
    clearLongPressTimer();
  }

  function handleCellClick(shift: WorkplaceShiftRow | null) {
    if (!canManageShifts || !shift) return;
    if (Date.now() < suppressClickUntilRef.current) return;
    setSelectedShift(shift);
    setShiftActionMsg(null);
  }

  function openDeleteConfirmFromActions() {
    if (!selectedShift) return;
    setPendingDeleteShift(selectedShift);
    setSelectedShift(null);
  }

  async function confirmPendingDelete() {
    if (!pendingDeleteShift) return;
    const shiftId = pendingDeleteShift.id;
    setPendingDeleteShift(null);
    await deleteShiftLocalAndServer(shiftId);
  }

  function openCreateShiftFromCell(
    userId: string,
    departmentId: string | null,
    day: Date,
    hour: number
  ) {
    if (!canManageShifts) return;
    const startsAt = localDateAt(day, hour);
    const endsAt = localDateAt(day, Math.min(hour + 8, 23), 55);
    setCreateShiftDraft({
      userId,
      departmentId,
      startIso: startsAt.toISOString(),
      endIso: endsAt.toISOString(),
      shiftTypeId: shiftTypes[0]?.id ?? null,
    });
    setCreateShiftMsg(null);
  }

  async function handleCreateShiftSave() {
    if (!createShiftDraft) return;
    setCreateShiftBusy(true);
    setCreateShiftMsg(null);
    try {
      const res = await createWorkplaceShift(workplaceId, {
        userId: createShiftDraft.userId,
        departmentId: createShiftDraft.departmentId,
        shiftTypeId: createShiftDraft.shiftTypeId,
        startsAtIso: createShiftDraft.startIso,
        endsAtIso: createShiftDraft.endIso,
      });
      if (!res.ok) {
        setCreateShiftMsg(res.error);
        return;
      }
      setRollingShifts((list) => [...list, res.shift]);
      setMonthShifts((list) => [...list, res.shift]);
      setCreateShiftDraft(null);
    } finally {
      setCreateShiftBusy(false);
    }
  }

  function onCalendarTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
    if (e.touches.length < 2) return;
    const el = scrollRef.current;
    if (!el) return;
    const a = e.touches[0];
    const b = e.touches[1];
    const dist = touchDistance(a, b);
    if (!Number.isFinite(dist) || dist <= 0) return;
    const centerX = (a.clientX + b.clientX) / 2 - el.getBoundingClientRect().left;
    pinchRef.current = {
      startDistance: dist,
      startHourColWidth: hourColWidth,
      centerXInViewport: centerX,
      anchorContentX: el.scrollLeft + centerX,
    };
  }

  function onCalendarTouchMove(e: ReactTouchEvent<HTMLDivElement>) {
    if (e.touches.length < 2 || !pinchRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const a = e.touches[0];
    const b = e.touches[1];
    const dist = touchDistance(a, b);
    if (!Number.isFinite(dist) || dist <= 0) return;

    e.preventDefault();
    const pinch = pinchRef.current;
    const scale = dist / pinch.startDistance;
    const nextWidth = Math.max(
      MIN_HOUR_COL,
      Math.min(MAX_HOUR_COL, pinch.startHourColWidth * scale)
    );
    const normalizedScale = nextWidth / pinch.startHourColWidth;
    const targetContentX = pinch.anchorContentX * normalizedScale;
    const nextScrollLeft = Math.max(0, targetContentX - pinch.centerXInViewport);

    setHourColWidth(nextWidth);
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = nextScrollLeft;
      }
    });
  }

  function onCalendarTouchEnd() {
    if (pinchRef.current) {
      pinchRef.current = null;
    }
  }

  function onCalendarWheel(e: ReactWheelEvent<HTMLDivElement>) {
    if (!e.ctrlKey) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();

    const zoomFactor = Math.exp(-e.deltaY * 0.01);
    const nextWidth = Math.max(MIN_HOUR_COL, Math.min(MAX_HOUR_COL, hourColWidth * zoomFactor));

    const rect = el.getBoundingClientRect();
    const centerXInViewport = e.clientX - rect.left;
    const anchorContentX = el.scrollLeft + centerXInViewport;
    const normalizedScale = nextWidth / hourColWidth;
    const targetContentX = anchorContentX * normalizedScale;
    const nextScrollLeft = Math.max(0, targetContentX - centerXInViewport);

    setHourColWidth(nextWidth);
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = nextScrollLeft;
      }
    });
  }

  async function handleReassignSelectedShift(source: "sick" | "replace") {
    if (!selectedShift || !replacementUserId) return;
    setShiftActionBusy(true);
    setShiftActionMsg(null);
    try {
      const res = await reassignWorkplaceShift(
        workplaceId,
        selectedShift.id,
        replacementUserId
      );
      if (!res.ok) {
        setShiftActionMsg(res.error);
        return;
      }
      setRollingShifts((list) =>
        list.map((s) =>
          s.id === selectedShift.id ? { ...s, user_id: replacementUserId } : s
        )
      );
      setMonthShifts((list) =>
        list.map((s) =>
          s.id === selectedShift.id ? { ...s, user_id: replacementUserId } : s
        )
      );
      setShiftActionMsg(
        source === "sick"
          ? "Sygemelding registreret og vagt overdraget."
          : "Erstatningsmedarbejder er sat på vagten."
      );
    } finally {
      setShiftActionBusy(false);
    }
  }

  async function handleSwapSelectedShift() {
    if (!selectedShift || !swapTargetShiftId) return;
    setShiftActionBusy(true);
    setShiftActionMsg(null);
    try {
      const target = rollingShiftsFiltered.find((s) => s.id === swapTargetShiftId);
      if (!target) {
        setShiftActionMsg("Vælg en gyldig vagt at bytte med.");
        return;
      }
      const res = await swapWorkplaceShifts(
        workplaceId,
        selectedShift.id,
        swapTargetShiftId
      );
      if (!res.ok) {
        setShiftActionMsg(res.error);
        return;
      }
      const sourceUser = selectedShift.user_id;
      const targetUser = target.user_id;
      setRollingShifts((list) =>
        list.map((s) => {
          if (s.id === selectedShift.id) return { ...s, user_id: targetUser };
          if (s.id === swapTargetShiftId) return { ...s, user_id: sourceUser };
          return s;
        })
      );
      setMonthShifts((list) =>
        list.map((s) => {
          if (s.id === selectedShift.id) return { ...s, user_id: targetUser };
          if (s.id === swapTargetShiftId) return { ...s, user_id: sourceUser };
          return s;
        })
      );
      setShiftActionMsg("Vagterne er byttet.");
    } finally {
      setShiftActionBusy(false);
    }
  }

  function toIsoFromMs(ms: number): string {
    return new Date(ms).toISOString();
  }

  function applyShiftTimingOptimistic(shiftId: string, nextStartMs: number, nextEndMs: number) {
    const startsAt = toIsoFromMs(nextStartMs);
    const endsAt = toIsoFromMs(nextEndMs);
    setRollingShifts((list) =>
      list.map((s) => (s.id === shiftId ? { ...s, starts_at: startsAt, ends_at: endsAt } : s))
    );
    setMonthShifts((list) =>
      list.map((s) => (s.id === shiftId ? { ...s, starts_at: startsAt, ends_at: endsAt } : s))
    );
    setSelectedShift((s) =>
      s?.id === shiftId ? { ...s, starts_at: startsAt, ends_at: endsAt } : s
    );
  }

  function syncDragTimeOverlayPosition() {
    const overlay = dragTimeOverlayRef.current;
    if (!overlay) return;
    const { x, y } = dragPointerRef.current;
    overlay.style.left = `clamp(8px, ${x}px, calc(100vw - 280px))`;
    overlay.style.top = `clamp(8px, calc(${y}px - 54px), calc(100vh - 90px))`;
  }

  function startShiftDrag(
    e: {
      preventDefault: () => void;
      stopPropagation: () => void;
      clientX: number;
      clientY: number;
      currentTarget: EventTarget & HTMLElement;
    },
    shift: WorkplaceShiftRow,
    mode: ShiftDragMode
  ) {
    if (!canManageShifts) return;
    e.preventDefault();
    e.stopPropagation();
    clearLongPressTimer();
    suppressClickUntilRef.current = Date.now() + 800;
    dragPointerRef.current = { x: e.clientX, y: e.clientY };
    const pxPer5Min = Math.max(1, hourColWidth / 12);
    const originalStartMs = new Date(shift.starts_at).getTime();
    const originalEndMs = new Date(shift.ends_at).getTime();
    setActiveShiftDrag({
      mode,
      shift,
      pointerStartX: e.clientX,
      pxPer5Min,
      originalStartMs,
      originalEndMs,
      nextStartMs: originalStartMs,
      nextEndMs: originalEndMs,
    });
  }

  useEffect(() => {
    if (!activeShiftDrag) return;
    syncDragTimeOverlayPosition();

    const onMove = (e: PointerEvent) => {
      dragPointerRef.current = { x: e.clientX, y: e.clientY };
      syncDragTimeOverlayPosition();
      const dx = e.clientX - activeShiftDrag.pointerStartX;
      const stepCount = Math.round(dx / activeShiftDrag.pxPer5Min);
      const deltaMs = stepCount * 5 * 60 * 1000;
      let nextStartMs = activeShiftDrag.originalStartMs;
      let nextEndMs = activeShiftDrag.originalEndMs;
      if (activeShiftDrag.mode === "move") {
        nextStartMs += deltaMs;
        nextEndMs += deltaMs;
      } else if (activeShiftDrag.mode === "resize_start") {
        nextStartMs = Math.min(
          activeShiftDrag.originalStartMs + deltaMs,
          activeShiftDrag.originalEndMs - 5 * 60 * 1000
        );
      } else {
        nextEndMs = Math.max(
          activeShiftDrag.originalEndMs + deltaMs,
          activeShiftDrag.originalStartMs + 5 * 60 * 1000
        );
      }
      setActiveShiftDrag((prev) =>
        prev
          ? prev.nextStartMs === nextStartMs && prev.nextEndMs === nextEndMs
            ? prev
            : {
                ...prev,
                nextStartMs,
                nextEndMs,
              }
          : prev
      );
    };

    const onUp = () => {
      const finalDrag = activeShiftDrag;
      setActiveShiftDrag(null);
      if (
        finalDrag.nextStartMs === finalDrag.originalStartMs &&
        finalDrag.nextEndMs === finalDrag.originalEndMs
      ) {
        return;
      }
      applyShiftTimingOptimistic(
        finalDrag.shift.id,
        finalDrag.nextStartMs,
        finalDrag.nextEndMs
      );
      void (async () => {
        const res = await updateWorkplaceShiftTiming(
          workplaceId,
          finalDrag.shift.id,
          toIsoFromMs(finalDrag.nextStartMs),
          toIsoFromMs(finalDrag.nextEndMs)
        );
        if (!res.ok) {
          applyShiftTimingOptimistic(
            finalDrag.shift.id,
            finalDrag.originalStartMs,
            finalDrag.originalEndMs
          );
          setShiftActionMsg(res.error);
        }
      })();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [activeShiftDrag, workplaceId]);

  useEffect(() => {
    const onWindowWheelCapture = (e: WheelEvent) => {
      if (!isGridPointerActive || !e.ctrlKey) return;
      e.preventDefault();
    };
    window.addEventListener("wheel", onWindowWheelCapture, {
      passive: false,
      capture: true,
    });
    return () => {
      window.removeEventListener("wheel", onWindowWheelCapture, true);
    };
  }, [isGridPointerActive]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const preventGesture = (e: Event) => e.preventDefault();
    el.addEventListener("gesturestart", preventGesture as EventListener, { passive: false });
    el.addEventListener("gesturechange", preventGesture as EventListener, { passive: false });
    return () => {
      el.removeEventListener("gesturestart", preventGesture as EventListener);
      el.removeEventListener("gesturechange", preventGesture as EventListener);
    };
  }, []);

  function goToday() {
    const t = startOfDay(new Date());
    setAnchorDate(t);
    if (viewMode === "rolling") {
      setRollingDays(expandForward(t, 7));
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      });
    }
  }

  function shiftPeriod(dir: -1 | 1) {
    if (viewMode === "rolling") {
      setAnchorDate((a) => {
        const a2 = addDays(startOfDay(a), dir * 7);
        setRollingDays(expandForward(a2, 7));
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
        });
        return a2;
      });
    } else {
      setAnchorDate((a) => addDays(startOfDay(a), dir * 30));
    }
  }

  function openRollingForDay(d: Date) {
    const day = startOfDay(d);
    setAnchorDate(day);
    setRollingDays(expandForward(day, 7));
    setViewMode("rolling");
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    });
  }

  const dayPx = 24 * hourColWidth;
  const totalHourCols = rollingDays.length * 24;

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
        if (scrollRef.current) scrollRef.current.scrollLeft += dayPx;
      });
    }
  }, [viewMode, dayPx]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] w-full items-center justify-center px-4">
        <section className="bob-loader-shell" aria-label="Kalender loader" role="status">
          <div className="bob-loader-row" aria-hidden="true">
            <span className="bob-orb bob-orb-1">B</span>
            <span className="bob-orb bob-orb-2">O</span>
            <span className="bob-orb bob-orb-3">B</span>
          </div>
        </section>
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
        <div className="pl-12">
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
          <label className="flex min-w-[200px] flex-col text-sm">
            <select
              aria-label="Afdeling"
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

        <label className="flex min-w-[220px] flex-1 flex-col text-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              aria-label="Søg medarbejdere"
              type="search"
              value={employeeQuery}
              onChange={(e) => setEmployeeQuery(e.target.value)}
              placeholder="Filtrér synlige rækker…"
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              autoComplete="off"
            />
          </div>
        </label>

        <label className="flex min-w-[180px] flex-col text-sm">
          <select
            aria-label="Sortér efter"
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
          <label className="flex min-w-[200px] flex-col text-sm">
            <select
              aria-label="Filtrer vagttype"
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
          <label className="flex min-w-[200px] flex-col text-sm">
            <select
              aria-label="Filtrer medarbejdertype"
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
              onPointerEnter={() => setIsGridPointerActive(true)}
              onPointerLeave={() => setIsGridPointerActive(false)}
              onTouchStartCapture={() => setIsGridPointerActive(true)}
              onTouchEndCapture={() => setIsGridPointerActive(false)}
              onTouchCancelCapture={() => setIsGridPointerActive(false)}
              onScroll={onHorizontalScroll}
              onWheel={onCalendarWheel}
              onTouchStart={onCalendarTouchStart}
              onTouchMove={onCalendarTouchMove}
              onTouchEnd={onCalendarTouchEnd}
              onTouchCancel={onCalendarTouchEnd}
              style={{ touchAction: "pan-x pan-y" }}
            >
              <table
                className="admin-shift-calendar w-full min-w-[720px] table-fixed border-collapse"
                style={{
                  width: 200 + totalHourCols * hourColWidth,
                  minWidth: 200 + totalHourCols * hourColWidth,
                }}
              >
                <colgroup>
                  <col style={{ width: 200 }} />
                  {Array.from({ length: totalHourCols }).map((_, i) => (
                    <col key={i} style={{ width: hourColWidth }} />
                  ))}
                </colgroup>
                <thead className="sticky top-0 z-20">
                  <tr>
                    <th
                      rowSpan={2}
                      className="sticky left-0 z-30 w-[200px] min-w-[200px] max-w-[200px] border-0 bg-transparent p-0 dark:bg-transparent"
                    />
                    {rollingDays.map((d) => (
                      <th
                        key={dayKeyLocal(d)}
                        colSpan={24}
                        className="border-b border-zinc-200 bg-zinc-100 px-3 py-2 text-center text-xs font-semibold whitespace-nowrap text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/95 dark:text-zinc-200"
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
                          className="border-b border-zinc-200 bg-zinc-100 px-0 py-2 text-center text-[10px] font-medium whitespace-nowrap tabular-nums text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/95 dark:text-zinc-400"
                        >
                          {h}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {groupedEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={1 + totalHourCols}
                        className="border-b border-zinc-100 px-3 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800"
                      >
                        Ingen medarbejdere matcher filteret for den valgte afdeling.
                      </td>
                    </tr>
                  ) : (
                    groupedEmployees.map((group) => (
                      <Fragment key={`dept-${group.name}`}>
                        <tr>
                          <td className="sticky left-0 z-20 w-[200px] min-w-[200px] max-w-[200px] border-b border-r border-zinc-200 bg-zinc-100/90 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-200">
                            <div className="flex items-center gap-2">
                              <span>{group.name}</span>
                              {(() => {
                                const deptId = departmentIdByName.get(group.name);
                                if (!deptId || !loadingDeptIds.includes(deptId)) return null;
                                return (
                                  <span className="inline-block h-3 w-3 animate-spin rounded-full border border-zinc-400 border-t-zinc-900 dark:border-zinc-500 dark:border-t-zinc-100" />
                                );
                              })()}
                            </div>
                          </td>
                          <td
                            colSpan={totalHourCols}
                            className="border-b border-l border-zinc-200 bg-zinc-100/60 px-0 py-2 dark:border-zinc-700 dark:bg-zinc-800/70"
                          />
                        </tr>
                        {group.employees.map((emp) => {
                          const groupDeptId =
                            departments.find((d) => d.name === group.name)?.id ?? null;
                          return (
                          <tr
                            key={emp.user_id}
                            className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                          >
                            <td className="sticky left-0 z-10 w-[200px] min-w-[200px] max-w-[200px] border-b border-r border-zinc-100 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                              <EmployeeCalendarNameCell
                                workplaceId={workplaceId}
                                emp={emp}
                                onSaved={() => void load()}
                                viewerUserId={viewerUserId}
                                nameMode={
                                  calendarAdminNameView ? "full" : "privacy"
                                }
                                canEdit={calendarAdminNameView}
                              />
                            </td>
                            {rollingDays.flatMap((d) =>
                              HOURS.map((h) => {
                                const slotKey = shiftSlotKey(emp.user_id, d, h);
                                const baseShift = rollingSlotShiftMap.map.get(slotKey) ?? null;
                                let shift = baseShift;
                                let startsHere = Boolean(
                                  shift && rollingSlotShiftMap.starts.has(slotKey)
                                );
                                let endsHere = Boolean(
                                  shift && rollingSlotShiftMap.ends.has(slotKey)
                                );
                                let isGhostPreview = false;

                                if (activeShiftDrag && activeShiftDrag.shift.user_id === emp.user_id) {
                                  const slotStart = localDateAt(d, h).getTime();
                                  const slotEnd = slotStart + 60 * 60 * 1000;
                                  const dragStart = activeShiftDrag.nextStartMs;
                                  const dragEnd = activeShiftDrag.nextEndMs;
                                  const dragOverlaps = dragStart < slotEnd && dragEnd > slotStart;
                                  const dragStarts = dragStart >= slotStart && dragStart < slotEnd;
                                  const dragEnds = dragEnd - 1 >= slotStart && dragEnd - 1 < slotEnd;

                                  if (dragOverlaps) {
                                    shift = {
                                      ...activeShiftDrag.shift,
                                      starts_at: toIsoFromMs(dragStart),
                                      ends_at: toIsoFromMs(dragEnd),
                                    };
                                    startsHere = dragStarts;
                                    endsHere = dragEnds;
                                    isGhostPreview = true;
                                  } else if (baseShift?.id === activeShiftDrag.shift.id) {
                                    shift = null;
                                    startsHere = false;
                                    endsHere = false;
                                  }
                                }

                                const has = Boolean(shift);
                                const shiftColor = shift?.shift_type_id
                                  ? shiftColorById.get(shift.shift_type_id) ?? "#94a3b8"
                                  : "#94a3b8";
                                const empPattern = emp.employee_type_id
                                  ? employeePatternById.get(emp.employee_type_id) ??
                                    "none"
                                  : fallbackPatternByUserId(emp.user_id);
                                const showPattern = Boolean(shift && endsHere);
                                const cellStyle = has
                                  ? shiftCalendarCellStyle({
                                      shiftTypeColor: shiftColor,
                                      employeePattern: showPattern
                                        ? empPattern
                                        : "none",
                                    })
                                  : undefined;
                                const shiftLabel =
                                  shift?.shift_type_id
                                    ? shiftTypeLabelById.get(shift.shift_type_id) ??
                                      "Vagt"
                                    : "Vagt";
                                const member = shift
                                  ? memberByUserId.get(shift.user_id) ?? null
                                  : null;
                                const employeeName = member?.display_name ?? "Ukendt";
                                const departmentName =
                                  shift?.department_id
                                    ? departmentById.get(shift.department_id)?.name ??
                                      "Uden afdeling"
                                    : "Uden afdeling";
                                const employeeTypeLabel =
                                  member?.employee_type_id
                                    ? employeeTypeLabelById.get(member.employee_type_id) ??
                                      "Uden medarbejdertype"
                                    : "Uden medarbejdertype";
                                const hoverDetails = has && !activeShiftDrag
                                  ? [
                                      `Medarbejder: ${employeeName}`,
                                      `Afdeling: ${departmentName}`,
                                      `Medarbejdertype: ${employeeTypeLabel}`,
                                      `Vagttype: ${shiftLabel}`,
                                      `Tid: ${formatShiftRange(
                                        shift!.starts_at,
                                        shift!.ends_at
                                      )}`,
                                    ].join("\n")
                                  : undefined;
                                const renderedCellStyle =
                                  has && cellStyle
                                    ? isGhostPreview
                                      ? {
                                          ...cellStyle,
                                          opacity: 0.86,
                                          boxShadow:
                                            "inset 0 0 0 1px rgba(34,211,238,0.95),0 0 10px rgba(34,211,238,0.65),0 0 24px rgba(59,130,246,0.4)",
                                        }
                                      : cellStyle
                                    : cellStyle;
                                return (
                                  <td
                                    key={`${emp.user_id}-${dayKeyLocal(d)}-${h}`}
                                    className={
                                      has
                                        ? "relative border-b border-l border-zinc-300/60 px-0 py-2 dark:border-zinc-600/50"
                                        : "border-b border-l border-zinc-100 bg-zinc-50/50 px-0 py-2 dark:border-zinc-800 dark:bg-zinc-950/50"
                                    }
                                    style={renderedCellStyle}
                                    title={hoverDetails}
                                    onPointerDown={(e) => handleCellPointerDown(e, shift)}
                                    onPointerUp={handleCellPointerUp}
                                    onPointerCancel={handleCellPointerUp}
                                    onPointerLeave={handleCellPointerUp}
                                    onClick={() => {
                                      if (shift) {
                                        handleCellClick(shift);
                                      } else {
                                        openCreateShiftFromCell(
                                          emp.user_id,
                                          groupDeptId,
                                          d,
                                          h
                                        );
                                      }
                                    }}
                                  >
                                    {has && startsHere ? (
                                      <span className="pointer-events-none block w-full truncate pl-2 pr-0.5 text-left text-[12px] font-bold text-black [text-shadow:0_0_2px_rgba(255,255,255,0.95),0_0_6px_rgba(255,255,255,0.9)]">
                                        {shiftLabel}
                                      </span>
                                    ) : null}
                                    {has && endsHere ? (
                                      <button
                                        type="button"
                                        className="absolute inset-0 cursor-grab bg-transparent active:cursor-grabbing"
                                        onPointerDown={(e) => {
                                          if (!shift) return;
                                          startShiftDrag(e, shift, "move");
                                        }}
                                        title="Træk i mønster-området for at flytte vagt"
                                      />
                                    ) : null}
                                    {has && startsHere ? (
                                      <button
                                        type="button"
                                        className="absolute inset-y-0 left-0 w-1.5 cursor-ew-resize bg-black/30 hover:bg-black/45"
                                        onPointerDown={(e) => {
                                          if (!shift) return;
                                          startShiftDrag(e, shift, "resize_start");
                                        }}
                                        title="Træk for at forkorte/forlænge start"
                                      />
                                    ) : null}
                                    {has && endsHere ? (
                                      <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 w-1.5 cursor-ew-resize bg-black/30 hover:bg-black/45"
                                        onPointerDown={(e) => {
                                          if (!shift) return;
                                          startShiftDrag(e, shift, "resize_end");
                                        }}
                                        title="Træk for at forkorte/forlænge slut"
                                      />
                                    ) : null}
                                    <span className="sr-only">
                                      {has ? "Vagt" : "Ledig"} {h}:00
                                    </span>
                                  </td>
                                );
                              })
                            )}
                          </tr>
                        );
                        })}
                      </Fragment>
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

      {activeShiftDrag ? (
        <div
          ref={dragTimeOverlayRef}
          className="pointer-events-none fixed z-50 rounded-lg border border-zinc-200 bg-white/95 px-3 py-2 text-xs font-medium text-zinc-800 shadow-lg dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-100"
          style={{
            left: `clamp(8px, ${dragPointerRef.current.x}px, calc(100vw - 280px))`,
            top: `clamp(8px, calc(${dragPointerRef.current.y}px - 54px), calc(100vh - 90px))`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {activeShiftDrag.mode === "move"
              ? "Flyt vagt"
              : activeShiftDrag.mode === "resize_start"
                ? "Juster start"
                : "Juster slut"}
          </div>
          <div>
            {formatClockDate(toIsoFromMs(activeShiftDrag.nextStartMs))} -{" "}
            {formatClockDate(toIsoFromMs(activeShiftDrag.nextEndMs))}
          </div>
        </div>
      ) : null}

      {pendingDeleteShift && canManageShifts ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Luk slet-advarsel"
            onClick={() => setPendingDeleteShift(null)}
          />
          <div
            className="relative z-10 flex w-full max-w-md flex-col gap-4 rounded-t-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-shift-title"
          >
            <h2 id="delete-shift-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Slet vagt?
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Du er ved at slette vagten permanent. Denne handling kan ikke fortrydes.
            </p>
            <p className="rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              {formatShiftRange(pendingDeleteShift.starts_at, pendingDeleteShift.ends_at)}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteShift(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Fortryd
              </button>
              <button
                type="button"
                disabled={shiftActionBusy}
                onClick={() => void confirmPendingDelete()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                Slet
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedShift && canManageShifts ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Luk dialog"
            onClick={() => setSelectedShift(null)}
          />
          <div
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded-t-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shift-actions-title"
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id="shift-actions-title"
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
              >
                Vagt handlinger
              </h2>
              <button
                type="button"
                onClick={() => setSelectedShift(null)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                aria-label="Luk"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-950/60">
              <p>
                <strong>Medarbejder:</strong>{" "}
                {memberByUserId.get(selectedShift.user_id)?.display_name ?? "Ukendt"}
              </p>
              <p>
                <strong>Afdeling:</strong>{" "}
                {selectedShift.department_id
                  ? departmentById.get(selectedShift.department_id)?.name ?? "Uden afdeling"
                  : "Uden afdeling"}
              </p>
              <p>
                <strong>Medarbejdertype:</strong>{" "}
                {(() => {
                  const m = memberByUserId.get(selectedShift.user_id);
                  if (!m?.employee_type_id) return "Uden medarbejdertype";
                  return (
                    employeeTypeLabelById.get(m.employee_type_id) ??
                    "Uden medarbejdertype"
                  );
                })()}
              </p>
              <p>
                <strong>Vagttype:</strong>{" "}
                {selectedShift.shift_type_id
                  ? shiftTypeLabelById.get(selectedShift.shift_type_id) ?? "Vagt"
                  : "Vagt"}
              </p>
              <p>
                <strong>Tid:</strong>{" "}
                {formatShiftRange(selectedShift.starts_at, selectedShift.ends_at)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Klik: sygemeld + find erstatning
                </h3>
                <select
                  value={replacementUserId}
                  onChange={(e) => setReplacementUserId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  {replacementCandidates.length === 0 ? (
                    <option value="">Ingen kandidater</option>
                  ) : null}
                  {replacementCandidates.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.display_name}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={shiftActionBusy || !replacementUserId}
                    onClick={() => void handleReassignSelectedShift("sick")}
                    className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
                  >
                    Sygemeld + overdrag
                  </button>
                  <button
                    type="button"
                    disabled={shiftActionBusy || !replacementUserId}
                    onClick={() => void handleReassignSelectedShift("replace")}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Find erstatning
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
                <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Byt denne vagt med
                </h3>
                <select
                  value={swapTargetShiftId}
                  onChange={(e) => setSwapTargetShiftId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  {swapCandidates.length === 0 ? (
                    <option value="">Ingen vagter at bytte med</option>
                  ) : null}
                  {swapCandidates.map((s) => {
                    const m = memberByUserId.get(s.user_id);
                    return (
                      <option key={s.id} value={s.id}>
                        {(m?.display_name ?? "Ukendt")} - {formatShiftRange(s.starts_at, s.ends_at)}
                      </option>
                    );
                  })}
                </select>
                <button
                  type="button"
                  disabled={shiftActionBusy || !swapTargetShiftId}
                  onClick={() => void handleSwapSelectedShift()}
                  className="mt-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  Byt vagt
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={shiftActionBusy}
                onClick={openDeleteConfirmFromActions}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                Slet vagt
              </button>
            </div>

            {shiftActionMsg ? (
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {shiftActionMsg}
              </p>
            ) : null}

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Long press pa en vagtcelle aabner slet-advarsel.
            </p>
          </div>
        </div>
      ) : null}

      {createShiftDraft ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Luk dialog"
            onClick={() => setCreateShiftDraft(null)}
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
                onClick={() => setCreateShiftDraft(null)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                aria-label="Luk"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                Starttidspunkt
              </span>
              <input
                type="datetime-local"
                value={toDateTimeLocalValue(createShiftDraft.startIso)}
                onChange={(e) =>
                  setCreateShiftDraft((d) =>
                    d
                      ? {
                          ...d,
                          startIso: localInputToIso(e.target.value, d.startIso),
                        }
                      : d
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                Sluttidspunkt
              </span>
              <input
                type="datetime-local"
                value={toDateTimeLocalValue(createShiftDraft.endIso)}
                onChange={(e) =>
                  setCreateShiftDraft((d) =>
                    d
                      ? {
                          ...d,
                          endIso: localInputToIso(e.target.value, d.endIso),
                        }
                      : d
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                Vagttype
              </span>
              <select
                value={createShiftDraft.shiftTypeId ?? ""}
                onChange={(e) =>
                  setCreateShiftDraft((d) =>
                    d ? { ...d, shiftTypeId: e.target.value || null } : d
                  )
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="">Uden vagttype</option>
                {shiftTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            {createShiftMsg ? (
              <p className="text-sm text-red-600 dark:text-red-400">{createShiftMsg}</p>
            ) : null}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreateShiftDraft(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-600"
              >
                Fortryd
              </button>
              <button
                type="button"
                disabled={createShiftBusy}
                onClick={() => void handleCreateShiftSave()}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                Gem
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
