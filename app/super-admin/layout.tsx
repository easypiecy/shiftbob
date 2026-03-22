import { redirect } from "next/navigation";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
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

  return <SuperAdminShell>{children}</SuperAdminShell>;
}
