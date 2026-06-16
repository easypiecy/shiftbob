"use server";

import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import { GEMINI_TEXT_MODEL } from "@/src/utils/ai/gemini";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

const SOURCE_LANG = "en-US";
const BATCH_CHUNK_SIZE = 4;
const BATCH_DELAY_MS = 900;
const RATE_LIMIT_BACKOFF_MS = 4000;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function isRateLimitError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("429") ||
    lower.includes("rate limit") ||
    lower.includes("resource exhausted") ||
    lower.includes("quota")
  );
}

function revalidateTranslationConsumers() {
  revalidatePath("/super-admin/translations");
  revalidatePath("/landing");
  revalidatePath("/landing2");
  revalidatePath("/landing3");
  revalidatePath("/landing4");
}

async function loadAllSourceRows(): Promise<
  | {
      ok: true;
      rows: Array<{
        translation_key: string;
        text_value: string;
        context_description: string;
      }>;
    }
  | { ok: false; error: string }
> {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);

  const rows: Array<{
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
      .eq("language_code", SOURCE_LANG)
      .order("translation_key")
      .range(from, from + pageSize - 1);

    if (error) {
      return { ok: false, error: error.message };
    }

    const chunk = data ?? [];
    rows.push(...chunk);
    if (chunk.length < pageSize) break;
    from += pageSize;
  }

  return { ok: true, rows };
}

/**
 * AI-oversættelse til brug fra Super Admin UI (UX-tekster).
 */
export async function translateWithAI(
  text: string,
  context: string,
  targetLanguage: string
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  try {
    const supabase = await createServerSupabase();
    await assertSuperAdminAccess(supabase);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "GEMINI_API_KEY mangler på serveren." };
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt =
      "Du er en professionel UX-oversætter. " +
      `Oversæt følgende tekst til ${targetLanguage}. ` +
      `Brug denne kontekst for at sikre korrekt terminologi: ${context}. ` +
      "HÅRD REGEL: Valutakoden 'EUR' må ALDRIG oversættes, translittereres eller omskrives. " +
      "Bevar altid præcis 'EUR' med store bogstaver i output (fx '49 EUR'). " +
      "HÅRD REGEL: Produktnavnet 'App Store' må ALDRIG oversættes, omskrives eller translittereres. " +
      "Bevar altid præcis 'App Store' med samme stavning og store bogstaver. " +
      "HÅRD REGEL: Produktnavnet 'Google Play' må ALDRIG oversættes, omskrives eller translittereres. " +
      "Bevar altid præcis 'Google Play' med samme stavning og store bogstaver. " +
      "Returner KUN den oversatte tekst, intet andet.";

    const runGenerate = async () =>
      ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        config: {
          systemInstruction: systemPrompt,
        },
        contents: text,
      });

    const withTimeout = async (attempt: number) => {
      const TIMEOUT_MS = 30000;
      return Promise.race([
        runGenerate(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `Gemini-timeout efter ${Math.round(TIMEOUT_MS / 1000)}s (forsøg ${attempt})`
                )
              ),
            TIMEOUT_MS
          )
        ),
      ]);
    };

    let response;
    let lastError = "Ukendt fejl";
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await withTimeout(attempt);
        break;
      } catch (e) {
        lastError = e instanceof Error ? e.message : "Ukendt fejl";
        if (isRateLimitError(lastError) && attempt < 3) {
          await sleep(RATE_LIMIT_BACKOFF_MS * attempt);
          continue;
        }
        if (attempt < 3) {
          await sleep(600);
          continue;
        }
        return { ok: false, error: lastError };
      }
    }

    const out = response?.text?.trim();
    if (!out) {
      return { ok: false, error: "Tomt svar fra Gemini." };
    }
    return { ok: true, text: out };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export type TranslateEmptyBatchInput = {
  languageCode: string;
  languageLabel: string;
  offset: number;
  keyPrefix?: string;
};

export type TranslateEmptyBatchResult =
  | {
      ok: true;
      filled: number;
      processed: number;
      totalEmpty: number;
      nextOffset: number;
      hasMore: boolean;
      errors: string[];
      filledKeys: string[];
    }
  | { ok: false; error: string };

