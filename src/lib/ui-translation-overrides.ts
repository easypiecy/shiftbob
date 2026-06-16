/**
 * Code-side overrides applied after DB fetch.
 * Use when a patch is merged but Supabase may not yet be updated.
 */
export const UI_TRANSLATION_OVERRIDES: Record<string, Record<string, string>> = {
  da: {
    "landing.plans.header.title": "Priser",
  },
  "en-US": {
    "landing.plans.header.title": "Pricing",
  },
  "en-IE": {
    "landing.plans.header.title": "Pricing",
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
