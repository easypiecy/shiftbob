"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import Image from "next/image";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type Props = {
  languageCode: string;
  iconUrl: string;
  buttonLabel: string;
  panelTitle: string;
  initialAssistantMessage: string;
  inputPlaceholder: string;
  sendLabel: string;
  closeLabel: string;
};

export function SalesBotWidget({
  languageCode,
  iconUrl,
  buttonLabel,
  panelTitle,
  initialAssistantMessage,
  inputPlaceholder,
  sendLabel,
  closeLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  async function initializeChat() {
    if (hasMessages || loading) return;
    setMessages([{ id: `assistant-${Date.now()}`, role: "assistant", text: initialAssistantMessage }]);
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
            <h2 className="text-sm font-semibold text-white">{panelTitle}</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-white/90 hover:bg-white/15 hover:text-white"
              aria-label={closeLabel}
              title={closeLabel}
            >
              <X className="h-4 w-4" />
            </button>
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
          </div>

          <form onSubmit={onSubmit} className="border-t border-zinc-200 bg-white p-3">
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
