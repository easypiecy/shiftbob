"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SalesBotWidget } from "@/app/landing/sales-bot-widget";
import {
  ArrowLeftRight,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { signOutAndRedirectToLogin } from "@/src/lib/auth-client";
import type { UiThemeId } from "@/src/lib/ui-theme";
import { useTranslations } from "@/src/contexts/translations-context";

type Props = {
  showAdminNav: boolean;
  children: React.ReactNode;
  /** Aktivt layout-tema (bruges i fanebladet Farver under Indstillinger). */
  initialLayoutTheme?: UiThemeId;
  /** Navn på valgt arbejdsplads (under logo); hentes i layout via cookie + DB. */
  activeWorkplaceName?: string | null;
};

/**
 * Hovedmenu — kun importerede Lucide-ikoner (ingen `UserPlus` / join-requests her).
 * Konstantnavnet skifter ved ændringer så Turbopack ikke genbruger gammel bundlet kode.
 */
type AdminNavLink = {
  href: string;
  navKey: string;
  labelDa: string;
  icon: LucideIcon;
};

const ADMIN_NAV_LINKS: AdminNavLink[] = [
  { href: "/dashboard", navKey: "admin.nav.calendar", labelDa: "Vagtplan", icon: LayoutDashboard },
  {
    href: "/dashboard/fremtiden",
    navKey: "admin.nav.future",
    labelDa: "Automatisk udrulning",
    icon: CalendarClock,
  },
  {
    href: "/dashboard/indstillinger",
    navKey: "admin.nav.settings",
    labelDa: "Indstillinger",
    icon: Settings,
  },
];

export function AdminWorkspaceShell({
  showAdminNav,
  children,
  initialLayoutTheme,
}: Props) {
  const { t } = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [signingOut, setSigningOut] = useState(false);
  const [settingsNavigationPending, setSettingsNavigationPending] = useState(false);

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
  const showSettingsLoaderOverlay =
    settingsNavigationPending && pathname !== "/dashboard/indstillinger";

  function openSpreadsheetImportPage() {
    router.push("/dashboard/import-regneark");
    setSidebarOpen(false);
  }

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
        <div className="relative shrink-0 px-3 pb-3 pt-1">
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
                  className={`h-[6.5rem] w-[6.5rem] object-contain object-center sm:h-[7.25rem] sm:w-[7.25rem] ${
                    showDarkCircleLogo ? "hidden" : "block"
                  }`}
                  priority
                />
                <Image
                  src="/ShiftBob-circle-logo-dark-1024.png"
                  alt={t("common.brand_name", "ShiftBob")}
                  width={1024}
                  height={1024}
                  className={`h-[6.5rem] w-[6.5rem] object-contain object-center sm:h-[7.25rem] sm:w-[7.25rem] ${
                    showDarkCircleLogo ? "block" : "hidden"
                  }`}
                  priority
                />
              </span>
            </Link>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-0">
          <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2">
            <div className="flex flex-col gap-0.5">
              {ADMIN_NAV_LINKS.map(({ href, navKey, labelDa, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={(e) => {
                      if (href !== "/dashboard/indstillinger") {
                        setSettingsNavigationPending(false);
                        return;
                      }
                      if (active) {
                        setSettingsNavigationPending(false);
                        return;
                      }
                      e.preventDefault();
                      setSettingsNavigationPending(true);
                      router.push(href);
                    }}
                    className={
                      active
                        ? "flex items-center gap-2 rounded-lg bg-zinc-200 px-3 py-2.5 text-sm font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                    <span className="inline-flex items-center">{t(navKey, labelDa)}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="shrink-0 px-2 pb-2">
            <button
              type="button"
              onClick={openSpreadsheetImportPage}
              className="flex w-full items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <FileSpreadsheet className="h-4 w-4 shrink-0" aria-hidden />
              <span>{t("admin.nav.import_spreadsheet", "Hent regneark")}</span>
            </button>
          </div>
          <div className="sidebar-menu-footer shrink-0 pt-2">
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
              <Link
                href="/select-workplace"
                className="shrink-0 rounded-lg p-2.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                title={t("admin.sidebar.switch_workplace", "Skift arbejdsplads")}
                aria-label={t("admin.sidebar.switch_workplace", "Skift arbejdsplads")}
              >
                <ArrowLeftRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </Link>
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
        {showSettingsLoaderOverlay ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-zinc-100/85 dark:bg-zinc-950/85">
            <section
              className="bob-loader-shell"
              aria-label={t("common.loading_page", "Siden loader")}
              role="status"
            >
              <div className="bob-loader-row" aria-hidden="true">
                <span className="bob-orb bob-orb-1">B</span>
                <span className="bob-orb bob-orb-2">O</span>
                <span className="bob-orb bob-orb-3">B</span>
              </div>
            </section>
          </div>
        ) : null}
        {children}
      </main>
      <SalesBotWidget
        languageCode="da"
        iconUrl="https://pwooqmqdershicxpnfuo.supabase.co/storage/v1/object/public/website_assets/chat.png"
        logoUrl="/ShiftBob-circle-logo-dark-1024.png"
        buttonLabel={t("landing.salesbot.button_aria", "Sporg shiftBOB")}
        panelTitle="shiftBOB"
        initialAssistantMessage={t(
          "landing.salesbot.initial_message",
          "Sporg mig om ShiftBob, vagtplaner eller regler."
        )}
        inputPlaceholder={t(
          "landing.salesbot.input_placeholder",
          "Skriv dit sporgsmal..."
        )}
        sendLabel={t("landing.salesbot.send", "Send")}
        closeLabel={t("landing.salesbot.close", "Luk chat")}
        supportButtonLabel={t("landing.salesbot.support_button", "Support ticket")}
        supportPanelTitle={t("landing.salesbot.support_panel_title", "Opret support ticket")}
        supportSubjectLabel={t("landing.salesbot.support_subject", "Emne")}
        supportMessageLabel={t("landing.salesbot.support_message", "Beskriv dit problem")}
        supportNameLabel={t("landing.salesbot.support_name", "Dit navn")}
        supportEmailLabel={t("landing.salesbot.support_email", "Din e-mail")}
        supportSubmitLabel={t("landing.salesbot.support_submit", "Send ticket")}
        supportSuccessTemplate={t(
          "landing.salesbot.support_success",
          "Tak! Din support ticket er oprettet: {ticketId}"
        )}
        supportNeedIdentityMessage={t(
          "landing.salesbot.support_need_identity",
          "For at oprette en support ticket skal du angive navn og e-mail."
        )}
        resetLabel={t("landing.salesbot.reset", "Nulstil chat")}
        dismissLabel={t("common.chat.dismiss_widget", "Skjul widget")}
        dismissStorageKey="shiftbob.chat.dismiss.admin"
      />
    </div>
  );
}
