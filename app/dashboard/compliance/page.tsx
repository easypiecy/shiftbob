import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getWorkplaceById } from "@/src/app/super-admin/workplaces/actions";
import { createTranslator } from "@/src/lib/translations-server";
import { getUiTranslations } from "@/src/lib/ui-language-server";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";

export default async function CompliancePage() {
  const jar = await cookies();
  const raw = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value?.trim();
  if (!raw) {
    redirect("/select-workplace");
  }

  const [map, wp] = await Promise.all([
    getUiTranslations(),
    getWorkplaceById(raw),
  ]);
  const tr = createTranslator(map);

  const workplaceLabel =
    wp.ok && wp.data
      ? wp.data.company_name?.trim() || wp.data.name
      : "—";

  const tenantBody = tr("compliance.section.tenant_body").replace(
    "{workplace}",
    workplaceLabel
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 px-3 py-6 dark:bg-zinc-950 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {tr("compliance.page.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {tr("compliance.page.intro")}
        </p>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {tr("compliance.section.system_title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {tr("compliance.section.system_body")}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {tr("compliance.section.ai_title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {tr("compliance.section.ai_body")}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {tr("compliance.section.gdpr_title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {tr("compliance.section.gdpr_body")}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {tr("compliance.section.tenant_title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {tenantBody}
          </p>
        </section>

        <p className="mt-8 rounded-lg border border-zinc-200 bg-zinc-100/80 px-3 py-2.5 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
          {tr("compliance.footer.rolling")}
        </p>
      </div>
    </div>
  );
}
