import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkplaceSummary } from "@/src/lib/workplaces";

/** Til admin-liste (server beriger med e-mail). */
export type JoinRequestListItem = {
  id: string;
  user_id: string;
  workplace_id: string;
  status: string;
  created_at: string;
  email: string;
};

export type JoinRequestRow = {
  id: string;
  user_id: string;
  workplace_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
};

export async function listWorkplacesOpenForJoin(
  supabase: SupabaseClient
): Promise<WorkplaceSummary[]> {
  const { data, error } = await supabase.rpc("list_workplaces_open_for_join");
  if (error) throw error;
  const rows = (data ?? []) as { id: string; name: string; created_at?: string }[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    created_at: r.created_at ?? "",
  }));
}

export async function requestWorkplaceJoin(
  supabase: SupabaseClient,
  workplaceId: string
): Promise<{ ok: boolean; error?: string; request_id?: string; note?: string }> {
  const { data, error } = await supabase.rpc("request_workplace_join", {
    p_workplace_id: workplaceId,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  const j = data as { ok?: boolean; error?: string; request_id?: string; note?: string };
  if (!j?.ok) {
    return { ok: false, error: j?.error ?? "unknown" };
  }
  return {
    ok: true,
    request_id: j.request_id,
    note: j.note,
  };
}

/** Brugerens egne anmodninger (fx pending). */
export async function fetchMyJoinRequests(
  supabase: SupabaseClient
): Promise<JoinRequestRow[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("workplace_join_requests")
    .select("id, user_id, workplace_id, status, created_at, reviewed_at, reviewed_by")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as JoinRequestRow[];
}

export function hasPendingJoinRequest(rows: JoinRequestRow[]): boolean {
  return rows.some((r) => r.status === "pending");
}
