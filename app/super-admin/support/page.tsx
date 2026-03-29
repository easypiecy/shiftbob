import {
  getSupportDashboardData,
  type LanguageOptionRow,
  type SupportMailboxConfigRow,
  type SupportReplyTemplateRow,
  type SupportTicketMessageRow,
  type SupportTicketRow,
} from "@/src/app/super-admin/support-actions";
import SupportAdminClient from "./support-admin-client";

export default async function SuperAdminSupportPage() {
  const res = await getSupportDashboardData();
  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente support-system: {res.error}
      </div>
    );
  }
  return (
    <SupportAdminClient
      initialMailbox={res.mailboxConfig as SupportMailboxConfigRow | null}
      initialTickets={res.tickets as SupportTicketRow[]}
      initialMessages={res.messages as SupportTicketMessageRow[]}
      initialTemplates={res.templates as SupportReplyTemplateRow[]}
      languages={res.languages as LanguageOptionRow[]}
    />
  );
}
