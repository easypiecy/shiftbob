import Link from "next/link";
import { CheckCircle2, FileSpreadsheet, Sheet } from "lucide-react";
import { createTranslator } from "@/src/lib/translations-server";

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
  price: LocalizedText;
  periodMain: LocalizedText;
  periodPerUser?: LocalizedText;
  description: LocalizedText;
  features: LocalizedText[];
  ctas: Array<{
    label: LocalizedText;
    href: string;
    style: "primary" | "secondary" | "contrast";
  }>;
  badge?: LocalizedText;
};

const plans: Plan[] = [
  {
    id: "foundation",
    title: { key: "landing.plans.foundation.title", fallback: "The free Basic" },
    subtitle: {
      key: "landing.plans.foundation.subtitle",
      fallback: "Free Spreadsheet & Checker",
    },
    modeLabel: { key: "landing.plans.mode.spreadsheet", fallback: "Spreadsheet" },
    modeTone: "green",
    price: { key: "landing.plans.foundation.price", fallback: "0 EUR" },
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
        href: "/login",
        style: "secondary",
      },
      {
        label: {
          key: "landing.plans.foundation.cta.free_check",
          fallback: "Free compliance check",
        },
        href: "/login",
        style: "primary",
      },
    ],
  },
  {
    id: "pro-planner",
    title: { key: "landing.plans.pro_planner.title", fallback: "The Pro Planner" },
    subtitle: {
      key: "landing.plans.pro_planner.subtitle",
      fallback: "Secure EU compliance",
    },
    modeLabel: { key: "landing.plans.mode.spreadsheet", fallback: "Spreadsheet" },
    modeTone: "green",
    price: { key: "landing.plans.pro_planner.price", fallback: "49 EUR" },
    periodMain: { key: "landing.plans.period.month", fallback: "/ month" },
    description: {
      key: "landing.plans.pro_planner.description",
      fallback: "For managers who iterate. Build your schedule in Excel and verify it infinitely.",
    },
    features: [
      {
        key: "landing.plans.pro_planner.feature1",
        fallback: "Everything in the free Basic plan",
      },
      {
        key: "landing.plans.pro_planner.feature2",
        fallback: "Unlimited EU-compliance checks",
      },
      {
        key: "landing.plans.pro_planner.feature3",
        fallback: "3 employees get free access to your schedule in the ShiftBob app",
      },
      {
        key: "landing.plans.pro_planner.feature4",
        fallback: "Secure cloud storage of all past schedules",
      },
      {
        key: "landing.plans.pro_planner.feature5",
        fallback: "Priority email support",
      },
    ],
    ctas: [
      {
        label: {
          key: "landing.plans.pro_planner.cta.subscribe",
          fallback: "Subscribe Now",
        },
        href: "/login",
        style: "primary",
      },
    ],
  },
  {
    id: "hybrid-app",
    title: { key: "landing.plans.hybrid_app.title", fallback: "The Hybrid App" },
    subtitle: {
      key: "landing.plans.hybrid_app.subtitle",
      fallback: "Spreadsheet to Smartphone",
    },
    modeLabel: { key: "landing.plans.mode.spreadsheet", fallback: "Spreadsheet" },
    modeTone: "green",
    price: { key: "landing.plans.hybrid_app.price", fallback: "29 EUR" },
    periodMain: { key: "landing.plans.period.month", fallback: "/ month" },
    periodPerUser: { key: "landing.plans.period.per_user", fallback: "1 EUR per user" },
    description: {
      key: "landing.plans.hybrid_app.description",
      fallback: "You keep the spreadsheet. Your staff gets the app. Bridge the gap completely.",
    },
    features: [
      {
        key: "landing.plans.hybrid_app.feature1",
        fallback: "Everything in The free Basic and The Pro Planner",
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
    ],
    ctas: [
      {
        label: {
          key: "landing.plans.hybrid_app.cta.upgrade",
          fallback: "Upgrade to next level!",
        },
        href: "/login",
        style: "contrast",
      },
    ],
    badge: { key: "landing.plans.hybrid_app.badge", fallback: "Most Popular" },
  },
  {
    id: "autopilot",
    title: { key: "landing.plans.autopilot.title", fallback: "The Autopilot" },
    subtitle: {
      key: "landing.plans.autopilot.subtitle",
      fallback: "Full Online Management",
    },
    modeLabel: {
      key: "landing.plans.mode.online_automatic",
      fallback: "Online & automatic",
    },
    modeTone: "yellow",
    price: { key: "landing.plans.autopilot.price", fallback: "59 EUR" },
    periodMain: { key: "landing.plans.period.month", fallback: "/ month" },
    periodPerUser: { key: "landing.plans.period.per_user", fallback: "1 EUR per user" },
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
        fallback: "Time-calculation export",
      },
      {
        key: "landing.plans.autopilot.feature7",
        fallback: "Create custom shift types",
      },
      { key: "landing.plans.autopilot.feature8", fallback: "API access" },
    ],
    ctas: [
      {
        label: {
          key: "landing.plans.autopilot.cta.go",
          fallback: "Go Autopilot",
        },
        href: "/login",
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
      ? "border border-zinc-300 bg-white text-zinc-900 hover:border-zinc-500"
      : style === "contrast"
        ? "bg-[#111827] text-white hover:bg-black"
        : "bg-[#4A90E2] text-white hover:bg-[#3A7FD1]";

  return (
    <Link
      href={href}
      className={`inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition ${styles}`}
    >
      {label}
    </Link>
  );
}

function PlanCard({
  plan,
  t,
}: {
  plan: Plan;
  t: (key: string, fallback?: string) => string;
}) {
  const modeStyles =
    plan.modeTone === "yellow"
      ? "bg-amber-100 text-amber-900 border-amber-200"
      : "bg-emerald-100 text-emerald-900 border-emerald-200";

  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      {plan.badge ? (
        <span className="absolute -top-3 right-4 rounded-full bg-[#4A90E2] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
          {t(plan.badge.key, plan.badge.fallback)}
        </span>
      ) : null}
      <div className="-mx-6 -mt-6 mb-2 flex min-h-[96px] items-start justify-between gap-3 rounded-t-2xl bg-black px-6 py-5">
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
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${modeStyles}`}
        >
          {t(plan.modeLabel.key, plan.modeLabel.fallback)}
        </span>
      </div>

      <div className="flex min-h-[78px] flex-col justify-end">
        <p className="text-3xl font-black text-zinc-900">
          {t(plan.price.key, plan.price.fallback)}
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
      <p className="mt-4 min-h-[84px] text-sm leading-6 text-zinc-700">
        {t(plan.description.key, plan.description.fallback)}
      </p>

      <ul className="mt-5 flex-1 space-y-2 text-sm text-zinc-800">
        {plan.features.map((feature) => (
          <li key={feature.key} className="flex gap-2">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-[#4A90E2]"
              aria-hidden="true"
            />
            <span>{t(feature.key, feature.fallback)}</span>
          </li>
        ))}
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
}: {
  translations: Record<string, string>;
}) {
  const t = createTranslator(translations);

  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1d6f42] shadow-sm">
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
              {t("landing.plans.header.excel", "Excel")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#188038] shadow-sm">
              <Sheet className="h-4 w-4" aria-hidden="true" />
              {t("landing.plans.header.google_sheets", "Google Sheets")}
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {t(
              "landing.plans.header.title",
              "Your spreadsheet is still the boss—we just give it superpowers"
            )}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
