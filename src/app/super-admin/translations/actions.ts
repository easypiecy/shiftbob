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
      "Returner KUN den oversatte tekst, intet andet.";

    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      config: {
        systemInstruction: systemPrompt,
      },
      contents: text,
    });

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

    const { data, error } = await supabase
      .from("ui_translations")
      .select("translation_key, text_value")
      .eq("language_code", languageCode);

    if (error) {
      return { ok: false, error: error.message };
    }

    const map: Record<string, string> = {};
    for (const row of data ?? []) {
      map[row.translation_key as string] = row.text_value as string;
    }
    return { ok: true, map };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunne ikke hente oversættelser.";
    return { ok: false, error: msg };
  }
}
