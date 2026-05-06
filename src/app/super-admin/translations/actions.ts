"use server";

import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import { GEMINI_TEXT_MODEL } from "@/src/utils/ai/gemini";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

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

    // En enkelt retry gør batch-kørslen mere robust ved kortvarige netværksfejl.
    let response;
    try {
      response = await withTimeout(1);
    } catch {
      response = await withTimeout(2);
    }

    const out = response.text?.trim();
    if (!out) {
      return { ok: false, error: "Tomt svar fra Gemini." };
    }
    return { ok: true, text: out };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
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

    revalidatePath("/super-admin/translations");
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
