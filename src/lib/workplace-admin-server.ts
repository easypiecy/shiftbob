import { hasSuperAdminAccess } from "@/src/lib/super-admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

async function hasSuperAdminAccessFromServer(): Promise<boolean> {
  const supabase = await createServerSupabase();
  return hasSuperAdminAccess(supabase);
}

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

/** Medlem af arbejdspladsen (enhver rolle) eller global super admin. */
export async function assertWorkplaceMember(workplaceId: string): Promise<void> {
  if (await hasSuperAdminAccessFromServer()) return;

  const supabase = await createServerSupabase();
  const { data: roles, error } = await supabase.rpc(
    "get_my_roles_for_workplace",
    { p_workplace_id: workplaceId }
  );
  if (error) {
    throw new Error("Kunne ikke verificere adgang.");
  }
  const arr = Array.isArray(roles) ? roles : [];
  if (arr.length === 0) {
    throw new Error("Ingen adgang til denne arbejdsplads.");
  }
}

/**
 * Kalender: fuldt navn på medarbejdere for administrator/leder; begrænset visning for EMPLOYEE.
 */
export async function isWorkplaceCalendarAdminView(
  workplaceId: string
): Promise<boolean> {
  if (await hasSuperAdminAccessFromServer()) return true;

  const supabase = await createServerSupabase();
  const { data: roles, error } = await supabase.rpc(
    "get_my_roles_for_workplace",
    { p_workplace_id: workplaceId }
  );
  if (error) {
    return false;
  }
  const arr = (Array.isArray(roles) ? roles : []) as string[];
  return (
    arr.includes("ADMIN") ||
    arr.includes("SUPER_ADMIN") ||
    arr.includes("MANAGER")
  );
}
