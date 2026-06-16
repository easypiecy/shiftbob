"use client";

import Image from "next/image";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { useChapterScrollPresence } from "./landing4-chapter-transition";

export function Chapter1ScrollVisual() {
  const fade = useChapterScrollPresence("landing4-chapter-1");
  const scale = 0.88 + fade * 0.12;

  return (
    <div className="landing4-visual-bleed flex items-center justify-center py-4 sm:px-4 sm:py-6">
      <div
        className="relative aspect-square w-full max-w-none will-change-transform sm:max-w-[340px] lg:max-w-[380px]"
        style={{
          opacity: fade,
          transform: `scale(${scale})`,
          transition: "opacity 0.12s linear, transform 0.12s linear",
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full shadow-[0_0_56px_rgba(16,185,129,0.22)] ring-2 ring-emerald-500/25 ring-offset-4 ring-offset-zinc-950">
          <Image
            src={WEBSITE_ASSETS.landingWorry}
            alt="Stresset arbejdsgiver overvældet af vagtplan og compliance"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 280px, 380px"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/35 via-transparent to-zinc-950/10" />
        </div>
      </div>
    </div>
  );
}
