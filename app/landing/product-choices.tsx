import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createTranslator } from "@/src/lib/translations-server";
import { formatLocalPriceHint } from "@/src/lib/local-currency-from-language";
import { EnterpriseCallout } from "./enterprise-callout";

type LocalizedText = {
  key: string;
  fallback: string;
};

type Plan = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  modeLabel: LocalizedText;
  modeTone: "green" | "yellow";
  modeLabels?: Array<{
    label: LocalizedText;
    tone: "green" | "yellow";
  }>;
  priceEurAmount: number;
  periodMain: LocalizedText;
  periodPerUser?: LocalizedText;
  description: LocalizedText;
  features: LocalizedText[];
  specialFeature?: LocalizedText;
  ctas: Array<{
    label: LocalizedText;
    href: string;
    style: "primary" | "secondary" | "contrast";
  }>;
  badge?: LocalizedText;
  employeeLimitFootnote?: LocalizedText;
};

const plans: Plan[] = [
  {
    id: "foundation",
    title: { key: "landing.plans.foundation.title", fallback: "Free Basic" },
    subtitle: {
      key: "landing.plans.foundation.subtitle",
      fallback: "Free Spreadsheet & Checker",
    },
    modeLabel: { key: "landing.plans.mode.spreadsheet", fallback: "Spreadsheet" },
    modeTone: "green",
    priceEurAmount: 0,
    periodMain: { key: "landing.plans.foundation.period", fallback: "Forever." },
    description: {
      key: "landing.plans.foundation.description",
      fallback: "The ultimate Excel template to keep your schedule organized and legal.",
    },
    features: [
      {
        key: "landing.plans.foundation.feature1",
        fallback: "Free professional scheduling spreadsheet",
      },
      {
        key: "landing.plans.foundation.feature2",
        fallback: "Fully compatible with Excel and Google Sheets",
      },
      {
        key: "landing.plans.foundation.feature3",
        fallback: "Clear shift-type overview",
      },
      {
        key: "landing.plans.foundation.feature4",
        fallback: "Built-in hour calculations and monthly overview",
      },
      {
        key: "landing.plans.foundation.feature5",
        fallback: "Free compliance check on the ShiftBob platform (max once daily)",
      },
    ],
    ctas: [
      {
        label: {
          key: "landing.plans.foundation.cta.download_excel",
          fallback: "Download free Excel",
        },
        href: "/employer-signup?product=basic",
        style: "secondary",
      },
      {
        label: {
          key: "landing.plans.foundation.cta.free_check",
          fallback: "Free compliance check",
        },
        href: "/employer-signup?product=basic",
        style: "primary",
      },
    ],
  },
  {
    id: "hybrid-app",
    title: { key: "landing.plans.hybrid_app.title", fallback: "Hybrid App" },
    subtitle: {
      key: "landing.plans.hybrid_app.subtitle",
      fallback: "Spreadsheet to Smartphone",
    },
    modeLabel: { key: "landing.plans.mode.online", fallback: "Online" },
    modeTone: "yellow",
    modeLabels: [
      {
        label: { key: "landing.plans.mode.spreadsheet", fallback: "Spreadsheet" },
        tone: "green",
      },
      {
        label: { key: "landing.plans.mode.online", fallback: "Online" },
        tone: "yellow",
      },
    ],
    priceEurAmount: 49,
    periodMain: { key: "landing.plans.period.month", fallback: "/ month" },
    employeeLimitFootnote: {
      key: "landing.plans.employee_limit_footnote",
      fallback: "*Up to 100 employees",
    },
    description: {
      key: "landing.plans.hybrid_app.description",
      fallback: "You keep the spreadsheet. Your staff gets the app. Bridge the gap completely.",
    },
    features: [
      {
        key: "landing.plans.hybrid_app.feature1",
        fallback: "Everything in the free Basic plan",
      },
      {
        key: "landing.plans.hybrid_app.feature2",
        fallback: "iOS & Android app for all employees",
      },
      {
        key: "landing.plans.hybrid_app.feature3",
        fallback: "In-app shift swapping & more",
      },
      {
        key: "landing.plans.hybrid_app.feature4",
        fallback: "Manager Approval Dashboard for web & mobile",
      },
      {
        key: "landing.plans.hybrid_app.feature5",
        fallback: "Automated shift reminders & push notifications",
      },
      {
        key: "landing.plans.hybrid_app.feature6",
        fallback:
          "Seasonal businesses can pause their subscription freely during off-season periods",
      },
      {
        key: "landing.plans.hybrid_app.feature7",
        fallback: "Unlimited EU-compliance checks",
      },
      {
        key: "landing.plans.hybrid_app.feature8",
        fallback: "Priority email support",
      },
    ],
    ctas: [
      {
        label: {
          key: "landing.plans.hybrid_app.cta.upgrade",
          fallback: "Upgrade to next level!",
        },
        href: "/employer-signup?product=hybrid_app",
        style: "contrast",
      },
    ],
    badge: { key: "landing.plans.hybrid_app.badge", fallback: "Most Popular" },
  },
  {
    id: "autopilot",
    title: { key: "landing.plans.autopilot.title", fallback: "Autopilot" },
    subtitle: {
      key: "landing.plans.autopilot.subtitle",
      fallback: "Full Online Management",
    },
    modeLabel: {
      key: "landing.plans.mode.online_automatic",
      fallback: "Online & automatic",
    },
    modeTone: "yellow",
    priceEurAmount: 99,
    periodMain: { key: "landing.plans.period.month", fallback: "/ month" },
    employeeLimitFootnote: {
      key: "landing.plans.employee_limit_footnote",
      fallback: "*Up to 100 employees",
    },
    description: {
      key: "landing.plans.autopilot.description",
      fallback: "Ditch the spreadsheet entirely. Let our engine build and manage your schedule.",
    },
    features: [
      {
        key: "landing.plans.autopilot.feature1",
        fallback: "Everything in all previous plans",
      },
      {
        key: "landing.plans.autopilot.feature2",
        fallback: "Auto-generate shifts based on EU laws",
      },
      {
        key: "landing.plans.autopilot.feature3",
        fallback: "Match shifts with employee preferences automatically",
      },
      {
        key: "landing.plans.autopilot.feature4",
        fallback: "Advanced settings with full employee options control",
      },
      {
        key: "landing.plans.autopilot.feature5",
        fallback: "Publish shifts for pickup in the employee app",
      },
      {
        key: "landing.plans.autopilot.feature6",
        fallback: "Time-calculation export (incl. API access)",
      },
      {
        key: "landing.plans.autopilot.feature7",
        fallback: "Create custom shift types",
      },
      {
        key: "landing.plans.autopilot.feature8",
        fallback: "Customize with local rule setup",
      },
    ],
    specialFeature: {
      key: "landing.plans.autopilot.special_feature_employee_chat",
      fallback: "Employee chat",
    },
    ctas: [
      {
        label: {
          key: "landing.plans.autopilot.cta.go",
          fallback: "Go Autopilot",
        },
        href: "/employer-signup?product=autopilot",
        style: "primary",
      },
    ],
  },
];

