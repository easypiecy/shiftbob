"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Bell, Globe2, MessageCircle, RefreshCw } from "lucide-react";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { Landing2Placeholder } from "./landing2-placeholder";

function MiniPhone({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[240px] ${className}`}>
      <div className="rounded-[2rem] border-[8px] border-zinc-900 bg-zinc-900 p-1.5 shadow-xl">
        <div className="rounded-[1.4rem] bg-zinc-950 p-3">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            {title}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Landing2EmployeeAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let t1: number | undefined;
    let t2: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setPhase(1);
          t1 = window.setTimeout(() => setPhase(2), 900);
          t2 = window.setTimeout(() => setPhase(3), 1800);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f3f7fb_0%,#ffffff_100%)] py-20 sm:py-28"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <div className="relative flex items-center justify-center gap-4 sm:gap-8">
            <MiniPhone title="Employee">
              <div className="relative aspect-[9/14] overflow-hidden rounded-xl bg-zinc-800">
                <Image
                  src={WEBSITE_ASSETS.landingEmployeePhoto}
                  alt=""
                  fill
                  className="object-cover opacity-80"
                  unoptimized
                />
                <button
                  type="button"
                  className={`absolute bottom-4 left-1/2 w-[88%] -translate-x-1/2 rounded-full bg-[#4A90E2] px-3 py-2 text-[11px] font-bold text-white transition-all duration-500 ${
                    phase >= 1 ? "scale-100 opacity-100" : "scale-95 opacity-70"
                  }`}
                >
                  Request shift swap
                </button>
              </div>
            </MiniPhone>

            <div
              className={`absolute left-[38%] top-[38%] z-10 max-w-[140px] rounded-2xl border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 shadow-lg transition-all duration-700 sm:left-[42%] ${
                phase >= 2
                  ? "translate-x-8 translate-y-0 opacity-100 sm:translate-x-16"
                  : "translate-x-0 translate-y-4 opacity-0"
              }`}
              aria-hidden="true"
            >
              Swap request sent →
            </div>

            <MiniPhone title="Manager" className="mt-8 sm:mt-12">
              <div className="space-y-3 p-1">
                <Landing2Placeholder
                  label="Manager app mockup"
                  className="aspect-[9/14] w-full"
                  rounded="xl"
                />
                <div
                  className={`rounded-xl border border-sky-200 bg-sky-50 p-3 transition-all duration-500 ${
                    phase >= 3 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-800">
                    <Bell className="h-3.5 w-3.5 text-[#4A90E2]" />
                    Approve shift swap?
                  </p>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-full bg-[#4A90E2] py-1.5 text-[11px] font-bold text-white"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </MiniPhone>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-800">
            Medarbejder-app
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Slip for unødig kommunikation og WhatsApp-kaos
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
            Glem alt om tabte PDF-filer, uoverskuelige tråde i beskedgrupper og konstante opkald på
            dine fridage. Med ShiftBob-appen har dine medarbejdere alt, hvad de skal bruge, lige i
            lommen.
          </p>
          <ul className="mt-6 space-y-4 text-sm text-zinc-700 sm:text-base">
            <li className="flex gap-3">
              <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-[#4A90E2]" />
              <span>
                <strong className="font-semibold text-zinc-900">Vagtbytte med ét klik:</strong>{" "}
                Medarbejderne bytter vagter i appen — du godkender med et enkelt klik.
              </span>
            </li>
            <li className="flex gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
              <span>
                <strong className="font-semibold text-zinc-900">Sikker chat uden private numre:</strong>{" "}
                Professionel teamkommunikation uden WhatsApp og private telefonnumre.
              </span>
            </li>
            <li className="flex gap-3">
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <span>
                <strong className="font-semibold text-zinc-900">Push-notifikationer der virker:</strong>{" "}
                Relevante opdateringer lander direkte — ingen kan sige, de &quot;ikke så mailen&quot;.
              </span>
            </li>
            <li className="flex gap-3">
              <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <span>
                <strong className="font-semibold text-zinc-900">Alle taler samme sprog:</strong>{" "}
                Appen understøtter alle EU-sprog, så medarbejderne kan læse planen på deres eget sprog.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
