import Image from "next/image";
import Link from "next/link";
import { Apple, Play } from "lucide-react";
import { ProductChoices } from "./product-choices";
import { ScrollFadeInImage } from "./scroll-fade-in-image";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { UiLanguageSelect } from "../login/login-language-picker";
import { createTranslator } from "@/src/lib/translations-server";
import {
  getUiTranslations,
  resolveRequestUiLanguage,
} from "@/src/lib/ui-language-server";
import { SalesBotWidget } from "./sales-bot-widget";

export default async function LandingPage() {
  const [map, lang] = await Promise.all([
    getUiTranslations(),
    resolveRequestUiLanguage(),
  ]);
  const t = createTranslator(map);

  return (
    <div className="min-h-full bg-white text-zinc-900">
      <header
        data-version="landing-v2"
        className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6">
          <Link href="/" className="flex items-end gap-3 sm:gap-4">
            <div className="rounded-xl bg-black p-1.5 sm:p-2">
              <Image
                src={WEBSITE_ASSETS.landingLogo}
                alt={t("landing.nav.logo_alt", "ShiftBob logo")}
                width={300}
                height={300}
                className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                priority
                unoptimized
              />
            </div>
            <span className="pb-1 text-lg font-semibold tracking-tight sm:text-xl">
              shiftbob.io
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
            >
              {t("landing.nav.login", "Login")}
            </Link>
            <UiLanguageSelect
              currentLanguage={lang}
              ariaLabel={t("landing.nav.language_aria", "Choose language")}
              id="landing-ui-language"
              variant="light"
            />

            <Link
              href="/login"
              className="rounded-full bg-[#4A90E2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3A7FD1]"
            >
              {t("landing.nav.try_for_free", "Try for free")}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden">
          <div
            className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${WEBSITE_ASSETS.landingHero}')` }}
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_20%,rgba(255,255,255,0)_80%,rgba(255,255,255,0.95)_100%)]" />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
            <div />
            <div
              data-hero-version="v3"
              className="justify-self-end rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-xl backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A90E2]">
                {t("landing.hero.eyebrow", "Shift Scheduling")}
              </p>
              <h1 className="mt-3 max-w-xl text-3xl font-black uppercase leading-[1.05] text-zinc-900 sm:text-4xl lg:text-5xl">
                {t(
                  "landing.hero.title",
                  "Give Your Excel Shift Plan Extra Power 💥"
                )}
              </h1>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-18 sm:px-6 sm:py-24 md:grid-cols-5 md:gap-14">
          <div className="text-center md:col-span-3">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm sm:text-sm">
                <Apple className="h-4 w-4" aria-hidden="true" />
                {t("landing.app.badge.app_store", "App Store")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm sm:text-sm">
                <Play className="h-4 w-4" aria-hidden="true" />
                {t("landing.app.badge.google_play", "Google Play")}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {t(
                "landing.app.title",
                "From your spreadsheet to the team app—like magic."
              )}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-800 sm:text-lg">
              {t(
                "landing.app.body",
                "Give your team the modern, lightning-fast mobile experience they expect. Instead of zooming in on PDFs or navigating messy WhatsApp groups, your employees get a sleek app with a clear shift overview. It empowers them to easily request schedule changes, pick up open hours, and manage their work life on the go. With instant push notifications for every update, communication chaos is completely eliminated, ensuring everyone is always connected and on the exact same page."
              )}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 md:col-span-2 md:items-end md:justify-end">
            <ScrollFadeInImage
              alt={t(
                "landing.app.image_alt",
                "Employee checking shifts on mobile app"
              )}
            />
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-18 sm:px-6 sm:pb-24 md:grid-cols-5 md:gap-14">
          <div className="flex justify-center md:col-span-2 md:justify-start">
            <div className="inline-flex flex-col items-start">
              <ScrollFadeInImage
                src={WEBSITE_ASSETS.landingEuCompliance}
                alt={t(
                  "landing.compliance.image_alt",
                  "Team compliance and schedule overview"
                )}
              />
              <div className="relative z-20 -mt-8 self-center rounded-md bg-[#d5d902]/80 px-3 py-1.5 text-xs font-bold text-black shadow-lg sm:text-sm">
                All EU languages supported
              </div>
            </div>
          </div>

          <div className="text-center md:col-span-3">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {t(
                "landing.compliance.title",
                "Never accidentally break the 11-hour rule again."
              )}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-800 sm:text-lg">
              {t(
                "landing.compliance.body",
                "Start by uploading your Excel schedule, and ShiftBob instantly scans the data to flag any violations, like the mandatory 11-hour daily rest rule. When you roll out the mobile app to your team, the platform acts as a strict gatekeeper, actively blocking staff from swapping or picking up shifts if the change breaks labor laws. Finally, with our full online Autopilot, compliance becomes fully automated. Shiftbob automatically generates a 100% compliant schedule from scratch, perfectly balancing legal requirements with your team's personal preferences."
              )}
            </p>
          </div>
        </section>

        <ProductChoices translations={map} />
      </main>
      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-sm text-zinc-700 sm:px-6">
          {t(
            "landing.footer.company_line",
            "P.S. Creations - Vlněna 5 - 602 00 Brno-střed - Czech Republic - support@shiftbob.io"
          )}
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
          "Ask me anything about ShiftBob and your shift plan."
        )}
        inputPlaceholder={t(
          "landing.salesbot.input_placeholder",
          "Ask about pricing, features, or onboarding..."
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
