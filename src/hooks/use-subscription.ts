"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SUBSCRIPTION_TIER,
  getSubscriptionPlanConfig,
  normalizeSubscriptionTier,
  subscriptionHasFeature,
  type SubscriptionFeature,
  type SubscriptionTier,
} from "@/src/config/subscriptions";
import { getActiveWorkplaceIdFromCookie } from "@/src/lib/workplaces";
import { createClient } from "@/src/utils/supabase/client";

type Options = {
  initialWorkplaceId?: string | null;
  initialTier?: SubscriptionTier;
};

type State = {
  workplaceId: string | null;
  tier: SubscriptionTier;
  isLoading: boolean;
  error: string | null;
};

type LoadResult = {
  workplaceId: string | null;
  tier: SubscriptionTier;
  error: string | null;
};

async function loadSubscription(
  explicitWorkplaceId?: string | null
): Promise<LoadResult> {
  const workplaceId = explicitWorkplaceId ?? getActiveWorkplaceIdFromCookie();
  if (!workplaceId) {
    return {
      workplaceId: null,
      tier: DEFAULT_SUBSCRIPTION_TIER,
      error: null,
    };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("workplaces")
      .select("subscription_tier")
      .eq("id", workplaceId)
      .maybeSingle();

    if (error) {
      return {
        workplaceId,
        tier: DEFAULT_SUBSCRIPTION_TIER,
        error: error.message,
      };
    }

    return {
      workplaceId,
      tier: normalizeSubscriptionTier(data?.subscription_tier as string | null),
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      workplaceId,
      tier: DEFAULT_SUBSCRIPTION_TIER,
      error: message,
    };
  }
}

export function useSubscription(options: Options = {}) {
  const [state, setState] = useState<State>({
    workplaceId: options.initialWorkplaceId ?? null,
    tier: options.initialTier ?? DEFAULT_SUBSCRIPTION_TIER,
    isLoading: options.initialTier == null,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const result = await loadSubscription(options.initialWorkplaceId);
    setState({
      workplaceId: result.workplaceId,
      tier: result.tier,
      isLoading: false,
      error: result.error,
    });
  }, [options.initialWorkplaceId]);

  useEffect(() => {
    if (options.initialTier != null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [options.initialTier, options.initialWorkplaceId, refresh]);

  const plan = useMemo(
    () => getSubscriptionPlanConfig(state.tier),
    [state.tier]
  );

  const hasFeature = useCallback(
    (feature: SubscriptionFeature) => subscriptionHasFeature(state.tier, feature),
    [state.tier]
  );

  return {
    ...state,
    plan,
    hasFeature,
    refresh,
  };
}
