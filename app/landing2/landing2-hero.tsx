"use client";

import { useRef } from "react";
import Image from "next/image";
import { FileSpreadsheet, ArrowRight } from "lucide-react";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { useStickyScrollProgress } from "./use-sticky-scroll-progress";
import { ScrollToSectionButton } from "./scroll-to-section-button";
import { ScrollToProductsButton } from "./scroll-to-products-button";

const EXCEL_ROWS = [
  ["Employee", "Mon", "Tue", "Wed", "Thu", "Fri"],
  ["Anna K.", "07-15", "07-15", "Day off", "07-15", "07-15"],
  ["Bo M.", "15-23", "Day off", "15-23", "15-23", "Day off"],
  ["Cara L.", "Day off", "07-15", "07-15", "07-15", "15-23"],
];

const SHIFT_CHIPS = ["07-15", "15-23", "Day off", "07-15", "15-23"];

function ExcelMockup({ flyProgress }: { flyProgress: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] ring-1 ring-emerald-100">
      <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/80 px-3 py-2">
        <FileSpreadsheet className="h-4 w-4 text-emerald-700" aria-hidden="true" />
        <span className="text-xs font-semibold text-emerald-900">shift-schedule.xlsx</span>
      </div>
      <div className="overflow-x-auto p-2">
        <table className="w-full min-w-[280px] border-collapse text-[10px] sm:text-xs">
          <tbody>
            {EXCEL_ROWS.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const chipIndex = rowIndex * row.length + cellIndex;
                  const offset = Math.min(1, Math.max(0, flyProgress * 1.4 - chipIndex * 0.08));
                  return (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className={`border border-zinc-200 px-2 py-1.5 transition-colors ${
                        rowIndex === 0
                          ? "bg-zinc-100 font-semibold text-zinc-700"
                          : cellIndex === 0
                            ? "bg-zinc-50 font-medium text-zinc-800"
                            : "bg-white text-zinc-700"
                      }`}
                      style={
                        rowIndex > 0 && cellIndex > 0
                          ? {
                              opacity: 1 - offset * 0.85,
                              transform: `translate(${offset * 120}px, ${offset * -40}px) scale(${1 - offset * 0.2})`,
                            }
                          : undefined
                      }
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PhoneMockup({ receiveProgress }: { receiveProgress: number }) {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div className="rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 p-2 shadow-[0_28px_60px_rgba(15,23,42,0.28)]">
        <div className="overflow-hidden rounded-[1.75rem] bg-zinc-950">
          <div className="flex items-center justify-between px-4 py-2 text-[10px] text-white/70">
            <span>ShiftBob</span>
            <span>09:41</span>
          </div>
          <div className="relative aspect-[9/16] bg-zinc-900">
            <Image
              src={WEBSITE_ASSETS.landingEmployeePhoto}
              alt="Employee viewing shift schedule in app"
              fill
              className="object-cover opacity-90"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            <div className="absolute inset-x-3 bottom-4 space-y-2">
              {SHIFT_CHIPS.map((chip, index) => {
                const appear = Math.min(1, Math.max(0, receiveProgress * 1.3 - index * 0.15));
                return (
                  <div
                    key={chip + index}
                    className="rounded-xl border border-sky-400/40 bg-sky-500/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300"
                    style={{
                      opacity: appear,
                      transform: `translateY(${(1 - appear) * 24}px)`,
                    }}
                  >
                    {chip === "Day off" ? "Day off" : `Shift ${chip}`}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute -left-6 top-1/2 hidden -translate-y-1/2 lg:flex"
        style={{ opacity: receiveProgress }}
        aria-hidden="true"
      >
        <ArrowRight className="h-8 w-8 text-[#4A90E2]" />
      </div>
    </div>
  );
}

export function Landing2Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useStickyScrollProgress(sectionRef);
  const flyProgress = Math.min(1, progress * 1.2);
  const receiveProgress = Math.min(1, Math.max(0, (progress - 0.15) * 1.3));

  return (
    <section ref={sectionRef} className="relative min-h-[160vh] bg-[#f8fbff]">
      <div className="sticky top-16 z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center px-4 py-12 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90E2]">
              Fra regneark til app
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
              Vagtplan fra regneark til medarbejder-app
            </h1>
            <blockquote className="mt-6 border-l-4 border-[#4A90E2] pl-4 text-base leading-relaxed text-zinc-700 sm:text-lg">
              <strong className="font-semibold text-zinc-900">
                Behold Excel — vi giver det bare superkræfter.
              </strong>{" "}
              Du behøver ikke at starte forfra i et komplekst system. Upload dit nuværende regneark,
              og se det forvandle sig til en professionel app til dit team på få sekunder.
            </blockquote>
            <div className="mt-8 flex flex-wrap gap-3">
              <ScrollToProductsButton
                label="Prøv gratis nu"
                className="rounded-full bg-[#4A90E2] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(74,144,226,0.28)] transition hover:-translate-y-0.5 hover:bg-[#3A7FD1]"
              />
              <ScrollToSectionButton
                targetId="landing2-compliance"
                label="Se hvordan det virker"
                className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-bold text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-400"
              />
            </div>
          </div>

          <div className="grid items-center gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <ExcelMockup flyProgress={flyProgress} />
            <PhoneMockup receiveProgress={receiveProgress} />
          </div>
        </div>

        <p
          className="mt-10 text-center text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 transition-opacity"
          style={{ opacity: progress > 0.05 ? 1 - progress : 1 }}
        >
          Scroll for at se data flytte fra Excel til appen
        </p>
      </div>
    </section>
  );
}
