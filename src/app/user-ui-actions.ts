"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerSupabase } from "@/src/utils/supabase/server";
import { UI_THEME_COOKIE, type UiThemeId, isUiThemeId } from "@/src/lib/ui-theme";

export async function setUserLayoutTheme(
  theme: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isUiThemeId(theme)) {
    return { ok: false, error: "Ugyldigt tema." };
  }
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Ikke logget ind." };
  }

  const { error } = await supabase.from("user_ui_preferences").upsert(
    {
      user_id: user.id,
      layout_theme: theme,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  const jar = await cookies();
  const cookieOpts = {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax" as const,
    httpOnly: false,
  };

  if (error) {
    const m = error.message.toLowerCase();
    const missingOrCache =
      m.includes("does not exist") ||
      m.includes("42p01") ||
      m.includes("schema cache") ||
      m.includes("could not find the table");
    if (missingOrCache) {
      jar.set(UI_THEME_COOKIE, theme, cookieOpts);
      revalidatePath("/", "layout");
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/indstillinger");
      return { ok: true };
    }
    return { ok: false, error: error.message };
  }

  jar.set(UI_THEME_COOKIE, theme, cookieOpts);
  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/indstillinger");
  return { ok: true };
}
