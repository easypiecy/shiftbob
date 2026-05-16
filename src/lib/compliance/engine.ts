import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  differenceInMinutes,
  endOfDay,
  format,
  isAfter,
  isBefore,
  min as minDate,
  startOfDay,
  startOfWeek,
} from "date-fns";
import {
  getConfigActiveComplianceRules,
  type ComplianceRule,
  type GapBetweenShiftsRule,
  type MandatoryBreakRule,
  type MaxConsecutiveDaysRule,
  type MaxDailyHoursRule,
  type MaxWeeklyHoursRule,
  type Severity,
  type WeeklyRestRule,
} from "@/src/lib/compliance/rules";

export type EuViolation = {
  rule_id: string;
  employee_id: string;
  date: string;
  severity: Severity;
  message: string;
};

export type ComplianceInputShift = {
  employee_id: string | number;
  starts_at: string | Date;
  ends_at: string | Date;
  shift_code?: string | null;
};

export type ShiftTypeDictionary = Record<
  string,
  {
    break_minutes?: number | null;
  }
>;

type NormalizedShift = {
  employee_id: string;
  startsAt: Date;
  endsAt: Date;
  shift_code: string | null;
};

function asDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

function normalizeShift(shift: ComplianceInputShift): NormalizedShift | null {
  const startsAt = asDate(shift.starts_at);
  const rawEndsAt = asDate(shift.ends_at);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(rawEndsAt.getTime())) {
    return null;
  }
  const endsAt = isAfter(rawEndsAt, startsAt) ? rawEndsAt : addDays(rawEndsAt, 1);
  return {
    employee_id: String(shift.employee_id),
    startsAt,
    endsAt,
    shift_code: shift.shift_code?.trim().toUpperCase() || null,
  };
}