/**
 * Oversætter et lille batch tomme felter server-side (undgår rate limits i browser-loop).
 */
export async function translateEmptyBatch(
  input: TranslateEmptyBatchInput
): Promise<TranslateEmptyBatchResult> {
  try {
    const supabase = await createServerSupabase();
    await assertSuperAdminAccess(supabase);

    const prefix = input.keyPrefix?.trim() ?? "";
    const source = await loadAllSourceRows();
    if (!source.ok) {
      return { ok: false, error: source.error };
    }

    const target = await loadTargetTexts(input.languageCode);
    if (!target.ok) {
      return { ok: false, error: target.error };
    }

    const emptyRows = source.rows.filter((row) => {
      if (prefix && !row.translation_key.startsWith(prefix)) return false;
      const sourceText = row.text_value.trim();
      if (!sourceText) return false;
      const existing = String(target.map[row.translation_key] ?? "").trim();
      return !existing;
    });

    const slice = emptyRows.slice(input.offset, input.offset + BATCH_CHUNK_SIZE);
    const admin = getAdminClient();
    let filled = 0;
    const errors: string[] = [];
    const filledKeys: string[] = [];

    for (let i = 0; i < slice.length; i++) {
      const row = slice[i];
      if (i > 0) {
        await sleep(BATCH_DELAY_MS);
      }

      const tr = await translateWithAI(
        row.text_value,
        row.context_description,
        input.languageLabel
      );
      if (!tr.ok) {
        errors.push(`${row.translation_key}: ${tr.error}`);
        continue;
      }

      const { error } = await admin.from("ui_translations").upsert(
        {
          translation_key: row.translation_key,
          language_code: input.languageCode,
          text_value: tr.text,
          context_description: row.context_description,
        },
        { onConflict: "translation_key,language_code" }
      );

      if (error) {
        errors.push(`${row.translation_key}: ${error.message}`);
        continue;
      }

      filled++;
      filledKeys.push(row.translation_key);
    }

    if (filled > 0) {
      revalidateTranslationConsumers();
    }

    const nextOffset = input.offset + slice.length;
    return {
      ok: true,
      filled,
      processed: slice.length,
      totalEmpty: emptyRows.length,
      nextOffset,
      hasMore: nextOffset < emptyRows.length,
      errors,
      filledKeys,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Batch-oversættelse fejlede.";
    return { ok: false, error: msg };
  }
}

export type SaveTranslationInput = {
  translationKey: string;
  languageCode: string;
  textValue: string;
  contextDescription: string;
};

export async function saveTranslation(
  input: SaveTranslationInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const supabase = await createServerSupabase();
    await assertSuperAdminAccess(supabase);

    // RLS kræver is_workplace_admin() (kun workplace_members). Global SUPER_ADMIN i user_roles
    // får ikke skrivning — service role efter Super Admin-check matcher øvrige admin-actions.
    const admin = getAdminClient();
    const { error } = await admin.from("ui_translations").upsert(
      {
        translation_key: input.translationKey,
        language_code: input.languageCode,
        text_value: input.textValue,
        context_description: input.contextDescription,
      },
      { onConflict: "translation_key,language_code" }
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateTranslationConsumers();
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunne ikke gemme.";
    return { ok: false, error: msg };
  }
}

export async function loadTargetTexts(
  languageCode: string
): Promise<
  { ok: true; map: Record<string, string> } | { ok: false; error: string }
> {
  try {
    const supabase = await createServerSupabase();
    await assertSuperAdminAccess(supabase);

    const map: Record<string, string> = {};
    const pageSize = 1000;
    let from = 0;

    while (true) {
      const { data, error } = await supabase
        .from("ui_translations")
        .select("translation_key, text_value")
        .eq("language_code", languageCode)
        .order("translation_key")
        .range(from, from + pageSize - 1);

      if (error) {
        return { ok: false, error: error.message };
      }

      const chunk = data ?? [];
      for (const row of chunk) {
        map[row.translation_key as string] = row.text_value as string;
      }

      if (chunk.length < pageSize) break;
      from += pageSize;
    }

    return { ok: true, map };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunne ikke hente oversættelser.";
    return { ok: false, error: msg };
  }
}
