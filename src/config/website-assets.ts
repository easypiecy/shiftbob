const SUPABASE_WEBSITE_ASSETS_BASE_URL =
  "https://pwooqmqdershicxpnfuo.supabase.co/storage/v1/object/public/website_assets";

export const WEBSITE_ASSETS = {
  landingLogo: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/ShiftBob-circle-logo-light-300x.png`,
  landingHero: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/landing-hero-power.png`,
  landingEmployeePhoto: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/landing-employee-photo.png`,
  landingEuCompliance: `${SUPABASE_WEBSITE_ASSETS_BASE_URL}/landing-eu-compliance.png`,
} as const;
