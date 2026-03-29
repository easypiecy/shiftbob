"use client";

import { useMemo, useState } from "react";
import { Loader2, Mail, MessageSquareText, Settings2 } from "lucide-react";
import {
  addSupportTicketReply,
  deleteSupportReplyTemplate,
  ingestSupportEmail,
  saveSupportMailboxConfig,
  updateSupportTicketStatus,
  upsertSupportReplyTemplate,
  type LanguageOptionRow,
  type SupportMailboxConfigRow,
  type SupportReplyTemplateRow,
  type SupportTicketMessageRow,
  type SupportTicketRow,
} from "@/src/app/super-admin/support-actions";

type Props = {
  initialMailbox: SupportMailboxConfigRow | null;
  initialTickets: SupportTicketRow[];
  initialMessages: SupportTicketMessageRow[];
  initialTemplates: SupportReplyTemplateRow[];
  languages: LanguageOptionRow[];
};

export default function SupportAdminClient({
  initialMailbox,
  initialTickets,
  initialMessages,
  initialTemplates,
  languages,
}: Props) {
  const [tab, setTab] = useState<"inbox" | "config" | "templates">("inbox");
  const [tickets, setTickets] = useState(initialTickets);
  const [messages, setMessages] = useState(initialMessages);
  const [templates, setTemplates] = useState(initialTemplates);
  const [mailbox, setMailbox] = useState<SupportMailboxConfigRow | null>(initialMailbox);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState(initialTickets[0]?.id ?? null);

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId]
  );
  const ticketMessages = useMemo(
    () =>
      selectedTicket
        ? messages.filter((m) => m.ticket_id === selectedTicket.id)
        : [],
    [messages, selectedTicket]
  );
  const suggestedTemplates = useMemo(() => {
    if (!selectedTicket) return [];
    const hay = `${selectedTicket.subject_translated}\n${selectedTicket.body_translated}`.toLowerCase();
    return templates.filter((tpl) => {
      const words = tpl.trigger_words.some((w) => hay.includes(w.toLowerCase()));
      const phrases = tpl.trigger_phrases.some((p) => hay.includes(p.toLowerCase()));
      return tpl.active && (words || phrases);
    });
  }, [templates, selectedTicket]);

  const [replyText, setReplyText] = useState("");
  const [replyLanguage, setReplyLanguage] = useState("en-US");
  const [ingest, setIngest] = useState({
    sender_email: "",
    sender_name: "",
    subject: "",
    body: "",
  });
  const [configDraft, setConfigDraft] = useState({
    protocol: (mailbox?.protocol ?? "imap") as "imap" | "pop3",
    host: mailbox?.host ?? "",
    port: String(mailbox?.port ?? 993),
    username: mailbox?.username ?? "",
    password: "",
    mailbox_name: mailbox?.mailbox_name ?? "INBOX",
    use_tls: mailbox?.use_tls ?? true,
    active: mailbox?.active ?? false,
    poll_every_minutes: String(mailbox?.poll_every_minutes ?? 5),
  });
  const [templateDraft, setTemplateDraft] = useState({
    id: "",
    name: "",
    language_code: "en-US",
    body_template: "",
    trigger_words: "",
    trigger_phrases: "",
    active: true,
  });

  async function run<T>(key: string, fn: () => Promise<T>): Promise<T | undefined> {
    setMsg(null);
    setBusy(key);
    try {
      return await fn();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Support tickets
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Inbox, POP3/IMAP mail-konfiguration og templates med trigger-ord/sætninger.
        </p>
      </div>
      {msg ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {msg}
        </div>
      ) : null}

      <div className="inline-flex gap-2 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
        {[
          { id: "inbox", label: "Inbox", icon: Mail },
          { id: "config", label: "Mail setup", icon: Settings2 },
          { id: "templates", label: "Templates", icon: MessageSquareText },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as "inbox" | "config" | "templates")}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "inbox" ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(260px,320px)_1fr]">
          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Tickets
            </h2>
            <ul className="space-y-2">
              {tickets.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTicketId(t.id);
                      setReplyLanguage(t.language_original || "en-US");
                    }}
                    className={
                      selectedTicketId === t.id
                        ? "w-full rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-left dark:border-zinc-700 dark:bg-zinc-800"
                        : "w-full rounded-lg border border-zinc-200 px-3 py-2 text-left hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                    }
                  >
                    <div className="truncate text-sm font-medium">{t.subject_original}</div>
                    <div className="mt-0.5 text-xs text-zinc-500">{t.sender_email}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-zinc-700">
                        {t.status}
                      </span>
                      {t.labels.map((l) => (
                        <span
                          key={l}
                          className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-900 dark:bg-blue-950/60 dark:text-blue-100"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            {!selectedTicket ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Vælg en ticket.</p>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {selectedTicket.subject_original}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {selectedTicket.sender_email} · {selectedTicket.language_original}
                    </p>
                  </div>
                  <select
                    value={selectedTicket.status}
                    onChange={async (e) => {
                      const status = e.target.value as SupportTicketRow["status"];
                      const res = await run("ticket-status", () =>
                        updateSupportTicketStatus(selectedTicket.id, status)
                      );
                      if (!res) return;
                      if (!res.ok) {
                        setMsg(res.error);
                        return;
                      }
                      setTickets((prev) =>
                        prev.map((x) => (x.id === selectedTicket.id ? { ...x, status } : x))
                      );
                    }}
                    className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-950"
                  >
                    <option value="open">open</option>
                    <option value="pending">pending</option>
                    <option value="resolved">resolved</option>
                    <option value="closed">closed</option>
                  </select>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <article className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Original
                    </h4>
                    <p className="whitespace-pre-wrap text-sm">{selectedTicket.body_original}</p>
                  </article>
                  <article className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Instant oversættelse
                    </h4>
                    <p className="whitespace-pre-wrap text-sm">{selectedTicket.body_translated}</p>
                  </article>
                </div>

                <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Tråd
                  </h4>
                  <ul className="space-y-2">
                    {ticketMessages.map((m) => (
                      <li
                        key={m.id}
                        className={
                          m.direction === "outgoing"
                            ? "rounded bg-blue-50 px-2 py-1.5 text-sm dark:bg-blue-950/30"
                            : "rounded bg-zinc-50 px-2 py-1.5 text-sm dark:bg-zinc-800/60"
                        }
                      >
                        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                          {m.direction} · {m.language_original}
                          {m.language_target ? ` -> ${m.language_target}` : ""}
                        </div>
                        <p className="whitespace-pre-wrap">{m.body_original}</p>
                        {m.body_translated && m.body_translated !== m.body_original ? (
                          <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-500">
                            {m.body_translated}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Foreslåede templates
                  </h4>
                  {suggestedTemplates.length === 0 ? (
                    <p className="text-sm text-zinc-500">Ingen template-match.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {suggestedTemplates.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => setReplyText(tpl.body_template)}
                          className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                        >
                          {tpl.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Svar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={replyLanguage}
                      onChange={(e) => setReplyLanguage(e.target.value)}
                      className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-950"
                    >
                      {languages.map((l) => (
                        <option key={l.language_code} value={l.language_code}>
                          {l.name} ({l.language_code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
                    placeholder="Skriv svar på engelsk eller dansk — systemet oversætter ved afsendelse."
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!selectedTicket) return;
                      const res = await run("reply-send", () =>
                        addSupportTicketReply({
                          ticketId: selectedTicket.id,
                          replyText,
                          targetLanguage: replyLanguage,
                        })
                      );
                      if (!res) return;
                      if (!res.ok) {
                        setMsg(res.error);
                        return;
                      }
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: `local-${Date.now()}`,
                          ticket_id: selectedTicket.id,
                          direction: "outgoing",
                          sender_email: null,
                          language_original: "en-US",
                          language_target: replyLanguage,
                          body_original: replyText,
                          body_translated: res.translated,
                          created_at: new Date().toISOString(),
                        },
                      ]);
                      setTickets((prev) =>
                        prev.map((x) =>
                          x.id === selectedTicket.id ? { ...x, status: "pending" } : x
                        )
                      );
                      setReplyText("");
                      setMsg("Svar gemt og instant-oversat.");
                    }}
                    disabled={busy === "reply-send" || !replyText.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    {busy === "reply-send" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Gem svar
                  </button>
                </div>
              </>
            )}
          </section>

          <section className="lg:col-span-2 space-y-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/30">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Manuel indgående mail (til test/import)
            </h3>
            <div className="grid gap-2 md:grid-cols-2">
              <input
                value={ingest.sender_email}
                onChange={(e) => setIngest((x) => ({ ...x, sender_email: e.target.value }))}
                placeholder="sender@domain.com"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
              />
              <input
                value={ingest.sender_name}
                onChange={(e) => setIngest((x) => ({ ...x, sender_name: e.target.value }))}
                placeholder="Afsendernavn"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
              />
            </div>
            <input
              value={ingest.subject}
              onChange={(e) => setIngest((x) => ({ ...x, subject: e.target.value }))}
              placeholder="Emne"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            />
            <textarea
              value={ingest.body}
              onChange={(e) => setIngest((x) => ({ ...x, body: e.target.value }))}
              rows={5}
              placeholder="Mail indhold..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            />
            <button
              type="button"
              onClick={async () => {
                const res = await run("ingest-mail", () => ingestSupportEmail(ingest));
                if (!res) return;
                if (!res.ok) {
                  setMsg(res.error);
                  return;
                }
                setMsg("Mail importeret som ticket.");
                window.location.reload();
              }}
              disabled={busy === "ingest-mail"}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {busy === "ingest-mail" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Importér mail
            </button>
          </section>
        </div>
      ) : null}

      {tab === "config" ? (
        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Mail polling (POP3 / IMAP)
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span>Protokol</span>
              <select
                value={configDraft.protocol}
                onChange={(e) =>
                  setConfigDraft((x) => ({ ...x, protocol: e.target.value as "imap" | "pop3" }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              >
                <option value="imap">IMAP</option>
                <option value="pop3">POP3</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span>Host</span>
              <input
                value={configDraft.host}
                onChange={(e) => setConfigDraft((x) => ({ ...x, host: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder="mail.domain.com"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Port</span>
              <input
                value={configDraft.port}
                onChange={(e) => setConfigDraft((x) => ({ ...x, port: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Brugernavn</span>
              <input
                value={configDraft.username}
                onChange={(e) => setConfigDraft((x) => ({ ...x, username: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Password / app password</span>
              <input
                type="password"
                value={configDraft.password}
                onChange={(e) => setConfigDraft((x) => ({ ...x, password: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
                placeholder={mailbox?.has_secret ? "Gemmes allerede (udfyld kun for at ændre)" : ""}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Mailbox</span>
              <input
                value={configDraft.mailbox_name}
                onChange={(e) => setConfigDraft((x) => ({ ...x, mailbox_name: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span>Poll interval (minutter)</span>
              <input
                value={configDraft.poll_every_minutes}
                onChange={(e) =>
                  setConfigDraft((x) => ({ ...x, poll_every_minutes: e.target.value }))
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
              />
            </label>
            <label className="mt-6 inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={configDraft.use_tls}
                onChange={(e) => setConfigDraft((x) => ({ ...x, use_tls: e.target.checked }))}
              />
              Brug TLS
            </label>
            <label className="mt-6 inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={configDraft.active}
                onChange={(e) => setConfigDraft((x) => ({ ...x, active: e.target.checked }))}
              />
              Aktiv polling
            </label>
          </div>
          <button
            type="button"
            onClick={async () => {
              const res = await run("save-config", () =>
                saveSupportMailboxConfig({
                  protocol: configDraft.protocol,
                  host: configDraft.host,
                  port: Number(configDraft.port),
                  username: configDraft.username,
                  password: configDraft.password,
                  mailbox_name: configDraft.mailbox_name,
                  use_tls: configDraft.use_tls,
                  active: configDraft.active,
                  poll_every_minutes: Number(configDraft.poll_every_minutes),
                })
              );
              if (!res) return;
              if (!res.ok) {
                setMsg(res.error);
                return;
              }
              setMailbox({
                id: mailbox?.id ?? "saved",
                protocol: configDraft.protocol,
                host: configDraft.host.trim(),
                port: Number(configDraft.port),
                username: configDraft.username.trim(),
                mailbox_name: configDraft.mailbox_name.trim() || "INBOX",
                use_tls: configDraft.use_tls,
                active: configDraft.active,
                poll_every_minutes: Number(configDraft.poll_every_minutes),
                has_secret: true,
                updated_at: new Date().toISOString(),
              });
              setConfigDraft((x) => ({ ...x, password: "" }));
              setMsg("Mail-konfiguration gemt.");
            }}
            disabled={busy === "save-config"}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {busy === "save-config" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Gem konfiguration
          </button>
        </section>
      ) : null}

      {tab === "templates" ? (
        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Template svar + trigger ord/sætning
          </h2>
          <div className="space-y-2">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">
                    {tpl.name}{" "}
                    <span className="text-xs text-zinc-500">({tpl.language_code})</span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await run(`del-${tpl.id}`, () =>
                        deleteSupportReplyTemplate(tpl.id)
                      );
                      if (!res) return;
                      if (!res.ok) {
                        setMsg(res.error);
                        return;
                      }
                      setTemplates((prev) => prev.filter((x) => x.id !== tpl.id));
                    }}
                    className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/40"
                  >
                    Slet
                  </button>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-600 dark:text-zinc-300">
                  {tpl.body_template}
                </p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  words: {tpl.trigger_words.join(", ") || "—"} | phrases:{" "}
                  {tpl.trigger_phrases.join(", ") || "—"}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/30">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Ny template
            </h3>
            <div className="grid gap-2 md:grid-cols-2">
              <input
                value={templateDraft.name}
                onChange={(e) => setTemplateDraft((x) => ({ ...x, name: e.target.value }))}
                placeholder="Navn"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
              />
              <select
                value={templateDraft.language_code}
                onChange={(e) =>
                  setTemplateDraft((x) => ({ ...x, language_code: e.target.value }))
                }
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
              >
                {languages.map((l) => (
                  <option key={l.language_code} value={l.language_code}>
                    {l.name} ({l.language_code})
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={templateDraft.body_template}
              onChange={(e) =>
                setTemplateDraft((x) => ({ ...x, body_template: e.target.value }))
              }
              rows={5}
              placeholder="Template-svar..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            />
            <input
              value={templateDraft.trigger_words}
              onChange={(e) =>
                setTemplateDraft((x) => ({ ...x, trigger_words: e.target.value }))
              }
              placeholder="Trigger ord, komma-separeret"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            />
            <input
              value={templateDraft.trigger_phrases}
              onChange={(e) =>
                setTemplateDraft((x) => ({ ...x, trigger_phrases: e.target.value }))
              }
              placeholder="Trigger sætninger, komma-separeret"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            />
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={templateDraft.active}
                onChange={(e) => setTemplateDraft((x) => ({ ...x, active: e.target.checked }))}
              />
              Aktiv
            </label>
            <button
              type="button"
              onClick={async () => {
                const res = await run("save-template", () =>
                  upsertSupportReplyTemplate({
                    id: templateDraft.id || undefined,
                    name: templateDraft.name,
                    language_code: templateDraft.language_code,
                    body_template: templateDraft.body_template,
                    trigger_words: templateDraft.trigger_words
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                    trigger_phrases: templateDraft.trigger_phrases
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                    active: templateDraft.active,
                  })
                );
                if (!res) return;
                if (!res.ok) {
                  setMsg(res.error);
                  return;
                }
                setMsg("Template gemt.");
                window.location.reload();
              }}
              disabled={busy === "save-template"}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {busy === "save-template" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Gem template
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
