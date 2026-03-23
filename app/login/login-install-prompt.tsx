"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "@/src/contexts/translations-context";

const STORAGE_KEY = "shiftbob_login_install_prompt_dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

export function LoginInstallPrompt() {
  const { t } = useTranslations();
  const [show, setShow] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(
    null
  );

  useEffect(() => {
    if (isStandalonePwa()) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* private mode */
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    setShow(true);

    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }, []);

  const install = useCallback(async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    try {
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") {
        try {
          localStorage.setItem(STORAGE_KEY, "1");
        } catch {
          /* ignore */
        }
        setShow(false);
      }
    } catch {
      /* ignore */
    }
    setInstallEvent(null);
  }, [installEvent]);

  if (!show) return null;

  return (
    <>
      <div
        className="pointer-events-none h-[5.5rem] shrink-0 sm:h-24"
        aria-hidden
      />
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-600/80 bg-zinc-950/95 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        role="region"
        aria-label={t("login.install.region_label", "Install the app")}
      >
        <div className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              {t("login.install.title", "Gem ShiftBob som app")}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-zinc-400">
              {installEvent
                ? t(
                    "login.install.hint_chrome",
                    "Tryk Installer for at tilføje til din startskærm."
                  )
                : t(
                    "login.install.hint_generic",
                    "Brug browsermenuen: Tilføj til hjemmeskærm eller Installer app."
                  )}
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2 sm:justify-end">
            {installEvent ? (
              <button
                type="button"
                onClick={() => void install()}
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("login.install.action_install", "Installer")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-zinc-600 text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
              aria-label={t("login.install.dismiss", "Vis ikke igen")}
            >
              <X className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
