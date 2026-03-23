/** Dato YYYY-MM-DD i Europe/Copenhagen (til sammenligning med kalenderfelter). */
export function formatDateInCopenhagen(isoDateFromInstant: Date): string {
  return isoDateFromInstant.toLocaleDateString("sv-SE", {
    timeZone: "Europe/Copenhagen",
  });
}

export function todayInCopenhagen(): string {
  return formatDateInCopenhagen(new Date());
}

export function parseYmdLocal(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}

export function addDaysYmd(ymd: string, days: number): string {
  const d = parseYmdLocal(ymd);
  if (Number.isNaN(d.getTime())) return ymd;
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

/** Mandag=0 … søndag=6 (ISO-uge med mandag som dag 0). */
export function weekdayMon0FromYmd(ymd: string): number {
  const d = parseYmdLocal(ymd);
  if (Number.isNaN(d.getTime())) return 0;
  const js = d.getDay(); // 0=søn … 6=lør
  return js === 0 ? 6 : js - 1;
}

export function compareYmd(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
