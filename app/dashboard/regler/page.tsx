import { AdminDocumentUploadPanel } from "@/src/components/admin-document-upload-panel";
import { createTranslator } from "@/src/lib/translations-server";
import { getUiTranslations } from "@/src/lib/ui-language-server";

export default async function ReglerPage() {
  const map = await getUiTranslations();
  const tr = createTranslator(map);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 px-3 py-6 dark:bg-zinc-950 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {tr("rules.page.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {tr("rules.page.intro")}
        </p>
        <ul className="mt-4 list-inside list-disc space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>{tr("rules.page.bullet1")}</li>
          <li>{tr("rules.page.bullet2")}</li>
          <li>{tr("rules.page.bullet3")}</li>
        </ul>
        <AdminDocumentUploadPanel
          accept=".pdf,.doc,.docx,application/pdf"
          fileInputLabel={tr("rules.upload.label")}
          hint={tr("rules.upload.hint")}
        />
      </div>
    </div>
  );
}
