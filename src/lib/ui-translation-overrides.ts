/**
 * Code-side overrides applied after DB fetch.
 * Use when a patch is merged but Supabase may not yet be updated.
 */
export const UI_TRANSLATION_OVERRIDES: Record<string, Record<string, string>> = {
  da: {
    "landing.plans.header.title": "Priser",
    "landing4.guarantee.title": "Fuld tilfredshed eller pengene tilbage",
    "landing4.guarantee.subtitle":
      "Vi står bag ShiftBob — prøv uden risiko og få pengene tilbage, hvis du ikke er tilfreds.",
    "landing4.guarantee.aria": "Tilfredshedsgaranti",
  },
  "en-US": {
    "landing.plans.header.title": "Pricing",
    "landing4.guarantee.title": "Full satisfaction or your money back",
    "landing4.guarantee.subtitle":
      "We stand behind ShiftBob — try it risk-free and get your money back if you are not satisfied.",
    "landing4.guarantee.aria": "Satisfaction guarantee",
  },
  "en-IE": {
    "landing.plans.header.title": "Pricing",
    "landing4.guarantee.title": "Full satisfaction or your money back",
    "landing4.guarantee.subtitle":
      "We stand behind ShiftBob — try it risk-free and get your money back if you are not satisfied.",
    "landing4.guarantee.aria": "Satisfaction guarantee",
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
