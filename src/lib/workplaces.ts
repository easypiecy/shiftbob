import type { SupabaseClient } from "@supabase/supabase-js";
import Cookies from "js-cookie";
import type { Role } from "@/src/types/roles";
import { isRole, ROLES } from "@/src/types/roles";
import {
  setActiveRoleCookie,
  type PostLoginRoleResult,
} from "@/src/lib/roles";
import { hasSuperAdminAccess } from "@/src/lib/super-admin";

export const ACTIVE_WORKPLACE_COOKIE = "active_workplace";

export type WorkplaceSummary = {
  id: string;
  name: string;
  created_at: string;
};

export function setActiveWorkplaceCookie(workplaceId: string) {
  Cookies.set(ACTIVE_WORKPLACE_COOKIE, workplaceId, {
    path: "/",
    sameSite: "lax",
    expires: 30,
  });
}

export function getActiveWorkplaceIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  return Cookies.get(ACTIVE_WORKPLACE_COOKIE) ?? null;
}

export async function fetchUserWorkplaces(
  supabase: SupabaseClient
): Promise<WorkplaceSummary[]> {
  const { data: rpcRows, error: rpcErr } = await supabase.rpc(
    "get_my_workplaces"
  );
  if (!rpcErr && rpcRows != null && Array.isArray(rpcRows)) {
    return (rpcRows as WorkplaceSummary[]).sort((a, b) =>
      a.name.localeCompare(b.name, "da")
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: mids, error: e1 } = await supabase
    .from("workplace_members")
    .select("workplace_id")
    .eq("user_id", user.id);

  if (e1) throw e1;

  const ids = [
    ...new Set((mids ?? []).map((m) => m.workplace_id as string)),
  ];
  if (ids.length === 0) return [];

  const { data: places, error: e2 } = await supabase
    .from("workplaces")
    .select("id, name, created_at")
    .in("id", ids);

  if (e2) throw e2;
  return (places ?? []).sort((a, b) =>
    a.name.localeCompare(b.name, "da")
  ) as WorkplaceSummary[];
}

export async function fetchUserRolesForWorkplace(
  supabase: SupabaseClient,
  workplaceId: string
): Promise<Role[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: rpcRoles, error: rpcErr } = await supabase.rpc(
    "get_my_roles_for_workplace",
    { p_workplace_id: workplaceId }
  );
  if (!rpcErr && rpcRoles != null) {
    const raw = Array.isArray(rpcRoles) ? rpcRoles : [];
    const list = raw.map((r) => String(r)).filter(isRole);
    return [...new Set(list)].sort(
      (a, b) => ROLES.indexOf(a) - ROLES.indexOf(b)
    );
  }

  const { data, error } = await supabase
    .from("workplace_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("workplace_id", workplaceId);

  if (error) throw error;
  const list = (data ?? []).map((row) => row.role).filter(isRole);
  return [...new Set(list)].sort(
    (a, b) => ROLES.indexOf(a) - ROLES.indexOf(b)
  );
}

export async function routeRolesForActiveWorkplace(
  supabase: SupabaseClient,
  router: { push: (href: string) => void },
  workplaceId: string
): Promise<PostLoginRoleResult> {
  let roles: Role[];
  try {
    roles = await fetchUserRolesForWorkplace(supabase, workplaceId);
  } catch {
    return "fetch_error";
  }

  if (roles.length === 0) return "no_roles";
  if (roles.length === 1) {
    setActiveRoleCookie(roles[0]);
    router.push("/dashboard");
    return "routed";
  }
  router.push("/select-role");
  return "routed";
}

export type PostLoginTenantResult =
  | PostLoginRoleResult
  | "no_workplaces";

export async function routeAfterLogin(
  supabase: SupabaseClient,
  router: { push: (href: string) => void }
): Promise<PostLoginTenantResult> {
  if (await hasSuperAdminAccess(supabase)) {
    router.push("/select-workplace");
    return "routed";
  }

  let workplaces: WorkplaceSummary[];
  try {
    workplaces = await fetchUserWorkplaces(supabase);
  } catch {
    return "fetch_error";
  }

  if (workplaces.length === 0) return "no_workplaces";

  router.push("/select-workplace");
  return "routed";
}
