/** 0 = mandag … 6 = søndag */
export type SeasonWeekdayKey = "0" | "1" | "2" | "3" | "4" | "5" | "6";

export const SEASON_WEEKDAY_LABELS: Record<SeasonWeekdayKey, string> = {
  "0": "Mandag",
  "1": "Tirsdag",
  "2": "Onsdag",
  "3": "Torsdag",
  "4": "Fredag",
  "5": "Lørdag",
  "6": "Søndag",
};

/** Mandag–søndag (0–6), samme nøgler som `calendar.weekday.*` i ui_translations */
export const SEASON_WEEKDAY_KEYS = Object.keys(
  SEASON_WEEKDAY_LABELS
) as SeasonWeekdayKey[];

export type SeasonDaySlot = {
  /** Min. antal medarbejdere med vagt denne ugedag */
  minEmployees?: number;
  /** Medarbejdertype-id → forventet antal */
  employeeTypeCounts?: Record<string, number>;
  /** Vagttype-id → forventet antal vagter */
  shiftTypeCounts?: Record<string, number>;
};

export type SeasonPeriod = {
  id: string;
  name: string;
  dateFrom: string;
  dateTo: string;
  weekdays: Partial<Record<SeasonWeekdayKey, SeasonDaySlot>>;
};

export type SeasonTemplatePayload = {
  periods: SeasonPeriod[];
};

function newPeriodId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function emptySeasonTemplate(): SeasonTemplatePayload {
  return { periods: [] };
}

export function createEmptySeasonPeriod(name = "New period"): SeasonPeriod {
  return {
    id: newPeriodId(),
    name,
    dateFrom: "",
    dateTo: "",
    weekdays: {},
  };
}

export function normalizeSeasonTemplate(raw: unknown): SeasonTemplatePayload {
  if (!raw || typeof raw !== "object") {
    return emptySeasonTemplate();
  }
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.periods)) {
    return emptySeasonTemplate();
  }
  const periods: SeasonPeriod[] = [];
  for (const p of o.periods) {
    if (!p || typeof p !== "object") continue;
    const r = p as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id : newPeriodId();
    const name = typeof r.name === "string" ? r.name : "Periode";
    const dateFrom = typeof r.dateFrom === "string" ? r.dateFrom : "";
    const dateTo = typeof r.dateTo === "string" ? r.dateTo : "";
    const weekdays: Partial<Record<SeasonWeekdayKey, SeasonDaySlot>> = {};
    if (r.weekdays && typeof r.weekdays === "object") {
      for (const k of Object.keys(r.weekdays)) {
        if (!/^([0-6])$/.test(k)) continue;
        const wk = k as SeasonWeekdayKey;
        const slot = (r.weekdays as Record<string, unknown>)[k];
        if (!slot || typeof slot !== "object") continue;
        const s = slot as Record<string, unknown>;
        weekdays[wk] = {
          minEmployees:
            typeof s.minEmployees === "number" ? s.minEmployees : undefined,
          employeeTypeCounts:
            s.employeeTypeCounts &&
            typeof s.employeeTypeCounts === "object" &&
            !Array.isArray(s.employeeTypeCounts)
              ? (s.employeeTypeCounts as Record<string, number>)
              : undefined,
          shiftTypeCounts:
            s.shiftTypeCounts &&
            typeof s.shiftTypeCounts === "object" &&
            !Array.isArray(s.shiftTypeCounts)
              ? (s.shiftTypeCounts as Record<string, number>)
              : undefined,
        };
      }
    }
    periods.push({ id, name, dateFrom, dateTo, weekdays });
  }
  return { periods };
}
