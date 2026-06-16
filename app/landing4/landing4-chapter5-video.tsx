"use client";

import { useEffect, useRef } from "react";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { createTranslator } from "@/src/lib/translations-server";

const SECTION_ID = "landing4-chapter-5";

function computeChapterPresence(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight;
  const sectionMid = rect.top + rect.height / 2;
  const viewportMid = viewport * 0.5;
  const distance = Math.abs(sectionMid - viewportMid);
  return Math.max(0, 1 - distance / (viewport * 0.62));
}

export function Chapter5ScrollVideo({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const t = createTranslator(translations);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const presenceRef = useRef(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    let frame = 0;

    function syncTime() {
      if (durationRef.current <= 0) return;
      const target = presenceRef.current * durationRef.current;
      if (Math.abs(el.currentTime - target) > 0.02) {
        try {
          el.currentTime = target;
        } catch {
          // Ignore seek errors while metadata is still loading.
        }
      }
    }

    function updatePresence() {
      const section = document.getElementById(SECTION_ID);
      if (!section) return;
      presenceRef.current = computeChapterPresence(section);
      syncTime();
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePresence);
    }

    function onLoadedMetadata() {
      durationRef.current = el.duration;
      el.pause();
      syncTime();
    }

    el.addEventListener("loadedmetadata", onLoadedMetadata);
    if (el.readyState >= 1) onLoadedMetadata();

    updatePresence();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="landing4-visual-bleed flex items-center justify-center py-4 sm:px-4 sm:py-6">
      <div className="relative aspect-[5/4] w-full max-w-none overflow-hidden rounded-none sm:max-w-[400px] sm:rounded-2xl lg:max-w-[460px]">
        <video
          ref={videoRef}
          src={WEBSITE_ASSETS.landingRobotArmVideo}
          muted
          playsInline
          preload="auto"
          aria-label={t(
            "landing4.visual.ch5.video_aria",
            "Robotarm der genererer vagtplan automatisk"
          )}
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
}
