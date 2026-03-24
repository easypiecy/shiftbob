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
      return "repeating-linear-gradient(135deg, rgba(255,255,255,0.38) 0px, rgba(255,255,255,0.38) 5px, transparent 5px, transparent 11px)";
    case "dots":
      return "radial-gradient(rgba(0,0,0,0.18) 1.2px, transparent 1.5px)";
    case "grid":
      return "linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px)";
    case "diagonal":
      return "repeating-linear-gradient(-45deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 3px, transparent 3px, transparent 9px)";
    default:
      return null;
  }
}

export function shiftCalendarCellStyle(args: {
  shiftTypeColor: string | null | undefined;
  employeePattern: string | null | undefined;
}): CSSProperties {
  const color = normalizeHex(args.shiftTypeColor ?? undefined);
  const raw = args.employeePattern ?? "none";
  const pattern: EmployeeTypePattern = isEmployeeTypePattern(raw) ? raw : "none";
  const layer = patternLayer(pattern);

  const style: CSSProperties = {
    backgroundColor: color,
  };

  if (pattern === "dots") {
    style.backgroundImage = layer ?? undefined;
    style.backgroundSize = "9px 9px";
    style.backgroundColor = color;
    return style;
  }

  if (pattern === "grid") {
    style.backgroundImage = layer ?? undefined;
    style.backgroundSize = "10px 10px, 10px 10px";
    style.backgroundColor = color;
    return style;
  }

  if (layer) {
    style.backgroundImage = `${layer}, linear-gradient(${color}, ${color})`;
    style.backgroundBlendMode = "normal";
  }

  return style;
}
