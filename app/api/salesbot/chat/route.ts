import { buildSalesBotReply, getSalesBotRuntime } from "@/src/lib/salesbot-runtime";
import { createServerSupabase } from "@/src/utils/supabase/server";
import { getAdminClient } from "@/src/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      languageCode?: string;
      message?: string;
      contextKnowledgeId?: string;
    };
    const languageCode = body.languageCode?.trim() || "en-US";
    const message = body.message?.trim() || "";
    const contextKnowledgeId = body.contextKnowledgeId?.trim() || "";

    const runtime = await getSalesBotRuntime(languageCode);
    const result = buildSalesBotReply({
      question: message,
      manifest: runtime.manifest,
      knowledge: runtime.knowledge,
      languageCode,
      contextKnowledgeId,
    });

    if (message) {
      try {
        const admin = getAdminClient();
        const supabase = await createServerSupabase();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        await admin.from("salesbot_chat_logs").insert({
          language_code: languageCode,
          user_message: message,
          bot_reply: result.reply,
          matched_knowledge_id: result.matchedKnowledgeId,
          context_knowledge_id: contextKnowledgeId || null,
          cta_label: result.ctaLabel,
          cta_href: result.ctaHref,
          user_id: user?.id ?? null,
        });
      } catch {
        // Non-blocking logging.
      }
    }

    return Response.json({
      ok: true,
      reply: result.reply,
      suggestions: result.suggestions,
      ctaLabel: result.ctaLabel,
      ctaHref: result.ctaHref,
      matchedKnowledgeId: result.matchedKnowledgeId,
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Ukendt fejl";
    return Response.json({ ok: false, error }, { status: 500 });
  }
}
