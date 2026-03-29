"use server";

import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import { GEMINI_TEXT_MODEL } from "@/src/utils/ai/gemini";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

const ROLE_OPTIONS = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE"] as const;
type RoleValue = (typeof ROLE_OPTIONS)[number];

function isRoleValue(s: string): s is RoleValue {
  return (ROLE_OPTIONS as readonly string[]).includes(s);
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

async function requireSuperAdminUserId(): Promise<string> {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Ikke logget ind.");
  return user.id;
}

function geminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY mangler.");
  return new GoogleGenAI({ apiKey });
}

async function translateForLanguage(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  context: string
): Promise<string> {
  const source = text.trim();
  if (!source) return "";
  const src = sourceLanguage.trim().toLowerCase();
  const tgt = targetLanguage.trim().toLowerCase();
  if (src === tgt) return source;
  const ai = geminiClient();
  const res = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    config: {
      systemInstruction:
        `Translate from ${sourceLanguage} to ${targetLanguage}. ` +
        `Context: ${context}. Keep it concise and suitable as notification copy. ` +
        "Return only translated text.",
      temperature: 0.2,
    },
    contents: source,
  });
  return res.text?.trim() || source;
}

export type NotificationAudienceWorkplace = {
  id: string;
  name: string;
  country_code: string | null;
  primary_language_code: string | null;
};

export type NotificationAudienceMember = {
  user_id: string;
  workplace_id: string;
  role: RoleValue;
  email: string | null;
  display_name: string;
};

export type RecentNotificationBatch = {
  id: string;
  title_original: string;
  source_language_code: string;
  recipients_count: number;
  created_at: string;
};

export async function getNotificationBroadcastData(): Promise<
  | {
      ok: true;
      workplaces: NotificationAudienceWorkplace[];
      members: NotificationAudienceMember[];
      recent: RecentNotificationBatch[];
    }
  | { ok: false; error: string }
