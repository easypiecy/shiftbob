"use client";

import Image from "next/image";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { createTranslator } from "@/src/lib/translations-server";
import { useChapterScrollPresence } from "./landing4-chapter-transition";

const SECTION_ID = "landing4-chapter-4";

export function Chapter4PhoneVisual({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const t = createTranslator(translations);
  const presence = useChapterScrollPresence(SECTION_ID);
  const translateX = -36 * (1 - presence);
  const scale = 0.95 + presence * 0.05;

  return (
    <div
      className="landing4-visual-bleed relative mx-auto w-full max-w-none px-0 will-change-transform sm:max-w-[235px] sm:px-2"
      style={{
        opacity: presence,
        transform: `translate3d(${translateX}px, 0, 0) scale(${scale})`,
        transition: "opacity 0.22s ease-out, transform 0.22s ease-out",
      }}
    >
      {/* Side buttons */}
      <div
        className="absolute -left-0.5 top-[26%] h-7 w-0.5 rounded-l-md bg-gradient-to-b from-zinc-500 to-zinc-700"
        aria-hidden="true"
      />
      <div
        className="absolute -left-0.5 top-[38%] h-11 w-0.5 rounded-l-md bg-gradient-to-b from-zinc-500 to-zinc-700"
        aria-hidden="true"
      />
      <div
        className="absolute -right-0.5 top-[32%] h-12 w-0.5 rounded-r-md bg-gradient-to-b from-zinc-500 to-zinc-700"
        aria-hidden="true"
      />

      <div className="rounded-[2.45rem] bg-gradient-to-b from-zinc-500 via-zinc-700 to-zinc-800 p-[2px] shadow-[0_0_52px_rgba(56,189,248,0.24)] ring-1 ring-sky-500/25">
        <div className="rounded-[2.4rem] bg-zinc-950 p-[2px]">
          <div className="relative overflow-hidden rounded-[2.28rem] bg-black">
            {/* Dynamic Island */}
            <div
              className="absolute left-1/2 top-2.5 z-20 h-[22px] w-[72px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
              aria-hidden="true"
            />

            {/* Status bar */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-3 text-[9px] font-semibold text-white/90">
              <span>09:41</span>
              <span className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2 w-3 rounded-sm border border-white/80" />
                <span className="h-2.5 w-4 rounded-[2px] border border-white/80 px-px">
                  <span className="block h-full w-2/3 rounded-[1px] bg-white/90" />
                </span>
              </span>
            </div>

            <div className="relative -mt-1 aspect-[9/19.2]">
              <Image
                src={WEBSITE_ASSETS.landingEmployeePhoto}
                alt={t("landing4.visual.ch4.alt", "Medarbejder-app")}
                fill
                className="object-cover object-top"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />

              <div className="absolute bottom-11 left-2.5 right-2.5 space-y-1.5">
                <div className="rounded-xl border border-sky-400/35 bg-sky-500/20 px-3 py-2 text-[11px] font-semibold text-sky-50 backdrop-blur-md">
                  {t("landing4.visual.ch4.shift_card", "Shift 07-15 · Man")}
                </div>
                <div className="rounded-xl border border-violet-400/30 bg-violet-500/15 px-3 py-2 text-[11px] font-semibold text-violet-50 backdrop-blur-md">
                  {t("landing4.visual.ch4.swap_card", "Anmod om bytte")}
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div
              className="absolute bottom-2 left-1/2 z-20 h-1 w-[34%] -translate-x-1/2 rounded-full bg-white/35"
              aria-hidden="true"
            />

            {/* Glass highlight */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