function CtaButton({
  label,
  href,
  style,
}: {
  label: string;
  href: string;
  style: "primary" | "secondary" | "contrast";
}) {
  const styles =
    style === "secondary"
      ? "border border-zinc-200 bg-white text-zinc-900 shadow-sm hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
      : style === "contrast"
        ? "bg-[#111827] text-white shadow-[0_8px_20px_rgba(17,24,39,0.22)] hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_14px_28px_rgba(17,24,39,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827]/40 active:translate-y-0"
        : "bg-[#4A90E2] text-white shadow-[0_10px_24px_rgba(74,144,226,0.22)] hover:-translate-y-0.5 hover:bg-[#3A7FD1] hover:shadow-[0_14px_30px_rgba(74,144,226,0.3)]";

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
}: {
  plan: Plan;
  t: (key: string, fallback?: string) => string;
  languageCode: string;
}) {
  const modeStylesFor = (tone: "green" | "yellow") =>
    tone === "yellow"
      ? "bg-amber-50 text-amber-900 border-amber-200/80"
      : "bg-emerald-50 text-emerald-900 border-emerald-200/80";

  const localPriceHint = formatLocalPriceHint(plan.priceEurAmount, languageCode);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white bg-white/90 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.07)] ring-1 ring-zinc-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
      {plan.badge ? (
        <span className="absolute right-5 top-5 z-10 rounded-full bg-[#4A90E2] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_24px_rgba(74,144,226,0.28)]">
          {t(plan.badge.key, plan.badge.fallback)}
        </span>
      ) : null}
      <div className="-mx-6 -mt-6 mb-3 flex min-h-[96px] items-start justify-between gap-3 bg-[linear-gradient(135deg,#0f172a_0%,#172033_58%,#1e3a5f_100%)] px-6 py-5">
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
        <p className="text-3xl font-black tracking-tight text-zinc-950">
          {formatEurListPrice(plan.priceEurAmount)}
          {localPriceHint ? (
            <span className="ml-1.5 text-lg font-semibold text-zinc-500">{localPriceHint}</span>
          ) : null}
        </p>
        <p className="text-sm font-medium text-zinc-600">
          {t(plan.periodMain.key, plan.periodMain.fallback)}
          {plan.periodPerUser ? (
            <>
              {" + "}
              <strong>{t(plan.periodPerUser.key, plan.periodPerUser.fallback)}</strong>
            </>
          ) : null}
        </p>
      </div>
      <p className="mt-4 min-h-[84px] text-sm leading-6 text-zinc-600">
        {t(plan.description.key, plan.description.fallback)}
      </p>

      <ul className="mt-5 flex-1 space-y-2 text-sm text-zinc-700">
        {plan.features.map((feature) => (
          <li key={feature.key} className="flex gap-2">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-[#4A90E2]"
              aria-hidden="true"
            />
            <span>{t(feature.key, feature.fallback)}</span>
          </li>
        ))}
        {plan.specialFeature ? (
          <li className="mt-3 rounded-2xl border border-violet-200 bg-violet-50/80 px-3 py-2 text-violet-900">
            <span className="mr-2 inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]">
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

      <div className="mt-6 flex min-h-[96px] flex-col justify-end gap-2">
        {plan.ctas.map((cta) => (
          <CtaButton
            key={cta.label.key}
            label={t(cta.label.key, cta.label.fallback)}
            href={cta.href}
            style={cta.style}
          />
        ))}
      </div>
    </article>
  );
}

export function ProductChoices({
  translations,
  languageCode,
}: {
  translations: Record<string, string>;
  languageCode: string;
}) {
  const t = createTranslator(translations);

  return (
    <section className="border-y border-zinc-200/70 bg-[linear-gradient(180deg,#f8fbff_0%,#f3f7fb_100%)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {t(
              "landing.plans.header.title",
              "Pricing"
            )}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} t={t} languageCode={languageCode} />
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
