"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { signOutAndRedirectToLogin } from "@/src/lib/auth-client";
import type { UiThemeId } from "@/src/lib/ui-theme";
import { LayoutThemeSidebar } from "@/src/components/layout-theme-sidebar";

type Props = {
  showAdminNav: boolean;
  children: React.ReactNode;
  /** Aktivt layout-tema (tre cirkler ved siden af Log ud i bunden af sidemenuen). */
  initialLayoutTheme?: UiThemeId;
};

const baseLinks = [
  { href: "/dashboard", label: "Kalender", icon: LayoutDashboard },
  { href: "/dashboard/notifikationer", label: "Notifikationer", icon: Bell },
  { href: "/dashboard/indstillinger", label: "Indstillinger", icon: Settings },
] as const;

export function AdminWorkspaceShell({
  showAdminNav,
  children,
  initialLayoutTheme,
}: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setSidebarOpen(typeof window !== "undefined" && window.innerWidth >= 768);
  }, []);

  if (!showAdminNav) {
    return <>{children}</>;
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="relative flex min-h-screen flex-1 bg-zinc-100 dark:bg-zinc-950">
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
            ? "fixed inset-y-0 left-0 z-[100] flex h-screen max-h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 md:relative md:inset-auto md:z-10 md:shadow-none"
            : "hidden"
        }
      >
        <div className="shrink-0 border-b border-zinc-200 px-3 py-4 dark:border-zinc-800">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <Link
                href="/dashboard"
                className="block outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
              >
                <span className="inline-block rounded-lg bg-zinc-950 px-3 py-2.5 dark:bg-zinc-950">
                  <Image
                    src="/ShiftBob-logo-90-light-512.png"
                    alt="ShiftBob"
                    width={320}
                    height={90}
                    className="h-12 w-auto max-w-full object-contain object-left sm:h-14"
                    priority
                  />
                </span>
              </Link>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Administrator
                </p>
                <Link
                  href="/select-workplace"
                  className="shrink-0 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  title="Skift arbejdsplads"
                  aria-label="Skift arbejdsplads"
                >
                  <Building2 className="h-4 w-4" aria-hidden />
                </Link>
              </div>
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
        <div className="flex min-h-0 flex-1 flex-col px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-0">
          <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2">
            <div className="flex flex-col gap-0.5">
              {baseLinks.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
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
            </div>
          </nav>
          <div className="sidebar-menu-footer shrink-0 border-t border-zinc-200 pt-2 dark:border-zinc-800">
            <div className="flex items-center gap-2 px-2 pb-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSigningOut(true);
                  void signOutAndRedirectToLogin();
                }}
                disabled={signingOut}
                className="relative z-[100] flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <LogOut className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                <span className="truncate">
                  {signingOut ? "Logger ud…" : "Log ud"}
                </span>
              </button>
              {initialLayoutTheme ? (
                <LayoutThemeSidebar initialTheme={initialLayoutTheme} />
              ) : null}
            </div>
          </div>
        </div>
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
            ? "min-w-0 flex-1 overflow-auto"
            : "min-w-0 flex-1 overflow-auto pt-14 md:pt-0"
        }
      >
        {children}
      </main>
    </div>
  );
}
