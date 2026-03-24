import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { JoinRequestsClient } from "../join-requests/join-requests-client";
import type { JoinRequestListItem } from "@/src/lib/join-requests";
import { createTranslator } from "@/src/lib/translations-server";
import { getUiTranslations } from "@/src/lib/ui-language-server";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";
import { getAdminClient } from "@/src/utils/supabase/admin";

function isMissingJoinRequestsTable(error: {
  message?: string;
  code?: string;
}): boolean {
  const m = (error.message ?? "").toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("does not exist") ||
    error.code === "42P01"
  );
}

export async function JoinRequestsSection() {
  const map = await getUiTranslations();
  const tr = createTranslator(map);
  const jar = await cookies();
  const wpId = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value;

  const title = tr(
    "notifications.section.access.title",
    "Adgang til arbejdsplads"
  );
  const intro = tr(
    "notifications.section.access.intro",
    "Brugere uden medlemskab kan anmode om adgang til den arbejdsplads, du har valgt i menuen."
  );
  const noWp = tr(
    "notifications.section.access.no_workplace",
    "Vælg en arbejdsplads (ikon ved logoet), før du kan se adgangsanmodninger."
  );
  const tableMissing = tr(
    "notifications.section.access.table_missing",
    "Databasen mangler tabellen til adgangsanmodninger. Kør migreringen workplace_join_requests (se projektets SQL), eller kontakt support."
  );

  let body: ReactNode;

  if (!wpId) {
    body = (
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
        {noWp}
      </p>
    );
  } else {
    const admin = getAdminClient();
    const { data: rows, error } = await admin
      .from("workplace_join_requests")
      .select("id, user_id, workplace_id, status, created_at")
      .eq("workplace_id", wpId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingJoinRequestsTable(error)) {
        body = (
          <p className="mt-4 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {tableMissing}
          </p>
        );
      } else {
        body = (
          <p className="mt-4 text-sm text-red-700 dark:text-red-300" role="alert">
            {error.message}
          </p>
        );
      }
    } else {
      const enriched: JoinRequestListItem[] = [];
      for (const r of rows ?? []) {
        let email = "?";
        try {
          const { data: u } = await admin.auth.admin.getUserById(
            r.user_id as string
          );
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
      body = (
        <JoinRequestsClient initialRows={enriched} workplaceId={wpId} />
      );
    }
  }

  return (
    <section
      id="adgang"
      className="mt-10 scroll-mt-6"
      aria-labelledby="notifications-access-heading"
    >
      <h2
        id="notifications-access-heading"
        className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        {title}
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{intro}</p>
      {body}
    </section>
  );
}
