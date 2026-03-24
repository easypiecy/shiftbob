import { cookies } from "next/headers";
import { ACTIVE_WORKPLACE_COOKIE } from "@/src/lib/workplaces";
import { createServerSupabase } from "@/src/utils/supabase/server";

type WpRow = {
  name?: string | null;
  company_name?: string | null;
};

function displayFromRow(row: WpRow | null): string | null {
  if (row == null) return null;
  const company =
    typeof row.company_name === "string" ? row.company_name.trim() : "";
  const shortName = typeof row.name === "string" ? row.name.trim() : "";
  const display = company.length > 0 ? company : shortName;
  return display.length > 0 ? display : null;
}

/**
 * Firma-/visningsnavn for valgt arbejdsplads (cookie `active_workplace`).
 * Bruger `company_name` når det er sat, ellers `name`.
 *
 * Hvis direkte `select` på `workplaces` ikke returnerer en række (fx RLS),
 * falder vi tilbage til RPC `get_my_workplaces()` (security definer), som
 * matcher resten af appen.
 */
export async function resolveActiveWorkplaceNameForSidebar(): Promise<
  string | null
> {
  const jar = await cookies();
  const wpId = jar.get(ACTIVE_WORKPLACE_COOKIE)?.value?.trim();
  if (!wpId) return null;

  try {
    const supabase = await createServerSupabase();

    const full = await supabase
      .from("workplaces")
      .select("name, company_name")
      .eq("id", wpId)
      .maybeSingle();

    if (!full.error && full.data != null) {
      const d = displayFromRow(full.data);
      if (d) return d;
    }

    if (full.error) {
      const minimal = await supabase
        .from("workplaces")
        .select("name")
        .eq("id", wpId)
        .maybeSingle();
      if (!minimal.error && minimal.data != null) {
        const d = displayFromRow(minimal.data);
        if (d) return d;
      }
    }

    const { data: rpcRows, error: rpcErr } = await supabase.rpc(
      "get_my_workplaces"
    );
    if (rpcErr || !Array.isArray(rpcRows)) return null;

    const row = (
      rpcRows as { id: string; name: string; created_at?: string }[]
    ).find((r) => r.id === wpId);
    const n = row?.name?.trim();
    return n && n.length > 0 ? n : null;
  } catch {
    return null;
  }
}
