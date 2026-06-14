import { createServerSupabase } from "@/src/utils/supabase/server";
import { getAdminClient } from "@/src/utils/supabase/admin";
import {
  checkIpAbuseGuardAllowed,
  recordIpAbuseGuardHit,
  type IpAbuseGuardAction,
} from "@/src/lib/ip-abuse-guard";
import { getClientIpFromRequest } from "@/src/lib/request-ip";

type SubmitBody = {
  languageCode?: string;
  subject?: string;
  message?: string;
  name?: string;
  email?: string;
  abuseGuardAction?: IpAbuseGuardAction;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeLanguageCode(languageCode?: string): string {
  return languageCode?.trim() || "en-US";
}

function isValidEmail(email: string): boolean {
  return email.includes("@") && email.includes(".");
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as SubmitBody;
    const subject = payload.subject?.trim() || "";
    const message = payload.message?.trim() || "";
    const languageCode = normalizeLanguageCode(payload.languageCode);

    if (!subject || !message) {
      return Response.json(
        { ok: false, error: "Subject and message are required." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const senderEmail = user?.email?.trim() || payload.email?.trim() || "";
    const senderName =
      (payload.name?.trim() || "") ||
      ((user?.user_metadata?.full_name as string | undefined)?.trim() ?? "") ||
      ((user?.user_metadata?.name as string | undefined)?.trim() ?? "") ||
      null;

    if (!senderEmail || (!user && !senderName)) {
      return Response.json(
        {
          ok: false,
          error: "Name and email are required when not logged in.",
          requiresIdentity: true,
        },
        { status: 400 }
      );
    }
    if (!isValidEmail(senderEmail)) {
      return Response.json({ ok: false, error: "Invalid email address." }, { status: 400 });
    }

    const clientIp = getClientIpFromRequest(req);
    if (payload.abuseGuardAction) {
      const guard = await checkIpAbuseGuardAllowed(payload.abuseGuardAction, clientIp);
      if (!guard.ok) {
        return Response.json(
          { ok: false, error: guard.error, rateLimited: true },
          { status: 429 }
        );
      }
    }

    const admin = getAdminClient();
    const inserted = await admin
      .from("support_tickets")
      .insert({
        channel: "web",
        status: "open",
        priority: "normal",
        sender_email: senderEmail.toLowerCase(),
        sender_name: senderName,
        language_original: languageCode,
        subject_original: subject,
        body_original: message,
        subject_translated: subject,
        body_translated: message,
        labels: ["SalesBot"],
      })
      .select("id")
      .single();

    if (inserted.error) {
      return Response.json({ ok: false, error: inserted.error.message }, { status: 500 });
    }

    const ticketId = String(inserted.data.id);
    const messageInsert = await admin.from("support_ticket_messages").insert({
      ticket_id: ticketId,
      direction: "incoming",
      sender_email: senderEmail.toLowerCase(),
      language_original: languageCode,
      language_target: null,
      body_original: message,
      body_translated: message,
    });
    if (messageInsert.error) {
      return Response.json({ ok: false, error: messageInsert.error.message }, { status: 500 });
    }

    if (payload.abuseGuardAction) {
      await recordIpAbuseGuardHit(payload.abuseGuardAction, clientIp);
    }

    return Response.json({ ok: true, ticketId });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Ukendt fejl";
    return Response.json({ ok: false, error }, { status: 500 });
  }
}
