import { cookies } from "next/headers";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";
import { createServerSupabase } from "@/src/utils/supabase/server";

/**
 * Navn på den arbejdsplads der er valgt i cookien (til admin-sidemenu).
 */
export async function resolveActiveWorkplaceNameForSidebar(): Promise<
  string | null
> {
  const jar = await cookies();
  const wpId = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value?.trim();
  if (!wpId) return null;

  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("workplaces")
      .select("name")
      .eq("id", wpId)
      .maybeSingle();

    if (error || data == null || typeof data.name !== "string") {
      return null;
    }
    const name = data.name.trim();
    return name.length > 0 ? name : null;
  } catch {
    return null;
  }
}
