import Link from "next/link";
import { CheckCircle2, FileSpreadsheet, Sheet } from "lucide-react";
import type { ReactNode } from "react";

type Plan = {
  id: string;
  title: string;
  subtitle: string;
  modeLabel: string;
  modeTone: "green" | "yellow";
  price: string;
  period: ReactNode;
  description: string;
  features: string[];
  ctas: Array<{
    label: string;
    href: string;
    style: "primary" | "secondary" | "contrast";
  }>;
  badge?: string;
};

const plans: Plan[] = [
  {
    id: "foundation",
    title: "The free Basic",
    subtitle: "Free Spreadsheet & Checker",
    modeLabel: "Spreadsheet",
    modeTone: "green",
    price: "0 EUR",
    period: "Forever.",
    description:
      "The ultimate Excel template to keep your schedule organized and legal.",
    features: [
      "Free professional scheduling spreadsheet",
      "Fully compatible with Excel and Google Sheets",
      "Clear shift-type overview",
      "Built-in hour calculations and monthly overview",
      "Free compliance check on the ShiftBob platform (max once daily)",
    ],
    ctas: [
      {
        label: "Download free Excel",
        href: "/login",
        style: "secondary",
      },
      {
        label: "Free compliance check",
        href: "/login",
        style: "primary",
      },
    ],
  },
  {
    id: "pro-planner",
    title: "The Pro Planner",
    subtitle: "Secure EU compliance",
    modeLabel: "Spreadsheet",
    modeTone: "green",
    price: "49 EUR",
    period: "/ month",
    description:
      "For managers who iterate. Build your schedule in Excel and verify it infinitely.",
    features: [
      "Everything in the free Basic plan",
      "Unlimited EU-compliance checks",
      "3 employees get free access to your schedule in the ShiftBob app",
      "Secure cloud storage of all past schedules",
      "Priority email support",
    ],
    ctas: [
      {
        label: "Subscribe Now",
        href: "/login",
        style: "primary",
      },
    ],
  },
  {
    id: "hybrid-app",
    title: "The Hybrid App",
    subtitle: "Spreadsheet to Smartphone",
    modeLabel: "Spreadsheet",
    modeTone: "green",
    price: "29 EUR",
    period: (
      <>
        / month + <strong>1 EUR</strong> per user
      </>
    ),
    description:
      "You keep the spreadsheet. Your staff gets the app. Bridge the gap completely.",
    features: [
      "Everything in The free Basic and The Pro Planner",
      "iOS & Android app for all employees",
      "In-app shift swapping & more",
      "Manager Approval Dashboard for web & mobile",
      "Automated shift reminders & push notifications",
    ],
    ctas: [
      {
        label: "Upgrade to next level!",
        href: "/login",
        style: "contrast",
      },
    ],
    badge: "Most Popular",
  },
  {
    id: "autopilot",
    title: "The Autopilot",
    subtitle: "Full Online Management",
    modeLabel: "Online & automatic",
    modeTone: "yellow",
    price: "59 EUR",
    period: (
      <>
        / month + <strong>1 EUR</strong> per user
      </>
    ),
    description:
      "Ditch the spreadsheet entirely. Let our engine build and manage your schedule.",
    features: [
      "Everything in all previous plans",
      "Auto-generate shifts based on EU laws",
      "Match shifts with employee preferences automatically",
      "Advanced settings with full employee options control",
      "Publish shifts for pickup in the employee app",
      "Time-calculation export",
      "Create custom shift types",
      "API access",
    ],
    ctas: [
      {
        label: "Go Autopilot",
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

function PlanCard({ plan }: { plan: Plan }) {
  const modeStyles =
    plan.modeTone === "yellow"
      ? "bg-amber-100 text-amber-900 border-amber-200"
      : "bg-emerald-100 text-emerald-900 border-emerald-200";

  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      {plan.badge ? (
        <span className="absolute -top-3 right-4 rounded-full bg-[#4A90E2] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
          {plan.badge}
        </span>
      ) : null}
      <div className="-mx-6 -mt-6 mb-2 flex min-h-[96px] items-start justify-between gap-3 rounded-t-2xl bg-black px-6 py-5">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {plan.title}
          </h3>
          <p className="mt-1 text-sm font-semibold text-white/85">{plan.subtitle}</p>
        </div>
      </div>
      <div className="mb-4">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${modeStyles}`}
        >
          {plan.modeLabel}
        </span>
      </div>

      <div className="flex min-h-[78px] flex-col justify-end">
        <p className="text-3xl font-black text-zinc-900">{plan.price}</p>
        <p className="text-sm font-medium text-zinc-600">{plan.period}</p>
      </div>
      <p className="mt-4 min-h-[84px] text-sm leading-6 text-zinc-700">
        {plan.description}
      </p>

      <ul className="mt-5 flex-1 space-y-2 text-sm text-zinc-800">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-[#4A90E2]"
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex min-h-[96px] flex-col justify-end gap-2">
        {plan.ctas.map((cta) => (
          <CtaButton key={cta.label} {...cta} />
        ))}
      </div>
    </article>
  );
}

export function ProductChoices() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1d6f42] shadow-sm">
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
              Excel
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#4A90E2]/30 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#188038] shadow-sm">
              <Sheet className="h-4 w-4" aria-hidden="true" />
              Google Sheets
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Your spreadsheet is still the boss—we just give it superpowers
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
