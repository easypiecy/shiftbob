"use client";

import { type ReactNode } from "react";
import { Download, ShieldCheck } from "lucide-react";
import { createTranslator } from "@/src/lib/translations-server";
import {
  ChapterSectionScrollBg,
  ChapterTransitionScrollArrow,
} from "./landing4-chapter-transition";
import { Chapter1ScrollVisual } from "./landing4-chapter1-visual";
import { Chapter2ScrollVisual } from "./landing4-chapter2-visual";
import { Chapter3UploadVisual } from "./landing4-upload-visual";
import { Chapter4PhoneVisual } from "./landing4-phone-visual";
import { Chapter5ScrollVideo } from "./landing4-chapter5-video";
import { ChapterProgressRail } from "./landing4-chapter-rail";
import { Landing4Hero } from "./landing4-hero";
import { Landing4ScrollProvider } from "./landing4-scroll-context";
import { StoryDetail, StoryHighlightPhrase } from "./landing4-highlight";
import { Landing4GradientBorderLink } from "./landing4-cta-button";
import { useInView } from "./use-in-view";

function ChapterShell({
  step,
  id,
  accent,
  eyebrow,
  visual,
  scrollBgColor,
  reverseLayout = false,
  className = "",
  children,
}: {
  step: number;
  id: string;
  accent: string;
  eyebrow: ReactNode;
  visual: ReactNode;
  scrollBgColor?: string;
  reverseLayout?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const { ref, visible } = useInView(0.2);
  const textOrder = reverseLayout ? "lg:order-2" : "lg:order-1";
  const visualOrder = reverseLayout ? "lg:order-1" : "lg:order-2";
  const accentPosition = reverseLayout ? "30% 40%" : "70% 40%";

  return (
    <section
      id={id}
      ref={ref}
      className={`relative scroll-mt-24 py-16 sm:min-h-[92vh] sm:py-24 ${className}`}
    >
      {scrollBgColor ? <ChapterSectionScrollBg sectionId={id} color={scrollBgColor} /> : null}

      <div
        className={`pointer-events-none absolute inset-0 z-[2] opacity-40 transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
        style={{
          background: `radial-gradient(ellipse 60% 50% at ${accentPosition}, ${accent}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div
          className={`order-2 transition-all duration-700 ease-out ${textOrder} ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-6">
            <span className="landing4-chapter-step inline-flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-900 text-4xl font-black text-white shadow-[0_0_24px_rgba(0,0,0,0.35)]">
              {step}
            </span>
            <div className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] sm:text-sm">
              {eyebrow}
            </div>
          </div>
          {children}
        </div>

        <div
          className={`order-1 transition-all delay-150 duration-700 ease-out ${visualOrder} ${
            visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          {visual}
        </div>
      </div>
    </section>
  );
}

function StoryCta({
  href,
  label,
  trailingIcon = "arrow",
}: {
  href: string;
  label: string;
  trailingIcon?: "arrow" | "download";
}) {
  return (
    <Landing4GradientBorderLink href={href} className="mt-8" size="md">
      {label}
      {trailingIcon === "download" ? (
        <Download
          className="ml-2 h-4 w-4 transition duration-300 group-hover:translate-y-0.5 group-hover:scale-125"
          aria-hidden="true"
        />
      ) : (
        <span
          className="ml-2 transition duration-300 group-hover:translate-x-1 group-hover:scale-110"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </Landing4GradientBorderLink>
  );
}

export function Landing4Story({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const t = createTranslator(translations);

  return (
    <Landing4ScrollProvider>
      <div className="relative">
        <ChapterProgressRail translations={translations} />

        <Landing4Hero translations={translations} />

        <ChapterShell
          step={1}
          id="landing4-chapter-1"
          accent="rgba(16,185,129,0.12)"
          eyebrow={
            <span className="inline-flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {t("landing4.chapter1.eyebrow", "Compliance")}
            </span>
          }
          visual={<Chapter1ScrollVisual translations={translations} />}
        >
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            <StoryHighlightPhrase
              tone="emerald"
              thick
              before={t("landing4.chapter1.title_prefix", "Lever din vagtplan op til de seneste ")}
              highlight={t("landing4.chapter1.title_highlight", "EU-regler")}
              after={t("landing4.chapter1.title_suffix", "?")}
            />
          </h2>
          <p className="mt-6 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {t(
              "landing4.chapter1.body_prefix",
              "De skærpede EU-direktiver stiller markant større krav til arbejdsgivere, når det gælder "
            )}
            <StoryDetail
              label={t("landing4.chapter1.detail.time_registration.label", "tidsregistrering")}
              detail={t(
                "landing4.chapter1.detail.time_registration.tooltip",
                "Dokumentation af faktisk arbejdstid er et centralt krav i de opdaterede direktiver."
              )}
            />
            {t("landing4.chapter1.body_mid", " og ")}
            <StoryDetail
              label={t("landing4.chapter1.detail.rest_periods.label", "hviletidsbestemmelser")}
              detail={t(
                "landing4.chapter1.detail.rest_periods.tooltip",
                "FX 11-timers daglig hvile og ugentligt fridøgn — ShiftBob tjekker automatisk for brud."
              )}
            />
            {t(
              "landing4.chapter1.body_suffix",
              ". Er du sikker på, at dine nuværende processer holder jer på den sikre side af loven?"
            )}
          </p>
        </ChapterShell>

        <ChapterShell
          step={2}
          id="landing4-chapter-2"
          accent="rgba(16,185,129,0.1)"
          scrollBgColor="#18181b"
          reverseLayout
          className="mt-2 sm:mt-4 lg:mt-6"
          eyebrow={
            <span className="text-emerald-400">
              {t("landing4.chapter2.eyebrow", "Gratis start")}
            </span>
          }
          visual={<Chapter2ScrollVisual translations={translations} />}
        >
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            <StoryHighlightPhrase
              tone="emerald"
              thick
              before={t(
                "landing4.chapter2.title_prefix",
                "Download det ultimative regneark til vagtplanlægning — 100% "
              )}
              highlight={t("landing4.chapter2.title_highlight", "gratis")}
            />
          </h2>
          <p className="mt-6 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {t(
              "landing4.chapter2.body_prefix",
              "Få det fulde overblik over dit team. Hent vores professionelle Excel-skabelon i dag og få indbygget "
            )}
            <StoryDetail
              label={t("landing4.chapter2.detail.hour_calc.label", "timeberegning")}
              detail={t(
                "landing4.chapter2.detail.hour_calc.tooltip",
                "Automatiske summeringer pr. medarbejder og måned — klar til løn og overblik."
              )}
            />
            {t(
              "landing4.chapter2.body_suffix",
              ", automatisk struktur og et klart overblik over jeres arbejdstid."
            )}
          </p>
          <StoryCta
            href="/employer-signup?product=basic"
            label={t("landing4.chapter2.cta", "Hent den her")}
            trailingIcon="download"
          />
        </ChapterShell>

        <ChapterShell
          step={3}
          id="landing4-chapter-3"
          accent="rgba(56,189,248,0.12)"
          eyebrow={
            <span className="text-sky-400">{t("landing4.chapter3.eyebrow", "Gratis tjek")}</span>
          }
          visual={<Chapter3UploadVisual translations={translations} />}
        >
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            <StoryHighlightPhrase
              tone="sky"
              thick
              before={t("landing4.chapter3.title_prefix", "Send os dit regneark, og få en gratis ")}
              highlight={t("landing4.chapter3.title_highlight", "compliance-rapport")}
            />
          </h2>
          <p className="mt-6 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {t(
              "landing4.chapter3.body",
              "Lad os tjekke din nuværende vagtplan for potentielle lovbrud. Upload dit regneark her eller send det til os på e-mail — så modtager du en uforpligtende rapport, der viser, om I overholder reglerne."
            )}
          </p>
        </ChapterShell>

        <ChapterTransitionScrollArrow
          fromId="landing4-chapter-3"
          toId="landing4-chapter-4"
          alignToTextColumn
        />

        <ChapterShell
          step={4}
          id="landing4-chapter-4"
          accent="rgba(56,189,248,0.1)"
          reverseLayout
          className="mt-10 sm:mt-14 lg:mt-16"
          eyebrow={
            <span className="text-sky-400">
              {t("landing4.chapter4.eyebrow", "Hybrid App")}
            </span>
          }
          visual={<Chapter4PhoneVisual translations={translations} />}
        >
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            <StoryHighlightPhrase
              tone="sky"
              thick
              before={t(
                "landing4.chapter4.title_prefix",
                "Når du er klar: Giv dine medarbejdere vagtplanen direkte som "
              )}
              highlight={t("landing4.chapter4.title_highlight", "app")}
            />
          </h2>
          <p className="mt-6 text-base leading-relaxed text-zinc-400 sm:text-lg">
            <StoryHighlightPhrase
              tone="white"
              before={t(
                "landing4.chapter4.body_prefix",
                "Vores intelligente regneark klarer automatisk oprettelsen af dine medarbejdere i systemet. Vil du give dit team direkte adgang til deres vagter, chat og vagtbytte på farten? Forbind regnearket med medarbejder-appen fra kun "
              )}
              highlight={t("landing4.chapter4.price", "49 EUR")}
              after={t("landing4.chapter4.body_suffix", " om måneden.")}
            />
          </p>
          <StoryCta
            href="/employer-signup?product=hybrid_app"
            label={t("landing4.chapter4.cta", "Kom i gang med appen")}
          />
        </ChapterShell>

        <ChapterShell
          step={5}
          id="landing4-chapter-5"
          accent="rgba(139,92,246,0.14)"
          eyebrow={
            <span className="text-violet-400">
              {t("landing4.chapter5.eyebrow", "Autopilot")}
            </span>
          }
          visual={<Chapter5ScrollVideo translations={translations} />}
        >
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            <StoryHighlightPhrase
              tone="violet"
              thick
              before={t("landing4.chapter5.title_prefix", "Vil du være på forkant? Gå ")}
              highlight={t("landing4.chapter5.title_highlight", "fuldt online")}
              after={t("landing4.chapter5.title_suffix", " og automatisér det hele")}
            />
          </h2>
          <p className="mt-6 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {t(
              "landing4.chapter5.body_prefix",
              "Tag det næste skridt og slip fuldstændig for det manuelle arbejde i regnearket. Lad vores indbyggede "
            )}
            <StoryDetail
              label={t("landing4.chapter5.detail.ai.label", "AI")}
              detail={t(
                "landing4.chapter5.detail.ai.tooltip",
                "Autopilot genererer compliant vagtplaner og balancerer medarbejdernes ønsker automatisk."
              )}
            />
            {t(
              "landing4.chapter5.body_suffix",
              " håndtere den automatiske vagtplanlægning, så du optimerer de daglige arbejdsgange og altid er garanteret fuld compliance."
            )}
          </p>
          <StoryCta
            href="/employer-signup?product=autopilot"
            label={t("landing4.chapter5.cta", "Prøv fuld automatisering")}
          />
        </ChapterShell>
      </div>
    </Landing4ScrollProvider>
  );
}
