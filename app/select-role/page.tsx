"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import {
  fetchUserRolesForWorkplace,
  getActiveWorkplaceIdFromCookie,
} from "@/src/lib/workplaces";
import { ROLE_LABELS, setActiveRoleCookie } from "@/src/lib/roles";
import type { Role } from "@/src/types/roles";

export default function SelectRolePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [fatal, setFatal] = useState<"auth" | "no_roles" | "fetch" | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        if (!cancelled) {
          setFatal("auth");
          setLoading(false);
        }
        return;
      }

      const workplaceId = getActiveWorkplaceIdFromCookie();
      if (!workplaceId) {
        router.replace("/select-workplace");
        return;
      }

      try {
        const list = await fetchUserRolesForWorkplace(supabase, workplaceId);
        if (cancelled) return;
        if (list.length === 0) {
          setFatal("no_roles");
          setLoading(false);
          return;
        }
        if (list.length === 1) {
          setActiveRoleCookie(list[0]);
          router.replace("/dashboard");
          return;
        }
        setRoles(list);
      } catch {
        if (!cancelled) setFatal("fetch");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  async function handlePick(role: Role) {
    setActiveRoleCookie(role);
    router.push("/dashboard");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading && fatal === null && roles.length === 0) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Henter dine roller…
        </p>
      </div>
    );
  }

  if (fatal === "auth") {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
        <p className="text-center text-zinc-700 dark:text-zinc-300">
          Du skal være logget ind.
        </p>
        <Link
          href="/login"
          className="mt-4 text-sm font-medium text-blue-600 underline dark:text-blue-400"
        >
          Gå til login
        </Link>
      </div>
    );
  }

  if (fatal === "no_roles") {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center dark:border-red-900/60 dark:bg-red-950/40">
          <p className="text-sm font-medium text-red-900 dark:text-red-100">
            Ingen roller for denne arbejdsplads. Kontakt en administrator.
          </p>
          <Link
            href="/select-workplace"
            className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Vælg arbejdsplads
          </Link>
        </div>
      </div>
    );
  }

  if (fatal === "fetch") {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
        <p className="text-center text-zinc-700 dark:text-zinc-300">
          Kunne ikke hente roller. Prøv igen senere.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-600"
        >
          Prøv igen
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full flex-1 bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Vælg aktiv rolle
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Du har flere roller på denne arbejdsplads. Vælg hvilken du vil arbejde som nu.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {roles.map((role) => (
            <li key={role}>
              <button
                type="button"
                onClick={() => handlePick(role)}
                className="group flex h-full w-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition hover:border-zinc-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:focus-visible:outline-zinc-100"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {role.replace(/_/g, " ")}
                </span>
                <span className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {ROLE_LABELS[role].title}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {ROLE_LABELS[role].description}
                </span>
                <span className="mt-4 text-sm font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                  Vælg denne rolle →
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-zinc-500">
          <button
            type="button"
            onClick={handleSignOut}
            className="font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Log ud
          </button>
        </p>
      </div>
    </div>
  );
}
