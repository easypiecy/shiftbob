import { cache } from "react";
import { getAdminClient } from "@/src/utils/supabase/admin";

const DEFAULT_UI_LANGUAGE = "da";

/**
 * Henter alle UI-strenge for et sprog (service role — virker uden bruger-session).
 * Bruges i Server Components og root layout.
 */
export async function getTranslationsServer(
  languageCode: string
): Promise<Record<string, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url?.trim() || !serviceKey?.trim()) {
    console.warn(
      "[translations] Mangler NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY — tom strengmap (sæt i .env.local).",
    );
    return {};
  }

  const admin = getAdminClient();
  const { data, error } = await admin
    .from("ui_translations")
    .select("translation_key, text_value")
    .eq("language_code", languageCode);

  if (error) {
    console.warn("[translations]", languageCode, error.message);
    return {};
  }

  const out: Record<string, string> = {};
  for (const row of data ?? []) {
    const k = row.translation_key as string;
    out[k] = row.text_value as string;
  }
  return out;
}

export const getTranslationsCached = cache(async (languageCode?: string) => {
  const lang = languageCode?.trim() || DEFAULT_UI_LANGUAGE;
  return getTranslationsServer(lang);
});

export function createTranslator(map: Record<string, string>) {
  return (key: string, fallback?: string) => map[key] ?? fallback ?? key;
}

export { DEFAULT_UI_LANGUAGE };
