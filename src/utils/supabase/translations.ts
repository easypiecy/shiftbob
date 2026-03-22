import { createClient } from "@/src/utils/supabase/client";

/**
 * Loads all UI strings for a language from `ui_translations`.
 * Returns a flat key → text map for use in React components.
 */
export async function getTranslations(
  languageCode: string
): Promise<Record<string, string>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ui_translations")
    .select("translation_key, text_value")
    .eq("language_code", languageCode);

  if (error) throw error;

  const out: Record<string, string> = {};
  for (const row of data ?? []) {
    const key = row.translation_key as string;
    out[key] = row.text_value as string;
  }
  return out;
}
