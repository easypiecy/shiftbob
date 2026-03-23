"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/src/utils/supabase/server";
import { getAdminClient } from "@/src/utils/supabase/admin";

export async function approveJoinRequestAction(
  requestId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Ikke logget ind." };

  const admin = getAdminClient();
  const { data: req, error: reqErr } = await admin
    .from("workplace_join_requests")
    .select("id, user_id, workplace_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (reqErr || !req) {
    return { ok: false, error: "Anmodning ikke fundet." };
  }
  if (req.status !== "pending") {
    return { ok: false, error: "Anmodningen er allerede behandlet." };
  }

  const { data: wm, error: wmErr } = await supabase
    .from("workplace_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("workplace_id", req.workplace_id)
    .maybeSingle();

  if (wmErr || !wm || !["ADMIN", "SUPER_ADMIN"].includes(wm.role as string)) {
    return { ok: false, error: "Ingen administrator-adgang." };
  }

  const { error: upMemberErr } = await admin.from("workplace_members").upsert(
    {
      user_id: req.user_id,
      workplace_id: req.workplace_id,
      role: "EMPLOYEE",
      profile_onboarding_completed: false,
    },
    { onConflict: "user_id,workplace_id" }
  );

  if (upMemberErr) {
    return { ok: false, error: upMemberErr.message };
  }

  const { error: upReqErr } = await admin
    .from("workplace_join_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", requestId);

  if (upReqErr) {
    return { ok: false, error: upReqErr.message };
  }

  revalidatePath("/dashboard/join-requests");
  revalidatePath("/select-workplace");
  return { ok: true };
}

export async function rejectJoinRequestAction(
  requestId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Ikke logget ind." };

  const admin = getAdminClient();
  const { data: req, error: reqErr } = await admin
    .from("workplace_join_requests")
    .select("id, workplace_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (reqErr || !req) {
    return { ok: false, error: "Anmodning ikke fundet." };
  }
  if (req.status !== "pending") {
    return { ok: false, error: "Anmodningen er allerede behandlet." };
  }

  const { data: wm, error: wmErr } = await supabase
    .from("workplace_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("workplace_id", req.workplace_id)
    .maybeSingle();

  if (wmErr || !wm || !["ADMIN", "SUPER_ADMIN"].includes(wm.role as string)) {
    return { ok: false, error: "Ingen administrator-adgang." };
  }

  const { error: upReqErr } = await admin
    .from("workplace_join_requests")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", requestId);

  if (upReqErr) {
    return { ok: false, error: upReqErr.message };
  }

  revalidatePath("/dashboard/join-requests");
  return { ok: true };
}
