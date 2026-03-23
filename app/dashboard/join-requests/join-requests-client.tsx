"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  approveJoinRequestAction,
  rejectJoinRequestAction,
} from "@/app/join-requests-actions";
import type { JoinRequestListItem } from "@/src/lib/join-requests";

export function JoinRequestsClient({
  initialRows,
  workplaceId,
}: {
  initialRows: JoinRequestListItem[];
  workplaceId: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function approve(id: string) {
    setErr(null);
    setBusy(id);
    const r = await approveJoinRequestAction(id);
    setBusy(null);
    if (!r.ok) {
      setErr(r.error);
      return;
    }
    setRows((x) => x.filter((row) => row.id !== id));
    router.refresh();
  }

  async function reject(id: string) {
    setErr(null);
    setBusy(id);
    const r = await rejectJoinRequestAction(id);
    setBusy(null);
    if (!r.ok) {
      setErr(r.error);
      return;
    }
    setRows((x) => x.filter((row) => row.id !== id));
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Adgangsanmodninger
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Brugere uden medlemskab har anmodet om adgang til den aktive arbejdsplads (
        <span className="font-mono text-xs">{workplaceId.slice(0, 8)}…</span>).
      </p>

      {err ? (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100"
        >
          {err}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
          Ingen afventende anmodninger.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {row.email}
                </p>
                <p className="text-xs text-zinc-500">
                  Anmodet{" "}
                  {new Date(row.created_at).toLocaleString("da-DK", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy === row.id}
                  onClick={() => void approve(row.id)}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Godkend
                </button>
                <button
                  type="button"
                  disabled={busy === row.id}
                  onClick={() => void reject(row.id)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-50"
                >
                  Afvis
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
