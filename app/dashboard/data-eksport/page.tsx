import { AdminDocumentUploadPanel } from "@/src/components/admin-document-upload-panel";
import { createTranslator } from "@/src/lib/translations-server";
import { getUiTranslations } from "@/src/lib/ui-language-server";

export default async function DataEksportPage() {
  const map = await getUiTranslations();
  const tr = createTranslator(map);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 px-3 py-6 dark:bg-zinc-950 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {tr("data_export.page.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {tr("data_export.page.intro")}
        </p>
        <ul className="mt-4 list-inside list-disc space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>{tr("data_export.page.bullet1")}</li>
          <li>{tr("data_export.page.bullet2")}</li>
          <li>{tr("data_export.page.bullet3")}</li>
        </ul>
        <div className="mt-2 space-y-6">
          <section>
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {tr("data_export.section.csv_title")}
            </h2>
            <AdminDocumentUploadPanel
              accept=".csv,text/csv"
              fileInputLabel={tr("data_export.upload.csv_label")}
              hint={tr("data_export.upload.csv_hint")}
              showBetaNotice={false}
            />
          </section>
          <section>
            <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {tr("data_export.section.docs_title")}
            </h2>
            <AdminDocumentUploadPanel
              accept=".pdf,.doc,.docx,.csv,.txt,text/plain"
              fileInputLabel={tr("data_export.upload.docs_label")}
              hint={tr("data_export.upload.docs_hint")}
              showBetaNotice={false}
            />
          </section>
        </div>
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          {tr("data_export.beta_notice")}
        </p>
      </div>
    </div>
  );
}
