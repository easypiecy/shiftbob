import { cache } from "react";
import { cookies, headers } from "next/headers";
import {
  isSupportedUiLanguage,
  resolveLanguageFromAcceptLanguage,
  UI_LANGUAGE_COOKIE,
} from "@/src/lib/ui-language";
import { getTranslationsCached } from "@/src/lib/translations-server";

export { UI_LANGUAGE_COOKIE };

/**
 * Manuel cookie → ellers Accept-Language → ellers en-US.
 */
export async function resolveRequestUiLanguage(): Promise<string> {
  const jar = await cookies();
  const fromCookie = jar.get(UI_LANGUAGE_COOKIE)?.value?.trim();
  if (fromCookie && isSupportedUiLanguage(fromCookie)) return fromCookie;

  const h = await headers();
  return resolveLanguageFromAcceptLanguage(h.get("accept-language"));
}

/** Alle UI-strenge for det aktive sprog (én gang pr. request). */
export const getUiTranslations = cache(async () => {
  const lang = await resolveRequestUiLanguage();
  return getTranslationsCached(lang);
});
