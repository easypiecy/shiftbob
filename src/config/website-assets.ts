const SUPABASE_WEBSITE_ASSETS_BASE_URL =
  "https://pwooqmqdershicxpnfuo.supabase.co/storage/v1/object/public/website_assets";

export const WEBSITE_ASSETS = {
  landingLogo: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/ShiftBob-circle-logo-light-300x.png`,
  landingHero: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/hero-power-top.jpg`,
  landingEmployeePhoto: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/employee_on-mob.jpg`,
  landingEuCompliance: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/eu2.jpg`,
  landingWorry: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/worry.webp`,
  landingPlan: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/plan.webp`,
  landingPlanLightning: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/planLyn.webp`,
  landingRobotArmVideo: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/robotarm_3.mp4`,
} as const;
