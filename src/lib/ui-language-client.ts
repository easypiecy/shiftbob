import {
  isSupportedUiLanguage,
  UI_LANGUAGE_COOKIE,
} from "@/src/lib/ui-language";

/** Sætter sprog-cookie i browseren med samme attributter som server action (øjeblikkelig effekt før OAuth-redirect). */
export function persistUiLanguageCookieClient(languageCode: string): void {
  if (!isSupportedUiLanguage(languageCode)) return;
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  const parts = [
    `${UI_LANGUAGE_COOKIE}=${encodeURIComponent(languageCode)}`,
    "path=/",
    `max-age=${maxAge}`,
    "samesite=lax",
  ];
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    parts.push("secure");
  }
  document.cookie = parts.join("; ");
}

/** Læs valgt sprog fra login-sprogvælger og skriv cookie (f.eks. lige før OAuth eller efter login). */
export function syncLoginUiLanguageFromPicker(): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById("login-ui-language") as HTMLSelectElement | null;
  const v = el?.value?.trim();
  if (v && isSupportedUiLanguage(v)) persistUiLanguageCookieClient(v);
}
