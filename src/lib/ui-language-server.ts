import { cookies, headers } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import {
  isSupportedUiLanguage,
  resolveLanguageFromAcceptLanguage,
  UI_LANGUAGE_COOKIE,
} from "@/src/lib/ui-language";
import { getTranslationsCached } from "@/src/lib/translations-server";
import { applyUiTranslationOverrides } from "@/src/lib/ui-translation-overrides";

export { UI_LANGUAGE_COOKIE };

/**
 * Manuel cookie → ellers Accept-Language → ellers en-US.
 */
export async function resolveRequestUiLanguage(): Promise<string> {
  noStore();
  const jar = await cookies();
  const fromCookie = jar.get(UI_LANGUAGE_COOKIE)?.value?.trim();
  if (fromCookie && isSupportedUiLanguage(fromCookie)) return fromCookie;

  const h = await headers();
  return resolveLanguageFromAcceptLanguage(h.get("accept-language"));
}

/** Alle UI-strenge for det aktive sprog. */
export async function getUiTranslations() {
  noStore();
  const lang = await resolveRequestUiLanguage();
  const map = await getTranslationsCached(lang);
  return applyUiTranslationOverrides(map, lang);
}
