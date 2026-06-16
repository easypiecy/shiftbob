import { createServerSupabase } from "@/src/utils/supabase/server";
import TranslationsEditor from "./translations-editor";

export const maxDuration = 120;

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

  const sourceRows: Array<{
    translation_key: string;
    text_value: string;
    context_description: string;
  }> = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("ui_translations")
      .select("translation_key, text_value, context_description")
      .eq("language_code", "en-US")
      .order("translation_key")
      .range(from, from + pageSize - 1);

    if (error) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
          Kunne ikke hente kildetekster: {error.message}
        </div>
      );
    }

    const chunk = data ?? [];
    sourceRows.push(...chunk);
    if (chunk.length < pageSize) break;
    from += pageSize;
  }

  return (
    <TranslationsEditor
      languages={languages ?? []}
      sourceRows={sourceRows}
    />
  );
}
