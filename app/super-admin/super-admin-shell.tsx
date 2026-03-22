"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Languages,
  LayoutDashboard,
  LogOut,
  Tags,
} from "lucide-react";
import { useEffect, useState } from "react";
import { signOutAndRedirectToLogin } from "@/src/lib/auth-client";

const links = [
  {
    href: "/super-admin",
    label: "Oversigt",
    icon: LayoutDashboard,
    match: "exact",
  },
  {
    href: "/super-admin/users",
    label: "Brugere & arbejdspladser",
    icon: Building2,
    match: "users-default",
  },
  {
    href: "/super-admin/workplace-templates",
    label: "Standard vagt- og medarbejdertyper",
    icon: Tags,
    match: "path",
  },
  {
    href: "/super-admin/translations",
    label: "Sprog & oversættelser",
    icon: Languages,
    match: "path",
  },
] as const;

function isSuperAdminNavActive(
  pathname: string,
  match: (typeof links)[number]["match"],
  href: string
): boolean {
  if (match === "exact") {
    return pathname === "/super-admin";
  }
  if (match === "path") {
    const path = href.split("?")[0];
    return pathname === path || pathname.startsWith(`${path}/`);
  }
  if (match === "users-default") {
    if (pathname === "/super-admin/workplaces/new") return false;
    if (
      pathname.startsWith("/super-admin/workplaces/") &&
      pathname !== "/super-admin/workplaces/new"
    ) {
      return true;
    }
    return pathname === "/super-admin/users";
  }
  return false;
}

export function SuperAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setSidebarOpen(typeof window !== "undefined" && window.innerWidth >= 768);
  }, []);

  return (
    <div className="relative flex min-h-full flex-1 bg-zinc-100 dark:bg-zinc-950">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Luk menu"
          className="fixed inset-0 z-[90] bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={
          sidebarOpen
            ? "fixed inset-y-0 left-0 z-[100] flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 md:relative md:inset-auto md:z-10 md:shadow-none"
            : "hidden"
        }
      >
        <div className="border-b border-zinc-200 px-3 py-4 dark:border-zinc-800">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <Link
                href="/super-admin"
                className="block outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
                prefetch={false}
              >
                <span className="inline-block rounded-lg bg-zinc-950 px-3 py-2.5 dark:bg-zinc-950">
                  <Image
                    src="/ShiftBob-logo-90-light-512.png"
                    alt="ShiftBob"
                    width={320}
                    height={90}
                    className="h-14 w-auto max-w-full object-contain object-left sm:h-16"
                    priority
                  />
                </span>
              </Link>
              <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Super Admin
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="shrink-0 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label="Skjul menu"
              title="Skjul menu"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {links.map(({ href, label, icon: Icon, match }) => {
            const active = isSuperAdminNavActive(pathname, match, href);
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "flex items-center gap-2 rounded-lg bg-zinc-200 px-3 py-2.5 text-sm font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                {label}
              </Link>
            );
          })}
          <div className="relative z-[100] mt-2 border-t border-zinc-200 pt-2 dark:border-zinc-800">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSigningOut(true);
                void signOutAndRedirectToLogin();
              }}
              disabled={signingOut}
              className="relative z-[100] flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <LogOut className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
              {signingOut ? "Logger ud…" : "Log ud"}
            </button>
          </div>
        </nav>
      </aside>

      {!sidebarOpen ? (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-3 top-3 z-[100] flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 shadow-md transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          aria-label="Vis menu"
          title="Vis menu"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      ) : null}

      <main
        className={
          sidebarOpen
            ? "min-w-0 flex-1 overflow-auto p-6 lg:p-8"
            : "min-w-0 flex-1 overflow-auto px-6 pb-6 pt-16 md:pt-6 lg:px-8 lg:pb-8 lg:pt-8"
        }
      >
        {children}
      </main>
    </div>
  );
}
