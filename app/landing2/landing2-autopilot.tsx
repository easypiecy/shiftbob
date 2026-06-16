"use client";

import { useRef } from "react";
import { Bot, CalendarDays, Download, Users } from "lucide-react";
import { useStickyScrollProgress } from "./use-sticky-scroll-progress";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const EMPLOYEES = [
  { name: "Anna", tag: "Evening shifts only" },
  { name: "Bo", tag: "Max 32 hours" },
  { name: "Cara", tag: "Thursday off" },
  { name: "David", tag: "Morning shifts OK" },
];

export function Landing2AutopilotSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useStickyScrollProgress(sectionRef);
  const autopilotOn = progress > 0.12;
  const fillWave = Math.min(1, Math.max(0, (progress - 0.2) * 1.4));
  const exportVisible = progress > 0.72;

  return (
    <section ref={sectionRef} className="relative min-h-[150vh] bg-zinc-950 text-white">
      <div className="sticky top-16 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-violet-200">
              <Bot className="h-4 w-4" aria-hidden="true" />
              Autopilot
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Sæt vagtplanen på Autopilot
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
              Hvorfor bruge timer på et puslespil, der kan lægges på sekunder? ShiftBob tager højde
              for alle variable og klarer det tunge arbejde for dig, så du kan fokusere på din
              forretning.
            </p>
            <ul className="mt-6 space-y-4 text-sm text-zinc-300 sm:text-base">
              <li className="flex gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
                <span>
                  <strong className="font-semibold text-white">Intelligent rullende vagtplan:</strong>{" "}
                  Automatisk generering med kontrakter og timetal inkluderet.
                </span>
              </li>
              <li className="flex gap-3">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                <span>
                  <strong className="font-semibold text-white">Respekt for medarbejdernes ønsker:</strong>{" "}
                  Balancerer virksomhedens behov med præferencer og fridagsønsker.
                </span>
              </li>
              <li className="flex gap-3">
                <Download className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                <span>
                  <strong className="font-semibold text-white">Klar til lønkørsel på et øjeblik:</strong>{" "}
                  Eksporter beregnede timer og tillæg direkte til dit lønsystem.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-200">Autopilot dashboard</p>
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${
                  autopilotOn
                    ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/50"
                    : "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700"
                }`}
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full transition-colors ${
                    autopilotOn ? "bg-emerald-400" : "bg-zinc-500"
                  }`}
                />
                {autopilotOn ? "ON" : "OFF"}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-7 gap-1.5">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="rounded-md bg-zinc-800/80 px-1 py-1 text-center text-[10px] font-semibold text-zinc-400"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 28 }).map((_, index) => {
                const filled = fillWave > index / 28;
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-md border transition-all duration-300 ${
                      filled
                        ? "border-sky-400/40 bg-sky-500/25"
                        : "border-zinc-700/80 bg-zinc-900/60"
                    }`}
                    style={{ transitionDelay: `${(index % 7) * 20}ms` }}
                  />
                );
              })}
            </div>

            <div className="space-y-2">
              {EMPLOYEES.map((employee, index) => {
                const placed = fillWave > 0.25 + index * 0.15;
                return (
                  <div
                    key={employee.name}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs transition-all duration-500 ${
                      placed
                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                        : "border-zinc-700 bg-zinc-900/50 text-zinc-500"
                    }`}
                    style={{
                      opacity: placed ? 1 : 0.55,
                      transform: placed ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    <span className="font-semibold">{employee.name}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                      {employee.tag}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              className={`mt-5 flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 transition-all duration-700 ${
                exportVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <Download className="h-5 w-5 text-amber-300" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-amber-100">Export ready</p>
                <p className="text-xs text-amber-200/80">shift-schedule-export.csv · Excel-compatible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
