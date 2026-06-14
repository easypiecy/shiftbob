export const SUBSCRIPTION_TIERS = [
  "FOUNDATION",
  "PRO_PLANNER",
  "HYBRID_APP",
  "AUTOPILOT",
] as const;

export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];

export type SubscriptionFeatureFlags = {
  hasAppAccess: boolean;
  hasUnlimitedChecks: boolean;
  canAccessOnlineSettings: boolean;
  canUseWebBuilder: boolean;
  canUseAutoScheduler: boolean;
};

export type SubscriptionFeature = keyof SubscriptionFeatureFlags;

export type SubscriptionPlanConfig = SubscriptionFeatureFlags & {
  tier: SubscriptionTier;
  title: string;
  priceLabel: string;
  maxChecksPerDay: number | null;
};

export const SUBSCRIPTION_PLAN_CONFIG: Record<
  SubscriptionTier,
  SubscriptionPlanConfig
> = {
  FOUNDATION: {
    tier: "FOUNDATION",
    title: "Foundation",
    priceLabel: "0 EUR",
    hasAppAccess: false,
    hasUnlimitedChecks: false,
    canAccessOnlineSettings: false,
    canUseWebBuilder: false,
    canUseAutoScheduler: false,
    maxChecksPerDay: 1,
  },
  PRO_PLANNER: {
    tier: "PRO_PLANNER",
    title: "Pro Planner",
    priceLabel: "49 EUR / month",
    hasAppAccess: false,
    hasUnlimitedChecks: true,
    canAccessOnlineSettings: false,
    canUseWebBuilder: false,
    canUseAutoScheduler: false,
    maxChecksPerDay: null,
  },
  HYBRID_APP: {
    tier: "HYBRID_APP",
    title: "Hybrid App",
    priceLabel: "49 EUR / month",
    hasAppAccess: true,
    hasUnlimitedChecks: true,
    canAccessOnlineSettings: false,
    canUseWebBuilder: false,
    canUseAutoScheduler: false,
    maxChecksPerDay: null,
  },
  AUTOPILOT: {
    tier: "AUTOPILOT",
    title: "Autopilot",
    priceLabel: "99 EUR / month",
    hasAppAccess: true,
    hasUnlimitedChecks: true,
    canAccessOnlineSettings: true,
    canUseWebBuilder: true,
    canUseAutoScheduler: true,
    maxChecksPerDay: null,
  },
};

export const DEFAULT_SUBSCRIPTION_TIER: SubscriptionTier = "FOUNDATION";

export function isSubscriptionTier(value: string): value is SubscriptionTier {
  return (SUBSCRIPTION_TIERS as readonly string[]).includes(value);
}

export function normalizeSubscriptionTier(
  value: string | null | undefined
): SubscriptionTier {
  if (!value) return DEFAULT_SUBSCRIPTION_TIER;
  return isSubscriptionTier(value) ? value : DEFAULT_SUBSCRIPTION_TIER;
}

export function getSubscriptionPlanConfig(
  tier: SubscriptionTier
): SubscriptionPlanConfig {
  return SUBSCRIPTION_PLAN_CONFIG[tier];
}

export function subscriptionHasFeature(
  tier: SubscriptionTier,
  feature: SubscriptionFeature
): boolean {
  return SUBSCRIPTION_PLAN_CONFIG[tier][feature];
}
