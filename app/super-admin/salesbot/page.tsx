import {
  getSalesBotDashboardData,
  type LanguageOptionRow,
  type SalesBotChatLogRow,
} from "@/src/app/super-admin/salesbot-actions";
import type { SalesBotKnowledgeEntry, SalesBotManifest } from "@/src/lib/salesbot-runtime";
import SalesBotAdminClient from "./salesbot-admin-client";

export default async function SuperAdminSalesBotPage() {
  const res = await getSalesBotDashboardData();
  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente SalesBot-data: {res.error}
      </div>
    );
  }

  return (
    <SalesBotAdminClient
      initialManifest={res.manifest as SalesBotManifest}
      initialKnowledge={res.knowledge as SalesBotKnowledgeEntry[]}
      languages={res.languages as LanguageOptionRow[]}
      initialLogs={res.logs as SalesBotChatLogRow[]}
    />
  );
}
