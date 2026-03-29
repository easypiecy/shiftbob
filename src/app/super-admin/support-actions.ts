"use server";

import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import { GEMINI_TEXT_MODEL } from "@/src/utils/ai/gemini";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

async function requireSuperAdmin() {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);
}

function isMissingSchemaError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("could not find") ||
    m.includes("does not exist") ||
    m.includes("42p01") ||
    (m.includes("relation") && m.includes("does not exist"))
  );
}

const TICKET_STATUS = ["open", "pending", "resolved", "closed"] as const;
type TicketStatus = (typeof TICKET_STATUS)[number];

export type SupportMailboxConfigRow = {
  id: string;
  protocol: "imap" | "pop3";
  host: string;
  port: number;
  username: string;
  mailbox_name: string;
  use_tls: boolean;
  active: boolean;
  poll_every_minutes: number;
  has_secret: boolean;
  updated_at: string;
};

export type SupportTicketRow = {
  id: string;
  status: TicketStatus;
  priority: "low" | "normal" | "high" | "urgent";
  sender_email: string;
  sender_name: string | null;
  subject_original: string;
  body_original: string;
  subject_translated: string;
  body_translated: string;
  language_original: string;
  labels: string[];
  workplace_id: string | null;
  created_at: string;
};

export type SupportTicketMessageRow = {
  id: string;
  ticket_id: string;
  direction: "incoming" | "outgoing";
  sender_email: string | null;
  language_original: string;
  language_target: string | null;
  body_original: string;
  body_translated: string;
  created_at: string;
};

export type SupportReplyTemplateRow = {
  id: string;
  name: string;
  language_code: string;
  body_template: string;
  trigger_words: string[];
  trigger_phrases: string[];
  active: boolean;
};

export type LanguageOptionRow = {
  language_code: string;
  name: string;
};

function geminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY mangler på serveren.");
  }
  return new GoogleGenAI({ apiKey });
}

async function detectLanguage(text: string): Promise<string> {
  if (!text.trim()) return "unknown";
  const ai = geminiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    config: {
      systemInstruction:
        "Return only the best language code for this text as BCP-47 (like da, en-US, fr, de). No extra text.",
      temperature: 0,
    },
    contents: text.slice(0, 4000),
  });
  return response.text?.trim() || "unknown";
}

async function translateText(
  text: string,
  targetLanguage: string,
  context: string
): Promise<string> {
  if (!text.trim()) return "";
  const ai = geminiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    config: {
      systemInstruction:
        `Translate the text to ${targetLanguage}. ` +
        `Use this support context: ${context}. ` +
        "Preserve meaning and intent. Return only translated text.",
      temperature: 0.2,
    },
    contents: text,
  });
  return response.text?.trim() || text;
}

