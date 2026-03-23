import { createTranslator } from "@/src/lib/translations-server";
import { getUiTranslations } from "@/src/lib/ui-language-server";

export default async function NotifikationerPage() {
  const map = await getUiTranslations();
  const tr = createTranslator(map);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 px-3 py-6 dark:bg-zinc-950 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {tr("notifications.page.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {tr("notifications.page.intro")}
        </p>
      </div>
    </div>
  );
}
