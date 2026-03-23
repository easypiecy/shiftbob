import Image from "next/image";
import Link from "next/link";
import { SHIFTBOB_CIRCLE_LOGO_DARK } from "@/src/lib/brand-assets";
import { createTranslator } from "@/src/lib/translations-server";
import {
  getUiTranslations,
  resolveRequestUiLanguage,
} from "@/src/lib/ui-language-server";
import { LoginForm } from "./login-form";
import { LoginInstallPrompt } from "./login-install-prompt";
import { LoginLanguagePicker } from "./login-language-picker";

/**
 * Server Component: ydre layout og logo leveres som RSC-HTML uden «hele siden» som én client root
 * (undgår hydration mismatch mod Next’s Suspense omkring client-only page roots).
 */
export default async function LoginPage() {
  const [map, lang] = await Promise.all([
    getUiTranslations(),
    resolveRequestUiLanguage(),
  ]);
  const t = createTranslator(map);

  return (
    <div className="login-page-shell relative flex flex-1 flex-col items-center justify-center px-4 py-12">
      <LoginLanguagePicker
        currentLanguage={lang}
        ariaLabel={t("login.language_picker.label", "Language")}
      />
      <div className="w-full max-w-md">
        <div className="mb-3 flex justify-center">
          <div
            className="relative mx-auto aspect-square w-40 shrink-0 sm:w-48 md:w-56"
            role="img"
            aria-label={t("login.logo.aria_label", "ShiftBob")}
          >
            <Image
              src={SHIFTBOB_CIRCLE_LOGO_DARK}
              alt=""
              width={1024}
              height={1024}
              className="h-full w-full object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        <LoginForm
          emailPlaceholder={t("login.email.placeholder", "you@example.com")}
          passwordPlaceholder={t(
            "login.password.placeholder",
            "••••••••"
          )}
        />

        <p className="mt-8 text-center text-sm text-zinc-400">
          <Link
            href="/"
            className="font-medium text-zinc-300 underline underline-offset-4 hover:text-white"
          >
            {t("login.link.home", "Back to home")}
          </Link>
        </p>
      </div>

      <LoginInstallPrompt />
    </div>
  );
}
