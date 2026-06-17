import Image from "next/image";
import Link from "next/link";
import { ProductChoices } from "./product-choices";
import { ScrollToProductsButton } from "./scroll-to-products-button";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { UiLanguageSelect } from "../login/login-language-picker";
import { createTranslator } from "@/src/lib/translations-server";
import {
  getUiTranslations,
  resolveRequestUiLanguage,
} from "@/src/lib/ui-language-server";
import { SalesBotWidget } from "../landing2/sales-bot-widget";
import { Landing3Hero } from "./landing3-hero";
import { Landing3ComplianceSection } from "./landing3-compliance";
import { Landing3EmployeeAppSection } from "./landing3-employee-app";
import { Landing3AutopilotSection } from "./landing3-autopilot";

const LANDING_FOOTER_COMPANY_LINE =
  "Whiff s.r.o. - Vlněna 5 - 602 00 Brno-střed - Czech Republic - support@shiftbob.io";

export default async function Landing3Page() {
  const [map, lang] = await Promise.all([
    getUiTranslations(),
    resolveRequestUiLanguage(),
  ]);
  const t = createTranslator(map);

  return (
    <div className="min-h-full bg-[#07070d] text-zinc-100">
      <header
        data-version="landing3-v1"
        className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 shadow-[0_1px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <Link href="/" className="flex items-end gap-3 sm:gap-4">
            <div className="rounded-2xl bg-zinc-900 p-1.5 shadow-[0_0_24px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/20 sm:p-2">
              <Image
                src={WEBSITE_ASSETS.landingLogo}
                alt={t("landing.nav.logo_alt", "ShiftBob logo")}
                width={300}
                height={300}
                className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                priority
                unoptimized
              />
            </div>
            <span className="pb-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
              shiftbob.io
            </span>
          </Link>

          <div className="flex flex-col items-end gap-2">
            <UiLanguageSelect
              currentLanguage={lang}
              ariaLabel={t("landing.nav.language_aria", "Choose language")}
              id="landing3-ui-language"
            />
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <Link
                href="/employer-login"
                className="rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-semibold text-zinc-200 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
              >
                {t("landing.nav.login", "Login")}
              </Link>
              <ScrollToProductsButton
                label={t("landing.nav.try_for_free", "Try for free")}
                className="rounded-full bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_28px_rgba(74,144,226,0.4)] transition hover:-translate-y-0.5 hover:bg-[#3A7FD1] hover:shadow-[0_0_36px_rgba(74,144,226,0.5)]"
              />
            </div>
          </div>
        </div>
      </header>

      <main>
        <Landing3Hero />
        <Landing3ComplianceSection />
        <Landing3EmployeeAppSection />
        <Landing3AutopilotSection />

        <section id="landing3-products" className="scroll-mt-32">
          <ProductChoices translations={map} languageCode={lang} />
        </section>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950/90">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-sm text-zinc-500 sm:px-6">
          {LANDING_FOOTER_COMPANY_LINE}
        </div>
      </footer>

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
