export type LocalizedText = {
  key: string;
  fallback: string;
};

export type Plan = {
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

export const plans: Plan[] = [
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
