"use client";

import { openSupportTicketModal } from "@/src/lib/support-ticket-events";

type Props = {
  open: boolean;
  message: string;
  contactLabel: string;
  closeLabel: string;
  onClose: () => void;
};

export function EmployeeLimitExceededModal({
  open,
  message,
  contactLabel,
  closeLabel,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
      >
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{message}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {closeLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              openSupportTicketModal({
                subject: "Enterprise Solution Inquiry",
                message:
                  "We would like to discuss Enterprise pricing and onboarding for more than 100 employees.",
              });
              onClose();
            }}
            className="rounded-full bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3A7FD1]"
          >
            {contactLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
