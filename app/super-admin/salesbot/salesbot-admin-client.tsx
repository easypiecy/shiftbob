"use client";

import { useMemo, useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import {
  createSalesBotKnowledgeEntry,
  deleteSalesBotKnowledgeEntry,
  saveSalesBotManifest,
  type LanguageOptionRow,
} from "@/src/app/super-admin/salesbot-actions";
import type { SalesBotKnowledgeEntry, SalesBotManifest } from "@/src/lib/salesbot-runtime";

type Props = {
  initialManifest: SalesBotManifest;
  initialKnowledge: SalesBotKnowledgeEntry[];
  languages: LanguageOptionRow[];
};

export default function SalesBotAdminClient({
  initialManifest,
  initialKnowledge,
  languages,
}: Props) {
  const [manifest, setManifest] = useState(initialManifest);
  const [knowledge, setKnowledge] = useState(initialKnowledge);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    language_code: languages[0]?.language_code ?? "en-US",
    title: "",
    question: "",
    answer: "",
    tags: "",
    sort_order: "100",
  });

  const knowledgeByLanguage = useMemo(() => {
    return [...knowledge].sort((a, b) => {
      if (a.language_code !== b.language_code) {
        return a.language_code.localeCompare(b.language_code);
      }
      return a.sort_order - b.sort_order;
    });
  }, [knowledge]);

  async function run<T>(key: string, fn: () => Promise<T>): Promise<T | undefined> {
    setBusy(key);
    setMessage(null);
    try {
      return await fn();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            SalesBot
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manifest og knowledge base til botten på landing-siden.
          </p>
        </div>

        {message ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-200">
            {message}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Bot navn</span>
            <input
              value={manifest.bot_name}
              onChange={(e) => setManifest((x) => ({ ...x, bot_name: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span>Overordnet bot-instruktion (prompt)</span>
            <textarea
              rows={5}
              value={manifest.tone_of_voice}
              onChange={(e) => setManifest((x) => ({ ...x, tone_of_voice: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              placeholder="Beskriv hvordan botten skal optræde: tone, længde, do/don't, hvordan usikkerhed håndteres, hvordan den skal henvise til priser og produkter osv."
            />
            <p className="text-xs text-zinc-500">
              Brug feltet til en detaljeret instruktion om bot-adfærd og svarstil.
            </p>
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span>Velkomstbesked</span>
            <textarea
              rows={3}
              value={manifest.welcome_message}
              onChange={(e) => setManifest((x) => ({ ...x, welcome_message: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>CTA label</span>
            <input
              value={manifest.cta_label}
              onChange={(e) => setManifest((x) => ({ ...x, cta_label: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>CTA link</span>
            <input
              value={manifest.cta_href}
              onChange={(e) => setManifest((x) => ({ ...x, cta_href: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span>Fallback svar</span>
            <textarea
              rows={3}
              value={manifest.fallback_reply}
              onChange={(e) => setManifest((x) => ({ ...x, fallback_reply: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={async () => {
            const res = await run("save-manifest", () =>
              saveSalesBotManifest({
                bot_name: manifest.bot_name,
                welcome_message: manifest.welcome_message,
                tone_of_voice: manifest.tone_of_voice,
                cta_label: manifest.cta_label,
                cta_href: manifest.cta_href,
                fallback_reply: manifest.fallback_reply,
              })
            );
            if (!res) return;
            if (!res.ok) {
              setMessage(res.error);
              return;
            }
            setMessage("Manifest gemt.");
          }}
          disabled={busy === "save-manifest"}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {busy === "save-manifest" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Gem manifest
        </button>
      </section>

      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Knowledge base</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Tilføj ny viden og slet gamle entries.
          </p>
        </div>

        <div className="space-y-2">
          {knowledgeByLanguage.length === 0 ? (
            <p className="text-sm text-zinc-500">Ingen entries endnu.</p>
          ) : (
            knowledgeByLanguage.map((entry) => (
              <article
                key={entry.id}
                className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {entry.language_code} · sort {entry.sort_order}
                    </p>
                    <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      <strong>Q:</strong> {entry.question}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                      <strong>A:</strong> {entry.answer}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      tags: {entry.tags.join(", ") || "—"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await run(`delete-${entry.id}`, () =>
                        deleteSalesBotKnowledgeEntry(entry.id)
                      );
                      if (!res) return;
                      if (!res.ok) {
                        setMessage(res.error);
                        return;
                      }
                      setKnowledge((prev) => prev.filter((row) => row.id !== entry.id));
                      setMessage("Knowledge entry slettet.");
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Slet
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/30">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Ny knowledge entry
          </h3>
          <div className="grid gap-2 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>Sprog</span>
              <select
                value={draft.language_code}
                onChange={(e) => setDraft((x) => ({ ...x, language_code: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              >
                {languages.map((lang) => (
                  <option key={lang.language_code} value={lang.language_code}>
                    {lang.name} ({lang.language_code})
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>Sort order</span>
              <input
                value={draft.sort_order}
                onChange={(e) => setDraft((x) => ({ ...x, sort_order: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              />
            </label>
          </div>
          <label className="space-y-1 text-sm">
            <span>Titel</span>
            <input
              value={draft.title}
              onChange={(e) => setDraft((x) => ({ ...x, title: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Spørgsmål (det brugeren skriver)</span>
            <input
              value={draft.question}
              onChange={(e) => setDraft((x) => ({ ...x, question: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Svar</span>
            <textarea
              rows={4}
              value={draft.answer}
              onChange={(e) => setDraft((x) => ({ ...x, answer: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span>Tags (komma-separeret)</span>
            <input
              value={draft.tags}
              onChange={(e) => setDraft((x) => ({ ...x, tags: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
            />
          </label>

          <button
            type="button"
            onClick={async () => {
              const res = await run("create-entry", () =>
                createSalesBotKnowledgeEntry({
                  language_code: draft.language_code,
                  title: draft.title,
                  question: draft.question,
                  answer: draft.answer,
                  tags: draft.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                  sort_order: Number(draft.sort_order),
                })
              );
              if (!res) return;
              if (!res.ok) {
                setMessage(res.error);
                return;
              }
              setMessage("Knowledge entry oprettet.");
              window.location.reload();
            }}
            disabled={busy === "create-entry"}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {busy === "create-entry" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Tilføj entry
          </button>
        </div>
      </section>
    </div>
  );
}
