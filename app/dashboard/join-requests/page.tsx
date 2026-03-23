import { cookies } from "next/headers";
import { JoinRequestsClient } from "./join-requests-client";
import type { JoinRequestListItem } from "@/src/lib/join-requests";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";
import { getAdminClient } from "@/src/utils/supabase/admin";

export const dynamic = "force-dynamic";

export default async function JoinRequestsPage() {
  const jar = await cookies();
  const wpId = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value;
  if (!wpId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-zinc-700 dark:text-zinc-300">
          Vælg først en arbejdsplads (menu eller skift arbejdsplads), så kan du se
          adgangsanmodninger.
        </p>
      </div>
    );
  }

  const admin = getAdminClient();
  const { data: rows, error } = await admin
    .from("workplace_join_requests")
    .select("id, user_id, workplace_id, status, created_at")
    .eq("workplace_id", wpId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-red-700">{error.message}</p>
      </div>
    );
  }

  const enriched: JoinRequestListItem[] = [];
  for (const r of rows ?? []) {
    let email = "?";
    try {
      const { data: u } = await admin.auth.admin.getUserById(r.user_id as string);
      email = u.user?.email ?? "?";
    } catch {
      /* ignore */
    }
    enriched.push({
      id: r.id as string,
      user_id: r.user_id as string,
      workplace_id: r.workplace_id as string,
      status: r.status as string,
      created_at: r.created_at as string,
      email,
    });
  }

  return (
    <JoinRequestsClient initialRows={enriched} workplaceId={wpId} />
  );
}
