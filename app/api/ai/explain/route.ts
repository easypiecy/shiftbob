import { generateScheduleExplanation } from "@/src/utils/ai/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { scheduleData?: unknown };
    const scheduleData = body.scheduleData;
    if (scheduleData === undefined) {
      return Response.json(
        { ok: false, error: "Mangler scheduleData i body." },
        { status: 400 }
      );
    }
    const text = await generateScheduleExplanation(scheduleData);
    return Response.json({ ok: true, text });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Ukendt fejl ved Gemini-kald.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
