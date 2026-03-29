/** Definitioner som fra `country_public_holidays` (uden id/stable_code). */
export type CalendarPublicHolidayDef = {
  holiday_rule: "fixed" | "easter_offset" | "nth_weekday" | "fixed_offset";
  month: number | null;
  day: number | null;
  easter_offset_days: number | null;
  display_name: string;
};

function dayKeyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysLocal(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  nth: number
): Date | null {
  if (month < 1 || month > 12) return null;
  if (weekday < 0 || weekday > 6) return null;
  if (nth === 0 || nth < -1 || nth > 5) return null;

  if (nth === -1) {
    const end = new Date(year, month, 0, 0, 0, 0, 0);
    const diff = (end.getDay() - weekday + 7) % 7;
    end.setDate(end.getDate() - diff);
    return end;
  }

  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const diff = (weekday - start.getDay() + 7) % 7;
  const day = 1 + diff + (nth - 1) * 7;
  const result = new Date(year, month - 1, day, 0, 0, 0, 0);
  if (result.getMonth() !== month - 1) return null;
  return result;
}

/** Lørdag eller søndag i lokal kalender. */
export function isWeekendLocal(d: Date): boolean {
  const wd = d.getDay();
  return wd === 0 || wd === 6;
}

/** Vestlig påskesøndag (algoritme: Meeus/Jones/Butcher), midnat lokal tid. */
export function easterSundayWestern(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Alle dato-nøgler (YYYY-MM-DD) for helligdage i de angivne år.
 * Samme dag kan have flere navne (bevares i `sort_order`-rækkefølge fra input).
 */
export function buildHolidayNamesByDayKey(
  defs: CalendarPublicHolidayDef[],
  years: Iterable<number>
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const yearList = [...new Set(years)];
  for (const year of yearList) {
    const easter = easterSundayWestern(year);
    for (const def of defs) {
      let inst: Date | null = null;
      if (def.holiday_rule === "fixed" && def.month != null && def.day != null) {
        inst = new Date(year, def.month - 1, def.day, 0, 0, 0, 0);
      } else if (
        def.holiday_rule === "easter_offset" &&
        def.easter_offset_days != null
      ) {
        inst = addDaysLocal(easter, def.easter_offset_days);
      } else if (
        def.holiday_rule === "nth_weekday" &&
        def.month != null &&
        def.day != null &&
        def.easter_offset_days != null
      ) {
        // `day` => weekday (0=søndag .. 6=lørdag), `easter_offset_days` => nth (1..5 or -1=last)
        inst = nthWeekdayOfMonth(year, def.month, def.day, def.easter_offset_days);
      } else if (
        def.holiday_rule === "fixed_offset" &&
        def.month != null &&
        def.day != null &&
        def.easter_offset_days != null
      ) {
        // Fast dato + offset i dage (bruges fx til observed-regler)
        const fixed = new Date(year, def.month - 1, def.day, 0, 0, 0, 0);
        inst = addDaysLocal(fixed, def.easter_offset_days);
      }
      if (!inst) continue;
      const key = dayKeyLocal(inst);
      const name = def.display_name.trim();
      if (!name) continue;
      const arr = map.get(key) ?? [];
      if (!arr.includes(name)) arr.push(name);
      map.set(key, arr);
    }
  }
  return map;
}

export type DayGridAmbient = "holiday" | "weekend" | "none";

export function dayGridAmbient(
  dayKey: string,
  holidayNames: Map<string, string[]>,
  isWeekend: boolean
): DayGridAmbient {
  const names = holidayNames.get(dayKey);
  if (names && names.length > 0) return "holiday";
  if (isWeekend) return "weekend";
  return "none";
}

export function holidayLineForDay(dayKey: string, holidayNames: Map<string, string[]>): string {
  const names = holidayNames.get(dayKey);
  if (!names?.length) return "";
  return names.join(" · ");
}
