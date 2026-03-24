import { cookies } from "next/headers";
import { createServerSupabase } from "@/src/utils/supabase/server";
import { UI_THEME_COOKIE, type UiThemeId, isUiThemeId } from "@/src/lib/ui-theme";

function isMissingPrefsTable(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("does not exist") ||
    m.includes("42p01") ||
    m.includes("schema cache") ||
    m.includes("could not find the table")
  );
}

/**
 * Løser aktivt layout-tema: cookie først, ellers DB for indloggede brugere.
 */
export async function resolveUiThemeForRequest(): Promise<UiThemeId> {
  const jar = await cookies();
  const c = jar.get(UI_THEME_COOKIE)?.value;
  if (isUiThemeId(c)) return c;

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "dark";

    const { data, error } = await supabase
      .from("user_ui_preferences")
      .select("layout_theme")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      if (isMissingPrefsTable(error.message)) return "dark";
      return "dark";
    }
    const t = data?.layout_theme;
    return isUiThemeId(t) ? t : "dark";
  } catch {
    /* Mangler env eller Supabase utilgængelig lokalt */
    return "dark";
  }
}
