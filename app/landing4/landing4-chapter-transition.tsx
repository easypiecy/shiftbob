"use client";

import { useEffect, useState } from "react";

/** 0–1 when a chapter section is in focus (peaks at viewport center). */
export function useChapterScrollPresence(sectionId: string) {
  const [presence, setPresence] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const sectionMid = rect.top + rect.height / 2;
      const viewportMid = viewport * 0.5;
      const distance = Math.abs(sectionMid - viewportMid);
      const nextPresence = Math.max(0, 1 - distance / (viewport * 0.62));

      setPresence(nextPresence);
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
  }, [sectionId]);

  return presence;
}

/** 0–1 intensity while scrolling from one chapter into the next. */
export function useChapterGapWash(fromId: string, toId: string) {
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      const fromSection = document.getElementById(fromId);
      const toSection = document.getElementById(toId);
      if (!fromSection || !toSection) return;

      const fromRect = fromSection.getBoundingClientRect();
      const toRect = toSection.getBoundingClientRect();
      const viewport = window.innerHeight;

      const gapMid = (fromRect.bottom + toRect.top) / 2;
      const viewportMid = viewport * 0.48;
      const distance = Math.abs(gapMid - viewportMid);
      const nextIntensity = Math.max(0, 1 - distance / (viewport * 0.42));

      setIntensity(nextIntensity);
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
  }, [fromId, toId]);

  return intensity;
}

/** 0→1 while scrolling from the end of `fromId` toward `toId`. */
export function useChapterExitProgress(fromId: string, toId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      const fromSection = document.getElementById(fromId);
      const toSection = document.getElementById(toId);
      if (!fromSection || !toSection) return;

      const fromRect = fromSection.getBoundingClientRect();
      const toRect = toSection.getBoundingClientRect();
      const viewport = window.innerHeight;

      const travelled = viewport * 0.92 - fromRect.bottom;
      const span = Math.max(1, fromRect.bottom - toRect.top + viewport * 0.95);
      const nextProgress = Math.min(1, Math.max(0, travelled / span));

      setProgress(nextProgress);
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
  }, [fromId, toId]);

  return progress;
}

type ChapterColorWashProps = {
  fromId: string;
  toId: string;
  /** CSS color stops for the wash gradient */
  gradient: string;
};

export function ChapterColorWash({ fromId, toId, gradient }: ChapterColorWashProps) {
  const intensity = useChapterGapWash(fromId, toId);

  return (
    <div
      className="pointer-events-none relative z-0 h-[36vh] sm:h-[44vh]"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 will-change-[opacity]"
        style={{
          opacity: intensity,
          background: gradient,
          transition: "opacity 0.12s linear",
        }}
      />
    </div>
  );
}

type ChapterTransitionQuestionProps = {
  fromId: string;
  toId: string;
};

/** Large "?" that scales up and fades out while scrolling toward the next chapter. */
export function ChapterTransitionQuestionMark({
  fromId,
  toId,
}: ChapterTransitionQuestionProps) {
  const progress = useChapterExitProgress(fromId, toId);
  const scale = 1.75 + progress * 4;
  const opacity = Math.max(0, 0.7 * (1 - progress));
  const translateY = -48 + progress * 72;

  if (progress <= 0) return null;

  return (
    <div
      className="pointer-events-none relative z-[3] -mt-28 flex h-8 items-start justify-center sm:-mt-36 lg:-mt-44"
      aria-hidden="true"
    >
      <span
        className="font-[family-name:var(--font-space-grotesk)] font-black leading-none text-emerald-400/90 will-change-transform drop-shadow-[0_0_40px_rgba(52,211,153,0.35)]"
        style={{
          fontSize: "3.5rem",
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          opacity,
          transition: "opacity 0.32s ease-out, transform 0.32s ease-out",
        }}
      >
        ?
      </span>
    </div>
  );
}

/** Scroll arrow — same motion as hero ↓ between two chapters. */
export function ChapterTransitionScrollArrow({
  fromId,
  toId,
  alignToTextColumn = false,
}: ChapterTransitionQuestionProps & { alignToTextColumn?: boolean }) {
  const progress = useChapterExitProgress(fromId, toId);
  const scale = 1 + progress * 7;
  const translateY = progress * 140;
  const opacity = 1 - progress;

  if (progress <= 0) return null;

  const arrow = (
    <span
      className="origin-center text-2xl font-light text-zinc-400 will-change-transform sm:text-3xl"
      style={{
        transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
        opacity,
      }}
    >
      ↓
    </span>
  );

  return (
    <div
      className="pointer-events-none relative z-[3] -mt-36 mb-14 sm:-mt-44 sm:mb-16 lg:-mt-52 lg:mb-20"
      aria-hidden="true"
    >
      {alignToTextColumn ? (
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="hidden lg:block" aria-hidden="true" />
          <div className="flex justify-center">{arrow}</div>
        </div>
      ) : (
        <div className="flex justify-center">{arrow}</div>
      )}
    </div>
  );
}

type ChapterSectionScrollBgProps = {
  sectionId: string;
  color: string;
};

/** Full-section background wash that fades in/out with scroll (e.g. black → dark gray). */
export function ChapterSectionScrollBg({ sectionId, color }: ChapterSectionScrollBgProps) {
  const presence = useChapterScrollPresence(sectionId);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] will-change-[opacity]"
      style={{
        opacity: presence,
        backgroundColor: color,
        transition: "opacity 0.12s linear",
      }}
      aria-hidden="true"
    />
  );
}
