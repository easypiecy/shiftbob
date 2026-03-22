import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Adgang til Super Admin: mindst én SUPER_ADMIN-rolle (workplace eller legacy user_roles).
 */
export async function hasSuperAdminAccess(
  supabase: SupabaseClient
): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: siteSa, error: rpcErr } = await supabase.rpc(
    "has_super_admin_membership"
  );
  if (!rpcErr && siteSa === true) return true;

  const { data: wm } = await supabase
    .from("workplace_members")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("role", "SUPER_ADMIN")
    .limit(1)
    .maybeSingle();

  if (wm) return true;

  const { data: ur, error: urErr } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "SUPER_ADMIN")
    .limit(1)
    .maybeSingle();

  return !urErr && !!ur;
}

export async function assertSuperAdminAccess(
  supabase: SupabaseClient
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Ikke logget ind.");
  }
  if (!(await hasSuperAdminAccess(supabase))) {
    throw new Error("Ingen adgang til Super Admin.");
  }
}
