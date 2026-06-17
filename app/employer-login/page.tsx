import Image from "next/image";
import Link from "next/link";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { SHIFTBOB_CIRCLE_LOGO_DARK } from "@/src/lib/brand-assets";
import { createTranslator } from "@/src/lib/translations-server";
import {
  getUiTranslations,
  resolveRequestUiLanguage,
} from "@/src/lib/ui-language-server";
import { SalesBotWidget } from "../landing/sales-bot-widget";
import { UiLanguageSelect } from "../login/login-language-picker";
import { EmployerLoginForm } from "./employer-login-form";

export default async function EmployerLoginPage() {
  const [map, lang] = await Promise.all([
    getUiTranslations(),
    resolveRequestUiLanguage(),
  ]);
  const t = createTranslator(map);

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-white text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="rounded-lg bg-black p-1.5">
              <Image
                src={SHIFTBOB_CIRCLE_LOGO_DARK}
                alt={t("landing.nav.logo_alt", "ShiftBob logo")}
                width={72}
                height={72}
                className="h-10 w-10 object-contain"
                priority
                unoptimized
              />
            </div>
            <span className="text-lg font-semibold tracking-tight">shiftbob.io</span>
          </Link>
          <UiLanguageSelect
            currentLanguage={lang}
            ariaLabel={t("login.language_picker.label", "Language")}
            id="employer-login-ui-language"
            variant="light"
          />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-md">
          <EmployerLoginForm
            emailPlaceholder={t("login.email.placeholder", "you@example.com")}
            passwordPlaceholder={t("login.password.placeholder", "••••••••")}
          />

          <p className="mt-8 text-center text-sm text-zinc-500">
            <Link
              href="/landing"
              className="font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900"
            >
              {t("login.link.home", "Back to home")}
            </Link>
          </p>
        </div>
      </main>

      <SalesBotWidget
        languageCode={lang}
        iconUrl="https://pwooqmqdershicxpnfuo.supabase.co/storage/v1/object/public/website_assets/chat.png"
        logoUrl={WEBSITE_ASSETS.landingLogo}
        buttonLabel={t("landing.salesbot.button_aria", "Ask shiftBOB")}
        panelTitle="shiftBOB"
        initialAssistantMessage={t(
          "landing.salesbot.initial_message",
          "Do you have any questions for me?"
        )}
        inputPlaceholder={t(
          "landing.salesbot.input_placeholder",
          "Ask me anything about BOB"
        )}
        sendLabel={t("landing.salesbot.send", "Send")}
        closeLabel={t("landing.salesbot.close", "Close chat")}
        supportButtonLabel={t("landing.salesbot.support_button", "Support ticket")}
        supportPanelTitle={t("landing.salesbot.support_panel_title", "Create support ticket")}
        supportSubjectLabel={t("landing.salesbot.support_subject", "Subject")}
        supportMessageLabel={t("landing.salesbot.support_message", "Describe your issue")}
        supportNameLabel={t("landing.salesbot.support_name", "Your name")}
        supportEmailLabel={t("landing.salesbot.support_email", "Your email")}
        supportSubmitLabel={t("landing.salesbot.support_submit", "Submit ticket")}
        supportSuccessTemplate={t(
          "landing.salesbot.support_success",
          "Thanks! Your support ticket is created: {ticketId}"
        )}
        supportNeedIdentityMessage={t(
          "landing.salesbot.support_need_identity",
          "To create a support ticket, please provide your name and email."
        )}
        resetLabel={t("landing.salesbot.reset", "Reset chat")}
      />
    </div>
  );
}