export async function getSupportDashboardData(): Promise<
  | {
      ok: true;
      mailboxConfig: SupportMailboxConfigRow | null;
      tickets: SupportTicketRow[];
      messages: SupportTicketMessageRow[];
      templates: SupportReplyTemplateRow[];
      languages: LanguageOptionRow[];
    }
  | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const [cfgRes, ticketRes, msgRes, tmplRes, langRes] = await Promise.all([
      admin
        .from("support_mailbox_configs")
        .select(
          "id, protocol, host, port, username, mailbox_name, use_tls, active, poll_every_minutes, auth_secret, updated_at"
        )
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      admin
        .from("support_tickets")
        .select(
          "id, status, priority, sender_email, sender_name, subject_original, body_original, subject_translated, body_translated, language_original, labels, workplace_id, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(200),
      admin
        .from("support_ticket_messages")
        .select(
          "id, ticket_id, direction, sender_email, language_original, language_target, body_original, body_translated, created_at"
        )
        .order("created_at", { ascending: true })
        .limit(800),
      admin
        .from("support_reply_templates")
        .select(
          "id, name, language_code, body_template, trigger_words, trigger_phrases, active"
        )
        .order("created_at", { ascending: false }),
      admin.from("languages").select("language_code, name").order("name"),
    ]);
    if (cfgRes.error && !isMissingSchemaError(cfgRes.error.message)) {
      return { ok: false, error: cfgRes.error.message };
    }
    if (ticketRes.error && !isMissingSchemaError(ticketRes.error.message)) {
      return { ok: false, error: ticketRes.error.message };
    }
    if (msgRes.error && !isMissingSchemaError(msgRes.error.message)) {
      return { ok: false, error: msgRes.error.message };
    }
    if (tmplRes.error && !isMissingSchemaError(tmplRes.error.message)) {
      return { ok: false, error: tmplRes.error.message };
    }
    if (langRes.error && !isMissingSchemaError(langRes.error.message)) {
      return { ok: false, error: langRes.error.message };
    }

    const mailboxConfig = cfgRes.data
      ? {
          id: String(cfgRes.data.id),
          protocol: (cfgRes.data.protocol as "imap" | "pop3") ?? "imap",
          host: String(cfgRes.data.host ?? ""),
          port: Number(cfgRes.data.port ?? 993),
          username: String(cfgRes.data.username ?? ""),
          mailbox_name: String(cfgRes.data.mailbox_name ?? "INBOX"),
          use_tls: Boolean(cfgRes.data.use_tls),
          active: Boolean(cfgRes.data.active),
          poll_every_minutes: Number(cfgRes.data.poll_every_minutes ?? 5),
          has_secret: Boolean(cfgRes.data.auth_secret),
          updated_at: String(cfgRes.data.updated_at ?? ""),
        }
      : null;

    return {
      ok: true,
      mailboxConfig,
      tickets: ((ticketRes.data ?? []) as Record<string, unknown>[]).map((r) => ({
        id: String(r.id),
        status: (r.status as TicketStatus) ?? "open",
        priority: (r.priority as SupportTicketRow["priority"]) ?? "normal",
        sender_email: String(r.sender_email ?? ""),
        sender_name: (r.sender_name as string | null) ?? null,
        subject_original: String(r.subject_original ?? ""),
        body_original: String(r.body_original ?? ""),
        subject_translated: String(r.subject_translated ?? ""),
        body_translated: String(r.body_translated ?? ""),
        language_original: String(r.language_original ?? "unknown"),
        labels: (r.labels as string[] | null) ?? [],
        workplace_id: (r.workplace_id as string | null) ?? null,
        created_at: String(r.created_at ?? ""),
      })),
      messages: ((msgRes.data ?? []) as Record<string, unknown>[]).map((r) => ({
        id: String(r.id),
        ticket_id: String(r.ticket_id),
        direction: (r.direction as "incoming" | "outgoing") ?? "incoming",
        sender_email: (r.sender_email as string | null) ?? null,
        language_original: String(r.language_original ?? "unknown"),
        language_target: (r.language_target as string | null) ?? null,
        body_original: String(r.body_original ?? ""),
        body_translated: String(r.body_translated ?? ""),
        created_at: String(r.created_at ?? ""),
      })),
      templates: ((tmplRes.data ?? []) as Record<string, unknown>[]).map((r) => ({
        id: String(r.id),
        name: String(r.name ?? ""),
        language_code: String(r.language_code ?? "en-US"),
        body_template: String(r.body_template ?? ""),
        trigger_words: (r.trigger_words as string[] | null) ?? [],
        trigger_phrases: (r.trigger_phrases as string[] | null) ?? [],
        active: Boolean(r.active),
      })),
      languages: ((langRes.data ?? []) as Record<string, unknown>[]).map((r) => ({
        language_code: String(r.language_code ?? ""),
        name: String(r.name ?? ""),
      })),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function saveSupportMailboxConfig(input: {
  protocol: "imap" | "pop3";
  host: string;
  port: number;
  username: string;
  password?: string;
  mailbox_name: string;
  use_tls: boolean;
  active: boolean;
  poll_every_minutes: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const host = input.host.trim();
    const username = input.username.trim();
    if (!host || !username) {
      return { ok: false, error: "Host og brugernavn skal udfyldes." };
    }
    if (!Number.isFinite(input.port) || input.port < 1 || input.port > 65535) {
      return { ok: false, error: "Port er ugyldig." };
    }
    const row: Record<string, unknown> = {
      protocol: input.protocol,
      host,
      port: Math.floor(input.port),
      username,
      mailbox_name: input.mailbox_name.trim() || "INBOX",
      use_tls: input.use_tls,
      active: input.active,
      poll_every_minutes: Math.max(1, Math.min(1440, Math.floor(input.poll_every_minutes))),
      updated_at: new Date().toISOString(),
    };
    if (typeof input.password === "string" && input.password.trim() !== "") {
      row.auth_secret = input.password.trim();
    }
    const existing = await admin
      .from("support_mailbox_configs")
      .select("id")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing.error && !isMissingSchemaError(existing.error.message)) {
      return { ok: false, error: existing.error.message };
    }
    const q = existing.data
      ? admin.from("support_mailbox_configs").update(row).eq("id", existing.data.id)
      : admin.from("support_mailbox_configs").insert(row);
    const { error } = await q;
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Support-tabeller mangler. Kør supabase_support_tickets_setup.sql og prøv igen.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/support");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function upsertSupportReplyTemplate(input: {
  id?: string;
  name: string;
  language_code: string;
  body_template: string;
  trigger_words: string[];
  trigger_phrases: string[];
  active: boolean;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const row = {
      name: input.name.trim(),
      language_code: input.language_code.trim() || "en-US",
      body_template: input.body_template.trim(),
      trigger_words: input.trigger_words.map((x) => x.trim()).filter(Boolean),
      trigger_phrases: input.trigger_phrases.map((x) => x.trim()).filter(Boolean),
      active: input.active,
      updated_at: new Date().toISOString(),
    };
    if (!row.name || !row.body_template) {
      return { ok: false, error: "Navn og skabelontekst skal udfyldes." };
    }
    const { error } = input.id
      ? await admin.from("support_reply_templates").update(row).eq("id", input.id)
      : await admin.from("support_reply_templates").insert(row);
    if (error) {
      if (isMissingSchemaError(error.message)) {
        return {
          ok: false,
          error:
            "Support-tabeller mangler. Kør supabase_support_tickets_setup.sql og prøv igen.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/support");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function deleteSupportReplyTemplate(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { error } = await admin.from("support_reply_templates").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/super-admin/support");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function updateSupportTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    if (!TICKET_STATUS.includes(status)) {
      return { ok: false, error: "Ugyldig status." };
    }
    const admin = getAdminClient();
    const { error } = await admin
      .from("support_tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", ticketId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/super-admin/support");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function addSupportTicketReply(input: {
  ticketId: string;
  replyText: string;
  targetLanguage: string;
}): Promise<{ ok: true; translated: string } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const text = input.replyText.trim();
    if (!text) return { ok: false, error: "Svartekst skal udfyldes." };
    const target = input.targetLanguage.trim() || "en-US";
    const translated = await translateText(
      text,
      target,
      "Outgoing support email. Keep polite and concise."
    );
    const { error } = await admin.from("support_ticket_messages").insert({
      ticket_id: input.ticketId,
      direction: "outgoing",
      language_original: "en-US",
      language_target: target,
      body_original: text,
      body_translated: translated,
    });
    if (error) return { ok: false, error: error.message };
    const { error: upErr } = await admin
      .from("support_tickets")
      .update({ status: "pending", updated_at: new Date().toISOString() })
      .eq("id", input.ticketId);
    if (upErr) return { ok: false, error: upErr.message };
    revalidatePath("/super-admin/support");
    return { ok: true, translated };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function ingestSupportEmail(input: {
  sender_email: string;
  sender_name?: string;
  subject: string;
  body: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const senderEmail = input.sender_email.trim().toLowerCase();
    if (!senderEmail || !senderEmail.includes("@")) {
      return { ok: false, error: "Afsender-email er ugyldig." };
    }
    const sourceSubject = input.subject.trim() || "(uden emne)";
    const sourceBody = input.body.trim();
    if (!sourceBody) return { ok: false, error: "Mail-indhold mangler." };

    const language = await detectLanguage(`${sourceSubject}\n\n${sourceBody}`);
    const translatedSubject = await translateText(
      sourceSubject,
      "en-US",
      "Incoming support email subject"
    );
    const translatedBody = await translateText(
      sourceBody,
      "en-US",
      "Incoming support email body"
    );

    let b2bWorkplaceId: string | null = null;
    let b2bAdminUserId: string | null = null;
    const labels: string[] = [];
    const { data: adminMembers } = await admin
      .from("workplace_members")
      .select("workplace_id, user_id, role")
      .eq("role", "ADMIN");
    if (adminMembers && adminMembers.length > 0) {
      for (const row of adminMembers) {
        const uid = String(row.user_id ?? "");
        if (!uid) continue;
        const userRes = await admin.auth.admin.getUserById(uid);
        const email = userRes.data.user?.email?.trim().toLowerCase();
        if (email && email === senderEmail) {
          b2bWorkplaceId = String(row.workplace_id ?? "") || null;
          b2bAdminUserId = uid;
          labels.push("B2B");
          break;
        }
      }
    }

    const ins = await admin
      .from("support_tickets")
      .insert({
        sender_email: senderEmail,
        sender_name: input.sender_name?.trim() || null,
        language_original: language || "unknown",
        subject_original: sourceSubject,
        body_original: sourceBody,
        subject_translated: translatedSubject,
        body_translated: translatedBody,
        labels,
        workplace_id: b2bWorkplaceId,
        workplace_admin_user_id: b2bAdminUserId,
      })
      .select("id")
      .single();
    if (ins.error) {
      if (isMissingSchemaError(ins.error.message)) {
        return {
          ok: false,
          error:
            "Support-tabeller mangler. Kør supabase_support_tickets_setup.sql og prøv igen.",
        };
      }
      return { ok: false, error: ins.error.message };
    }
    const ticketId = String(ins.data.id);
    const { error: msgErr } = await admin.from("support_ticket_messages").insert({
      ticket_id: ticketId,
      direction: "incoming",
      sender_email: senderEmail,
      language_original: language || "unknown",
      language_target: "en-US",
      body_original: sourceBody,
      body_translated: translatedBody,
    });
    if (msgErr) return { ok: false, error: msgErr.message };

    revalidatePath("/super-admin/support");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
