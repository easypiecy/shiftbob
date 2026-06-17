import Link from "next/link";
import { MoveRight } from "lucide-react";
import { createTranslator } from "@/src/lib/translations-server";
import { formatLocalPriceHint } from "@/src/lib/local-currency-from-language";
import { EnterpriseCallout } from "./enterprise-callout";
import { plans, type Plan } from "../landing2/product-choices-data";
import { Landing4GradientBorderLink } from "../landing4/landing4-cta-button";

type PrimaryCtaVariant = "blue" | "gradient-border";

function CtaButton({
  label,
  href,
  style,
  primaryVariant = "blue",
}: {
  label: string;
  href: string;
  style: "primary" | "secondary" | "contrast";
  primaryVariant?: PrimaryCtaVariant;
}) {
  if (
    primaryVariant === "gradient-border" &&
    (style === "primary" || style === "contrast")
  ) {
    return (
      <Landing4GradientBorderLink href={href} fullWidth size="md" innerClassName="py-2.5">
        {label}
      </Landing4GradientBorderLink>
    );
  }

  const styles =
    style === "secondary"
      ? "border border-zinc-600 bg-zinc-800 text-zinc-100 shadow-sm hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-700"
      : style === "contrast"
        ? "bg-white text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.12)] hover:-translate-y-0.5 hover:bg-zinc-100"
        : "bg-[#4A90E2] text-white shadow-[0_0_24px_rgba(74,144,226,0.35)] hover:-translate-y-0.5 hover:bg-[#3A7FD1]";

  return (
    <Link
      href={href}
      className={`inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-center text-sm font-bold leading-tight transition ${styles}`}
    >
      {label}
    </Link>
  );
}

function formatEurListPrice(eurAmount: number): string {
  return `${eurAmount} EUR`;
}

function PlanCard({
  plan,
  t,
  languageCode,
  primaryCtaVariant = "blue",
}: {
  plan: Plan;
  t: (key: string, fallback?: string) => string;
  languageCode: string;
  primaryCtaVariant?: PrimaryCtaVariant;
}) {
  const modeStylesFor = (tone: "green" | "yellow") =>
    tone === "yellow"
      ? "bg-amber-950/60 text-amber-200 border-amber-500/30"
      : "bg-emerald-950/60 text-emerald-200 border-emerald-500/30";

  const localPriceHint = formatLocalPriceHint(plan.priceEurAmount, languageCode);

  return (
    <div className="relative h-full">
      {plan.badge ? (
        <span className="absolute right-6 top-0 z-20 -translate-y-1/2 rounded-full bg-[#4A90E2]/90 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_24px_rgba(74,144,226,0.4)] backdrop-blur-sm sm:right-8">
          {t(plan.badge.key, plan.badge.fallback)}
        </span>
      ) : null}
      <article className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-zinc-800 bg-zinc-900/90 p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)] ring-1 ring-zinc-700/50 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_0_48px_rgba(56,189,248,0.12)]">
      <div
        className={`-mx-6 -mt-6 mb-3 flex min-h-[96px] items-start justify-between gap-3 bg-[linear-gradient(135deg,#0f172a_0%,#172033_58%,#1e3a5f_100%)] px-6 py-5 ring-1 ring-sky-500/10${plan.badge ? " pr-28 pt-6 sm:pr-32" : ""}`}
      >
        <div className="min-w-0">
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {t(plan.title.key, plan.title.fallback)}
          </h3>
          <p className="mt-1 text-sm font-semibold text-white/85">
            {t(plan.subtitle.key, plan.subtitle.fallback)}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {(plan.modeLabels ?? [{ label: plan.modeLabel, tone: plan.modeTone }]).map((entry) => (
            <span
              key={entry.label.key}
              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${modeStylesFor(entry.tone)}`}
            >
              {t(entry.label.key, entry.label.fallback)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex min-h-[78px] flex-col justify-end">
        <p className="text-3xl font-black tracking-tight text-white">
          {formatEurListPrice(plan.priceEurAmount)}
          {localPriceHint ? (
            <span className="ml-1.5 text-lg font-semibold text-zinc-500">{localPriceHint}</span>
          ) : null}
        </p>
        <p className="text-sm font-medium text-zinc-400">
          {t(plan.periodMain.key, plan.periodMain.fallback)}
          {plan.periodPerUser ? (
            <>
              {" + "}
              <strong>{t(plan.periodPerUser.key, plan.periodPerUser.fallback)}</strong>
            </>
          ) : null}
        </p>
      </div>
      <p className="mt-4 min-h-[84px] text-sm leading-6 text-zinc-400">
        {t(plan.description.key, plan.description.fallback)}
      </p>

      <ul className="mt-5 flex-1 space-y-2 text-sm text-zinc-300">
        {plan.features.map((feature) => (
          <li key={feature.key} className="flex gap-3">
            <MoveRight
              className="mt-0.5 h-4 w-6 shrink-0 text-sky-400"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span>{t(feature.key, feature.fallback)}</span>
          </li>
        ))}
        {plan.specialFeature ? (
          <li className="mt-3 rounded-2xl border border-violet-500/30 bg-violet-950/40 px-3 py-2 text-violet-200">
            <span className="mr-2 inline-flex rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]">
              {t("landing.plans.special_feature_label", "Special feature")}
            </span>
            <span>{t(plan.specialFeature.key, plan.specialFeature.fallback)}</span>
          </li>
        ) : null}
        {plan.employeeLimitFootnote ? (
          <li className="pt-2 text-xs italic text-zinc-500">
            {t(plan.employeeLimitFootnote.key, plan.employeeLimitFootnote.fallback)}
          </li>
        ) : null}
      </ul>

      <div
        className={`mt-auto flex w-full flex-col pt-6 ${
          plan.id === "foundation" ? "gap-3" : "gap-2"
        }`}
      >
        {plan.ctas.map((cta) => (
          <CtaButton
            key={cta.label.key}
            label={t(cta.label.key, cta.label.fallback)}
            href={cta.href}
            style={cta.style}
            primaryVariant={primaryCtaVariant}
          />
        ))}
      </div>
    </article>
    </div>
  );
}

export function ProductChoices({
  translations,
  languageCode,
  primaryCtaVariant = "blue",
  sectionBorder = true,
  sectionClassName = "bg-[linear-gradient(180deg,#0a0a10_0%,#0c0c12_100%)]",
}: {
  translations: Record<string, string>;
  languageCode: string;
  primaryCtaVariant?: PrimaryCtaVariant;
  sectionBorder?: boolean;
  sectionClassName?: string;
}) {
  const t = createTranslator(translations);

  return (
    <section
      className={`${sectionClassName} ${sectionBorder ? "border-y border-zinc-800" : ""}`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t(
              "landing.plans.header.title",
              "Prices"
            )}
          </h2>
        </div>

        <div className="mt-12 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              t={t}
              languageCode={languageCode}
              primaryCtaVariant={primaryCtaVariant}
            />
          ))}
        </div>

        <EnterpriseCallout
          headline={t("landing.plans.enterprise.title", "Enterprise Solution")}
          subheadline={t(
            "landing.plans.enterprise.subtitle",
            "Managing a team of more than 100 employees? Contact us today for a tailored pricing agreement and custom onboarding."
          )}
          buttonLabel={t("landing.plans.enterprise.cta", "Contact Us")}
        />
      </div>
    </section>
  );
}
