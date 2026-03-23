"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { getActiveWorkplaceIdFromCookie } from "@/src/lib/workplaces";

export function DashboardOnboardingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/dashboard/complete-profile")) {
      setReady(true);
      return;
    }

    const wp = getActiveWorkplaceIdFromCookie();
    if (!wp) {
      setReady(true);
      return;
    }

    let cancelled = false;
    async function run() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) {
        if (!cancelled) setReady(true);
        return;
      }

      const { data: wm, error } = await supabase
        .from("workplace_members")
        .select("profile_onboarding_completed")
        .eq("user_id", user.id)
        .eq("workplace_id", wp)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        setReady(true);
        return;
      }
      if (wm?.profile_onboarding_completed === false) {
        router.replace("/dashboard/complete-profile");
        return;
      }
      setReady(true);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] flex-1 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  return <>{children}</>;
}
