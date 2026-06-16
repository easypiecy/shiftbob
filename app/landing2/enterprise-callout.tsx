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
    <div className="mx-auto mt-10 max-w-4xl rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-6 text-center shadow-[0_18px_48px_rgba(15,23,42,0.07)] ring-1 ring-zinc-950/5 backdrop-blur sm:p-8">
      <div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#172033_58%,#1e3a5f_100%)] shadow-[0_12px_28px_rgba(15,23,42,0.2)] ring-1 ring-white/10"
        aria-hidden="true"
      >
        <Factory className="h-7 w-7 text-white" strokeWidth={1.75} />
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-zinc-950">{headline}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
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
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#111827] px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(17,24,39,0.22)] transition hover:-translate-y-0.5 hover:bg-black"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