function uniqueViolations(items: EuViolation[]): EuViolation[] {
  const seen = new Set<string>();
  const out: EuViolation[] = [];
  for (const item of items) {
    const key = `${item.rule_id}|${item.employee_id}|${item.date}|${item.severity}|${item.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function hoursBetween(start: Date, end: Date): number {
  return Math.max(0, differenceInMinutes(end, start) / 60);
}

function splitShiftByDay(shift: NormalizedShift): Array<{ day: Date; start: Date; end: Date }> {
  const chunks: Array<{ day: Date; start: Date; end: Date }> = [];
  let cursor = shift.startsAt;
  while (isBefore(cursor, shift.endsAt)) {
    const nextDayStart = addDays(startOfDay(cursor), 1);
    const partEnd = minDate([nextDayStart, shift.endsAt]);
    chunks.push({ day: startOfDay(cursor), start: cursor, end: partEnd });
    cursor = partEnd;
  }
  return chunks;
}

function mergeIntervals(
  intervals: Array<{ start: Date; end: Date }>
): Array<{ start: Date; end: Date }> {
  if (intervals.length <= 1) return intervals;
  const sorted = [...intervals].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: Array<{ start: Date; end: Date }> = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];
    if (!isAfter(current.start, last.end)) {
      if (isAfter(current.end, last.end)) {
        last.end = current.end;
      }
      continue;
    }
    merged.push({ ...current });
  }
  return merged;
}

function applyGapBetweenShiftsRule(
  rule: GapBetweenShiftsRule,
  employeeId: string,
  shifts: NormalizedShift[]
): EuViolation[] {
  const violations: EuViolation[] = [];
  for (let i = 1; i < shifts.length; i++) {
    const prev = shifts[i - 1];
    const curr = shifts[i];
    const gapHours = hoursBetween(prev.endsAt, curr.startsAt);
    if (gapHours >= rule.min_gap_hours) continue;
    violations.push({
      rule_id: rule.rule_id,
      employee_id: employeeId,
      date: format(curr.startsAt, "yyyy-MM-dd"),
      severity: rule.severity,
      message: `Gap between shifts is ${gapHours.toFixed(1)}h, minimum is ${rule.min_gap_hours}h.`,
    });
  }
  return violations;
}

function maxGapInWindow(
  intervals: Array<{ start: Date; end: Date }>,
  windowStart: Date,
  windowEnd: Date
): number {
  if (intervals.length === 0) {
    return hoursBetween(windowStart, windowEnd);
  }
  const merged = mergeIntervals(intervals);
  let largestGap = hoursBetween(windowStart, merged[0].start);
  for (let i = 1; i < merged.length; i++) {
    largestGap = Math.max(largestGap, hoursBetween(merged[i - 1].end, merged[i].start));
  }
  largestGap = Math.max(largestGap, hoursBetween(merged[merged.length - 1].end, windowEnd));
  return largestGap;
}

function applyWeeklyRestRule(
  rule: WeeklyRestRule,
  employeeId: string,
  shifts: NormalizedShift[]
): EuViolation[] {
  if (shifts.length === 0) return [];
  const violations: EuViolation[] = [];
  const windowDays = rule.window_days ?? 7;
  const windowStartFloor = startOfDay(shifts[0].startsAt);
  const windowEndCeil = endOfDay(shifts[shifts.length - 1].endsAt);
  for (
    let cursor = windowStartFloor;
    !isAfter(addDays(cursor, windowDays), addDays(windowEndCeil, 1));
    cursor = addDays(cursor, 1)
  ) {
    const windowStart = cursor;
    const windowEnd = addDays(windowStart, windowDays);
    const overlaps = shifts
      .filter((shift) => isBefore(shift.startsAt, windowEnd) && isAfter(shift.endsAt, windowStart))
      .map((shift) => ({
        start: isBefore(shift.startsAt, windowStart) ? windowStart : shift.startsAt,
        end: isAfter(shift.endsAt, windowEnd) ? windowEnd : shift.endsAt,
      }));
    const largestGap = maxGapInWindow(overlaps, windowStart, windowEnd);
    if (largestGap >= rule.min_consecutive_hours) continue;
    violations.push({
      rule_id: rule.rule_id,
      employee_id: employeeId,
      date: format(windowStart, "yyyy-MM-dd"),
      severity: rule.severity,
      message:
        `No rest period >= ${rule.min_consecutive_hours}h found in ` +
        `${windowDays}-day window starting ${format(windowStart, "yyyy-MM-dd")}.`,
    });
  }
  return violations;
}

function allocateShiftHoursByWeek(shift: NormalizedShift): Map<string, number> {
  const hoursByWeek = new Map<string, number>();
  let cursor = shift.startsAt;
  while (isBefore(cursor, shift.endsAt)) {
    const nextWeekStart = addWeeks(startOfWeek(cursor, { weekStartsOn: 1 }), 1);
    const partEnd = minDate([nextWeekStart, shift.endsAt]);
    const weekStart = startOfWeek(cursor, { weekStartsOn: 1 });
    const key = format(weekStart, "yyyy-MM-dd");
    const current = hoursByWeek.get(key) ?? 0;
    hoursByWeek.set(key, current + hoursBetween(cursor, partEnd));
    cursor = partEnd;
  }
  return hoursByWeek;
}

function applyMaxWeeklyHoursRule(
  rule: MaxWeeklyHoursRule,
  employeeId: string,
  shifts: NormalizedShift[]
): EuViolation[] {
  if (shifts.length === 0) return [];
  const violations: EuViolation[] = [];
  const windowWeeks = rule.average_window_weeks ?? 17;
  const weeklyHours = new Map<string, number>();
  for (const shift of shifts) {
    const perShift = allocateShiftHoursByWeek(shift);
    for (const [weekKey, hours] of perShift) {
      weeklyHours.set(weekKey, (weeklyHours.get(weekKey) ?? 0) + hours);
    }
  }
  const earliestWeek = startOfWeek(shifts[0].startsAt, { weekStartsOn: 1 });
  const latestWeek = startOfWeek(shifts[shifts.length - 1].startsAt, { weekStartsOn: 1 });
  for (let week = earliestWeek; !isAfter(week, latestWeek); week = addWeeks(week, 1)) {
    let totalHours = 0;
    for (let i = 0; i < windowWeeks; i++) {
      const weekKey = format(addWeeks(week, -i), "yyyy-MM-dd");
      totalHours += weeklyHours.get(weekKey) ?? 0;
    }
    const average = totalHours / windowWeeks;
    if (average <= rule.max_hours) continue;
    violations.push({
      rule_id: rule.rule_id,
      employee_id: employeeId,
      date: format(week, "yyyy-MM-dd"),
      severity: rule.severity,
      message:
        `Weekly average is ${average.toFixed(1)}h across ${windowWeeks} weeks, ` +
        `maximum is ${rule.max_hours}h.`,
    });
  }
  return violations;
}

function applyMaxDailyHoursRule(
  rule: MaxDailyHoursRule,
  employeeId: string,
  shifts: NormalizedShift[]
): EuViolation[] {
  const byDay = new Map<string, Array<{ start: Date; end: Date }>>();
  for (const shift of shifts) {
    const chunks = splitShiftByDay(shift);
    for (const chunk of chunks) {
      const dayKey = format(chunk.day, "yyyy-MM-dd");
      const list = byDay.get(dayKey) ?? [];
      list.push({ start: chunk.start, end: chunk.end });
      byDay.set(dayKey, list);
    }
  }
  const violations: EuViolation[] = [];
  for (const [dayKey, intervals] of byDay) {
    const merged = mergeIntervals(intervals);
    const worked = merged.reduce((sum, interval) => sum + hoursBetween(interval.start, interval.end), 0);
    if (worked <= rule.max_hours) continue;
    violations.push({
      rule_id: rule.rule_id,
      employee_id: employeeId,
      date: dayKey,
      severity: rule.severity,
      message: `Worked ${worked.toFixed(1)}h on ${dayKey}, maximum is ${rule.max_hours}h.`,
    });
  }
  return violations;
}

function applyMaxConsecutiveDaysRule(
  rule: MaxConsecutiveDaysRule,
  employeeId: string,
  shifts: NormalizedShift[]
): EuViolation[] {
  const dayKeys = new Set<string>();
  for (const shift of shifts) {
    for (const chunk of splitShiftByDay(shift)) {
      dayKeys.add(format(chunk.day, "yyyy-MM-dd"));
    }
  }
  const days = [...dayKeys].sort();
  const violations: EuViolation[] = [];
  let streak = 0;
  let previous: Date | null = null;
  for (const dayKey of days) {
    const day = new Date(`${dayKey}T00:00:00`);
    if (previous && differenceInCalendarDays(day, previous) === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
    previous = day;
    if (streak <= rule.max_days) continue;
    violations.push({
      rule_id: rule.rule_id,
      employee_id: employeeId,
      date: dayKey,
      severity: rule.severity,
      message: `Worked ${streak} consecutive days, maximum is ${rule.max_days}.`,
    });
  }
  return violations;
}

function applyMandatoryBreakRule(
  rule: MandatoryBreakRule,
  employeeId: string,
  shifts: NormalizedShift[],
  shiftTypeDictionary: ShiftTypeDictionary
): EuViolation[] {
  const violations: EuViolation[] = [];
  for (const shift of shifts) {
    if (!shift.shift_code) continue;
    const durationHours = hoursBetween(shift.startsAt, shift.endsAt);
    if (durationHours < rule.shift_length_threshold_hours) continue;
    const shiftType = shiftTypeDictionary[shift.shift_code];
    const breakMinutes = shiftType?.break_minutes ?? 0;
    if (breakMinutes >= rule.min_break_minutes) continue;
    violations.push({
      rule_id: rule.rule_id,
      employee_id: employeeId,
      date: format(shift.startsAt, "yyyy-MM-dd"),
      severity: rule.severity,
      message:
        `Shift ${shift.shift_code} is ${durationHours.toFixed(1)}h with ${breakMinutes} min break, ` +
        `minimum is ${rule.min_break_minutes} min.`,
    });
  }
  return violations;
}

export function runComplianceEngine(
  newShifts: ComplianceInputShift[],
  historicalShifts: ComplianceInputShift[],
  shiftTypesDictionary: ShiftTypeDictionary,
  rulesOverride?: ComplianceRule[]
): EuViolation[] {
  const combined = [...historicalShifts, ...newShifts]
    .map(normalizeShift)
    .filter((item): item is NormalizedShift => item !== null);

  const byEmployee = new Map<string, NormalizedShift[]>();
  for (const shift of combined) {
    const list = byEmployee.get(shift.employee_id) ?? [];
    list.push(shift);
    byEmployee.set(shift.employee_id, list);
  }
  for (const shifts of byEmployee.values()) {
    shifts.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  }

  const rules = rulesOverride ?? getConfigActiveComplianceRules();
  const violations: EuViolation[] = [];
  for (const [employeeId, shifts] of byEmployee.entries()) {
    for (const rule of rules) {
      if (rule.type === "gap_between_shifts") {
        violations.push(...applyGapBetweenShiftsRule(rule, employeeId, shifts));
        continue;
      }
      if (rule.type === "weekly_rest") {
        violations.push(...applyWeeklyRestRule(rule, employeeId, shifts));
        continue;
      }
      if (rule.type === "max_weekly_hours") {
        violations.push(...applyMaxWeeklyHoursRule(rule, employeeId, shifts));
        continue;
      }
      if (rule.type === "max_daily_hours") {
        violations.push(...applyMaxDailyHoursRule(rule, employeeId, shifts));
        continue;
      }
      if (rule.type === "max_consecutive_days") {
        violations.push(...applyMaxConsecutiveDaysRule(rule, employeeId, shifts));
        continue;
      }
      if (rule.type === "mandatory_break") {
        violations.push(
          ...applyMandatoryBreakRule(rule, employeeId, shifts, shiftTypesDictionary)
        );
      }
    }
  }
  return uniqueViolations(violations);
}
