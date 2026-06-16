"use client";

import { createTranslator } from "@/src/lib/translations-server";
import { LANDING4_CHAPTER_IDS, useChapterScrollSpy } from "./use-chapter-scroll-spy";

const CHAPTER_LABEL_KEYS = [
  "landing4.chapter.nav.label.eu_compliance",
  "landing4.chapter.nav.label.free_spreadsheet",
  "landing4.chapter.nav.label.compliance_report",
  "landing4.chapter.nav.label.employee_app",
  "landing4.chapter.nav.label.autopilot",
] as const;

const CHAPTER_LABEL_FALLBACKS = [
  "EU-compliance",
  "Gratis regneark",
  "Compliance-rapport",
  "Medarbejder-app",
  "Autopilot",
] as const;

function scrollToChapter(index: number) {
  const id = LANDING4_CHAPTER_IDS[index];
  const section = document.getElementById(id);
  if (!section) return;

  section.scrollIntoView({ behavior: "smooth", block: "start" });

  if (window.location.hash !== `#${id}`) {
    window.history.replaceState(null, "", `#${id}`);
  }
}

export function ChapterProgressRail({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const t = createTranslator(translations);
  const activeChapter = useChapterScrollSpy();

  return (
    <nav
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 lg:flex xl:left-8"
      aria-label={t("landing4.chapter.nav.aria", "Kapitel-navigation")}
    >
      {CHAPTER_LABEL_KEYS.map((key, index) => {
        const label = t(key, CHAPTER_LABEL_FALLBACKS[index]);
        const isActive = activeChapter === index;
        const isPast = activeChapter > index;
        const gotoLabel = t("landing4.chapter.nav.goto", "Gå til kapitel {step}: {label}")
          .replace("{step}", String(index + 1))
          .replace("{label}", label);

        return (
          <button
            key={key}
            type="button"
            onClick={() => scrollToChapter(index)}
            aria-label={gotoLabel}
            aria-current={isActive ? "step" : undefined}
            className="group relative flex items-center justify-center rounded-full p-2 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <span
              className={`block h-8 w-1 rounded-full transition-all duration-500 group-hover:scale-125 ${
                isActive
                  ? "bg-gradient-to-b from-sky-400 to-violet-500 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                  : isPast
                    ? "bg-zinc-500 group-hover:bg-zinc-400"
                    : "bg-zinc-800 group-hover:bg-zinc-600"
              }`}
            />
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg border border-zinc-800 bg-zinc-900/95 px-2.5 py-1 text-xs font-medium text-zinc-300 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
              {index + 1}. {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
