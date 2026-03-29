type TranslateFn = (key: string, fallback?: string) => string;

function keyOf(value: string | null | undefined): string {
  return (value ?? "").trim().toLocaleLowerCase("da");
}

const SHIFT_KEY_BY_SLUG = new Map<string, string>([
  ["normal", "type.shift.normal"],
  ["open", "type.shift.open"],
  ["urgent", "type.shift.urgent"],
  ["swap", "type.shift.swap"],
  ["sick", "type.shift.sick"],
  ["vacation", "type.shift.vacation"],
  ["child_sick_day", "type.shift.child_sick_day"],
]);

const SHIFT_KEY_BY_LABEL = new Map<string, string>([
  ["normal", "type.shift.normal"],
  ["dag", "type.shift.normal"],
  ["day", "type.shift.normal"],
  ["ledig", "type.shift.open"],
  ["open", "type.shift.open"],
  ["akut", "type.shift.urgent"],
  ["urgent", "type.shift.urgent"],
  ["bytte", "type.shift.swap"],
  ["swap", "type.shift.swap"],
  ["sygdom", "type.shift.sick"],
  ["sick", "type.shift.sick"],
  ["ferie", "type.shift.vacation"],
  ["vacation", "type.shift.vacation"],
  ["barn 1. sygedag", "type.shift.child_sick_day"],
  ["child sick day", "type.shift.child_sick_day"],
]);

const EMPLOYEE_KEY_BY_SLUG = new Map<string, string>([
  ["full_time", "type.employee.full_time"],
  ["part_time", "type.employee.part_time"],
  ["trainee", "type.employee.trainee"],
  ["temp", "type.employee.temp"],
  ["youth_u18", "type.employee.youth_u18"],
]);

const EMPLOYEE_KEY_BY_LABEL = new Map<string, string>([
  ["fuldtid", "type.employee.full_time"],
  ["full time", "type.employee.full_time"],
  ["deltid", "type.employee.part_time"],
  ["part time", "type.employee.part_time"],
  ["elev", "type.employee.trainee"],
  ["trainee", "type.employee.trainee"],
  ["vikar", "type.employee.temp"],
  ["temp", "type.employee.temp"],
  ["ung (under 18)", "type.employee.youth_u18"],
  ["youth (under 18)", "type.employee.youth_u18"],
]);

export function localizeStandardShiftTypeLabel(
  label: string,
  t: TranslateFn,
  slug?: string | null
): string {
  const translationKey =
    (slug ? SHIFT_KEY_BY_SLUG.get(keyOf(slug)) : undefined) ??
    SHIFT_KEY_BY_LABEL.get(keyOf(label));
  return translationKey ? t(translationKey, label) : label;
}

export function localizeStandardEmployeeTypeLabel(
  label: string,
  t: TranslateFn,
  slug?: string | null
): string {
  const translationKey =
    (slug ? EMPLOYEE_KEY_BY_SLUG.get(keyOf(slug)) : undefined) ??
    EMPLOYEE_KEY_BY_LABEL.get(keyOf(label));
  return translationKey ? t(translationKey, label) : label;
}
