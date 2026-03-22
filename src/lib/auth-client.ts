import { createClient } from "@/src/utils/supabase/client";

/**
 * Logger ud og sender browseren til login. Bruger fuld navigation så session-cookies
 * og klienttilstand nulstilles pålideligt (Next App Router + Supabase SSR).
 */
export async function signOutAndRedirectToLogin(): Promise<void> {
  const supabase = createClient();
  try {
    await supabase.auth.signOut({ scope: "global" });
  } catch {
    /* stadig redirect */
  }
  window.location.href = "/login";
}
