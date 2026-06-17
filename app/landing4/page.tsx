import Link from "next/link";
import { ProductChoices } from "../landing3/product-choices";
import { ScrollToProductsButton } from "./scroll-to-products-button";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { UiLanguageSelect } from "../login/login-language-picker";
import { createTranslator } from "@/src/lib/translations-server";
import {
  getUiTranslations,
  resolveRequestUiLanguage,
} from "@/src/lib/ui-language-server";
import { SalesBotWidget } from "../landing2/sales-bot-widget";
import { Landing4Story } from "./landing4-story";
import { Landing4SatisfactionGuarantee } from "./landing4-satisfaction-guarantee";

export default async function Landing4Page() {
  const [map, lang] = await Promise.all([
    getUiTranslations(),
    resolveRequestUiLanguage(),
  ]);
  const t = createTranslator(map);

  return (
    <div className="landing4-page min-h-full overflow-x-hidden bg-[#050508] text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 shadow-[0_1px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[95%] items-center justify-between gap-4 py-4 sm:py-5">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white sm:text-xl"
          >
            {t("landing4.nav.site_name", "shiftbob.io")}
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <UiLanguageSelect
              currentLanguage={lang}
              ariaLabel={t("landing.nav.language_aria", "Choose language")}
              id="landing4-ui-language"
            />
            <Link
              href="/employer-login"
              className="rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
            >
              {t("landing.nav.login", "Login")}
            </Link>
            <ScrollToProductsButton
              label={t("landing.nav.try_for_free", "Try for free")}
              targetId="landing4-chapter-2"
              scrollOffset={112}
            />
          </div>
        </div>
      </header>

      <main>
        <Landing4Story translations={map} />

        <section id="landing4-products" className="scroll-mt-32">
          <ProductChoices
            translations={map}
            languageCode={lang}
            primaryCtaVariant="gradient-border"
            sectionBorder={false}
            sectionClassName="bg-[#050508]"
          />
        </section>

        <Landing4SatisfactionGuarantee translations={map} />
      </main>

      <footer className="bg-[#050508]">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-sm text-zinc-500 sm:px-6">
          {t(
            "landing.footer.company_line",
            "Whiff s.r.o. - Vlněna 5 - 602 00 Brno-střed - Czech Republic - support@shiftbob.io"
          )}
        </div>
      </footer>

      <SalesBotWidget
        languageCode={lang}
        theme="landing4"
        iconUrl="https://pwooqmqdershicxpnfuo.supabase.co/storage/v1/object/public/website_assets/chat.png"
        logoUrl={WEBSITE_ASSETS.landingLogo}
        buttonLabel={t("landing.salesbot.button_aria", "Ask shiftBOB")}
        panelTitle="shiftbob support"
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
        supportButtonLabel="support ticket"
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
