/** Cookie-navn — delt mellem server actions, RSC og klient (OAuth m.m.). */
export const UI_LANGUAGE_COOKIE = "ui_language";

/**
 * Sprog understøttet af `public.languages` / UI-oversættelser (samme koder som i databasen).
 */
export const SUPPORTED_UI_LANGUAGE_CODES = [
  "en-US",
  "en-IE",
  "de",
  "de-AT",
  "nl",
  "nl-BE",
  "bg",
  "hr",
  "cs",
  "da",
  "et",
  "fi",
  "fr",
  "el",
  "hu",
  "it",
  "lv",
  "lt",
  "lb",
  "mt",
  "pl",
  "pt",
  "ro",
  "sk",
  "sl",
  "es",
  "sv",
] as const;

export type UiLanguageCode = (typeof SUPPORTED_UI_LANGUAGE_CODES)[number];

const SUPPORTED = new Set<string>(SUPPORTED_UI_LANGUAGE_CODES);

export function isSupportedUiLanguage(code: string): code is UiLanguageCode {
  return SUPPORTED.has(code);
}

/** Vist navn i sprogvælger (engelske navne fra DB). */
export const UI_LANGUAGE_LABELS: Record<string, string> = {
  "en-US": "English (United States)",
  "en-IE": "English (Ireland)",
  de: "German",
  "de-AT": "German (Austria)",
  nl: "Dutch",
  "nl-BE": "Dutch (Belgium)",
  bg: "Bulgarian",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  et: "Estonian",
  fi: "Finnish",
  fr: "French",
  el: "Greek",
  hu: "Hungarian",
  it: "Italian",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mt: "Maltese",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  sk: "Slovak",
  sl: "Slovenian",
  es: "Spanish",
  sv: "Swedish",
};

/**
 * Vælg første understøttede sprog fra Accept-Language.
 * Ukendte sprog → en-US (produktkrav).
 */
export function resolveLanguageFromAcceptLanguage(
  header: string | null
): string {
  if (!header?.trim()) return "en-US";

  const parts = header.split(",").map((part) => {
    const [tag, ...params] = part.trim().split(";");
    let q = 1;
    for (const p of params) {
      const s = p.trim();
      if (s.startsWith("q=")) {
        const n = parseFloat(s.slice(2));
        if (!Number.isNaN(n)) q = n;
      }
    }
    return { tag: tag.trim().replace(/_/g, "-"), q };
  });
  parts.sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    for (const code of SUPPORTED_UI_LANGUAGE_CODES) {
      if (code.toLowerCase() === tag.toLowerCase()) return code;
    }
    const primary = tag.split("-")[0]?.toLowerCase();
    if (!primary) continue;
    if (primary === "en") return "en-US";
    for (const code of SUPPORTED_UI_LANGUAGE_CODES) {
      if (code.toLowerCase() === primary) return code;
    }
  }
  return "en-US";
}
