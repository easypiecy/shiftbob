import { cookies } from "next/headers";
import {
  DEFAULT_SUBSCRIPTION_TIER,
  normalizeSubscriptionTier,
  subscriptionHasFeature,
  type SubscriptionFeature,
  type SubscriptionTier,
} from "@/src/config/subscriptions";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";
import { createServerSupabase } from "@/src/utils/supabase/server";

export async function resolveWorkplaceSubscriptionTier(
  workplaceId: string
): Promise<SubscriptionTier> {
  if (!workplaceId) return DEFAULT_SUBSCRIPTION_TIER;

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("workplaces")
      .select("subscription_tier")
      .eq("id", workplaceId)
      .maybeSingle();

    if (error || !data) return DEFAULT_SUBSCRIPTION_TIER;
    return normalizeSubscriptionTier(data.subscription_tier as string | null);
  } catch {
    return DEFAULT_SUBSCRIPTION_TIER;
  }
}

export async function resolveActiveWorkplaceSubscriptionTier(): Promise<{
  workplaceId: string | null;
  tier: SubscriptionTier;
}> {
  const jar = await cookies();
  const workplaceId = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value?.trim() || null;
  if (!workplaceId) {
    return { workplaceId: null, tier: DEFAULT_SUBSCRIPTION_TIER };
  }

  const tier = await resolveWorkplaceSubscriptionTier(workplaceId);
  return { workplaceId, tier };
}

export async function activeWorkplaceHasSubscriptionFeature(
  feature: SubscriptionFeature
): Promise<boolean> {
  const { tier } = await resolveActiveWorkplaceSubscriptionTier();
  return subscriptionHasFeature(tier, feature);
}

export async function workplaceHasSubscriptionFeature(
  workplaceId: string,
  feature: SubscriptionFeature
): Promise<boolean> {
  const tier = await resolveWorkplaceSubscriptionTier(workplaceId);
  return subscriptionHasFeature(tier, feature);
}

export async function assertWorkplaceSubscriptionFeature(
  workplaceId: string,
  feature: SubscriptionFeature
): Promise<void> {
  const allowed = await workplaceHasSubscriptionFeature(workplaceId, feature);
  if (!allowed) {
    throw new Error(
      "This feature requires The Autopilot (59 EUR / month + 1 EUR per user)."
    );
  }
}
