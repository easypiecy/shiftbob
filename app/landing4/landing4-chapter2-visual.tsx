"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { createTranslator } from "@/src/lib/translations-server";
import { useChapterScrollPresence } from "./landing4-chapter-transition";

const SECTION_ID = "landing4-chapter-2";

function isChapterInView(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (!section) return false;

  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight;
  return rect.top < viewport * 0.88 && rect.bottom > viewport * 0.12;
}

/** Sharp random lightning glints while scrolling through the chapter. */
function useRandomLightningGlimmers(sectionId: string) {
  const [active, setActive] = useState(false);
  const scrollAccumulator = useRef(0);
  const lastScrollY = useRef(0);
  const busyRef = useRef(false);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doubleFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function clearFlashTimers() {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = null;
      }
      if (doubleFlashTimeoutRef.current) {
        clearTimeout(doubleFlashTimeoutRef.current);
        doubleFlashTimeoutRef.current = null;
      }
    }

    function flash(durationMs: number) {
      clearFlashTimers();
      busyRef.current = true;
      setActive(true);

      flashTimeoutRef.current = setTimeout(() => {
        setActive(false);
        busyRef.current = false;
        flashTimeoutRef.current = null;
      }, durationMs);
    }

    function maybeGlimmer() {
      if (busyRef.current || !isChapterInView(sectionId)) return;
      if (Math.random() > 0.58) return;

      const duration = 55 + Math.random() * 75;
      flash(duration);

      if (Math.random() > 0.72) {
        doubleFlashTimeoutRef.current = setTimeout(() => {
          if (!isChapterInView(sectionId)) return;
          flash(35 + Math.random() * 45);
        }, duration + 25 + Math.random() * 35);
      }
    }

    function onScroll() {
      if (!isChapterInView(sectionId)) {
        scrollAccumulator.current = 0;
        return;
      }

      const delta = Math.abs(window.scrollY - lastScrollY.current);
      lastScrollY.current = window.scrollY;
      scrollAccumulator.current += delta;

      const threshold = 28 + Math.random() * 55;
      if (scrollAccumulator.current >= threshold) {
        scrollAccumulator.current = 0;
        maybeGlimmer();
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearFlashTimers();
      setActive(false);
      busyRef.current = false;
    };
  }, [sectionId]);

  return active;
}

export function Chapter2ScrollVisual({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const t = createTranslator(translations);
  const presence = useChapterScrollPresence(SECTION_ID);
  const lightningActive = useRandomLightningGlimmers(SECTION_ID);
  const scale = 0.94 + presence * 0.06;

  return (
    <div className="landing4-visual-bleed flex items-center justify-center py-4 sm:px-4 sm:py-6">
      <div
        className="relative w-full max-w-none will-change-transform sm:max-w-[min(100%,520px)]"
        style={{
          opacity: presence,
          transform: `scale(${scale})`,
          transition: "opacity 0.18s ease-out, transform 0.18s ease-out",
        }}
      >
        <div
          className="pointer-events-none absolute -inset-6 rounded-3xl bg-sky-400/35 blur-3xl"
          style={{ opacity: lightningActive ? 0.28 : 0 }}
          aria-hidden="true"
        />

        <div className="relative aspect-[16/10] overflow-hidden rounded-none shadow-[0_0_48px_rgba(56,189,248,0.12)] ring-1 ring-sky-500/20 sm:rounded-2xl">
          <Image
            src={WEBSITE_ASSETS.landingPlan}
            alt={t("landing4.visual.ch2.alt", "Digital vagtplan i regneark")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 520px"
            unoptimized
            style={{ opacity: lightningActive ? 0 : 1 }}
          />

          <Image
            src={WEBSITE_ASSETS.landingPlanLightning}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 520px"
            unoptimized
            aria-hidden="true"
            style={{ opacity: lightningActive ? 1 : 0 }}
          />

          <div
            className="pointer-events-none absolute inset-0 bg-sky-200/20"
            style={{ opacity: lightningActive ? 1 : 0 }}
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/25 via-transparent to-zinc-950/10" />
        </div>
      </div>
    </div>
  );
}
