"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import {
  subscriptionHasFeature,
  type SubscriptionFeature,
  type SubscriptionTier,
} from "@/src/config/subscriptions";
import { useSubscription } from "@/src/hooks/use-subscription";

type PremiumFeatureGuardProps = {
  requiredFeature: SubscriptionFeature;
  children?: ReactNode;
  initialTier?: SubscriptionTier;
  initialWorkplaceId?: string | null;
  featureName?: string;
  compact?: boolean;
};

export function PremiumFeatureGuard({
  requiredFeature,
  children,
  initialTier,
  initialWorkplaceId,
  featureName,
  compact = false,
}: PremiumFeatureGuardProps) {
  const subscription = useSubscription({ initialTier, initialWorkplaceId });
  const allowed = subscriptionHasFeature(subscription.tier, requiredFeature);

  if (subscription.isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="h-5 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="mt-3 h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="mt-2 h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    );
  }

  if (allowed) return <>{children}</>;

  return (
    <SubscriptionLockedUpsell
      featureName={featureName}
      compact={compact}
      tier={subscription.tier}
    />
  );
}

function SubscriptionLockedUpsell({
  tier,
  featureName,
  compact,
}: {
  tier: SubscriptionTier;
  featureName?: string;
  compact: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-zinc-200/60 blur-3xl dark:bg-zinc-700/30" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-200/60 blur-3xl dark:bg-emerald-700/20" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <Lock className="h-3.5 w-3.5" />
            Locked Premium Feature
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Upgrade to The Autopilot to unlock online management
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
            {featureName
              ? `${featureName} is available only on The Autopilot tier.`
              : "This feature is available only on The Autopilot tier."}{" "}
            Move beyond spreadsheets and manage settings, web planning, and auto-scheduling directly online.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
              <Sparkles className="h-4 w-4" />
              The Autopilot - 99 EUR / month
            </span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Current tier: {tier}
            </span>
          </div>

          {!compact ? (
            <div className="mt-6 grid gap-3 text-sm text-zinc-700 dark:text-zinc-300 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60">
                Dashboard settings unlock
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60">
                Web drag-and-drop builder
              </div>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60">
                AI auto-scheduling and release tools
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <Link
              href="/landing"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              View upgrade details
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
