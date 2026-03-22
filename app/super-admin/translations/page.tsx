import { createServerSupabase } from "@/src/utils/supabase/server";
import TranslationsEditor from "./translations-editor";

export default async function SuperAdminTranslationsPage() {
  const supabase = await createServerSupabase();

  const { data: languages, error: langErr } = await supabase
    .from("languages")
    .select("language_code, name")
    .order("name");

  if (langErr) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente sprog: {langErr.message}
      </div>
    );
  }

  const { data: sourceRows, error: srcErr } = await supabase
    .from("ui_translations")
    .select("translation_key, text_value, context_description")
    .eq("language_code", "en-US")
    .order("translation_key");

  if (srcErr) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente kildetekster: {srcErr.message}
      </div>
    );
  }

  return (
    <TranslationsEditor
      languages={languages ?? []}
      sourceRows={sourceRows ?? []}
    />
  );
}