> {
  try {
    await requireSuperAdminUserId();
    const admin = getAdminClient();
    const [wpRes, memberRes, profileRes, recentRes] = await Promise.all([
      admin
        .from("workplaces")
        .select("id, name, company_name, country_code")
        .order("company_name", { ascending: true }),
      admin
        .from("workplace_members")
        .select("user_id, workplace_id, role")
        .order("created_at", { ascending: false }),
      admin
        .from("user_profiles")
        .select("user_id, first_name, last_name"),
      admin
        .from("super_admin_notification_batches")
        .select("id, title_original, source_language_code, recipients_count, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    if (wpRes.error) return { ok: false, error: wpRes.error.message };
    if (memberRes.error) return { ok: false, error: memberRes.error.message };
    if (profileRes.error && !isMissingSchemaError(profileRes.error.message)) {
      return { ok: false, error: profileRes.error.message };
    }
    if (recentRes.error && !isMissingSchemaError(recentRes.error.message)) {
      return { ok: false, error: recentRes.error.message };
    }

    const countriesRes = await admin
      .from("eu_countries")
      .select("country_code, primary_language_code");
    if (countriesRes.error) {
      return { ok: false, error: countriesRes.error.message };
    }
    const primaryLangByCountry = new Map<string, string>();
    for (const row of countriesRes.data ?? []) {
      const cc = String(row.country_code ?? "").trim().toUpperCase();
      const lang = String(row.primary_language_code ?? "").trim();
      if (cc && lang) primaryLangByCountry.set(cc, lang);
    }

    const profileNameByUser = new Map<string, string>();
    for (const row of profileRes.data ?? []) {
      const uid = String(row.user_id ?? "");
      if (!uid) continue;
      const first = String(row.first_name ?? "").trim();
      const last = String(row.last_name ?? "").trim();
      const name = `${first} ${last}`.trim();
      if (name) profileNameByUser.set(uid, name);
    }

    const userIds = [...new Set((memberRes.data ?? []).map((m) => String(m.user_id ?? "")))].filter(
      Boolean
    );
    const emailByUser = new Map<string, string | null>();
    for (const uid of userIds) {
      const user = await admin.auth.admin.getUserById(uid);
      emailByUser.set(uid, user.data.user?.email ?? null);
    }

    const workplaces = (wpRes.data ?? []).map((row) => {
      const cc = String(row.country_code ?? "").trim().toUpperCase();
      const name = String(row.company_name ?? row.name ?? "").trim() || String(row.id);
      return {
        id: String(row.id),
        name,
        country_code: cc || null,
        primary_language_code: cc ? primaryLangByCountry.get(cc) ?? "en-US" : "en-US",
      } satisfies NotificationAudienceWorkplace;
    });

    const members = (memberRes.data ?? [])
      .map((row) => {
        const role = String(row.role ?? "").toUpperCase();
        if (!isRoleValue(role)) return null;
        const uid = String(row.user_id ?? "");
        return {
          user_id: uid,
          workplace_id: String(row.workplace_id ?? ""),
          role,
          email: emailByUser.get(uid) ?? null,
          display_name:
            profileNameByUser.get(uid) ??
            emailByUser.get(uid) ??
            `${uid.slice(0, 8)}…`,
        } satisfies NotificationAudienceMember;
      })
      .filter((x): x is NotificationAudienceMember => x != null);

    return {
      ok: true,
      workplaces,
      members,
      recent: ((recentRes.data ?? []) as Record<string, unknown>[]).map((r) => ({
        id: String(r.id),
        title_original: String(r.title_original ?? ""),
        source_language_code: String(r.source_language_code ?? "da"),
        recipients_count: Number(r.recipients_count ?? 0),
        created_at: String(r.created_at ?? ""),
      })),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function sendNotificationBroadcast(input: {
  title: string;
  body: string;
  sourceLanguageCode: string;
  workplaceIds: string[];
  roles: string[];
  userIds: string[];
  targetAll: boolean;
}): Promise<{ ok: true; recipients: number; languages: string[] } | { ok: false; error: string }> {
  try {
    const senderUserId = await requireSuperAdminUserId();
    const admin = getAdminClient();
    const title = input.title.trim();
    const body = input.body.trim();
    if (!title || !body) {
      return { ok: false, error: "Overskrift og brødtekst skal udfyldes." };
    }
    const sourceLanguageCode = input.sourceLanguageCode.trim() || "da";
    const roleFilter = input.roles.filter(isRoleValue);
    const wpFilter = input.workplaceIds.filter(Boolean);
    const userFilter = input.userIds.filter(Boolean);

    const [membersRes, wpRes, countryRes] = await Promise.all([
      admin.from("workplace_members").select("user_id, workplace_id, role"),
      admin.from("workplaces").select("id, country_code"),
      admin.from("eu_countries").select("country_code, primary_language_code"),
    ]);
    if (membersRes.error) return { ok: false, error: membersRes.error.message };
    if (wpRes.error) return { ok: false, error: wpRes.error.message };
    if (countryRes.error) return { ok: false, error: countryRes.error.message };

    const primaryLangByCountry = new Map<string, string>();
    for (const row of countryRes.data ?? []) {
      const cc = String(row.country_code ?? "").trim().toUpperCase();
      const lang = String(row.primary_language_code ?? "").trim();
      if (cc && lang) primaryLangByCountry.set(cc, lang);
    }
    const countryByWorkplaceId = new Map<string, string | null>();
    for (const row of wpRes.data ?? []) {
      const cc = String(row.country_code ?? "").trim().toUpperCase();
      countryByWorkplaceId.set(String(row.id), cc || null);
    }

    const recipients = (membersRes.data ?? [])
      .map((row) => ({
        user_id: String(row.user_id ?? ""),
        workplace_id: String(row.workplace_id ?? ""),
        role: String(row.role ?? "").toUpperCase(),
      }))
      .filter((row) => row.user_id && row.workplace_id && isRoleValue(row.role))
      .filter((row) => (input.targetAll ? true : wpFilter.length ? wpFilter.includes(row.workplace_id) : true))
      .filter((row) => (roleFilter.length ? roleFilter.includes(row.role) : true))
      .filter((row) => (userFilter.length ? userFilter.includes(row.user_id) : true));

    const uniqueRecipients = new Map<string, { user_id: string; workplace_id: string; role: RoleValue }>();
    for (const row of recipients) {
      uniqueRecipients.set(`${row.user_id}:${row.workplace_id}`, row as {
        user_id: string;
        workplace_id: string;
        role: RoleValue;
      });
    }
    const recipientRows = [...uniqueRecipients.values()];
    if (recipientRows.length === 0) {
      return { ok: false, error: "Ingen modtagere matcher det valgte filter." };
    }

    const targetLanguages = new Set<string>();
    const recipientLanguage = new Map<string, string>();
    for (const r of recipientRows) {
      const cc = countryByWorkplaceId.get(r.workplace_id) ?? null;
      const lang = cc ? primaryLangByCountry.get(cc) ?? "en-US" : "en-US";
      recipientLanguage.set(`${r.user_id}:${r.workplace_id}`, lang);
      targetLanguages.add(lang);
    }

    const titleByLanguage = new Map<string, string>();
    const bodyByLanguage = new Map<string, string>();
    for (const lang of targetLanguages) {
      if (lang.toLowerCase() === sourceLanguageCode.toLowerCase()) {
        titleByLanguage.set(lang, title);
        bodyByLanguage.set(lang, body);
      } else {
        titleByLanguage.set(
          lang,
          await translateForLanguage(
            title,
            sourceLanguageCode,
            lang,
            "Notification title for staff."
          )
        );
        bodyByLanguage.set(
          lang,
          await translateForLanguage(
            body,
            sourceLanguageCode,
            lang,
            "Notification body for staff."
          )
        );
      }
    }

    const batchRes = await admin
      .from("super_admin_notification_batches")
      .insert({
        created_by_user_id: senderUserId,
        title_original: title,
        body_original: body,
        source_language_code: sourceLanguageCode,
        target_scope: {
          targetAll: input.targetAll,
          workplaceIds: wpFilter,
          roles: roleFilter,
          userIds: userFilter,
        },
        recipients_count: recipientRows.length,
      })
      .select("id")
      .single();
    if (batchRes.error) {
      if (isMissingSchemaError(batchRes.error.message)) {
        return {
          ok: false,
          error:
            "Notification-tabeller mangler. Kør supabase_super_admin_notifications_setup.sql.",
        };
      }
      return { ok: false, error: batchRes.error.message };
    }
    const batchId = String(batchRes.data.id);

    const deliveries = recipientRows.map((r) => {
      const lang = recipientLanguage.get(`${r.user_id}:${r.workplace_id}`) ?? "en-US";
      return {
        batch_id: batchId,
        user_id: r.user_id,
        workplace_id: r.workplace_id,
        role: r.role,
        language_code: lang,
        title_translated: titleByLanguage.get(lang) ?? title,
        body_translated: bodyByLanguage.get(lang) ?? body,
        status: "queued",
      };
    });
    const ins = await admin.from("super_admin_notification_deliveries").insert(deliveries);
    if (ins.error) return { ok: false, error: ins.error.message };

    // Stub for actual push/sms dispatch layer.
    console.info(
      `[super-admin-notification] batch=${batchId} recipients=${recipientRows.length} languages=${[
        ...targetLanguages,
      ].join(",")}`
    );

    revalidatePath("/super-admin/notifications-broadcast");
    return { ok: true, recipients: recipientRows.length, languages: [...targetLanguages] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
