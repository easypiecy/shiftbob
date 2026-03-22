"use server";

import { revalidatePath } from "next/cache";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

const WORKPLACE_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "EMPLOYEE",
] as const;

export type UserAdminRow = {
  id: string;
  email: string | null;
  created_at: string | null;
  globalRoles: string[];
};

async function requireSuperAdmin() {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);
}

export async function getUsers(): Promise<
  { ok: true; data: UserAdminRow[] } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();

    const allAuthUsers: {
      id: string;
      email?: string;
      created_at?: string;
    }[] = [];

    let page = 1;
    const perPage = 1000;
    for (;;) {
      const { data, error } = await admin.auth.admin.listUsers({
        page,
        perPage,
      });
      if (error) {
        return { ok: false, error: error.message };
      }
      const batch = data.users ?? [];
      for (const u of batch) {
        allAuthUsers.push({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
        });
      }
      if (batch.length < perPage) break;
      page += 1;
      if (page > 100) break;
    }

    const { data: roleRows, error: roleErr } = await admin
      .from("user_roles")
      .select("user_id, role");

    if (roleErr) {
      return { ok: false, error: roleErr.message };
    }

    const roleMap = new Map<string, string[]>();
    for (const r of roleRows ?? []) {
      const uid = r.user_id as string;
      const role = r.role as string;
      const arr = roleMap.get(uid) ?? [];
      arr.push(role);
      roleMap.set(uid, arr);
    }

    const rows: UserAdminRow[] = allAuthUsers.map((u) => ({
      id: u.id,
      email: u.email ?? null,
      created_at: u.created_at ?? null,
      globalRoles: (roleMap.get(u.id) ?? []).sort(),
    }));

    rows.sort((a, b) =>
      (a.email ?? "").localeCompare(b.email ?? "", "da", {
        sensitivity: "base",
      })
    );

    return { ok: true, data: rows };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function assignWorkplaceRole(
  userId: string,
  workplaceId: string,
  role: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    if (!WORKPLACE_ROLES.includes(role as (typeof WORKPLACE_ROLES)[number])) {
      return { ok: false, error: "Ugyldig rolle." };
    }

    await requireSuperAdmin();
    const admin = getAdminClient();

    const { error } = await admin.from("workplace_members").upsert(
      {
        user_id: userId,
        workplace_id: workplaceId,
        role,
      },
      { onConflict: "user_id,workplace_id" }
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/super-admin/users");
    revalidatePath("/super-admin/workplaces");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

/**
 * Genererer et magic link (uden e-mail) så Super Admin kan åbne det og logge ind som brugeren.
 */
export async function impersonateUser(
  email: string
): Promise<
  { ok: true; actionLink: string } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      return { ok: false, error: "E-mail mangler." };
    }

    const admin = getAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: trimmed,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    const actionLink = data?.properties?.action_link;
    if (!actionLink) {
      return {
        ok: false,
        error: "Supabase returnerede intet magic link (action_link).",
      };
    }

    return { ok: true, actionLink };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
