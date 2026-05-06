import Image from "next/image";
import Link from "next/link";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";
import { SHIFTBOB_CIRCLE_LOGO_DARK } from "@/src/lib/brand-assets";
import { createTranslator, getTranslationsCached } from "@/src/lib/translations-server";
import {
  resolveRequestUiLanguage,
} from "@/src/lib/ui-language-server";
import { SalesBotWidget } from "../landing/sales-bot-widget";
import { UiLanguageSelect } from "../login/login-language-picker";
import { EmployerSignupForm } from "./employer-signup-form";

type ProductId = "basic" | "pro_planner" | "hybrid_app" | "autopilot";

function normalizeProduct(value?: string): ProductId {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "pro_planner") return "pro_planner";
  if (v === "hybrid_app") return "hybrid_app";
  if (v === "autopilot") return "autopilot";
  return "basic";
}

export default async function EmployerSignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = await resolveRequestUiLanguage();
  const [map, sp] = await Promise.all([getTranslationsCached(lang), searchParams]);
  const t = createTranslator(map);
  const productRaw = sp.product;
  const initialProduct = normalizeProduct(
    Array.isArray(productRaw) ? productRaw[0] : productRaw
  );

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
            id="employer-signup-ui-language"
            variant="light"
          />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-2xl space-y-5">
          <div>
            <p className="mt-2 text-sm text-zinc-600 sm:text-base">
              {t("employer_signup.subtitle", "Fill out the form below and you are ready!")}
            </p>
          </div>

          <EmployerSignupForm
            key={lang}
            initialProduct={initialProduct}
            languageCode={lang}
            copy={{
              labelProduct: t("employer_signup.label.product", "Product"),
              productBasic: t("employer_signup.product.basic", "Basic (free)"),
              productProPlanner: t("employer_signup.product.pro_planner", "Pro Planner"),
              productHybridApp: t("employer_signup.product.hybrid_app", "Hybrid App"),
              productAutopilot: t("employer_signup.product.autopilot", "Autopilot"),
              labelCompanyName: t("employer_signup.label.company_name", "Company name"),
              labelFirstName: t("employer_signup.label.first_name", "First name"),
              labelLastName: t("employer_signup.label.last_name", "Last name"),
              labelEmail: t("employer_signup.label.email", "Email"),
              labelVat: t("employer_signup.label.vat", "CVR / VAT"),
              labelPhone: t("employer_signup.label.phone", "Phone"),
              labelAddress: t("employer_signup.label.address", "Address"),
              labelPostalCode: t("employer_signup.label.postal_code", "Postal code"),
              labelCity: t("employer_signup.label.city", "City"),
              labelCountry: t("employer_signup.label.country", "Country"),
              placeholderSelectCountry: t(
                "employer_signup.placeholder.select_country",
                "Select country"
              ),
              labelEmployeeCount: t("employer_signup.label.employee_count", "Number of employees"),
              labelCardholderName: t(
                "employer_signup.label.cardholder_name",
                "Cardholder name"
              ),
              labelCardNumber: t("employer_signup.label.card_number", "Card number"),
              labelCardExpiry: t("employer_signup.label.card_expiry", "Expiry (MM/YY)"),
              labelCardCvc: t("employer_signup.label.card_cvc", "CVC"),
              placeholderCompanyName: t(
                "employer_signup.placeholder.company_name",
                "e.g. Sunrise Cafe Ltd."
              ),
              placeholderFirstName: t(
                "employer_signup.placeholder.first_name",
                "First name"
              ),
              placeholderLastName: t(
                "employer_signup.placeholder.last_name",
                "Last name"
              ),
              placeholderEmail: t(
                "employer_signup.placeholder.email",
                "name@company.com"
              ),
              placeholderCardholderName: t(
                "employer_signup.placeholder.cardholder_name",
                "Name on card"
              ),
              placeholderCardNumber: t(
                "employer_signup.placeholder.card_number",
                "1234 5678 9012 3456"
              ),
              placeholderCardExpiry: t(
                "employer_signup.placeholder.card_expiry",
                "MM/YY"
              ),
              placeholderCardCvc: t("employer_signup.placeholder.card_cvc", "123"),
              marketingConsentText: t(
                "employer_signup.marketing_consent",
                "By placing an order, you accept that ShiftBob may send marketing emails. You can unsubscribe at any time."
              ),
              buttonBack: t("employer_signup.button.back", "Back"),
              buttonNext: t("employer_signup.button.next", "Next"),
              buttonDownloadExcel: t(
                "employer_signup.button.download_excel",
                "Download Excel schedule"
              ),
              buttonCreateCompany: t(
                "employer_signup.button.create_company",
                "Create company"
              ),
              buttonStartAccountTemplate: t(
                "employer_signup.button.start_account_template",
                "Start {productName} {price} & create account"
              ),
              buttonSending: t("employer_signup.button.sending", "Sending..."),
              errorRequiredFieldsStep1: t(
                "employer_signup.error.required_step1",
                "Please fill in all required fields."
              ),
              errorRequiredFieldsStep2: t(
                "employer_signup.error.required_step2",
                "Please fill in all fields in step 2."
              ),
              errorConsentRequired: t(
                "employer_signup.error.consent_required",
                "You must accept marketing emails to continue."
              ),
              errorSubmitFailed: t(
                "employer_signup.error.submit_failed",
                "Could not create the request right now. Please try again in a moment."
              ),
              errorNetwork: t(
                "employer_signup.error.network",
                "Network error. Check your connection and try again."
              ),
              successBasicTemplate: t(
                "employer_signup.success.basic",
                "Thanks! We created your request ({ticketId}). The download step will be connected soon."
              ),
              successOtherTemplate: t(
                "employer_signup.success.other",
                "Thanks! We received your signup ({ticketId}). We will contact you as soon as possible."
              ),
            }}
          />

          <p className="text-center text-sm text-zinc-500">
            <Link
              href="/landing#landing-products"
              className="font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900"
            >
              {t("employer_signup.link.back_to_products", "Back to products")}
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
