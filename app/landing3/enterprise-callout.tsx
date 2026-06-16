"use client";

import { Factory } from "lucide-react";
import { openSupportTicketModal } from "@/src/lib/support-ticket-events";

type Props = {
  headline: string;
  subheadline: string;
  buttonLabel: string;
};

export function EnterpriseCallout({ headline, subheadline, buttonLabel }: Props) {
  return (
    <div className="mx-auto mt-10 max-w-4xl rounded-[1.75rem] border border-zinc-800 bg-zinc-900/80 p-6 text-center shadow-[0_0_48px_rgba(56,189,248,0.08)] ring-1 ring-zinc-700/80 backdrop-blur-sm sm:p-8">
      <div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1e3a5f_0%,#0f172a_58%,#020617_100%)] shadow-[0_0_32px_rgba(56,189,248,0.2)] ring-1 ring-sky-500/30"
        aria-hidden="true"
      >
        <Factory className="h-7 w-7 text-sky-300" strokeWidth={1.75} />
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-white">{headline}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
        {subheadline}
      </p>
      <button
        type="button"
        onClick={() =>
          openSupportTicketModal({
            subject: "Enterprise Solution Inquiry",
            message:
              "We would like to discuss Enterprise pricing and onboarding for more than 100 employees.",
          })
        }
        className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-bold text-zinc-950 shadow-[0_0_24px_rgba(255,255,255,0.15)] transition hover:-translate-y-0.5 hover:bg-zinc-100"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
