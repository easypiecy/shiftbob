import type { SubscriptionTier } from "@/src/config/subscriptions";

export const STANDARD_PLAN_MAX_EMPLOYEES = 100;

export const EMPLOYEE_LIMIT_TIERS: SubscriptionTier[] = ["HYBRID_APP", "AUTOPILOT"];

export const EMPLOYEE_LIMIT_EXCEEDED_MESSAGE =
  "Wow, you have a great team! Your current plan supports up to 100 employees. Please contact us to upgrade to our Enterprise solution.";

export function subscriptionTierHasEmployeeLimit(tier: SubscriptionTier): boolean {
  return EMPLOYEE_LIMIT_TIERS.includes(tier);
}
