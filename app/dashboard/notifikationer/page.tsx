import { cookies } from "next/headers";
import { JoinRequestsSection } from "./join-requests-section";
import { createTranslator } from "@/src/lib/translations-server";
import { getUiTranslations } from "@/src/lib/ui-language-server";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";
import { createServerSupabase } from "@/src/utils/supabase/server";

function isMissingTable(error: { message?: string; code?: string }): boolean {
  const m = (error.message ?? "").toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("does not exist") ||
    error.code === "42P01"
  );
}

export default async function NotifikationerPage() {
  const map = await getUiTranslations();
  const tr = createTranslator(map);
  const supabase = await createServerSupabase();
  const jar = await cookies();
  const wpId = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value ?? null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let broadcasts:
    | Array<{
        id: string;
        title_translated: string;
        body_translated: string;
        status: string;
        created_at: string;
      }>
    | null = null;
  let broadcastsError: string | null = null;

  if (user?.id && wpId) {
    const markRead = await supabase
      .from("super_admin_notification_deliveries")
      .update({ status: "sent" })
      .eq("user_id", user.id)
      .eq("workplace_id", wpId)
      .eq("status", "queued");
    if (markRead.error && !isMissingTable(markRead.error)) {
      broadcastsError = markRead.error.message;
    }
    const q = await supabase
      .from("super_admin_notification_deliveries")
      .select("id, title_translated, body_translated, status, created_at")
      .eq("user_id", user.id)
      .eq("workplace_id", wpId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (q.error) {
      if (!isMissingTable(q.error)) {
        broadcastsError = q.error.message;
      } else {
        broadcasts = [];
      }
    } else {
      broadcasts = (q.data ?? []) as Array<{
        id: string;
        title_translated: string;
        body_translated: string;
        status: string;
        created_at: string;
      }>;
    }
  } else {
    broadcasts = [];
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 px-3 py-6 dark:bg-zinc-950 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {tr("notifications.page.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {tr("notifications.page.intro")}
        </p>

        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Udsendte notifikationer
          </h2>
          {!wpId ? (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Vælg en arbejdsplads for at se notifikationer.
            </p>
          ) : broadcastsError ? (
            <p className="mt-3 text-sm text-red-700 dark:text-red-300">{broadcastsError}</p>
          ) : broadcasts && broadcasts.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {broadcasts.map((n) => (
                <li
                  key={n.id}
                  className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700"
                >
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {n.title_translated}
                  </div>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {n.body_translated}
                  </p>
                  <div className="mt-1 text-xs text-zinc-500">
                    {new Date(n.created_at).toLocaleString("da-DK")} · {n.status}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Ingen notifikationer endnu.
            </p>
          )}
        </section>

        <JoinRequestsSection />
      </div>
    </div>
  );
}
