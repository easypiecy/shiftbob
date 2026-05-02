"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, RotateCcw, Send, X } from "lucide-react";
import Image from "next/image";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
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
}: Props) {
  const headerLogoSrc = logoUrl?.trim() || "/ShiftBob-circle-logo-dark-1024.png";
  const [open, setOpen] = useState(false);
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
    // Language switch means a fresh conversation context.
    resetChat();
  }, [languageCode]);

  function addAssistantMessage(text: string) {
    setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", text }]);
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

    try {
      const res = await fetch("/api/salesbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ languageCode, message: trimmed }),
      });
      const data = (await res.json()) as { ok?: boolean; reply?: string };
      const reply =
        data.ok && data.reply ? data.reply : "Sorry, I could not answer right now. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now() + 1}`, role: "assistant", text: reply },
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

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          setOpen((value) => !value);
          if (!open) {
            await initializeChat();
          }
        }}
        className="fixed bottom-5 right-5 z-[70] inline-flex items-center justify-center p-0 transition hover:scale-105"
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

      {open ? (
        <section className="fixed bottom-24 right-6 z-[70] flex h-[540px] w-[min(92vw,390px)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-[#3A7FD1] bg-[#4A90E2] px-4 py-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <span className="inline-flex items-center justify-center rounded-md bg-black p-0.5">
                <Image
                  src={headerLogoSrc}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </span>
              <span>{panelTitle}</span>
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  resetChat();
                  void initializeChat(true);
                }}
                className="rounded-md p-1 text-white/85 hover:bg-white/15 hover:text-white"
                aria-label={resetLabel}
                title={resetLabel}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-white/90 hover:bg-white/15 hover:text-white"
                aria-label={closeLabel}
                title={closeLabel}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 px-3 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "assistant"
                    ? "max-w-[92%] rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800"
                    : "ml-auto max-w-[92%] rounded-xl bg-[#4A90E2] px-3 py-2 text-sm text-white"
                }
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            ))}
            {loading ? (
              <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking...
              </div>
            ) : null}

            {supportOpen ? (
              <form
                onSubmit={submitSupportTicket}
                className="space-y-2 rounded-xl border border-zinc-200 bg-white p-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {supportPanelTitle}
                </p>
                {!session?.loggedIn ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      placeholder={supportNameLabel}
                      className="h-9 rounded-md border border-zinc-300 px-2 text-sm"
                    />
                    <input
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder={supportEmailLabel}
                      className="h-9 rounded-md border border-zinc-300 px-2 text-sm"
                    />
                  </div>
                ) : null}
                <input
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  placeholder={supportSubjectLabel}
                  className="h-9 w-full rounded-md border border-zinc-300 px-2 text-sm"
                />
                <textarea
                  rows={4}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder={supportMessageLabel}
                  className="w-full rounded-md border border-zinc-300 px-2 py-2 text-sm"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSupportOpen(false)}
                    className="rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-700"
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

          <form onSubmit={onSubmit} className="border-t border-zinc-200 bg-white p-3">
            <div className="mb-2 flex justify-start">
              <button
                type="button"
                onClick={() => setSupportOpen((value) => !value)}
                className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
              >
                {supportButtonLabel}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputPlaceholder}
                className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none"
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
