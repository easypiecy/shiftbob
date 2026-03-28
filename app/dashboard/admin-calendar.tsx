"use client";

import {
  memo,
  type TouchEvent as ReactTouchEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight, FileText, Loader2, Plus, Search, X } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  getWorkplaceDepartmentsOverview,
  getWorkplaceTypes,
  type WorkplaceDepartmentRow,
  type WorkplaceEmployeeTypeRow,
  type WorkplaceMemberDepartmentsRow,
  type WorkplaceShiftTypeRow,
} from "@/src/app/super-admin/workplaces/actions";
import {
  createWorkplaceShift,
  deleteWorkplaceShift,
  reassignWorkplaceShift,
  swapWorkplaceShifts,
  updateWorkplaceShiftTiming,
  getWorkplaceShiftsInRange,
  type WorkplaceShiftRow,
} from "@/src/app/dashboard/workplace-shifts-actions";
import {
  createWorkplaceMemberWithProfile,
  getWorkplaceMemberCvSignedUrl,
  getWorkplaceMemberPreferences,
  getWorkplaceMemberProfileDetails,
  saveWorkplaceMemberPreferences,
  updateWorkplaceMemberWithProfile,
  uploadWorkplaceMemberCv,
} from "@/src/app/dashboard/workplace-member-calendar-actions";
import EmployeeCalendarNameCell from "@/app/dashboard/employee-calendar-name-cell";
import { useTranslations } from "@/src/contexts/translations-context";
import { shiftCalendarCellStyle } from "@/src/lib/calendar-shift-style";

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

function truncateTowardZero(value: number): number {
  return value < 0 ? Math.ceil(value) : Math.floor(value);
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

const DEFAULT_SHIFT_COLOR = "#94a3b8";

function normalizeCalendarHex(color: string | null | undefined): string {
  const c = color?.trim();
  if (!c) return DEFAULT_SHIFT_COLOR;
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  return DEFAULT_SHIFT_COLOR;
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
  hourColWidth: number;
  timelineStartMs: number;
  previewTopPx: number;
  previewHeightPx: number;
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

type MemberProfileDraft = {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
  employeeTypeId: string;
  note: string;
};

type MemberPreferenceDraft = {
  id: string;
  priority: number;
  preferenceText: string;
};

type MemberEditorMode = "create" | "edit";

function blankMemberProfileDraft(defaultEmployeeTypeId: string): MemberProfileDraft {
  return {
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    streetName: "",
    streetNumber: "",
    postalCode: "",
    city: "",
    country: "",
    employeeTypeId: defaultEmployeeTypeId,
    note: "",
  };
}

type CalendarRow =
  | {
      kind: "group";
      key: string;
      name: string;
      deptId: string | null;
    }
  | {
      kind: "employee";
      key: string;
      emp: WorkplaceMemberDepartmentsRow;
      groupDeptId: string | null;
    };

const BASE_HOUR_COL = 34;
/** Mindste timekolonne — forhindrer «zoom helt ud» hvor gitteret bliver ubrugeligt. */
const MIN_HOUR_COL = 26;
/** Største timekolonne — lavere værdi så gitteret forbliver synligt ved maks. zoom ind. */
const MAX_HOUR_COL = 48;
/** Maks. relativ ændring pr. ctrl+wheel-step (store deltaY fra trackpads). */
const WHEEL_ZOOM_FACTOR_MIN = 0.88;
const WHEEL_ZOOM_FACTOR_MAX = 1.12;

function clampHourColWidth(px: number): number {
  return Math.max(MIN_HOUR_COL, Math.min(MAX_HOUR_COL, px));
}
const NAME_COL_WIDTH = 200;

type ActivePinch = {
  startDistance: number;
  startHourColWidth: number;
  centerXInViewport: number;
  anchorContentX: number;
};

type ShiftGridCellProps = {
  cellKey: string;
  day: Date;
  dayKey: string;
  hour: number;
  userId: string;
  groupDeptId: string | null;
  shift: WorkplaceShiftRow | null;
  startsHere: boolean;
  endsHere: boolean;
  has: boolean;
  shiftLabel: string;
  renderedCellStyle: ReturnType<typeof shiftCalendarCellStyle> | undefined;
  styleToken: string;
  hoverDetails?: string;
  onCellPointerDown: (
    e: {
      pointerType?: string;
    },
    shift: WorkplaceShiftRow | null
  ) => void;
  onCellPointerUp: () => void;
  onCellClick: (
    shift: WorkplaceShiftRow | null,
    userId: string,
    departmentId: string | null,
    day: Date,
    hour: number
  ) => void;
  onStartShiftDrag: (
    e: {
      preventDefault: () => void;
      stopPropagation: () => void;
      clientX: number;
      clientY: number;
      currentTarget: EventTarget & HTMLElement;
    },
    shift: WorkplaceShiftRow,
    mode: ShiftDragMode
  ) => void;
};

const ShiftGridCell = memo(function ShiftGridCell({
  cellKey,
  day,
  dayKey,
  hour,
  userId,
  groupDeptId,
  shift,
  startsHere,
  endsHere,
  has,
  shiftLabel,
  renderedCellStyle,
  hoverDetails,
  onCellPointerDown,
  onCellPointerUp,
  onCellClick,
  onStartShiftDrag,
}: ShiftGridCellProps) {
  return (
    <td
      key={cellKey}
      className={
        has
          ? "relative border-b border-l border-zinc-300/60 px-0 py-2 dark:border-zinc-600/50"
          : "border-b border-l border-zinc-100 bg-zinc-50/50 px-0 py-2 dark:border-zinc-800 dark:bg-zinc-950/50"
      }
      style={renderedCellStyle}
      title={hoverDetails}
      onPointerDown={(e) => onCellPointerDown(e, shift)}
      onPointerUp={onCellPointerUp}
      onPointerCancel={onCellPointerUp}
      onPointerLeave={onCellPointerUp}
      onClick={() => onCellClick(shift, userId, groupDeptId, day, hour)}
      data-shift-id={shift?.id ?? ""}
      data-user-id={userId}
      data-day-key={dayKey}
      data-hour={hour}
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
            onStartShiftDrag(e, shift, "move");
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
            onStartShiftDrag(e, shift, "resize_start");
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
            onStartShiftDrag(e, shift, "resize_end");
          }}
          title="Træk for at forkorte/forlænge slut"
        />
      ) : null}
      <span className="sr-only">
        {has ? "Vagt" : "Ledig"} {hour}:00
      </span>
    </td>
  );
},
(prev, next) =>
  prev.cellKey === next.cellKey &&
  prev.has === next.has &&
  prev.startsHere === next.startsHere &&
  prev.endsHere === next.endsHere &&
  prev.shift?.id === next.shift?.id &&
  prev.shift?.starts_at === next.shift?.starts_at &&
  prev.shift?.ends_at === next.shift?.ends_at &&
  prev.shiftLabel === next.shiftLabel &&
  prev.styleToken === next.styleToken &&
  prev.hoverDetails === next.hoverDetails &&
  prev.day.getTime() === next.day.getTime()
);

