import type { CSSProperties } from "react";

export const EMPLOYEE_TYPE_PATTERNS = [
  "none",
  "stripes",
  "dots",
  "grid",
  "diagonal",
] as const;

export type EmployeeTypePattern = (typeof EMPLOYEE_TYPE_PATTERNS)[number];

export function isEmployeeTypePattern(s: string): s is EmployeeTypePattern {
  return (EMPLOYEE_TYPE_PATTERNS as readonly string[]).includes(s);
}

const DEFAULT_SHIFT_COLOR = "#94a3b8";

function normalizeHex(color: string | null | undefined): string {
  const c = color?.trim();
  if (!c) return DEFAULT_SHIFT_COLOR;
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  return DEFAULT_SHIFT_COLOR;
}

/** Halvgennemsigtigt mønster oven på vagtfarve (farve = shift type, mønster = medarbejdertype). */
function patternLayer(pattern: EmployeeTypePattern): string | null {
  switch (pattern) {
    case "none":
      return null;
    case "stripes":
      return "repeating-linear-gradient(135deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 4px, rgba(255,255,255,0.14) 4px, rgba(255,255,255,0.14) 8px)";
    case "dots":
      return "radial-gradient(rgba(0,0,0,0.22) 1.45px, transparent 1.6px), radial-gradient(rgba(255,255,255,0.16) 0.9px, transparent 1px)";
    case "grid":
      return "linear-gradient(rgba(0,0,0,0.2) 1.2px, transparent 1.2px), linear-gradient(90deg, rgba(0,0,0,0.2) 1.2px, transparent 1.2px), linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)";
    case "diagonal":
      return "repeating-linear-gradient(-45deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 3px, rgba(255,255,255,0.12) 3px, rgba(255,255,255,0.12) 7px)";
    default:
      return null;
  }
}

export function shiftCalendarCellStyle(args: {
  shiftTypeColor: string | null | undefined;
  employeePattern: string | null | undefined;
  /** Dagsbaggrund: helligdag slår weekend. */
  ambient?: "holiday" | "weekend" | null;
}): CSSProperties {
  const color = normalizeHex(args.shiftTypeColor ?? undefined);
  const raw = args.employeePattern ?? "none";
  const pattern: EmployeeTypePattern = isEmployeeTypePattern(raw) ? raw : "none";
  const layer = patternLayer(pattern);

  const style: CSSProperties = {
    backgroundColor: color,
  };

  if (!layer) {
    return style;
  }

  style.backgroundImage = layer;
  if (pattern === "dots") {
    style.backgroundSize = "10px 10px, 10px 10px";
    style.backgroundPosition = "0 0, 5px 5px";
  } else if (pattern === "grid") {
    style.backgroundSize = "12px 12px, 12px 12px, 6px 6px, 6px 6px";
  }

  return style;
}
