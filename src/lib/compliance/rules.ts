import euRulesConfig from "@/config/eu-rules.json";

export type Severity = "ERROR" | "WARNING";

type RuleBase = {
  rule_id: string;
  type:
    | "gap_between_shifts"
    | "weekly_rest"
    | "max_weekly_hours"
    | "max_daily_hours"
    | "max_consecutive_days"
    | "mandatory_break";
  severity: Severity;
  enabled?: boolean;
};

export type GapBetweenShiftsRule = RuleBase & {
  type: "gap_between_shifts";
  min_gap_hours: number;
};

export type WeeklyRestRule = RuleBase & {
  type: "weekly_rest";
  window_days?: number;
  min_consecutive_hours: number;
};

export type MaxWeeklyHoursRule = RuleBase & {
  type: "max_weekly_hours";
  average_window_weeks?: number;
  max_hours: number;
};

export type MaxDailyHoursRule = RuleBase & {
  type: "max_daily_hours";
  max_hours: number;
};

export type MaxConsecutiveDaysRule = RuleBase & {
  type: "max_consecutive_days";
  max_days: number;
};

export type MandatoryBreakRule = RuleBase & {
  type: "mandatory_break";
  shift_length_threshold_hours: number;
  min_break_minutes: number;
};

export type ComplianceRule =
  | GapBetweenShiftsRule
  | WeeklyRestRule
  | MaxWeeklyHoursRule
  | MaxDailyHoursRule
  | MaxConsecutiveDaysRule
  | MandatoryBreakRule;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asPositiveNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return null;
  return value;
}

function parseRule(value: unknown): ComplianceRule | null {
  if (!isObject(value)) return null;
  const rule_id = typeof value.rule_id === "string" ? value.rule_id.trim() : "";
  const type = typeof value.type === "string" ? value.type.trim() : "";
  const severity = value.severity === "WARNING" ? "WARNING" : value.severity === "ERROR" ? "ERROR" : null;
  const enabled = value.enabled === false ? false : true;
  if (!rule_id || !severity) return null;

  if (type === "gap_between_shifts") {
    const min_gap_hours = asPositiveNumber(value.min_gap_hours);
    if (min_gap_hours == null) return null;
    return { rule_id, type, severity, enabled, min_gap_hours };
  }
  if (type === "weekly_rest") {
    const min_consecutive_hours = asPositiveNumber(value.min_consecutive_hours);
    if (min_consecutive_hours == null) return null;
    const window_days = asPositiveNumber(value.window_days) ?? 7;
    return { rule_id, type, severity, enabled, min_consecutive_hours, window_days };
  }
  if (type === "max_weekly_hours") {
    const max_hours = asPositiveNumber(value.max_hours);
    if (max_hours == null) return null;
    const average_window_weeks = asPositiveNumber(value.average_window_weeks) ?? 17;
    return { rule_id, type, severity, enabled, max_hours, average_window_weeks };
  }
  if (type === "max_daily_hours") {
    const max_hours = asPositiveNumber(value.max_hours);
    if (max_hours == null) return null;
    return { rule_id, type, severity, enabled, max_hours };
  }
  if (type === "max_consecutive_days") {
    const max_days = asPositiveNumber(value.max_days);
    if (max_days == null) return null;
    return { rule_id, type, severity, enabled, max_days: Math.trunc(max_days) };
  }
  if (type === "mandatory_break") {
    const shift_length_threshold_hours = asPositiveNumber(value.shift_length_threshold_hours);
    const min_break_minutes = asPositiveNumber(value.min_break_minutes);
    if (shift_length_threshold_hours == null || min_break_minutes == null) return null;
    return {
      rule_id,
      type,
      severity,
      enabled,
      shift_length_threshold_hours,
      min_break_minutes: Math.trunc(min_break_minutes),
    };
  }
  return null;
}

export function normalizeComplianceRules(raw: unknown): ComplianceRule[] {
  if (!Array.isArray(raw)) return [];
  const parsed = raw
    .map((value) => parseRule(value))
    .filter((rule): rule is ComplianceRule => rule !== null);
  const seen = new Set<string>();
  const unique: ComplianceRule[] = [];
  for (const rule of parsed) {
    if (seen.has(rule.rule_id)) continue;
    seen.add(rule.rule_id);
    unique.push(rule);
  }
  return unique;
}

export function getConfigDefaultComplianceRules(): ComplianceRule[] {
  const raw = isObject(euRulesConfig) ? euRulesConfig.rules : null;
  return normalizeComplianceRules(raw);
}

export function getConfigActiveComplianceRules(): ComplianceRule[] {
  return getConfigDefaultComplianceRules().filter((rule) => rule.enabled !== false);
}

export function serializeComplianceRules(rules: ComplianceRule[]): unknown[] {
  return rules.map((rule) => ({ ...rule }));
}

export function describeComplianceRule(rule: ComplianceRule): string {
  if (rule.type === "gap_between_shifts") {
    return `Min. gap: ${rule.min_gap_hours}h`;
  }
  if (rule.type === "weekly_rest") {
    return `Window: ${rule.window_days ?? 7} dage, min. sammenhaengende hvile: ${rule.min_consecutive_hours}h`;
  }
  if (rule.type === "max_weekly_hours") {
    return `Maks. gennemsnit: ${rule.max_hours}h over ${rule.average_window_weeks ?? 17} uger`;
  }
  if (rule.type === "max_daily_hours") {
    return `Maks. timer pr. dag: ${rule.max_hours}h`;
  }
  if (rule.type === "max_consecutive_days") {
    return `Maks. sammenhaengende arbejdsdage: ${rule.max_days}`;
  }
  return `Vagtlaengde >= ${rule.shift_length_threshold_hours}h kraever min. ${rule.min_break_minutes} min pause`;
}
