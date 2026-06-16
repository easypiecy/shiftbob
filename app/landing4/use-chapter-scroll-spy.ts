"use client";

import { useEffect, useState } from "react";

export const LANDING4_CHAPTER_IDS = [
  "landing4-chapter-1",
  "landing4-chapter-2",
  "landing4-chapter-3",
  "landing4-chapter-4",
  "landing4-chapter-5",
] as const;

/** Active chapter index (0–4), or -1 when still in the hero above chapter 1. */
export function useChapterScrollSpy(): number {
  const [activeChapter, setActiveChapter] = useState(-1);

  useEffect(() => {
    let frame = 0;

    function resolveActiveChapter(): number {
      const sections = LANDING4_CHAPTER_IDS.map((id) => document.getElementById(id)).filter(
        (el): el is HTMLElement => el !== null
      );
      if (sections.length === 0) return -1;

      const marker = window.innerHeight * 0.38;
      const first = sections[0].getBoundingClientRect();
      const last = sections[sections.length - 1].getBoundingClientRect();

      if (first.top > marker) return -1;
      if (last.top <= marker) return sections.length - 1;

      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) return i;
      }

      let bestIndex = 0;
      let bestDistance = Infinity;
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - marker);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      }
      return bestIndex;
    }

    function update() {
      setActiveChapter(resolveActiveChapter());
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return activeChapter;
}
