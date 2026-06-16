"use client";

import { useRef } from "react";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { Landing3Placeholder } from "./landing3-placeholder";
import { useStickyScrollProgress } from "./use-sticky-scroll-progress";

const TIMELINE = [
  { day: "Mon", shift: "07:00–15:00", hours: 8 },
  { day: "Tue", shift: "22:00–06:00", hours: 8, conflict: true },
  { day: "Wed", shift: "07:00–15:00", hours: 8 },
  { day: "Thu", shift: "Day off", hours: 0 },
  { day: "Fri", shift: "15:00–23:00", hours: 8 },
];

export function Landing3ComplianceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useStickyScrollProgress(sectionRef);
  const phase =
    progress < 0.35 ? "idle" : progress < 0.65 ? "warning" : "resolved";

  return (
    <section
      id="landing3-compliance"
      ref={sectionRef}
      className="relative min-h-[145vh] scroll-mt-24 bg-[#0c0c12] text-zinc-100"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-64 w-64 rounded-full bg-emerald-600/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="sticky top-16 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Compliance
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Helt ro i maven — ShiftBob sikrer, at din vagtplan altid er lovlig
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
              Det er slut med at Google komplekse hviletidsbestemmelser eller svede over lokale
              overenskomster. ShiftBob scanner automatisk dit regneark for lovlighed, så snart du
              uploader det.
            </p>
            <ul className="mt-6 space-y-4 text-sm text-zinc-400 sm:text-base">
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <span>
                  <strong className="font-semibold text-zinc-100">Automatisk compliance-tjek:</strong>{" "}
                  Systemet opdager og blokerer øjeblikkeligt brud på f.eks. 11-timers reglen eller
                  det ugentlige fridøgn.
                </span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
                <span>
                  <strong className="font-semibold text-zinc-100">Lokale regler og overenskomster:</strong>{" "}
                  Fodr ShiftBobs AI (eller juster via JSON), så advarslerne tilpasser sig præcis jeres
                  virkelighed.
                </span>
              </li>
              <li className="flex gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
                <span>
                  <strong className="font-semibold text-zinc-100">100% GDPR-sikker:</strong> Alt
                  opbevares og håndteres efter højeste EU-standard.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <Landing3Placeholder
              src={WEBSITE_ASSETS.landingEuCompliance}
              label="Compliance illustration"
              alt="Team compliance and shift schedule"
              className="aspect-[4/3] w-full"
              rounded="3xl"
            />

            <div
              className={`rounded-2xl border p-4 backdrop-blur-sm transition-all duration-700 ${
                phase === "warning"
                  ? "border-red-500/50 bg-red-950/40 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
                  : phase === "resolved"
                    ? "border-emerald-500/40 bg-emerald-950/30 shadow-[0_0_40px_rgba(52,211,153,0.2)]"
                    : "border-zinc-800 bg-zinc-900/60"
              }`}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Employee&apos;s week
              </p>
              <div className="space-y-2">
                {TIMELINE.map((entry, index) => {
                  const isConflict = entry.conflict && phase !== "resolved";
                  const isFixed = entry.conflict && phase === "resolved";
                  return (
                    <div
                      key={entry.day}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-all duration-500 ${
                        isConflict
                          ? "bg-red-950/80 text-red-200 ring-1 ring-red-500/40"
                          : isFixed
                            ? "bg-emerald-950/60 text-emerald-200 ring-1 ring-emerald-500/30"
                            : "bg-zinc-900/80 text-zinc-300 ring-1 ring-zinc-800"
                      }`}
                      style={{
                        transitionDelay: `${index * 50}ms`,
                        boxShadow: isConflict
                          ? "0 0 20px rgba(239,68,68,0.3)"
                          : isFixed
                            ? "0 0 16px rgba(52,211,153,0.2)"
                            : undefined,
                      }}
                    >
                      <span className="font-semibold">{entry.day}</span>
                      <span>{isFixed ? "07:00–15:00" : entry.shift}</span>
                    </div>
                  );
                })}
              </div>
              {phase === "warning" ? (
                <p className="mt-3 animate-pulse rounded-lg bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-300 ring-1 ring-red-500/40">
                  11-hour rest rule violation!
                </p>
              ) : null}
              {phase === "resolved" ? (
                <p className="mt-3 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                  Shift automatically moved to a legal time slot ✓
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
