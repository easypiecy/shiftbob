"use client";

import { useRef } from "react";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { Landing2Placeholder } from "./landing2-placeholder";
import { useStickyScrollProgress } from "./use-sticky-scroll-progress";

const TIMELINE = [
  { day: "Mon", shift: "07:00–15:00", hours: 8 },
  { day: "Tue", shift: "22:00–06:00", hours: 8, conflict: true },
  { day: "Wed", shift: "07:00–15:00", hours: 8 },
  { day: "Thu", shift: "Day off", hours: 0 },
  { day: "Fri", shift: "15:00–23:00", hours: 8 },
];

export function Landing2ComplianceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useStickyScrollProgress(sectionRef);
  const phase =
    progress < 0.35 ? "idle" : progress < 0.65 ? "warning" : "resolved";

  return (
    <section
      id="landing2-compliance"
      ref={sectionRef}
      className="relative min-h-[140vh] scroll-mt-24 bg-white"
    >
      <div className="sticky top-16 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Compliance
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Helt ro i maven — ShiftBob sikrer, at din vagtplan altid er lovlig
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
              Det er slut med at Google komplekse hviletidsbestemmelser eller svede over lokale
              overenskomster. ShiftBob scanner automatisk dit regneark for lovlighed, så snart du
              uploader det.
            </p>
            <ul className="mt-6 space-y-4 text-sm text-zinc-700 sm:text-base">
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span>
                  <strong className="font-semibold text-zinc-900">Automatisk compliance-tjek:</strong>{" "}
                  Systemet opdager og blokerer øjeblikkeligt brud på f.eks. 11-timers reglen eller
                  det ugentlige fridøgn.
                </span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                <span>
                  <strong className="font-semibold text-zinc-900">Lokale regler og overenskomster:</strong>{" "}
                  Fodr ShiftBobs AI (eller juster via JSON), så advarslerne tilpasser sig præcis jeres
                  virkelighed.
                </span>
              </li>
              <li className="flex gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                <span>
                  <strong className="font-semibold text-zinc-900">100% GDPR-sikker:</strong> Alt
                  opbevares og håndteres efter højeste EU-standard.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <Landing2Placeholder
              src={WEBSITE_ASSETS.landingEuCompliance}
              label="Compliance illustration"
              alt="Team compliance and shift schedule"
              className="aspect-[4/3] w-full shadow-lg ring-1 ring-zinc-200/80"
              rounded="3xl"
            />

            <div
              className={`rounded-2xl border p-4 transition-all duration-500 ${
                phase === "warning"
                  ? "border-red-300 bg-red-50 shadow-[0_0_0_4px_rgba(248,113,113,0.15)]"
                  : phase === "resolved"
                    ? "border-emerald-300 bg-emerald-50 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]"
                    : "border-zinc-200 bg-zinc-50"
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
                          ? "bg-red-100 text-red-900"
                          : isFixed
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-white text-zinc-800"
                      }`}
                      style={{ transitionDelay: `${index * 40}ms` }}
                    >
                      <span className="font-semibold">{entry.day}</span>
                      <span>{isFixed ? "07:00–15:00" : entry.shift}</span>
                    </div>
                  );
                })}
              </div>
              {phase === "warning" ? (
                <p className="mt-3 animate-pulse rounded-lg bg-red-200/80 px-3 py-2 text-sm font-semibold text-red-900">
                  11-hour rest rule violation!
                </p>
              ) : null}
              {phase === "resolved" ? (
                <p className="mt-3 rounded-lg bg-emerald-200/80 px-3 py-2 text-sm font-semibold text-emerald-900">
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
