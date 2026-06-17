"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, RotateCcw, Send, X } from "lucide-react";
import Image from "next/image";
import {
  SUPPORT_TICKET_OPEN_EVENT,
  type SupportTicketOpenDetail,
} from "@/src/lib/support-ticket-events";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  matchedKnowledgeId?: string | null;
};

type Props = {
  languageCode: string;
  iconUrl: string;
  logoUrl: string;
  buttonLabel: string;
  panelTitle: string;
  initialAssistantMessage: string;
  inputPlaceholder: string;
  sendLabel: string;
  closeLabel: string;
  supportButtonLabel: string;
  supportPanelTitle: string;
  supportSubjectLabel: string;
  supportMessageLabel: string;
  supportNameLabel: string;
  supportEmailLabel: string;
  supportSubmitLabel: string;
  supportSuccessTemplate: string;
  supportNeedIdentityMessage: string;
  resetLabel: string;
  dismissLabel?: string;
  dismissStorageKey?: string;
  theme?: "default" | "landing4";
};

type SessionState = {
  loggedIn: boolean;
  name: string;
  email: string;
};

export function SalesBotWidget({
  languageCode,
  iconUrl,
  logoUrl,
  buttonLabel,
  panelTitle,
  initialAssistantMessage,
  inputPlaceholder,
  sendLabel,
  closeLabel,
  supportButtonLabel,
  supportPanelTitle,
  supportSubjectLabel,
  supportMessageLabel,
  supportNameLabel,
  supportEmailLabel,
  supportSubmitLabel,
  supportSuccessTemplate,
  supportNeedIdentityMessage,
  resetLabel,
  dismissLabel,
  dismissStorageKey,
  theme = "default",
}: Props) {
  const isLanding4 = theme === "landing4";
  const headerLogoSrc = logoUrl?.trim() || "/ShiftBob-circle-logo-dark-1024.png";
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<SessionState | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  function resetChat() {
    setMessages([]);
    setInput("");
    setSupportOpen(false);
    setSupportSubject("");
    setSupportMessage("");
  }

  useEffect(() => {
    resetChat();
  }, [languageCode]);

  useEffect(() => {
    if (!dismissStorageKey) {
      setDismissed(false);
      return;
    }
    try {
      setDismissed(window.localStorage.getItem(dismissStorageKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [dismissStorageKey]);

  useEffect(() => {
    function onOpenSupportTicket(event: Event) {
      const detail = (event as CustomEvent<SupportTicketOpenDetail>).detail;
      setOpen(true);
      setSupportOpen(true);
      if (detail?.subject) setSupportSubject(detail.subject);
      if (detail?.message) setSupportMessage(detail.message);
      void initializeChat();
    }

    window.addEventListener(SUPPORT_TICKET_OPEN_EVENT, onOpenSupportTicket);
    return () => {
      window.removeEventListener(SUPPORT_TICKET_OPEN_EVENT, onOpenSupportTicket);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageCode, initialAssistantMessage, supportNeedIdentityMessage]);

  function addAssistantMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `assistant-${Date.now()}`, role: "assistant", text, ctaLabel: null, ctaHref: null },
    ]);
  }

  async function initializeChat(force = false) {
    if (!force && (hasMessages || loading)) return;
    setMessages([{ id: `assistant-${Date.now()}`, role: "assistant", text: initialAssistantMessage }]);
    try {
      const res = await fetch("/api/salesbot/session", { method: "GET" });
      const data = (await res.json()) as {
        ok?: boolean;
        loggedIn?: boolean;
        name?: string;
        email?: string;
      };
      if (!data.ok) return;
      const nextSession = {
        loggedIn: Boolean(data.loggedIn),
        name: data.name?.trim() || "",
        email: data.email?.trim() || "",
      };
      setSession(nextSession);
      if (!nextSession.loggedIn) {
        addAssistantMessage(supportNeedIdentityMessage);
      }
      setSupportName(nextSession.name);
      setSupportEmail(nextSession.email);
    } catch {
      // Ignore session fetch errors and allow normal chat usage.
    }
  }

  async function sendMessage(message: string) {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const latestAssistantMatch =
      [...messages].reverse().find((m) => m.role === "assistant" && m.matchedKnowledgeId)
        ?.matchedKnowledgeId || null;

    try {
      const res = await fetch("/api/salesbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageCode,
          message: trimmed,
          contextKnowledgeId: latestAssistantMatch,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        reply?: string;
        ctaLabel?: string | null;
        ctaHref?: string | null;
        matchedKnowledgeId?: string | null;
      };
      const reply =
        data.ok && data.reply ? data.reply : "Sorry, I could not answer right now. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now() + 1}`,
          role: "assistant",
          text: reply,
          ctaLabel: data.ctaLabel?.trim() || null,
          ctaHref: data.ctaHref?.trim() || null,
          matchedKnowledgeId: data.matchedKnowledgeId?.trim() || null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await sendMessage(input);
  }

  async function submitSupportTicket(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim() || supportLoading) return;

    setSupportLoading(true);
    try {
      const res = await fetch("/api/salesbot/support-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageCode,
          subject: supportSubject.trim(),
          message: supportMessage.trim(),
          name: supportName.trim(),
          email: supportEmail.trim(),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        ticketId?: string;
        requiresIdentity?: boolean;
      };
      if (!data.ok) {
        addAssistantMessage(data.error || "Could not submit support ticket.");
        if (data.requiresIdentity) {
          setSupportOpen(true);
        }
        return;
      }
      addAssistantMessage(
        supportSuccessTemplate.replace("{ticketId}", data.ticketId || "created")
      );
      setSupportOpen(false);
      setSupportSubject("");
      setSupportMessage("");
    } finally {
      setSupportLoading(false);
    }
  }

  function dismissWidget() {
    setOpen(false);
    setDismissed(true);
    if (!dismissStorageKey) return;
    try {
      window.localStorage.setItem(dismissStorageKey, "1");
    } catch {
      // Ignore private mode / quota errors.
    }
  }

  if (dismissed) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[70]">
        <button
          type="button"
          onClick={async () => {
            setOpen((value) => !value);
            if (!open) {
              await initializeChat();
            }
          }}
          className="inline-flex items-center justify-center p-0 transition hover:scale-105"
          aria-label={buttonLabel}
          title={buttonLabel}
        >
          <Image
            src={iconUrl}
            alt=""
            width={84}
            height={84}
            className="h-20 w-20 object-contain [filter:drop-shadow(0_0_12px_rgba(255,255,255,0.98))]"
          />
        </button>
        {dismissLabel ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dismissWidget();
            }}
            className="absolute bottom-0 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900/85 text-[11px] font-semibold text-white hover:bg-zinc-900"
            aria-label={dismissLabel}
            title={dismissLabel}
          >
            ×
          </button>
        ) : null}
      </div>

      {open ? (
        <section
          className={
            isLanding4
              ? "fixed bottom-24 right-6 z-[70] flex h-[540px] w-[min(92vw,390px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/95 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_28px_90px_rgba(0,0,0,0.92),0_0_56px_rgba(56,189,248,0.14)] ring-1 ring-white/10 backdrop-blur-xl"
              : "fixed bottom-24 right-6 z-[70] flex h-[540px] w-[min(92vw,390px)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          }
        >
          <header
            className={
              isLanding4
                ? "flex items-center justify-between border-b border-white/10 bg-zinc-950/90 px-4 py-3.5 backdrop-blur-xl"
                : "flex items-center justify-between border-b border-[#3A7FD1] bg-[#4A90E2] px-4 py-3"
            }
          >
            <h2
              className={
                isLanding4
                  ? "text-sm font-semibold tracking-tight text-white sm:text-base"
                  : "flex items-center gap-2 text-base font-semibold text-white"
              }
            >
              {!isLanding4 ? (
                <span className="inline-flex items-center justify-center rounded-md bg-black p-0.5">
                  <Image
                    src={headerLogoSrc}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </span>
              ) : null}
              <span>{panelTitle}</span>
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  resetChat();
                  void initializeChat(true);
                }}
                className={
                  isLanding4
                    ? "rounded-md p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    : "rounded-md p-1 text-white/85 hover:bg-white/15 hover:text-white"
                }
                aria-label={resetLabel}
                title={resetLabel}
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={
                  isLanding4
                    ? "rounded-md p-1 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    : "rounded-md p-1 text-white/90 hover:bg-white/15 hover:text-white"
                }
                aria-label={closeLabel}
                title={closeLabel}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div
            className={
              isLanding4
                ? "flex-1 space-y-3 overflow-y-auto bg-[#050508] px-3 py-3"
                : "flex-1 space-y-3 overflow-y-auto bg-zinc-50 px-3 py-3"
            }
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "assistant"
                    ? isLanding4
                      ? "max-w-[92%] rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      : "max-w-[92%] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800"
                    : isLanding4
                      ? "ml-auto max-w-[92%] rounded-xl bg-sky-600 px-3 py-2 text-sm text-white shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                      : "ml-auto max-w-[92%] rounded-xl bg-[#4A90E2] px-3 py-2 text-sm text-white"
                }
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.role === "assistant" && message.ctaLabel && message.ctaHref ? (
                  <a
                    href={message.ctaHref}
                    className={
                      isLanding4
                        ? "mt-2 inline-flex text-sm font-semibold text-sky-400 underline underline-offset-2 hover:text-sky-300"
                        : "mt-2 inline-flex text-sm font-semibold text-[#3A7FD1] underline underline-offset-2 hover:text-[#2b69af]"
                    }
                  >
                    {message.ctaLabel}
                  </a>
                ) : null}
              </div>
            ))}
            {loading ? (
              <div
                className={
                  isLanding4
                    ? "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-400"
                    : "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600"
                }
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking...
              </div>
            ) : null}

            {supportOpen ? (
              <form
                onSubmit={submitSupportTicket}
                className={
                  isLanding4
                    ? "space-y-2 rounded-xl border border-white/10 bg-zinc-900/90 p-3"
                    : "space-y-2 rounded-xl border border-zinc-200 bg-white p-3"
                }
              >
                <p
                  className={
                    isLanding4
                      ? "text-xs font-semibold uppercase tracking-wide text-zinc-500"
                      : "text-xs font-semibold uppercase tracking-wide text-zinc-500"
                  }
                >
                  {supportPanelTitle}
                </p>
                {!session?.loggedIn ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      placeholder={supportNameLabel}
                      className={
                        isLanding4
                          ? "h-9 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                          : "h-9 rounded-md border border-zinc-300 px-2 text-sm"
                      }
                    />
                    <input
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder={supportEmailLabel}
                      className={
                        isLanding4
                          ? "h-9 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                          : "h-9 rounded-md border border-zinc-300 px-2 text-sm"
                      }
                    />
                  </div>
                ) : null}
                <input
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  placeholder={supportSubjectLabel}
                  className={
                    isLanding4
                      ? "h-9 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                      : "h-9 w-full rounded-md border border-zinc-300 px-2 text-sm"
                  }
                />
                <textarea
                  rows={4}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder={supportMessageLabel}
                  className={
                    isLanding4
                      ? "w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                      : "w-full rounded-md border border-zinc-300 px-2 py-2 text-sm"
                  }
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSupportOpen(false)}
                    className={
                      isLanding4
                        ? "rounded-md border border-zinc-600 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                        : "rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-700"
                    }
                  >
                    {closeLabel}
                  </button>
                  <button
                    type="submit"
                    disabled={
                      supportLoading ||
                      !supportSubject.trim() ||
                      !supportMessage.trim() ||
                      (!session?.loggedIn && (!supportName.trim() || !supportEmail.trim()))
                    }
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#4A90E2] px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {supportLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    {supportSubmitLabel}
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          <form
            onSubmit={onSubmit}
            className={
              isLanding4
                ? "border-t border-white/10 bg-zinc-950/95 p-3 backdrop-blur-xl"
                : "border-t border-zinc-200 bg-white p-3"
            }
          >
            <div className="mb-2 flex justify-start">
              <button
                type="button"
                onClick={() => setSupportOpen((value) => !value)}
                className={
                  isLanding4
                    ? "rounded-full border border-zinc-600 bg-zinc-800/80 px-3 py-1.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
                    : "rounded-full border border-zinc-300 bg-yellow-100/60 px-3 py-1.5 text-sm text-zinc-700 hover:bg-yellow-100"
                }
              >
                {supportButtonLabel}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputPlaceholder}
                className={
                  isLanding4
                    ? "h-10 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                    : "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none"
                }
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#4A90E2] px-3 text-xs font-semibold text-white transition hover:bg-[#3A7FD1] disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {sendLabel}
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </>
  );
}
