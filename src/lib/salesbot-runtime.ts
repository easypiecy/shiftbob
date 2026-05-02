import { getAdminClient } from "@/src/utils/supabase/admin";

export type SalesBotManifest = {
  id: string;
  bot_name: string;
  welcome_message: string;
  tone_of_voice: string;
  cta_label: string;
  cta_href: string;
  fallback_reply: string;
  updated_at: string;
};

export type SalesBotKnowledgeEntry = {
  id: string;
  language_code: string;
  title: string;
  question: string;
  answer: string;
  tags: string[];
  sort_order: number;
};

export const DEFAULT_SALESBOT_MANIFEST: SalesBotManifest = {
  id: "default",
  bot_name: "SalesBot",
  welcome_message:
    "Hi! I can quickly explain how ShiftBob helps with planning, compliance, and the employee app.",
  tone_of_voice: "Helpful, concise, sales-oriented",
  cta_label: "Book a free intro",
  cta_href: "/login",
  fallback_reply:
    "I do not have a precise answer for that yet. Want a quick intro call so we can show your exact setup?",
  updated_at: "",
};

function isMissingSchemaError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("does not exist") ||
    m.includes("could not find") ||
    m.includes("42p01")
  );
}

function normalizeLanguageCode(languageCode?: string): string {
  const value = languageCode?.trim();
  if (!value) return "en-US";
  return value;
}

function languageBase(languageCode: string): string {
  return languageCode.split("-")[0].toLowerCase();
}

function resolveKnowledgeForLanguage(
  entries: SalesBotKnowledgeEntry[],
  languageCode: string
): SalesBotKnowledgeEntry[] {
  const exact = entries.filter((row) => row.language_code === languageCode);
  if (exact.length > 0) return exact;

  const base = languageBase(languageCode);
  const sameBase = entries.filter((row) => languageBase(row.language_code) === base);
  if (sameBase.length > 0) return sameBase;

  const enUs = entries.filter((row) => row.language_code === "en-US");
  if (enUs.length > 0) return enUs;

  const da = entries.filter((row) => row.language_code === "da");
  if (da.length > 0) return da;

  return entries;
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function scoreKnowledgeMatch(question: string, row: SalesBotKnowledgeEntry): number {
  const hay = `${row.title} ${row.question} ${row.tags.join(" ")}`.toLowerCase();
  const tokens = tokenize(question);
  if (tokens.length === 0) return 0;

  let score = 0;
  for (const token of tokens) {
    if (hay.includes(token)) score += 1;
  }
  if (hay.includes(question.trim().toLowerCase())) score += 2;
  return score;
}

export async function getSalesBotRuntime(languageCode?: string): Promise<{
  manifest: SalesBotManifest;
  knowledge: SalesBotKnowledgeEntry[];
}> {
  const preferredLanguage = normalizeLanguageCode(languageCode);
  try {
    const admin = getAdminClient();
    const [manifestRes, knowledgeRes] = await Promise.all([
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
        .select("id, language_code, title, question, answer, tags, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    if (manifestRes.error && !isMissingSchemaError(manifestRes.error.message)) {
      throw new Error(manifestRes.error.message);
    }
    if (knowledgeRes.error && !isMissingSchemaError(knowledgeRes.error.message)) {
      throw new Error(knowledgeRes.error.message);
    }

    const manifestRow = manifestRes.data
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

    const knowledgeRows = ((knowledgeRes.data ?? []) as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      language_code: String(row.language_code ?? "en-US"),
      title: String(row.title ?? ""),
      question: String(row.question ?? ""),
      answer: String(row.answer ?? ""),
      tags: (row.tags as string[] | null) ?? [],
      sort_order: Number(row.sort_order ?? 100),
    }));

    return {
      manifest: manifestRow,
      knowledge: resolveKnowledgeForLanguage(knowledgeRows, preferredLanguage),
    };
  } catch {
    return { manifest: DEFAULT_SALESBOT_MANIFEST, knowledge: [] };
  }
}

export function buildSalesBotReply(input: {
  question: string;
  manifest: SalesBotManifest;
  knowledge: SalesBotKnowledgeEntry[];
}): { reply: string; suggestions: string[] } {
  const message = input.question.trim();
  const suggestions = input.knowledge.slice(0, 3).map((entry) => entry.question);

  if (!message) {
    return { reply: input.manifest.welcome_message, suggestions };
  }

  const ranked = input.knowledge
    .map((entry) => ({ entry, score: scoreKnowledgeMatch(message, entry) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 1) {
    const fallbackWithCta = input.manifest.cta_href
      ? `${input.manifest.fallback_reply}\n\n${input.manifest.cta_label}: ${input.manifest.cta_href}`
      : input.manifest.fallback_reply;
    return { reply: fallbackWithCta, suggestions };
  }

  const withCta = input.manifest.cta_href
    ? `${best.entry.answer}\n\n${input.manifest.cta_label}: ${input.manifest.cta_href}`
    : best.entry.answer;
  return { reply: withCta, suggestions };
}
