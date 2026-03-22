import { hasSuperAdminAccess } from "@/src/lib/super-admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

/**
 * Global Super Admin eller arbejdsplads-ADMIN / workplace-SUPER_ADMIN for denne tenant.
 */
export async function assertWorkplaceAdminOrSuperAdmin(
  workplaceId: string
): Promise<void> {
  const supabase = await createServerSupabase();
  if (await hasSuperAdminAccess(supabase)) return;

  const { data: roles, error } = await supabase.rpc(
    "get_my_roles_for_workplace",
    { p_workplace_id: workplaceId }
  );
  if (error) {
    throw new Error("Kunne ikke verificere adgang.");
  }
  const arr = (Array.isArray(roles) ? roles : []) as string[];
  if (!arr.includes("ADMIN") && !arr.includes("SUPER_ADMIN")) {
    throw new Error("Ingen administrator-adgang til denne arbejdsplads.");
  }
}
