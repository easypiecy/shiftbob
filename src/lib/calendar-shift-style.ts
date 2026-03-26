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
      return "repeating-linear-gradient(135deg, rgba(0,0,0,0.32) 0px, rgba(0,0,0,0.32) 4px, rgba(255,255,255,0.22) 4px, rgba(255,255,255,0.22) 8px)";
    case "dots":
      return "radial-gradient(rgba(0,0,0,0.45) 1.45px, transparent 1.6px), radial-gradient(rgba(255,255,255,0.26) 0.9px, transparent 1px)";
    case "grid":
      return "linear-gradient(rgba(0,0,0,0.32) 1.2px, transparent 1.2px), linear-gradient(90deg, rgba(0,0,0,0.32) 1.2px, transparent 1.2px), linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)";
    case "diagonal":
      return "repeating-linear-gradient(-45deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 7px)";
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
    style.backgroundSize = "10px 10px, 10px 10px";
    style.backgroundPosition = "0 0, 5px 5px";
    style.backgroundColor = color;
    return style;
  }

  if (pattern === "grid") {
    style.backgroundImage = layer ?? undefined;
    style.backgroundSize = "12px 12px, 12px 12px, 6px 6px, 6px 6px";
    style.backgroundColor = color;
    return style;
  }

  if (layer) {
    style.backgroundImage = `${layer}, linear-gradient(${color}, ${color})`;
    style.backgroundBlendMode = "normal";
  }

  return style;
}
