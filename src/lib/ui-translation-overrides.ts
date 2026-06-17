/**
 * Code-side overrides applied after DB fetch.
 * Use when a patch is merged but Supabase may not yet be updated.
 */
export const UI_TRANSLATION_OVERRIDES: Record<string, Record<string, string>> = {
  "en-US": {
    "landing.plans.header.title": "Prices",
  },
  "en-IE": {
    "landing.plans.header.title": "Prices",
  },
  da: {
    "landing.plans.header.title": "Priser",
  },
  de: {
    "landing.plans.header.title": "Preise",
  },
  "de-AT": {
    "landing.plans.header.title": "Preise",
  },
  nl: {
    "landing.plans.header.title": "Prijzen",
  },
  "nl-BE": {
    "landing.plans.header.title": "Prijzen",
  },
  sv: {
    "landing.plans.header.title": "Priser",
  },
  fi: {
    "landing.plans.header.title": "Hinnat",
  },
  fr: {
    "landing.plans.header.title": "Tarifs",
  },
  es: {
    "landing.plans.header.title": "Precios",
  },
  it: {
    "landing.plans.header.title": "Prezzi",
  },
  pt: {
    "landing.plans.header.title": "Preços",
  },
  pl: {
    "landing.plans.header.title": "Ceny",
  },
  cs: {
    "landing.plans.header.title": "Ceník",
  },
  sk: {
    "landing.plans.header.title": "Ceny",
  },
  hu: {
    "landing.plans.header.title": "Árak",
  },
  ro: {
    "landing.plans.header.title": "Prețuri",
  },
  bg: {
    "landing.plans.header.title": "Цени",
  },
  hr: {
    "landing.plans.header.title": "Cijene",
  },
  sl: {
    "landing.plans.header.title": "Cene",
  },
  et: {
    "landing.plans.header.title": "Hinnad",
  },
  lv: {
    "landing.plans.header.title": "Cenas",
  },
  lt: {
    "landing.plans.header.title": "Kainos",
  },
  el: {
    "landing.plans.header.title": "Τιμές",
  },
  lb: {
    "landing.plans.header.title": "Präisser",
  },
  mt: {
    "landing.plans.header.title": "Prezzijiet",
  },
};

export function applyUiTranslationOverrides(
  map: Record<string, string>,
  languageCode: string
): Record<string, string> {
  const overrides = UI_TRANSLATION_OVERRIDES[languageCode];
  if (!overrides) return map;
  return { ...map, ...overrides };
}
