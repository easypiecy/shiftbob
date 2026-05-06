"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ACTIVE_ROLE_COOKIE } from "@/src/lib/roles";
import { getActiveWorkplaceIdFromCookie } from "@/src/lib/workplaces";
import type { Role } from "@/src/types/roles";
import { isRole } from "@/src/types/roles";
import { getWorkplaceById } from "@/src/app/super-admin/workplaces/actions";
import AdminCalendar from "./admin-calendar";

export default function DashboardPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [workplaceId, setWorkplaceId] = useState<string | null>(null);
  const [workplaceName, setWorkplaceName] = useState<string | null>(null);

  useEffect(() => {
    const raw = Cookies.get(ACTIVE_ROLE_COOKIE);
    if (raw && isRole(raw)) setRole(raw);
    setWorkplaceId(getActiveWorkplaceIdFromCookie());
  }, []);

  useEffect(() => {
    if (!workplaceId) {
      setWorkplaceName(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const direct = await getWorkplaceById(workplaceId);
      if (cancelled) return;
      if (!direct.ok) {
        setWorkplaceName(null);
        return;
      }
      setWorkplaceName(direct.data.company_name?.trim() || direct.data.name?.trim() || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [workplaceId]);

  const canViewCalendar =
    role === "ADMIN" ||
    role === "SUPER_ADMIN" ||
    role === "MANAGER" ||
    role === "EMPLOYEE";

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 px-3 py-6 dark:bg-zinc-950 sm:px-4 sm:py-8">
      <div
        className={
          canViewCalendar
            ? "mx-auto flex w-full max-w-none flex-col"
            : "mx-auto w-full max-w-lg px-2"
        }
      >
        {canViewCalendar && workplaceId ? (
          <AdminCalendar workplaceId={workplaceId} workplaceName={workplaceName} />
        ) : canViewCalendar && !workplaceId ? (
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Vælg en arbejdsplads for at se kalenderen.
          </p>
        ) : (
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Log ind og vælg rolle for at se vagtplan-kalenderen.
          </p>
        )}
      </div>
    </div>
  );
}
