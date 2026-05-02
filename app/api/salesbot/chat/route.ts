import { buildSalesBotReply, getSalesBotRuntime } from "@/src/lib/salesbot-runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { languageCode?: string; message?: string };
    const languageCode = body.languageCode?.trim() || "en-US";
    const message = body.message?.trim() || "";

    const runtime = await getSalesBotRuntime(languageCode);
    const { reply, suggestions, ctaLabel, ctaHref } = buildSalesBotReply({
      question: message,
      manifest: runtime.manifest,
      knowledge: runtime.knowledge,
    });

    return Response.json({ ok: true, reply, suggestions, ctaLabel, ctaHref });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Ukendt fejl";
    return Response.json({ ok: false, error }, { status: 500 });
  }
}
