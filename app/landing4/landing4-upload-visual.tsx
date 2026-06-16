"use client";

import Link from "next/link";
import { Upload } from "lucide-react";
import { createTranslator } from "@/src/lib/translations-server";
import { useChapterScrollPresence } from "./landing4-chapter-transition";

const SECTION_ID = "landing4-chapter-3";

export function Chapter3UploadVisual({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const t = createTranslator(translations);
  const presence = useChapterScrollPresence(SECTION_ID);
  const iconScale = 1 + (1 - presence) * 0.55;
  const iconOpacity = presence;

  return (
    <Link
      href="/employer-signup?product=basic"
      className="landing4-visual-bleed group block w-full rounded-none border border-dashed border-sky-500/40 bg-zinc-900/60 p-6 text-center shadow-[0_0_40px_rgba(56,189,248,0.12)] ring-1 ring-sky-500/20 transition hover:-translate-y-0.5 hover:border-sky-400/60 hover:bg-zinc-900/80 hover:shadow-[0_0_56px_rgba(56,189,248,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:rounded-3xl sm:p-8"
      aria-label={t(
        "landing4.visual.ch3.aria",
        "Upload regneark og få gratis compliance-rapport"
      )}
    >
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center will-change-transform"
        style={{
          opacity: iconOpacity,
          transform: `scale(${iconScale})`,
          transition: "opacity 0.18s ease-out, transform 0.18s ease-out",
        }}
      >
        <Upload
          className="h-12 w-12 text-sky-400 transition group-hover:scale-105"
          strokeWidth={1.5}
        />
      </div>
      <p className="mt-4 text-lg font-bold text-white">
        {t("landing4.visual.ch3.title", "Upload dit regneark")}
      </p>
      <div className="mt-6 inline-flex rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30 transition group-hover:bg-emerald-500/25">
        {t("landing4.visual.ch3.badge", "Øjeblikkelig compliance-rapport")}
      </div>
    </Link>
  );
}