export default function AdminCalendar({ workplaceId }: Props) {
  const { t } = useTranslations();
  const isDevBuild = process.env.NODE_ENV !== "production";
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
  const [clock, setClock] = useState(formatTimeNow);
  const [hourColWidth, setHourColWidth] = useState(BASE_HOUR_COL);
  const [createShiftDraft, setCreateShiftDraft] = useState<CreateShiftDraft | null>(null);
  const [createShiftBusy, setCreateShiftBusy] = useState(false);
  const [createShiftMsg, setCreateShiftMsg] = useState<string | null>(null);
  const [memberEditorMode, setMemberEditorMode] = useState<MemberEditorMode | null>(null);
  const [memberEditorUserId, setMemberEditorUserId] = useState<string | null>(null);
  const [memberEditorDraft, setMemberEditorDraft] = useState<MemberProfileDraft | null>(null);
  const [memberEditorBusy, setMemberEditorBusy] = useState(false);
  const [memberEditorMessage, setMemberEditorMessage] = useState<string | null>(null);
  const [memberCvBusy, setMemberCvBusy] = useState(false);
  const [memberHasCv, setMemberHasCv] = useState(false);
  const [memberCvFile, setMemberCvFile] = useState<File | null>(null);
  const [memberLoadingDetails, setMemberLoadingDetails] = useState(false);
  const [memberPreferences, setMemberPreferences] = useState<MemberPreferenceDraft[]>([]);
  const [memberPreferencesBusy, setMemberPreferencesBusy] = useState(false);
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
  const [isShiftDragActive, setIsShiftDragActive] = useState(false);
  const [isGridPointerActive, setIsGridPointerActive] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragContentRef = useRef<HTMLDivElement>(null);
  const dragPreviewRef = useRef<HTMLDivElement>(null);
  const dragTimeOverlayRef = useRef<HTMLDivElement>(null);
  const dragTimeOverlayModeRef = useRef<HTMLDivElement>(null);
  const dragTimeOverlayRangeRef = useRef<HTMLDivElement>(null);
  const activeShiftDragRef = useRef<ActiveShiftDrag | null>(null);
  const rollingDaysRef = useRef(rollingDays);
  const pinchRef = useRef<ActivePinch | null>(null);
  const dragPointerRef = useRef({ x: 0, y: 0 });
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickUntilRef = useRef(0);
  const shiftLoadQueueRef = useRef<Promise<void>>(Promise.resolve());
  const shiftLoadReqIdRef = useRef(0);

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

  const enqueueShiftLoad = useCallback(
    (runner: (isStale: () => boolean) => Promise<void>) => {
      const reqId = ++shiftLoadReqIdRef.current;
      shiftLoadQueueRef.current = shiftLoadQueueRef.current
        .then(async () => {
          if (reqId !== shiftLoadReqIdRef.current) return;
          await runner(() => reqId !== shiftLoadReqIdRef.current);
        })
        .catch(() => {
          // Keep queue alive even if a load fails.
        });
    },
    []
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [overviewRes, typesRes] = await Promise.all([
      getWorkplaceDepartmentsOverview(workplaceId),
      getWorkplaceTypes(workplaceId),
    ]);
    if (!overviewRes.ok) {
      setError(overviewRes.error);
      setLoading(false);
      return;
    }
    setDepartments(overviewRes.departments);
    setMembers(overviewRes.members);
    if (typesRes.ok) {
      setShiftTypes(typesRes.shiftTypes);
      setEmployeeTypes(typesRes.employeeTypes);
    } else {
      setShiftTypes(overviewRes.shiftTypes);
      setEmployeeTypes(overviewRes.employeeTypes);
    }
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
      onLoadingDept: (deptId: string | null) => void,
      isCancelled?: () => boolean
    ) => {
      const shouldStop = () => (isCancelled ? isCancelled() : false);
      const logClientFetch = (
        mode: "ok" | "error",
        deptId: string | null,
        elapsedMs: number,
        shiftCount: number
      ) => {
        if (!isDevBuild) return;
        const rangeLabel = `${rangeStartIso.slice(0, 16)}..${rangeEndIso.slice(0, 16)}`;
        console.debug(
          `[calendar-client] dept=${deptId ?? "all"} ${mode} ${elapsedMs.toFixed(1)}ms shifts=${shiftCount} range=${rangeLabel}`
        );
      };

      if (selectedDeptId) {
        if (shouldStop()) return;
        onLoadingDept(selectedDeptId);
        const t0 = performance.now();
        const res = await getWorkplaceShiftsInRange(
          workplaceId,
          selectedDeptId,
          rangeStartIso,
          rangeEndIso
        );
        const elapsedMs = performance.now() - t0;
        if (shouldStop()) return;
        if (res.ok) {
          onChunk(res.shifts);
          logClientFetch("ok", selectedDeptId, elapsedMs, res.shifts.length);
        } else {
          logClientFetch("error", selectedDeptId, elapsedMs, 0);
        }
        if (shouldStop()) return;
        onLoadingDept(null);
        return;
      }

      if (departments.length === 0) {
        if (shouldStop()) return;
        onLoadingDept(null);
        const t0 = performance.now();
        const res = await getWorkplaceShiftsInRange(workplaceId, null, rangeStartIso, rangeEndIso);
        const elapsedMs = performance.now() - t0;
        if (shouldStop()) return;
        if (res.ok) {
          onChunk(res.shifts);
          logClientFetch("ok", null, elapsedMs, res.shifts.length);
        } else {
          logClientFetch("error", null, elapsedMs, 0);
        }
        return;
      }

      let acc: WorkplaceShiftRow[] = [];
      for (const dept of departments) {
        if (shouldStop()) return;
        onLoadingDept(dept.id);
        const t0 = performance.now();
        const res = await getWorkplaceShiftsInRange(
          workplaceId,
          dept.id,
          rangeStartIso,
          rangeEndIso
        );
        const elapsedMs = performance.now() - t0;
        if (shouldStop()) return;
        if (!res.ok) {
          logClientFetch("error", dept.id, elapsedMs, 0);
          continue;
        }
        acc = [...acc, ...res.shifts];
        onChunk(acc);
        logClientFetch("ok", dept.id, elapsedMs, res.shifts.length);
      }
      if (shouldStop()) return;
      onLoadingDept(null);
    },
    [selectedDeptId, workplaceId, departments, isDevBuild]
  );

  useEffect(() => {
    if (loading) return;
    if (viewMode !== "month30") return;
    const rangeStartIso = startOfDay(anchorDate).toISOString();
    const rangeEndIso = addDays(startOfDay(anchorDate), 30).toISOString();
    let cancelled = false;
    setLoadingDeptIds([]);
    enqueueShiftLoad(async (isStale) => {
      if (cancelled || isStale()) return;
      await loadShiftsRangeDeptByDept(
        rangeStartIso,
        rangeEndIso,
        (rows) => {
          if (!cancelled && !isStale()) setMonthShifts(rows);
        },
        (deptId) => {
          if (!cancelled && !isStale()) setLoadingDeptIds(deptId ? [deptId] : []);
        },
        () => cancelled || isStale()
      );
    });
    return () => {
      cancelled = true;
    };
  }, [loading, viewMode, anchorDate, loadShiftsRangeDeptByDept, enqueueShiftLoad]);

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
      list = list.filter((m) => m.employee_type_id === filterEmployeeTypeId);
    }
    const q = employeeQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => {
        const label = `${m.display_name} ${m.email ?? ""} ${m.user_id}`.toLowerCase();
        return label.includes(q);
      });
    }
    const sorted = [...list];
    sorted.sort((a, b) => a.display_name.localeCompare(b.display_name, "da"));
    return sorted;
  }, [
    departmentFiltered,
    employeeQuery,
    filterEmployeeTypeId,
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
      map.set(t.id, normalizeCalendarHex(t.calendar_color));
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
  const defaultEmployeeTypeId = employeeTypes[0]?.id ?? "";

  const memberByUserId = useMemo(() => {
    const map = new Map<string, WorkplaceMemberDepartmentsRow>();
    for (const m of members) {
      map.set(m.user_id, m);
    }
    return map;
  }, [members]);

  const canManageShifts = calendarAdminNameView;

  const closeMemberEditor = useCallback(() => {
    setMemberEditorMode(null);
    setMemberEditorUserId(null);
    setMemberEditorDraft(null);
    setMemberEditorMessage(null);
    setMemberCvBusy(false);
    setMemberCvFile(null);
    setMemberHasCv(false);
    setMemberLoadingDetails(false);
    setMemberPreferences([]);
    setMemberPreferencesBusy(false);
  }, []);

  const openCreateMemberEditor = useCallback(() => {
    if (!canManageShifts) return;
    setMemberEditorMode("create");
    setMemberEditorUserId(null);
    setMemberEditorDraft(blankMemberProfileDraft(defaultEmployeeTypeId));
    setMemberEditorMessage(
      defaultEmployeeTypeId
        ? null
        : t(
            "calendar.member_editor.need_employee_type",
            "Opret mindst én medarbejdertype først."
          )
    );
    setMemberCvBusy(false);
    setMemberCvFile(null);
    setMemberHasCv(false);
    setMemberLoadingDetails(false);
    setMemberPreferences([]);
    setMemberPreferencesBusy(false);
  }, [canManageShifts, defaultEmployeeTypeId, t]);

  const openEditMemberEditor = useCallback(
    async (userId: string) => {
      if (!canManageShifts) return;
      setMemberEditorMode("edit");
      setMemberEditorUserId(userId);
      setMemberEditorDraft(blankMemberProfileDraft(defaultEmployeeTypeId));
      setMemberEditorMessage(null);
      setMemberCvBusy(false);
      setMemberCvFile(null);
      setMemberHasCv(false);
      setMemberLoadingDetails(true);
      setMemberPreferences([]);
      const [profileRes, prefRes] = await Promise.all([
        getWorkplaceMemberProfileDetails(workplaceId, userId),
        getWorkplaceMemberPreferences(workplaceId, userId),
      ]);
      if (!profileRes.ok) {
        setMemberEditorMessage(profileRes.error);
        setMemberLoadingDetails(false);
        return;
      }
      setMemberEditorDraft({
        firstName: profileRes.data.firstName,
        lastName: profileRes.data.lastName,
        email: profileRes.data.email,
        mobilePhone: profileRes.data.mobilePhone,
        streetName: profileRes.data.streetName,
        streetNumber: profileRes.data.streetNumber,
        postalCode: profileRes.data.postalCode,
        city: profileRes.data.city,
        country: profileRes.data.country,
        employeeTypeId: profileRes.data.employeeTypeId ?? defaultEmployeeTypeId,
        note: profileRes.data.note ?? "",
      });
      setMemberHasCv(profileRes.data.hasCv);
      if (prefRes.ok) {
        setMemberPreferences(
          prefRes.rows.map((row) => ({
            id: row.id,
            priority: row.priority,
            preferenceText: row.preferenceText,
          }))
        );
      } else {
        setMemberEditorMessage((prev) => prev ?? prefRes.error);
      }
      setMemberLoadingDetails(false);
    },
    [canManageShifts, defaultEmployeeTypeId, workplaceId]
  );

  const onMemberDraftField = useCallback(
    (key: keyof MemberProfileDraft, value: string) => {
      setMemberEditorDraft((prev) => {
        if (!prev) return prev;
        return { ...prev, [key]: value };
      });
    },
    []
  );

  const addPreferenceRow = useCallback(() => {
    setMemberPreferences((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}-${prev.length + 1}`,
        priority: prev.length + 1,
        preferenceText: "",
      },
    ]);
  }, []);

  const removePreferenceRow = useCallback((id: string) => {
    setMemberPreferences((prev) =>
      prev
        .filter((row) => row.id !== id)
        .map((row, idx) => ({ ...row, priority: idx + 1 }))
    );
  }, []);

  const updatePreferenceRow = useCallback(
    (id: string, patch: Partial<Pick<MemberPreferenceDraft, "priority" | "preferenceText">>) => {
      setMemberPreferences((prev) =>
        prev
          .map((row) => (row.id === id ? { ...row, ...patch } : row))
          .sort((a, b) => a.priority - b.priority)
      );
    },
    []
  );

  const savePreferencesForUser = useCallback(
    async (userId: string) => {
      setMemberPreferencesBusy(true);
      try {
        const res = await saveWorkplaceMemberPreferences(
          workplaceId,
          userId,
          memberPreferences.map((row, idx) => ({
            priority: Number.isFinite(row.priority) ? Math.max(1, Math.floor(row.priority)) : idx + 1,
            preferenceText: row.preferenceText,
          }))
        );
        if (!res.ok) {
          setMemberEditorMessage((prev) => prev ?? res.error);
          return false;
        }
        return true;
      } finally {
        setMemberPreferencesBusy(false);
      }
    },
    [memberPreferences, workplaceId]
  );

  const saveMemberEditor = useCallback(async () => {
    if (!memberEditorDraft) return;
    setMemberEditorBusy(true);
    setMemberEditorMessage(null);
    try {
      if (memberEditorMode === "create") {
        const res = await createWorkplaceMemberWithProfile(workplaceId, {
          firstName: memberEditorDraft.firstName,
          lastName: memberEditorDraft.lastName,
          email: memberEditorDraft.email,
          mobilePhone: memberEditorDraft.mobilePhone,
          streetName: memberEditorDraft.streetName,
          streetNumber: memberEditorDraft.streetNumber,
          postalCode: memberEditorDraft.postalCode,
          city: memberEditorDraft.city,
          country: memberEditorDraft.country,
          employeeTypeId: memberEditorDraft.employeeTypeId,
          note: memberEditorDraft.note.trim() ? memberEditorDraft.note : null,
        });
        if (!res.ok) {
          setMemberEditorMessage(res.error);
          return;
        }
        const prefSaved = await savePreferencesForUser(res.userId);
        if (!prefSaved) {
          await load();
          return;
        }
        if (memberCvFile) {
          const fd = new FormData();
          fd.append("file", memberCvFile);
          const uploadRes = await uploadWorkplaceMemberCv(workplaceId, res.userId, fd);
          if (!uploadRes.ok) {
            setMemberEditorMessage(
              t(
                "calendar.member_editor.create_cv_failed",
                "Medarbejder oprettet, men CV upload fejlede: {detail}"
              ).replace("{detail}", uploadRes.error)
            );
            await load();
            return;
          }
        }
        await load();
        closeMemberEditor();
        return;
      }

      if (!memberEditorUserId) return;
      const res = await updateWorkplaceMemberWithProfile(workplaceId, memberEditorUserId, {
        firstName: memberEditorDraft.firstName,
        lastName: memberEditorDraft.lastName,
        email: memberEditorDraft.email,
        mobilePhone: memberEditorDraft.mobilePhone,
        streetName: memberEditorDraft.streetName,
        streetNumber: memberEditorDraft.streetNumber,
        postalCode: memberEditorDraft.postalCode,
        city: memberEditorDraft.city,
        country: memberEditorDraft.country,
        employeeTypeId: memberEditorDraft.employeeTypeId,
        note: memberEditorDraft.note.trim() ? memberEditorDraft.note : null,
      });
      if (!res.ok) {
        setMemberEditorMessage(res.error);
        return;
      }
      const prefSaved = await savePreferencesForUser(memberEditorUserId);
      if (!prefSaved) {
        await load();
        return;
      }
      if (memberCvFile) {
        const fd = new FormData();
        fd.append("file", memberCvFile);
        const uploadRes = await uploadWorkplaceMemberCv(workplaceId, memberEditorUserId, fd);
        if (!uploadRes.ok) {
            setMemberEditorMessage(
              t(
                "calendar.member_editor.update_cv_failed",
                "Data gemt, men CV upload fejlede: {detail}"
              ).replace("{detail}", uploadRes.error)
            );
          await load();
          return;
        }
      }
      await load();
      closeMemberEditor();
    } finally {
      setMemberEditorBusy(false);
    }
  }, [
    closeMemberEditor,
    load,
    memberCvFile,
    memberEditorDraft,
    memberEditorMode,
    memberEditorUserId,
    savePreferencesForUser,
    t,
    workplaceId,
  ]);

  const viewMemberCv = useCallback(async () => {
    if (!memberEditorUserId) return;
    setMemberCvBusy(true);
    setMemberEditorMessage(null);
    try {
      const res = await getWorkplaceMemberCvSignedUrl(workplaceId, memberEditorUserId);
      if (!res.ok) {
        setMemberEditorMessage(res.error);
        return;
      }
      window.open(res.url, "_blank", "noopener,noreferrer");
    } finally {
      setMemberCvBusy(false);
    }
  }, [memberEditorUserId, workplaceId]);

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

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

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

  const handleCellPointerDown = useCallback((
    e: {
      pointerType?: string;
    },
    shift: WorkplaceShiftRow | null
  ) => {
    if (!canManageShifts || !shift) return;
    // Keep long-press delete for touch/pen; avoid desktop mouse delays.
    if (e.pointerType === "mouse") return;
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      suppressClickUntilRef.current = Date.now() + 800;
      setPendingDeleteShift(shift);
    }, 520);
  }, [canManageShifts, clearLongPressTimer]);

  const handleCellPointerUp = useCallback(() => {
    clearLongPressTimer();
  }, [clearLongPressTimer]);

  const handleCellClick = useCallback((shift: WorkplaceShiftRow | null) => {
    if (!canManageShifts || !shift) return;
    if (Date.now() < suppressClickUntilRef.current) return;
    setSelectedShift(shift);
    setShiftActionMsg(null);
  }, [canManageShifts]);

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

  const openCreateShiftFromCell = useCallback((
    userId: string,
    departmentId: string | null,
    day: Date,
    hour: number
  ) => {
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
  }, [canManageShifts, shiftTypes]);

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
    const nextWidth = clampHourColWidth(pinch.startHourColWidth * scale);
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

    const rawFactor = Math.exp(-e.deltaY * 0.01);
    const zoomFactor = Math.min(
      WHEEL_ZOOM_FACTOR_MAX,
      Math.max(WHEEL_ZOOM_FACTOR_MIN, rawFactor)
    );
    const nextWidth = clampHourColWidth(hourColWidth * zoomFactor);

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

  const toIsoFromMs = useCallback((ms: number): string => {
    return new Date(ms).toISOString();
  }, []);

  const applyShiftTimingOptimistic = useCallback((
    shiftId: string,
    nextStartMs: number,
    nextEndMs: number
  ) => {
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
  }, [toIsoFromMs]);

  const syncDragTimeOverlayPosition = useCallback(() => {
    const overlay = dragTimeOverlayRef.current;
    if (!overlay) return;
    const { x, y } = dragPointerRef.current;
    overlay.style.left = `clamp(8px, ${x}px, calc(100vw - 280px))`;
    overlay.style.top = `clamp(8px, calc(${y}px - 54px), calc(100vh - 90px))`;
  }, []);

  const syncDragPreview = useCallback((drag: ActiveShiftDrag) => {
    const preview = dragPreviewRef.current;
    if (!preview) return;
    const leftPx =
      NAME_COL_WIDTH +
      ((drag.nextStartMs - drag.timelineStartMs) / (60 * 60 * 1000)) * drag.hourColWidth;
    const widthPx = Math.max(
      drag.hourColWidth / 12,
      ((drag.nextEndMs - drag.nextStartMs) / (60 * 60 * 1000)) * drag.hourColWidth
    );
    preview.style.display = "block";
    preview.style.transform = `translate3d(${leftPx}px, ${drag.previewTopPx}px, 0)`;
    preview.style.width = `${widthPx}px`;
    preview.style.height = `${drag.previewHeightPx}px`;
  }, []);

  const syncDragOverlayContent = useCallback((drag: ActiveShiftDrag) => {
    const modeEl = dragTimeOverlayModeRef.current;
    const rangeEl = dragTimeOverlayRangeRef.current;
    if (modeEl) {
      modeEl.textContent =
        drag.mode === "move" ? "Flyt vagt" : drag.mode === "resize_start" ? "Juster start" : "Juster slut";
    }
    if (rangeEl) {
      rangeEl.textContent = `${formatClockDate(toIsoFromMs(drag.nextStartMs))} - ${formatClockDate(
        toIsoFromMs(drag.nextEndMs)
      )}`;
    }
  }, [toIsoFromMs]);

  const handleShiftDragMove = useCallback((e: PointerEvent) => {
    const drag = activeShiftDragRef.current;
    if (!drag) return;
    dragPointerRef.current = { x: e.clientX, y: e.clientY };
    syncDragTimeOverlayPosition();

    const dx = e.clientX - drag.pointerStartX;
    const rawSteps = dx / drag.pxPer5Min;
    const stepCount =
      drag.mode === "resize_end" ? truncateTowardZero(rawSteps) : Math.round(rawSteps);
    const deltaMs = stepCount * 5 * 60 * 1000;
    let nextStartMs = drag.originalStartMs;
    let nextEndMs = drag.originalEndMs;
    if (drag.mode === "move") {
      nextStartMs += deltaMs;
      nextEndMs += deltaMs;
    } else if (drag.mode === "resize_start") {
      nextStartMs = Math.min(drag.originalStartMs + deltaMs, drag.originalEndMs - 5 * 60 * 1000);
    } else {
      nextEndMs = Math.max(drag.originalEndMs + deltaMs, drag.originalStartMs + 5 * 60 * 1000);
    }
    if (nextStartMs === drag.nextStartMs && nextEndMs === drag.nextEndMs) return;
    drag.nextStartMs = nextStartMs;
    drag.nextEndMs = nextEndMs;
    syncDragPreview(drag);
    syncDragOverlayContent(drag);
  }, [syncDragOverlayContent, syncDragPreview, syncDragTimeOverlayPosition]);

  const handleShiftDragUp = useCallback(() => {
    const finalDrag = activeShiftDragRef.current;
    activeShiftDragRef.current = null;
    setIsShiftDragActive(false);
    const preview = dragPreviewRef.current;
    if (preview) preview.style.display = "none";
    const overlay = dragTimeOverlayRef.current;
    if (overlay) overlay.style.display = "none";
    if (!finalDrag) return;
    if (
      finalDrag.nextStartMs === finalDrag.originalStartMs &&
      finalDrag.nextEndMs === finalDrag.originalEndMs
    ) {
      return;
    }
    applyShiftTimingOptimistic(finalDrag.shift.id, finalDrag.nextStartMs, finalDrag.nextEndMs);
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
  }, [applyShiftTimingOptimistic, toIsoFromMs, workplaceId]);

  const startShiftDrag = useCallback((
    e: {
      preventDefault: () => void;
      stopPropagation: () => void;
      clientX: number;
      clientY: number;
      currentTarget: EventTarget & HTMLElement;
    },
    shift: WorkplaceShiftRow,
    mode: ShiftDragMode
  ) => {
    if (!canManageShifts) return;
    e.preventDefault();
    e.stopPropagation();
    clearLongPressTimer();
    suppressClickUntilRef.current = Date.now() + 800;
    dragPointerRef.current = { x: e.clientX, y: e.clientY };
    const contentEl = dragContentRef.current;
    const rowEl = e.currentTarget.closest("tr");
    if (!contentEl || !rowEl) return;
    const contentRect = contentEl.getBoundingClientRect();
    const rowRect = rowEl.getBoundingClientRect();
    const pxPer5Min = Math.max(1, hourColWidth / 12);
    const originalStartMs = new Date(shift.starts_at).getTime();
    const originalEndMs = new Date(shift.ends_at).getTime();
    const drag: ActiveShiftDrag = {
      mode,
      shift,
      pointerStartX: e.clientX,
      pxPer5Min,
      hourColWidth,
      timelineStartMs: startOfDay(rollingDaysRef.current[0] ?? new Date()).getTime(),
      previewTopPx: rowRect.top - contentRect.top,
      previewHeightPx: rowRect.height,
      originalStartMs,
      originalEndMs,
      nextStartMs: originalStartMs,
      nextEndMs: originalEndMs,
    };
    activeShiftDragRef.current = drag;
    syncDragTimeOverlayPosition();
    syncDragPreview(drag);
    syncDragOverlayContent(drag);
    const overlay = dragTimeOverlayRef.current;
    if (overlay) overlay.style.display = "block";
    setIsShiftDragActive(true);
  }, [
    canManageShifts,
    hourColWidth,
    clearLongPressTimer,
    syncDragOverlayContent,
    syncDragPreview,
    syncDragTimeOverlayPosition,
  ]);

  useEffect(() => {
    if (!isShiftDragActive) return;
    window.addEventListener("pointermove", handleShiftDragMove);
    window.addEventListener("pointerup", handleShiftDragUp, { once: true });
    window.addEventListener("pointercancel", handleShiftDragUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", handleShiftDragMove);
      window.removeEventListener("pointerup", handleShiftDragUp);
      window.removeEventListener("pointercancel", handleShiftDragUp);
    };
  }, [isShiftDragActive, handleShiftDragMove, handleShiftDragUp]);

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
  const calendarRows = useMemo<CalendarRow[]>(() => {
    const out: CalendarRow[] = [];
    for (const group of groupedEmployees) {
      const groupDeptId = departments.find((d) => d.name === group.name)?.id ?? null;
      out.push({
        kind: "group",
        key: `dept-${group.name}`,
        name: group.name,
        deptId: groupDeptId,
      });
      for (const emp of group.employees) {
        out.push({
          kind: "employee",
          key: emp.user_id,
          emp,
          groupDeptId,
        });
      }
    }
    return out;
  }, [groupedEmployees, departments]);

  const rowVirtualizer = useVirtualizer({
    count: calendarRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => (calendarRows[index]?.kind === "group" ? 38 : 44),
    overscan: 8,
  });

  const hourVirtualizer = useVirtualizer({
    horizontal: true,
    count: totalHourCols,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => hourColWidth,
    overscan: 24,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const virtualHourItems = hourVirtualizer.getVirtualItems();
  const topPadPx = virtualRows[0]?.start ?? 0;
  const bottomPadPx =
    virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;
  const firstHourIndex = virtualHourItems[0]?.index ?? 0;
  const lastHourIndex = virtualHourItems[virtualHourItems.length - 1]?.index ?? -1;
  const leftPadCols = Math.max(0, firstHourIndex);
  const rightPadCols =
    lastHourIndex >= 0 ? Math.max(0, totalHourCols - lastHourIndex - 1) : totalHourCols;
  const visibleHourIndexes = useMemo(() => {
    if (lastHourIndex < firstHourIndex) return [];
    return Array.from(
      { length: lastHourIndex - firstHourIndex + 1 },
      (_, offset) => firstHourIndex + offset
    );
  }, [firstHourIndex, lastHourIndex]);

  const hourMetaByIndex = useCallback(
    (hourIndex: number): { day: Date; dayKey: string; hour: number } | null => {
      const dayIndex = Math.floor(hourIndex / 24);
      const day = rollingDays[dayIndex];
      if (!day) return null;
      return {
        day,
        dayKey: dayKeyLocal(day),
        hour: hourIndex % 24,
      };
    },
    [rollingDays]
  );
  const visibleStartDay =
    rollingDays[Math.floor(Math.max(firstHourIndex, 0) / 24)] ?? rollingDays[0] ?? null;
  const visibleEndDay =
    rollingDays[Math.floor(Math.max(lastHourIndex, 0) / 24)] ??
    rollingDays[rollingDays.length - 1] ??
    null;
  const rollingFetchStartIso = visibleStartDay
    ? startOfDay(visibleStartDay).toISOString()
    : null;
  const rollingFetchEndIso = visibleEndDay
    ? addDays(startOfDay(visibleEndDay), 1).toISOString()
    : null;

  useEffect(() => {
    if (loading) return;
    if (viewMode !== "rolling" || !rollingFetchStartIso || !rollingFetchEndIso) return;
    let cancelled = false;
    setLoadingDeptIds([]);
    enqueueShiftLoad(async (isStale) => {
      if (cancelled || isStale()) return;
      await loadShiftsRangeDeptByDept(
        rollingFetchStartIso,
        rollingFetchEndIso,
        (rows) => {
          if (!cancelled && !isStale()) setRollingShifts(rows);
        },
        (deptId) => {
          if (!cancelled && !isStale()) {
            setLoadingDeptIds(deptId ? [deptId] : []);
          }
        },
        () => cancelled || isStale()
      );
    });
    return () => {
      cancelled = true;
    };
  }, [
    loading,
    viewMode,
    rollingFetchStartIso,
    rollingFetchEndIso,
    loadShiftsRangeDeptByDept,
    enqueueShiftLoad,
  ]);

  const handleGridCellClick = useCallback(
    (
      shift: WorkplaceShiftRow | null,
      userId: string,
      departmentId: string | null,
      day: Date,
      hour: number
    ) => {
      if (shift) {
        handleCellClick(shift);
        return;
      }
      openCreateShiftFromCell(userId, departmentId, day, hour);
    },
    [handleCellClick, openCreateShiftFromCell]
  );

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
              aria-label={t(
                "calendar.employee.search_aria",
                "Søg medarbejdere"
              )}
              type="search"
              value={employeeQuery}
              onChange={(e) => setEmployeeQuery(e.target.value)}
              placeholder="Filtrér synlige rækker…"
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              autoComplete="off"
            />
          </div>
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
              <option value="">
                {t(
                  "calendar.employee.filter_all_types",
                  "Alle medarbejdertyper"
                )}
              </option>
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
              className="max-h-[72vh] overflow-auto px-3"
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
              <div ref={dragContentRef} className="relative">
                <table
                  className="admin-shift-calendar w-full min-w-[720px] table-fixed border-collapse"
                  style={{
                    width: NAME_COL_WIDTH + totalHourCols * hourColWidth,
                    minWidth: NAME_COL_WIDTH + totalHourCols * hourColWidth,
                  }}
                >
                <colgroup>
                  <col style={{ width: NAME_COL_WIDTH }} />
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
                    {leftPadCols > 0 ? (
                      <th
                        colSpan={leftPadCols}
                        className="border-b border-zinc-200 bg-zinc-100 px-0 py-2 dark:border-zinc-700 dark:bg-zinc-800/95"
                      />
                    ) : null}
                    {visibleHourIndexes.map((hourIndex) => {
                      const meta = hourMetaByIndex(hourIndex);
                      if (!meta) return null;
                      return (
                        <th
                          key={`${meta.dayKey}-${meta.hour}`}
                          className="border-b border-zinc-200 bg-zinc-100 px-0 py-2 text-center text-[10px] font-medium whitespace-nowrap tabular-nums text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/95 dark:text-zinc-400"
                        >
                          {meta.hour}
                        </th>
                      );
                    })}
                    {rightPadCols > 0 ? (
                      <th
                        colSpan={rightPadCols}
                        className="border-b border-zinc-200 bg-zinc-100 px-0 py-2 dark:border-zinc-700 dark:bg-zinc-800/95"
                      />
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {calendarRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={1 + totalHourCols}
                        className="border-b border-zinc-100 px-3 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800"
                      >
                        {t(
                          "calendar.employee.empty_filter",
                          "Ingen medarbejdere matcher filteret for den valgte afdeling."
                        )}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {topPadPx > 0 ? (
                        <tr aria-hidden="true">
                          <td colSpan={1 + totalHourCols} style={{ height: topPadPx }} />
                        </tr>
                      ) : null}
                      {virtualRows.map((virtualRow) => {
                        const row = calendarRows[virtualRow.index];
                        if (!row) return null;
                        if (row.kind === "group") {
                          return (
                            <tr
                              key={row.key}
                              ref={rowVirtualizer.measureElement}
                              data-index={virtualRow.index}
                            >
                              <td className="sticky left-0 z-20 w-[200px] min-w-[200px] max-w-[200px] border-b border-r border-zinc-200 bg-zinc-100/90 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-200">
                                <div className="flex items-center gap-2">
                                  <span>{row.name}</span>
                                  {row.deptId && loadingDeptIds.includes(row.deptId) ? (
                                    <span className="inline-block h-3 w-3 animate-spin rounded-full border border-zinc-400 border-t-zinc-900 dark:border-zinc-500 dark:border-t-zinc-100" />
                                  ) : null}
                                </div>
                              </td>
                              <td
                                colSpan={totalHourCols}
                                className="border-b border-l border-zinc-200 bg-zinc-100/60 px-0 py-2 dark:border-zinc-700 dark:bg-zinc-800/70"
                              />
                            </tr>
                          );
                        }

                        const emp = row.emp;
                        return (
                          <tr
                            key={row.key}
                            ref={rowVirtualizer.measureElement}
                            data-index={virtualRow.index}
                            className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                          >
                            <td className="sticky left-0 z-10 w-[200px] min-w-[200px] max-w-[200px] border-b border-r border-zinc-100 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
                              <EmployeeCalendarNameCell
                                emp={emp}
                                viewerUserId={viewerUserId}
                                nameMode={calendarAdminNameView ? "full" : "privacy"}
                                canEdit={calendarAdminNameView}
                                onOpenEdit={() => void openEditMemberEditor(emp.user_id)}
                              />
                            </td>

                            {leftPadCols > 0 ? (
                              <td
                                colSpan={leftPadCols}
                                className="border-b border-l border-zinc-100 bg-zinc-50/50 px-0 py-2 dark:border-zinc-800 dark:bg-zinc-950/50"
                              />
                            ) : null}

                            {visibleHourIndexes.map((hourIndex) => {
                              const meta = hourMetaByIndex(hourIndex);
                              if (!meta) return null;
                              const slotKey = shiftSlotKey(emp.user_id, meta.day, meta.hour);
                              const shift = rollingSlotShiftMap.map.get(slotKey) ?? null;
                              const startsHere = Boolean(
                                shift && rollingSlotShiftMap.starts.has(slotKey)
                              );
                              const endsHere = Boolean(
                                shift && rollingSlotShiftMap.ends.has(slotKey)
                              );
                              const has = Boolean(shift);
                              const shiftColor = shift?.shift_type_id
                                ? shiftColorById.get(shift.shift_type_id) ?? "#94a3b8"
                                : "#94a3b8";
                              const empPattern = emp.employee_type_id
                                ? employeePatternById.get(emp.employee_type_id) ?? "none"
                                : fallbackPatternByUserId(emp.user_id);
                              const showPattern = Boolean(shift && endsHere);
                              const cellStyle = has
                                ? shiftCalendarCellStyle({
                                    shiftTypeColor: shiftColor,
                                    employeePattern: showPattern ? empPattern : "none",
                                  })
                                : undefined;
                              const shiftLabel = shift?.shift_type_id
                                ? shiftTypeLabelById.get(shift.shift_type_id) ?? "Vagt"
                                : "Vagt";
                              const member = shift ? memberByUserId.get(shift.user_id) ?? null : null;
                              const employeeName = member?.display_name ?? "Ukendt";
                              const departmentName = shift?.department_id
                                ? departmentById.get(shift.department_id)?.name ?? "Uden afdeling"
                                : "Uden afdeling";
                              const employeeTypeLabel = member?.employee_type_id
                                ? employeeTypeLabelById.get(member.employee_type_id) ??
                                  "Uden medarbejdertype"
                                : "Uden medarbejdertype";
                              const hoverDetails = has
                                ? [
                                    `Medarbejder: ${employeeName}`,
                                    `Afdeling: ${departmentName}`,
                                    `Medarbejdertype: ${employeeTypeLabel}`,
                                    `Vagttype: ${shiftLabel}`,
                                    `Tid: ${formatShiftRange(shift!.starts_at, shift!.ends_at)}`,
                                  ].join("\n")
                                : undefined;
                              const styleToken = `${shiftColor}|${showPattern ? empPattern : "none"}|${has ? "1" : "0"}`;
                              return (
                                <ShiftGridCell
                                  key={`${emp.user_id}-${meta.dayKey}-${meta.hour}`}
                                  cellKey={`${emp.user_id}-${meta.dayKey}-${meta.hour}`}
                                  day={meta.day}
                                  dayKey={meta.dayKey}
                                  hour={meta.hour}
                                  userId={emp.user_id}
                                  groupDeptId={row.groupDeptId}
                                  shift={shift}
                                  startsHere={startsHere}
                                  endsHere={endsHere}
                                  has={has}
                                  shiftLabel={shiftLabel}
                                  renderedCellStyle={cellStyle}
                                  styleToken={styleToken}
                                  hoverDetails={hoverDetails}
                                  onCellPointerDown={handleCellPointerDown}
                                  onCellPointerUp={handleCellPointerUp}
                                  onCellClick={handleGridCellClick}
                                  onStartShiftDrag={startShiftDrag}
                                />
                              );
                            })}

                            {rightPadCols > 0 ? (
                              <td
                                colSpan={rightPadCols}
                                className="border-b border-l border-zinc-100 bg-zinc-50/50 px-0 py-2 dark:border-zinc-800 dark:bg-zinc-950/50"
                              />
                            ) : null}
                          </tr>
                        );
                      })}
                      {bottomPadPx > 0 ? (
                        <tr aria-hidden="true">
                          <td colSpan={1 + totalHourCols} style={{ height: bottomPadPx }} />
                        </tr>
                      ) : null}
                    </>
                  )}
                  <tr>
                    <td className="sticky left-0 z-20 w-[200px] min-w-[200px] max-w-[200px] border-b border-r border-zinc-200 bg-zinc-50 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                      <button
                        type="button"
                        onClick={() => openCreateMemberEditor()}
                        disabled={!canManageShifts}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
                      >
                        <Plus className="h-4 w-4" />
                        {t("calendar.employee.add_button", "Tilføj medarbejder")}
                      </button>
                    </td>
                    <td
                      colSpan={totalHourCols}
                      className="border-b border-l border-zinc-100 bg-zinc-50/40 px-0 py-3 dark:border-zinc-800 dark:bg-zinc-950/40"
                    />
                  </tr>
                </tbody>
                </table>
                <div className="pointer-events-none absolute inset-0 z-40">
                  <div
                    ref={dragPreviewRef}
                    className="absolute hidden rounded-md border border-cyan-300 bg-cyan-400/35 shadow-[0_0_14px_rgba(34,211,238,0.55)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className={`text-xs text-zinc-500 dark:text-zinc-400 ${shellClass}`}>
        {viewMode === "rolling"
          ? "Rul vandret for at se flere dage — vagter hentes automatisk for de dage, du scroller til."
          : "Klik en dag for at åbne rullende visning med timegitter for den dag."}
      </p>

      <div
        ref={dragTimeOverlayRef}
        className="pointer-events-none fixed z-50 hidden rounded-lg border border-zinc-200 bg-white/95 px-3 py-2 text-xs font-medium text-zinc-800 shadow-lg dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-100"
        style={{ transform: "translate(-50%, -100%)" }}
      >
        <div
          ref={dragTimeOverlayModeRef}
          className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        />
        <div ref={dragTimeOverlayRangeRef} />
      </div>

      {memberEditorMode && canManageShifts ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label={t(
              "calendar.member_editor.close_dialog_aria",
              "Luk medarbejder-dialog"
            )}
            onClick={closeMemberEditor}
          />
          <div
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-t-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 sm:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-editor-title"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="member-editor-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {memberEditorMode === "create"
                  ? t("calendar.member_editor.title_create", "Tilføj medarbejder")
                  : t("calendar.member_editor.title_edit", "Rediger medarbejder")}
              </h2>
              <button
                type="button"
                onClick={closeMemberEditor}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                aria-label={t("calendar.member_editor.close_aria", "Luk")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {memberLoadingDetails || !memberEditorDraft ? (
              <div className="flex items-center gap-2 py-6 text-sm text-zinc-600 dark:text-zinc-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("calendar.member_editor.loading", "Henter medarbejderdata…")}
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.first_name", "Fornavn *")}
                    </span>
                    <input
                      required
                      value={memberEditorDraft.firstName}
                      onChange={(e) => onMemberDraftField("firstName", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                      autoComplete="given-name"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.last_name", "Efternavn *")}
                    </span>
                    <input
                      required
                      value={memberEditorDraft.lastName}
                      onChange={(e) => onMemberDraftField("lastName", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                      autoComplete="family-name"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.email", "Email *")}
                    </span>
                    <input
                      required
                      type="email"
                      value={memberEditorDraft.email}
                      onChange={(e) => onMemberDraftField("email", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                      autoComplete="email"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.mobile", "Mobilnummer *")}
                    </span>
                    <input
                      required
                      value={memberEditorDraft.mobilePhone}
                      onChange={(e) => onMemberDraftField("mobilePhone", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                      autoComplete="tel"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.street", "Vejnavn *")}
                    </span>
                    <input
                      required
                      value={memberEditorDraft.streetName}
                      onChange={(e) => onMemberDraftField("streetName", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.street_no", "Vej nr. *")}
                    </span>
                    <input
                      required
                      value={memberEditorDraft.streetNumber}
                      onChange={(e) => onMemberDraftField("streetNumber", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.postal", "Postnummer *")}
                    </span>
                    <input
                      required
                      value={memberEditorDraft.postalCode}
                      onChange={(e) => onMemberDraftField("postalCode", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.city", "By *")}
                    </span>
                    <input
                      required
                      value={memberEditorDraft.city}
                      onChange={(e) => onMemberDraftField("city", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.country", "Land *")}
                    </span>
                    <input
                      required
                      value={memberEditorDraft.country}
                      onChange={(e) => onMemberDraftField("country", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                      {t("calendar.member_editor.employee_type", "Medarbejdertype *")}
                    </span>
                    <select
                      required
                      value={memberEditorDraft.employeeTypeId}
                      onChange={(e) => onMemberDraftField("employeeTypeId", e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    >
                      <option value="" disabled>
                        {t(
                          "calendar.member_editor.employee_type_placeholder",
                          "Vælg medarbejdertype"
                        )}
                      </option>
                      {employeeTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-300">
                    {t("calendar.member_editor.note", "Note")}
                  </span>
                  <textarea
                    value={memberEditorDraft.note}
                    onChange={(e) => onMemberDraftField("note", e.target.value)}
                    rows={3}
                    className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                    placeholder={t(
                      "calendar.member_editor.note_placeholder",
                      "Valgfri intern note"
                    )}
                  />
                </label>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {t("calendar.member_editor.preferences_title", "Præferencer")}
                    </p>
                    <button
                      type="button"
                      onClick={addPreferenceRow}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {t("calendar.member_editor.preferences_add", "Tilføj")}
                    </button>
                  </div>
                  <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {t(
                      "calendar.member_editor.preferences_hint",
                      "Prioriteret rækkefølge. Eksempel: Ferie i uge 42, Ikke arbejde lørdage."
                    )}
                  </p>
                  <div className="space-y-2">
                    {memberPreferences.length === 0 ? (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {t(
                          "calendar.member_editor.preferences_empty",
                          "Ingen præferencer endnu."
                        )}
                      </p>
                    ) : (
                      memberPreferences.map((pref) => (
                        <div key={pref.id} className="grid grid-cols-[72px_1fr_auto] items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={pref.priority}
                            onChange={(e) =>
                              updatePreferenceRow(pref.id, {
                                priority: Number(e.target.value) || 1,
                              })
                            }
                            className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                            aria-label={t(
                              "calendar.member_editor.priority_aria",
                              "Prioritet"
                            )}
                          />
                          <input
                            type="text"
                            value={pref.preferenceText}
                            onChange={(e) =>
                              updatePreferenceRow(pref.id, {
                                preferenceText: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                            placeholder={t(
                              "calendar.member_editor.preference_placeholder",
                              "Skriv præference…"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => removePreferenceRow(pref.id)}
                            className="rounded-lg px-2.5 py-2 text-xs font-medium text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                          >
                            {t("calendar.member_editor.remove", "Fjern")}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
                  <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {t("calendar.member_editor.cv_title", "Upload CV (PDF)")}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                      <FileText className="h-4 w-4" aria-hidden />
                      {t("calendar.member_editor.cv_choose", "Vælg PDF")}
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,application/pdf"
                        disabled={memberEditorBusy || memberCvBusy}
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          e.target.value = "";
                          setMemberCvFile(file);
                        }}
                      />
                    </label>
                    {memberCvFile ? (
                      <span className="text-xs text-zinc-600 dark:text-zinc-300">{memberCvFile.name}</span>
                    ) : null}
                    {memberEditorMode === "edit" && memberHasCv ? (
                      <button
                        type="button"
                        disabled={memberCvBusy || memberEditorBusy}
                        onClick={() => void viewMemberCv()}
                        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        {t(
                          "calendar.member_editor.cv_view_existing",
                          "Se nuværende CV"
                        )}
                      </button>
                    ) : null}
                    {memberCvBusy ? <Loader2 className="h-4 w-4 animate-spin text-zinc-500" /> : null}
                  </div>
                </div>

                {memberEditorMessage ? (
                  <p className="text-sm text-red-600 dark:text-red-400">{memberEditorMessage}</p>
                ) : null}

                <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                  <button
                    type="button"
                    disabled={memberEditorBusy}
                    onClick={closeMemberEditor}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-600"
                  >
                    {t("calendar.member_editor.cancel", "Annuller")}
                  </button>
                  <button
                    type="button"
                    disabled={memberEditorBusy || memberLoadingDetails || memberPreferencesBusy}
                    onClick={() => void saveMemberEditor()}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    {memberEditorBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : memberEditorMode === "create" ? (
                      t("calendar.member_editor.submit_create", "Opret medarbejder")
                    ) : (
                      t("calendar.member_editor.submit_save", "Gem ændringer")
                    )}
                  </button>
                </div>
              </>
            )}
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
