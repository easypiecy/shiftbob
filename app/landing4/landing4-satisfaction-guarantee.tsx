import { ShieldCheck } from "lucide-react";
import { createTranslator } from "@/src/lib/translations-server";

export function Landing4SatisfactionGuarantee({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const t = createTranslator(translations);

  return (
    <section
      className="bg-[#050508] py-12 sm:py-14"
      aria-label={t("landing4.guarantee.aria", "Tilfredshedsgaranti")}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-4 px-4 text-center sm:flex-row sm:gap-5 sm:px-6">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/12 shadow-[0_0_32px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500/35"
          aria-hidden="true"
        >
          <ShieldCheck className="h-7 w-7 text-emerald-400" strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-lg font-bold tracking-tight text-white sm:text-xl">
            {t("landing4.guarantee.title", "Fuld tilfredshed eller pengene tilbage")}
          </p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            {t(
              "landing4.guarantee.subtitle",
              "Vi står bag ShiftBob — prøv uden risiko og få pengene tilbage, hvis du ikke er tilfreds."
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
