import { getSubscriptionPlanConfig, type SubscriptionTier } from "@/src/config/subscriptions";
import { getAdminClient } from "@/src/utils/supabase/admin";

export const IP_ABUSE_GUARD_ACTIONS = {
  basic_signup: {
    actionType: "basic_signup",
    maxPerDay: 1,
  },
  foundation_compliance_check: {
    actionType: "foundation_compliance_check",
    maxPerDay: 1,
  },
} as const;

export type IpAbuseGuardAction = keyof typeof IP_ABUSE_GUARD_ACTIONS;

type GuardRow = {
  hit_count: number;
};

function utcDayString(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function subscriptionTierRequiresComplianceIpGuard(
  tier: SubscriptionTier
): boolean {
  const plan = getSubscriptionPlanConfig(tier);
  return plan.maxChecksPerDay !== null && !plan.hasUnlimitedChecks;
}

export async function checkIpAbuseGuardAllowed(
  action: IpAbuseGuardAction,
  ipAddress: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!ipAddress) {
    return { ok: true };
  }

  const config = IP_ABUSE_GUARD_ACTIONS[action];
  const admin = getAdminClient();
  const usageDay = utcDayString();

  const { data, error } = await admin
    .from("ip_free_tier_guard")
    .select("hit_count")
    .eq("ip_address", ipAddress)
    .eq("action_type", config.actionType)
    .eq("usage_day", usageDay)
    .maybeSingle();

  if (error) {
    console.error("ip_free_tier_guard lookup failed:", error.message);
    return { ok: true };
  }

  const hitCount = (data as GuardRow | null)?.hit_count ?? 0;
  if (hitCount >= config.maxPerDay) {
    return {
      ok: false,
      error: guardErrorMessage(action),
    };
  }

  return { ok: true };
}

export async function recordIpAbuseGuardHit(
  action: IpAbuseGuardAction,
  ipAddress: string | null
): Promise<void> {
  if (!ipAddress) return;

  const config = IP_ABUSE_GUARD_ACTIONS[action];
  const admin = getAdminClient();
  const usageDay = utcDayString();
  const now = new Date().toISOString();

  const { data: existing, error: lookupError } = await admin
    .from("ip_free_tier_guard")
    .select("id, hit_count")
    .eq("ip_address", ipAddress)
    .eq("action_type", config.actionType)
    .eq("usage_day", usageDay)
    .maybeSingle();

  if (lookupError) {
    console.error("ip_free_tier_guard lookup failed:", lookupError.message);
    return;
  }

  if (existing?.id) {
    const { error: updateError } = await admin
      .from("ip_free_tier_guard")
      .update({
        hit_count: Number(existing.hit_count ?? 0) + 1,
        last_hit_at: now,
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("ip_free_tier_guard update failed:", updateError.message);
    }
    return;
  }

  const { error: insertError } = await admin.from("ip_free_tier_guard").insert({
    ip_address: ipAddress,
    action_type: config.actionType,
    usage_day: usageDay,
    hit_count: 1,
    first_hit_at: now,
    last_hit_at: now,
  });

  if (insertError) {
    console.error("ip_free_tier_guard insert failed:", insertError.message);
  }
}

function guardErrorMessage(action: IpAbuseGuardAction): string {
  if (action === "basic_signup") {
    return "Gratis Basic kan kun anmodes én gang pr. dag fra dit netværk. Prøv igen i morgen eller kontakt support@shiftbob.io.";
  }

  return "Gratis compliance-tjek er begrænset til én gang pr. dag fra dit netværk. Opgrader planen for ubegrænsede tjek.";
}
