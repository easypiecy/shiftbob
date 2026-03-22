import { cookies } from "next/headers";
import { AdminWorkspaceShell } from "@/src/components/admin-workspace-shell";
import { ACTIVE_ROLE_COOKIE } from "@/src/lib/roles";
import { resolveUiThemeForRequest } from "@/src/lib/ui-theme-server";
import { isRole } from "@/src/types/roles";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const raw = jar.get(ACTIVE_ROLE_COOKIE)?.value;
  const showAdminNav =
    raw != null && isRole(raw) && raw === "ADMIN";
  const initialLayoutTheme = showAdminNav
    ? await resolveUiThemeForRequest()
    : undefined;

  return (
    <AdminWorkspaceShell
      showAdminNav={showAdminNav}
      initialLayoutTheme={initialLayoutTheme}
    >
      {children}
    </AdminWorkspaceShell>
  );
}
