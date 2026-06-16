"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { createTranslator } from "@/src/lib/translations-server";
import { StoryHighlight } from "./landing4-highlight";

function useHeroParallax(ref: RefObject<HTMLElement | null>, speed = 0.42) {
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1.12);
  const [arrowProgress, setArrowProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setOffsetY(0);
      setScale(1.08);
      setArrowProgress(0);
      return;
    }

    let frame = 0;

    function update() {
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      const heroHeight = node.offsetHeight;

      const scrollProgress = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / (viewport + heroHeight * 0.5))
      );

      setOffsetY(rect.top * speed);
      setScale(1.12 + scrollProgress * 0.06);

      const arrowScroll = Math.min(1, Math.max(0, -rect.top / (heroHeight * 0.42)));
      setArrowProgress(arrowScroll);
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
  }, [ref, speed]);

  return { offsetY, scale, arrowProgress };
}

export function Landing4Hero({
  translations,
}: {
  translations: Record<string, string>;
}) {
  const t = createTranslator(translations);
  const heroRef = useRef<HTMLElement>(null);
  const { offsetY, scale, arrowProgress } = useHeroParallax(heroRef);
  const arrowScale = 1 + arrowProgress * 7;
  const arrowTranslateY = arrowProgress * 140;
  const arrowOpacity = 1 - arrowProgress;

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[78vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:min-h-[88vh] sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute -inset-[18%] will-change-transform"
          style={{
            transform: `translate3d(0, ${offsetY}px, 0) scale(${scale})`,
          }}
        >
          <Image
            src={WEBSITE_ASSETS.landingEuCompliance}
            alt=""
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
            unoptimized
          />
        </div>

        <div className="absolute inset-0 bg-zinc-950/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/75 to-[#050508]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,transparent_0%,#050508_85%)]" />
      </div>

      <div className="relative z-10 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/90">
          {t("landing4.hero.eyebrow", "Vagtplan som altid følger reglerne")}
        </p>
        <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-6xl">
          {t("landing4.hero.title_prefix", "Fra usikkerhed om EU-regler til fuld ")}
          <StoryHighlight tone="violet" thick>
            {t("landing4.hero.title_highlight", "automatisering")}
          </StoryHighlight>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-300 sm:text-lg">
          {t(
            "landing4.hero.subtitle",
            "Scroll ned — vi guider dig trin for trin fra gratis regneark til app og Autopilot."
          )}
        </p>
        <div
          className="pointer-events-none mt-10 origin-center text-2xl font-light text-zinc-400 will-change-transform sm:text-3xl"
          style={{
            transform: `translate3d(0, ${arrowTranslateY}px, 0) scale(${arrowScale})`,
            opacity: arrowOpacity,
          }}
          aria-hidden="true"
        >
          ↓
        </div>
      </div>
    </section>
  );
}
