import { cookies } from "next/headers";
import { AdminWorkspaceShell } from "@/src/components/admin-workspace-shell";
import { ACTIVE_ROLE_COOKIE } from "@/src/lib/roles";
import { isRole } from "@/src/types/roles";

export default async function SelectWorkplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const raw = jar.get(ACTIVE_ROLE_COOKIE)?.value;
  const showAdminNav =
    raw != null && isRole(raw) && raw === "ADMIN";

  return (
    <AdminWorkspaceShell showAdminNav={showAdminNav}>{children}</AdminWorkspaceShell>
  );
}
