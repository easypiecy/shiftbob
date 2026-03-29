"use client";

import { useMemo, useState } from "react";
import { Loader2, Megaphone } from "lucide-react";
import {
  sendNotificationBroadcast,
  type NotificationAudienceMember,
  type NotificationAudienceWorkplace,
  type RecentNotificationBatch,
} from "@/src/app/super-admin/notifications-actions";

type Props = {
  workplaces: NotificationAudienceWorkplace[];
  members: NotificationAudienceMember[];
  recent: RecentNotificationBatch[];
};

const ROLE_OPTIONS = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE"] as const;

export default function NotificationsBroadcastClient({
  workplaces,
  members,
  recent,
}: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sourceLanguageCode, setSourceLanguageCode] = useState("da");
  const [targetAll, setTargetAll] = useState(true);
  const [selectedWorkplaces, setSelectedWorkplaces] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = members;
    if (!targetAll && selectedWorkplaces.length > 0) {
      list = list.filter((m) => selectedWorkplaces.includes(m.workplace_id));
    }
    if (selectedRoles.length > 0) {
      list = list.filter((m) => selectedRoles.includes(m.role));
    }
    if (!q) return list.slice(0, 300);
    return list
      .filter((m) =>
        `${m.display_name} ${m.email ?? ""} ${m.role}`.toLowerCase().includes(q)
      )
      .slice(0, 300);
  }, [members, query, selectedRoles, selectedWorkplaces, targetAll]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Notifikationsudsendelse
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Send notifikationer til alle eller målrettet på arbejdsplads, rolle og
            medarbejdere. Tekst oversættes automatisk efter modtagerens arbejdspladsland.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          <Megaphone className="h-3.5 w-3.5" />
          Super Admin
        </span>
      </div>

      {msg ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {msg}
        </div>
      ) : null}

      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Indhold
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm md:col-span-2">
            <span>Overskrift</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              placeholder="Fx Opdatering: Vedligehold i nat"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Kildesprog</span>
            <select
              value={sourceLanguageCode}
              onChange={(e) => setSourceLanguageCode(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            >
              <option value="da">da</option>
              <option value="en-US">en-US</option>
            </select>
          </label>
        </div>
        <label className="space-y-1 text-sm">
          <span>Kort brødtekst</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            placeholder="Kort besked til modtagerne…"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Målgruppe
        </h2>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={targetAll}
            onChange={(e) => {
              setTargetAll(e.target.checked);
              if (e.target.checked) setSelectedWorkplaces([]);
            }}
          />
          Alle arbejdspladser
        </label>

        {!targetAll ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Bestemte arbejdspladser
            </p>
            <div className="flex flex-wrap gap-2">
              {workplaces.map((w) => {
                const checked = selectedWorkplaces.includes(w.id);
                return (
                  <label
                    key={w.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedWorkplaces((prev) =>
                          checked ? prev.filter((x) => x !== w.id) : [...prev, w.id]
                        )
                      }
                    />
                    {w.name}
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Bestemte medarbejderroller
          </p>
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((role) => {
              const checked = selectedRoles.includes(role);
              return (
                <label
                  key={role}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelectedRoles((prev) =>
                        checked ? prev.filter((x) => x !== role) : [...prev, role]
                      )
                    }
                  />
                  {role}
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Bestemte medarbejdere
          </p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Søg navn/e-mail/rolle..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          />
          <div className="max-h-56 overflow-auto rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
            <div className="space-y-1">
              {filteredMembers.map((m) => {
                const key = `${m.user_id}:${m.workplace_id}`;
                const checked = selectedUsers.includes(m.user_id);
                return (
                  <label
                    key={key}
                    className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <span className="truncate">
                      {m.display_name} · {m.email ?? "—"} · {m.role}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedUsers((prev) =>
                          checked
                            ? prev.filter((x) => x !== m.user_id)
                            : [...prev, m.user_id]
                        )
                      }
                    />
                  </label>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Viser op til 300 medarbejdere ad gangen.
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            setMsg(null);
            setBusy(true);
            try {
              const res = await sendNotificationBroadcast({
                title,
                body,
                sourceLanguageCode,
                workplaceIds: selectedWorkplaces,
                roles: selectedRoles,
                userIds: selectedUsers,
                targetAll,
              });
              if (!res.ok) {
                setMsg(res.error);
                return;
              }
              setMsg(
                `Notifikation udsendt til ${res.recipients} modtagere. Sprog: ${res.languages.join(", ")}`
              );
              setTitle("");
              setBody("");
              setSelectedUsers([]);
            } finally {
              setBusy(false);
            }
          }}
          disabled={busy || !title.trim() || !body.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Udsend notifikation
        </button>
      </section>

      <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Seneste udsendelser
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-zinc-500">Ingen udsendelser endnu.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
              >
                <div className="font-medium">{b.title_original}</div>
                <div className="text-xs text-zinc-500">
                  {b.recipients_count} modtagere · {b.source_language_code} ·{" "}
                  {new Date(b.created_at).toLocaleString("da-DK")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
