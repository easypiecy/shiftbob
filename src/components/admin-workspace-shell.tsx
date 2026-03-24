"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Bell,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  Scale,
  Settings,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { signOutAndRedirectToLogin } from "@/src/lib/auth-client";
import type { UiThemeId } from "@/src/lib/ui-theme";
import { useTranslations } from "@/src/contexts/translations-context";
import { LayoutThemeSidebar } from "@/src/components/layout-theme-sidebar";

type Props = {
  showAdminNav: boolean;
  children: React.ReactNode;
  /** Aktivt layout-tema (tre cirkler ved siden af Log ud i bunden af sidemenuen). */
  initialLayoutTheme?: UiThemeId;
  /** Navn på valgt arbejdsplads (under logo); hentes i layout via cookie + DB. */
  activeWorkplaceName?: string | null;
};

/** Fallbacks (da) hvis ui_translations mangler — undgår rå nøgle-navne i menuen. */
const baseLinks = [
  { href: "/dashboard", navKey: "admin.nav.calendar", labelDa: "Kalender", icon: LayoutDashboard },
  { href: "/dashboard/fremtiden", navKey: "admin.nav.future", labelDa: "Fremtiden", icon: CalendarClock },
  { href: "/dashboard/notifikationer", navKey: "admin.nav.notifications", labelDa: "Notifikationer", icon: Bell },
  { href: "/dashboard/join-requests", navKey: "admin.nav.join_requests", labelDa: "Adgangsanmodninger", icon: UserPlus },
  { href: "/dashboard/regler", navKey: "admin.nav.rules", labelDa: "Regler", icon: Scale },
  { href: "/dashboard/data-eksport", navKey: "admin.nav.data_export", labelDa: "Data eksport", icon: FileSpreadsheet },
  { href: "/dashboard/compliance", navKey: "admin.nav.compliance", labelDa: "Compliance", icon: ShieldCheck },
  { href: "/dashboard/indstillinger", navKey: "admin.nav.settings", labelDa: "Indstillinger", icon: Settings },
] as const;

export function AdminWorkspaceShell({
  showAdminNav,
  children,
  initialLayoutTheme,
  activeWorkplaceName = null,
}: Props) {
  const { t } = useTranslations();
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

  /** Dark: mørkt cirkel-logo. Light + unicorn: lyst cirkel-logo (unicorn bruger også `dark` på `<html>`). */
  const showDarkCircleLogo = initialLayoutTheme === "dark";

  return (
    <div className="relative flex min-h-screen flex-1 bg-zinc-100 dark:bg-zinc-950">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label={t("common.menu.close_overlay", "Luk menu")}
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
        <div className="relative shrink-0 border-b border-zinc-200 px-3 pb-3 pt-1 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="absolute right-0 top-0 z-10 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label={t("common.menu.hide_sidebar", "Skjul menu")}
            title={t("common.menu.hide_sidebar", "Skjul menu")}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex flex-col items-center px-1 pr-7">
            <Link
              href="/dashboard"
              className="outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
            >
              <span className="sidebar-logo-wrap inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
                <Image
                  src="/ShiftBob-circle-logo-light-1024.png"
                  alt={t("common.brand_name", "ShiftBob")}
                  width={1024}
                  height={1024}
                  className={`h-[5.5rem] w-[5.5rem] object-contain object-center sm:h-[6.5rem] sm:w-[6.5rem] ${
                    showDarkCircleLogo ? "hidden" : "block"
                  }`}
                  priority
                />
                <Image
                  src="/ShiftBob-circle-logo-dark-1024.png"
                  alt={t("common.brand_name", "ShiftBob")}
                  width={1024}
                  height={1024}
                  className={`h-[5.5rem] w-[5.5rem] object-contain object-center sm:h-[6.5rem] sm:w-[6.5rem] ${
                    showDarkCircleLogo ? "block" : "hidden"
                  }`}
                  priority
                />
              </span>
            </Link>
            <div className="mt-2.5 flex w-full max-w-[15rem] items-center justify-center gap-2">
              <p
                className="min-w-0 flex-1 break-words text-center text-xs font-semibold leading-snug text-zinc-600 dark:text-zinc-400"
                title={activeWorkplaceName ?? undefined}
              >
                {activeWorkplaceName?.trim()
                  ? activeWorkplaceName.trim()
                  : t("admin.sidebar.workplace_name_missing", "—")}
              </p>
              <Link
                href="/select-workplace"
                className="-m-1 shrink-0 rounded-lg p-1.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                title={t("admin.sidebar.switch_workplace", "Skift arbejdsplads")}
                aria-label={t("admin.sidebar.switch_workplace", "Skift arbejdsplads")}
              >
                <ArrowLeftRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-0">
          <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2">
            <div className="flex flex-col gap-0.5">
              {baseLinks.map(({ href, navKey, labelDa, icon: Icon }) => {
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
                    {t(navKey, labelDa)}
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
                  {signingOut
                    ? t("common.logout.loading", "Logger ud…")
                    : t("common.logout", "Log ud")}
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
          aria-label={t("common.menu.show_sidebar", "Vis menu")}
          title={t("common.menu.show_sidebar", "Vis menu")}
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
