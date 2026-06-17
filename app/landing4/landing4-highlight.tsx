"use client";

import { useId, useState, type ReactNode } from "react";
import { useLanding4ScrollProgress } from "./landing4-scroll-context";

/** Flowing gradient — shifts horizontally as the user scrolls. */
const SCROLL_UNDERLINE_GRADIENT =
  "linear-gradient(90deg, #34d399 0%, #2dd4bf 14%, #38bdf8 28%, #22d3ee 42%, #a78bfa 57%, #e879f9 71%, #fbbf24 85%, #34d399 100%)";

const TONE_OFFSET: Record<string, number> = {
  emerald: 0,
  sky: 0.12,
  violet: 0.24,
  amber: 0.18,
  white: 0.36,
};

/** Punctuation glued directly after highlight (no extra space). */
const GLUED_AFTER = /^[?.!,;:)}\]—–-]/;

function trimTrailingSpace(text: string) {
  return text.replace(/\s+$/, "");
}

function afterHighlightFragment(after?: string): ReactNode {
  if (after == null || after === "") return null;
  const trimmed = after.trimStart();
  if (!trimmed) return null;
  if (GLUED_AFTER.test(trimmed)) return trimmed;
  return <>{" "}{trimmed}</>;
}

type HighlightTone = keyof typeof TONE_OFFSET;

/**
 * Prefix + highlighted word + suffix with reliable spacing in all languages.
 * Trims stray spaces from translation parts; AI often drops trailing/leading spaces.
 */
export function StoryHighlightPhrase({
  before,
  highlight,
  after,
  tone = "sky",
  thick = false,
}: {
  before: string;
  highlight: string;
  after?: string;
  tone?: HighlightTone;
  thick?: boolean;
}) {
  const beforeText = trimTrailingSpace(before);

  return (
    <>
      {beforeText}
      {beforeText ? " " : null}
      <StoryHighlight tone={tone} thick={thick}>
        {highlight}
      </StoryHighlight>
      {afterHighlightFragment(after)}
    </>
  );
}

export function StoryHighlight({
  children,
  tone = "sky",
  thick = false,
}: {
  children: ReactNode;
  tone?: HighlightTone;
  thick?: boolean;
}) {
  const scrollProgress = useLanding4ScrollProgress();
  const offset = TONE_OFFSET[tone] ?? 0;
  const position = ((scrollProgress * 1.4 + offset) % 1) * 100;

  return (
    <span className="group/hl relative inline font-black text-white">
      {children}
      <span
        className={`absolute -bottom-0.5 left-0 w-[92%] rounded-full opacity-90 transition-[background-position,opacity] duration-300 ease-out group-hover/hl:w-full group-hover/hl:opacity-100 ${
          thick ? "h-1.5 sm:h-2" : "h-0.5 sm:h-1"
        }`}
        style={{
          background: SCROLL_UNDERLINE_GRADIENT,
          backgroundSize: "220% 100%",
          backgroundPosition: `${position}% 0`,
        }}
        aria-hidden="true"
      />
    </span>
  );
}

export function StoryDetail({
  label,
  detail,
}: {
  label: string;
  detail: string;
}) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <button
      type="button"
      className="group/detail relative inline cursor-help border-b border-dotted border-sky-500/50 text-sky-200 transition hover:border-sky-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      aria-describedby={tooltipId}
      aria-expanded={open}
      onClick={() => setOpen((value) => !value)}
      onBlur={() => setOpen(false)}
    >
      {label}
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-zinc-700 bg-zinc-900/95 px-3 py-2 text-left text-xs font-normal leading-relaxed text-zinc-300 shadow-xl sm:group-hover/detail:block ${
          open ? "block" : "hidden group-hover/detail:block group-focus-visible/detail:block"
        }`}
      >
        {detail}
      </span>
    </button>
  );
}
