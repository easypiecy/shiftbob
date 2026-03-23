import { redirect } from "next/navigation";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import { resolveUiThemeForRequest } from "@/src/lib/ui-theme-server";
import { createServerSupabase } from "@/src/utils/supabase/server";
import { SuperAdminShell } from "./super-admin-shell";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  try {
    await assertSuperAdminAccess(supabase);
  } catch {
    redirect("/dashboard");
  }

  const initialLayoutTheme = await resolveUiThemeForRequest();

  return (
    <SuperAdminShell initialLayoutTheme={initialLayoutTheme}>
      {children}
    </SuperAdminShell>
  );
}
