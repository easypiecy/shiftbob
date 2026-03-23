"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { createClient } from "@/src/utils/supabase/client";
import {
  fetchMyJoinRequests,
  hasPendingJoinRequest,
  listWorkplacesOpenForJoin,
  requestWorkplaceJoin,
} from "@/src/lib/join-requests";
import {
  fetchUserWorkplaces,
  routeRolesForActiveWorkplace,
  setActiveWorkplaceCookie,
  type WorkplaceSummary,
} from "@/src/lib/workplaces";
import type { PostLoginRoleResult } from "@/src/lib/roles";
import { hasSuperAdminAccess } from "@/src/lib/super-admin";

export default function SelectWorkplaceClient() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<WorkplaceSummary[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [fatal, setFatal] = useState<"auth" | "fetch" | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);
  const [noMembership, setNoMembership] = useState<
    | null
    | { kind: "pending" }
    | { kind: "join"; list: WorkplaceSummary[] }
  >(null);
  const [joinBusy, setJoinBusy] = useState<string | null>(null);
  const [joinMsg, setJoinMsg] = useState<string | null>(null);

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

      let superAdmin = false;
      try {
        superAdmin = await hasSuperAdminAccess(supabase);
      } catch {
        if (!cancelled) setFatal("fetch");
        if (!cancelled) setLoading(false);
        return;
      }
      if (!cancelled) setIsSuperAdmin(superAdmin);

      let list: WorkplaceSummary[];
      try {
        list = await fetchUserWorkplaces(supabase);
      } catch {
        if (!cancelled) setFatal("fetch");
        if (!cancelled) setLoading(false);
        return;
      }
      if (cancelled) return;

      setPlaces(list);

      if (!superAdmin && list.length === 0) {
        try {
          const reqs = await fetchMyJoinRequests(supabase);
          const joinable = await listWorkplacesOpenForJoin(supabase);
          if (cancelled) return;
          if (hasPendingJoinRequest(reqs)) {
            setNoMembership({ kind: "pending" });
          } else {
            setNoMembership({ kind: "join", list: joinable });
          }
        } catch {
          if (!cancelled) setFatal("fetch");
          if (!cancelled) setLoading(false);
          return;
        }
        if (!cancelled) setLoading(false);
        return;
      }

      if (!cancelled) setNoMembership(null);
      setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  async function handlePick(wp: WorkplaceSummary) {
    setPickError(null);
    setActiveWorkplaceCookie(wp.id);
    const r: PostLoginRoleResult = await routeRolesForActiveWorkplace(
      supabase,
      router,
      wp.id
    );
    if (r === "no_roles") {
      setPickError("Ingen roller for denne arbejdsplads. Kontakt administrator.");
    } else if (r === "fetch_error") {
      setPickError("Kunne ikke hente roller. Prøv igen.");
    }
  }

  function handleSuperAdmin() {
    router.push("/super-admin");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function handleRequestJoin(wp: WorkplaceSummary) {
    setJoinMsg(null);
    setJoinBusy(wp.id);
    const r = await requestWorkplaceJoin(supabase, wp.id);
    setJoinBusy(null);
    if (!r.ok) {
      setJoinMsg(
        r.error === "already_member"
          ? "Du er allerede medlem — opdatér siden."
          : r.error ?? "Kunne ikke sende anmodning."
      );
      return;
    }
    router.push("/pending-approval");
  }

  if (loading && fatal === null) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Henter dine data…
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

  if (fatal === "fetch") {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center dark:border-red-900/60 dark:bg-red-950/40">
          <p className="text-sm font-medium text-red-900 dark:text-red-100">
            Kunne ikke hente arbejdspladser eller anmodningsdata.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Log ud
          </button>
        </div>
      </div>
    );
  }

  if (noMembership?.kind === "pending") {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-amber-950 dark:text-amber-100">
            Du har en afventende adgangsanmodning. Vent på at en administrator
            godkender den.
          </p>
          <button
            type="button"
            onClick={() => router.push("/pending-approval")}
            className="mt-4 w-full rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900"
          >
            Se statusside
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 dark:border-zinc-600 dark:text-zinc-200"
          >
            Log ud
          </button>
        </div>
      </div>
    );
  }

  if (noMembership?.kind === "join") {
    const joinList = noMembership.list;
    return (
      <div className="min-h-full flex-1 bg-gradient-to-b from-zinc-100 to-zinc-50 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Vælg arbejdsplads
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Du er endnu ikke tilknyttet en arbejdsplads. Vælg den du vil anmode
              om adgang til — en administrator modtager en notifikation og kan
              godkende eller afvise.
            </p>
          </div>
          {joinMsg ? (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100"
            >
              {joinMsg}
            </div>
          ) : null}
          {joinList.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              Ingen arbejdspladser accepterer lige nu åbne anmodninger. Kontakt en
              administrator.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {joinList.map((wp) => (
                <li key={wp.id}>
                  <button
                    type="button"
                    disabled={joinBusy === wp.id}
                    onClick={() => void handleRequestJoin(wp)}
                    className="group flex h-full min-h-[140px] w-full flex-col rounded-2xl border border-zinc-200/90 bg-white p-6 text-left shadow-md ring-1 ring-zinc-200/50 transition hover:border-blue-300 hover:shadow-lg disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-700 dark:hover:border-blue-500"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Anmod om adgang
                    </span>
                    <span className="mt-2 line-clamp-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {wp.name}
                    </span>
                    <span className="mt-auto pt-4 text-sm font-medium text-blue-700 group-hover:underline dark:text-blue-300">
                      {joinBusy === wp.id ? "Sender…" : "Send anmodning →"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
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

  return (
    <div className="min-h-full flex-1 bg-gradient-to-b from-zinc-100 to-zinc-50 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isSuperAdmin ? "Hvad vil du åbne?" : "Vælg arbejdsplads"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {isSuperAdmin
              ? "Du har Super Admin-adgang. Vælg systemportalen eller en arbejdsplads med dine roller (fx administrator)."
              : "Du har adgang til flere steder. Vælg hvor du vil arbejde nu."}
          </p>
        </div>

        {isSuperAdmin ? (
          <div className="mb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              System
            </p>
            <button
              type="button"
              onClick={handleSuperAdmin}
              className="group flex w-full flex-col rounded-2xl border border-violet-200/90 bg-violet-50/90 p-6 text-left shadow-md ring-1 ring-violet-200/60 transition hover:border-violet-400 hover:shadow-lg hover:ring-violet-300/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:border-violet-900/50 dark:bg-violet-950/40 dark:ring-violet-900/40 dark:hover:border-violet-600 dark:hover:ring-violet-800/50"
            >
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                <Shield className="h-4 w-4" aria-hidden />
                Super Admin
              </span>
              <span className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                System- og tenant-administration
              </span>
              <span className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Brugere, arbejdspladser, oversættelser, standardtyper m.m.
              </span>
              <span className="mt-4 text-sm font-medium text-violet-800 group-hover:underline dark:text-violet-200">
                Åbn Super Admin →
              </span>
            </button>
          </div>
        ) : null}

        {places.length > 0 ? (
          <>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {isSuperAdmin ? "Arbejdsplads (dine roller)" : "Arbejdspladser"}
            </p>
            {pickError && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100"
              >
                {pickError}
              </div>
            )}
            <ul className="grid gap-4 sm:grid-cols-2">
              {places.map((wp) => (
                <li key={wp.id}>
                  <button
                    type="button"
                    onClick={() => handlePick(wp)}
                    className="group flex h-full min-h-[140px] w-full flex-col rounded-2xl border border-zinc-200/90 bg-white p-6 text-left shadow-md ring-1 ring-zinc-200/50 transition hover:border-blue-300 hover:shadow-lg hover:ring-blue-200/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-700 dark:hover:border-blue-500 dark:hover:ring-blue-900/40"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Arbejdsplads
                    </span>
                    <span className="mt-2 line-clamp-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {wp.name}
                    </span>
                    <span className="mt-auto pt-4 text-sm font-medium text-blue-700 group-hover:underline dark:text-blue-300">
                      Vælg og fortsæt →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : isSuperAdmin ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            Ingen arbejdspladser fundet for din konto. Brug Super Admin ovenfor, eller
            opdatér siden / log ud og ind igen, hvis du lige er blevet tilknyttet.
          </p>
        ) : null}

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
