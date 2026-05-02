"use server";

import { revalidatePath } from "next/cache";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import {
  DEFAULT_SALESBOT_MANIFEST,
  type SalesBotKnowledgeEntry,
  type SalesBotManifest,
} from "@/src/lib/salesbot-runtime";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

export type LanguageOptionRow = {
  language_code: string;
  name: string;
};

async function requireSuperAdmin() {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);
}

function isMissingSchemaError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("does not exist") ||
    m.includes("could not find") ||
    m.includes("42p01")
  );
}

export async function getSalesBotDashboardData(): Promise<
  | {
      ok: true;
      manifest: SalesBotManifest;
      knowledge: SalesBotKnowledgeEntry[];
      languages: LanguageOptionRow[];
    }
  | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const [manifestRes, knowledgeRes, languageRes] = await Promise.all([
      admin
        .from("salesbot_manifests")
        .select(
          "id, bot_name, welcome_message, tone_of_voice, cta_label, cta_href, fallback_reply, updated_at"
        )
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from("salesbot_knowledge_entries")
        .select("id, language_code, title, question, answer, tags, sort_order, created_at")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      admin.from("languages").select("language_code, name").order("name"),
    ]);

    if (manifestRes.error && !isMissingSchemaError(manifestRes.error.message)) {
      return { ok: false, error: manifestRes.error.message };
    }
    if (knowledgeRes.error && !isMissingSchemaError(knowledgeRes.error.message)) {
      return { ok: false, error: knowledgeRes.error.message };
    }
    if (languageRes.error && !isMissingSchemaError(languageRes.error.message)) {
      return { ok: false, error: languageRes.error.message };
    }

    const manifest = manifestRes.data
      ? {
          id: String(manifestRes.data.id),
          bot_name: String(manifestRes.data.bot_name ?? DEFAULT_SALESBOT_MANIFEST.bot_name),
          welcome_message: String(
            manifestRes.data.welcome_message ?? DEFAULT_SALESBOT_MANIFEST.welcome_message
          ),
          tone_of_voice: String(
            manifestRes.data.tone_of_voice ?? DEFAULT_SALESBOT_MANIFEST.tone_of_voice
          ),
          cta_label: String(manifestRes.data.cta_label ?? DEFAULT_SALESBOT_MANIFEST.cta_label),
          cta_href: String(manifestRes.data.cta_href ?? DEFAULT_SALESBOT_MANIFEST.cta_href),
          fallback_reply: String(
            manifestRes.data.fallback_reply ?? DEFAULT_SALESBOT_MANIFEST.fallback_reply
          ),
          updated_at: String(manifestRes.data.updated_at ?? ""),
        }
      : DEFAULT_SALESBOT_MANIFEST;

    const knowledge = ((knowledgeRes.data ?? []) as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      language_code: String(row.language_code ?? "en-US"),
      title: String(row.title ?? ""),
      question: String(row.question ?? ""),
      answer: String(row.answer ?? ""),
      tags: (row.tags as string[] | null) ?? [],
      sort_order: Number(row.sort_order ?? 100),
    }));

    const languages = ((languageRes.data ?? []) as Record<string, unknown>[]).map((row) => ({
      language_code: String(row.language_code ?? ""),
      name: String(row.name ?? ""),
    }));

    return { ok: true, manifest, knowledge, languages };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: message };
  }
}

export async function saveSalesBotManifest(input: {
  bot_name: string;
  welcome_message: string;
  tone_of_voice: string;
  cta_label: string;
  cta_href: string;
  fallback_reply: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();

    const row = {
      bot_name: input.bot_name.trim() || DEFAULT_SALESBOT_MANIFEST.bot_name,
      welcome_message:
        input.welcome_message.trim() || DEFAULT_SALESBOT_MANIFEST.welcome_message,
      tone_of_voice: input.tone_of_voice.trim() || DEFAULT_SALESBOT_MANIFEST.tone_of_voice,
      // Allow explicit empty CTA fields (no link shown in chat).
      cta_label: input.cta_label.trim(),
      cta_href: input.cta_href.trim(),
      fallback_reply: input.fallback_reply.trim() || DEFAULT_SALESBOT_MANIFEST.fallback_reply,
      updated_at: new Date().toISOString(),
    };

    const existing = await admin
      .from("salesbot_manifests")
      .select("id")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing.error && !isMissingSchemaError(existing.error.message)) {
      return { ok: false, error: existing.error.message };
    }

    const op = existing.data
      ? admin.from("salesbot_manifests").update(row).eq("id", existing.data.id)
      : admin.from("salesbot_manifests").insert(row);

    const { error } = await op;
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error: "SalesBot-tabeller mangler. Kør supabase_salesbot_setup.sql først.",
        };
      }
      return { ok: false, error: error.message };
    }

    revalidatePath("/super-admin/salesbot");
    revalidatePath("/landing");
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: message };
  }
}

export async function createSalesBotKnowledgeEntry(input: {
  language_code: string;
  title: string;
  question: string;
  answer: string;
  tags: string[];
  sort_order: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();

    const row = {
      language_code: input.language_code.trim() || "en-US",
      title: input.title.trim(),
      question: input.question.trim(),
      answer: input.answer.trim(),
      tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
      sort_order: Math.max(1, Math.min(9999, Math.floor(input.sort_order))),
      active: true,
      updated_at: new Date().toISOString(),
    };

    if (!row.title || !row.question || !row.answer) {
      return { ok: false, error: "Titel, spørgsmål og svar skal udfyldes." };
    }

    const { error } = await admin.from("salesbot_knowledge_entries").insert(row);
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error: "SalesBot-tabeller mangler. Kør supabase_salesbot_setup.sql først.",
        };
      }
      return { ok: false, error: error.message };
    }

    revalidatePath("/super-admin/salesbot");
    revalidatePath("/landing");
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: message };
  }
}

export async function deleteSalesBotKnowledgeEntry(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { error } = await admin.from("salesbot_knowledge_entries").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/super-admin/salesbot");
    revalidatePath("/landing");
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: message };
  }
}
