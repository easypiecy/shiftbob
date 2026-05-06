"use client";

import { useEffect, useMemo, useState } from "react";

type ProductId = "basic" | "pro_planner" | "hybrid_app" | "autopilot";

type EmployerSignupFormProps = {
  initialProduct: ProductId;
  languageCode?: string;
  copy?: {
    labelProduct: string;
    productBasic: string;
    productProPlanner: string;
    productHybridApp: string;
    productAutopilot: string;
    labelCompanyName: string;
    labelFirstName: string;
    labelLastName: string;
    labelEmail: string;
    labelVat: string;
    labelPhone: string;
    labelAddress: string;
    labelPostalCode: string;
    labelCity: string;
    labelCountry: string;
    placeholderSelectCountry: string;
    labelEmployeeCount: string;
    labelCardholderName: string;
    labelCardNumber: string;
    labelCardExpiry: string;
    labelCardCvc: string;
    placeholderCompanyName: string;
    placeholderFirstName: string;
    placeholderLastName: string;
    placeholderEmail: string;
    placeholderCardholderName: string;
    placeholderCardNumber: string;
    placeholderCardExpiry: string;
    placeholderCardCvc: string;
    marketingConsentText: string;
    buttonBack: string;
    buttonNext: string;
    buttonDownloadExcel: string;
    buttonCreateCompany: string;
    buttonStartAccountTemplate: string;
    buttonSending: string;
    errorRequiredFieldsStep1: string;
    errorRequiredFieldsStep2: string;
    errorConsentRequired: string;
    errorSubmitFailed: string;
    errorNetwork: string;
    successBasicTemplate: string;
    successOtherTemplate: string;
  };
};

type MessageState = { kind: "success" | "error"; text: string } | null;

const DEFAULT_COPY_EN: NonNullable<EmployerSignupFormProps["copy"]> = {
  labelProduct: "Product",
  productBasic: "Basic (free)",
  productProPlanner: "Pro Planner",
  productHybridApp: "Hybrid App",
  productAutopilot: "Autopilot",
  labelCompanyName: "Company name",
  labelFirstName: "First name",
  labelLastName: "Last name",
  labelEmail: "Email",
  labelVat: "VAT / company number",
  labelPhone: "Phone",
  labelAddress: "Address",
  labelPostalCode: "Postal code",
  labelCity: "City",
  labelCountry: "Country",
  placeholderSelectCountry: "Select country",
  labelEmployeeCount: "Number of employees",
  labelCardholderName: "Cardholder name",
  labelCardNumber: "Card number",
  labelCardExpiry: "Expiry (MM/YY)",
  labelCardCvc: "CVC",
  placeholderCompanyName: "e.g. Sunrise Cafe Ltd.",
  placeholderFirstName: "First name",
  placeholderLastName: "Last name",
  placeholderEmail: "name@company.com",
  placeholderCardholderName: "Name on card",
  placeholderCardNumber: "1234 5678 9012 3456",
  placeholderCardExpiry: "MM/YY",
  placeholderCardCvc: "123",
  marketingConsentText:
    "By placing an order, you accept that ShiftBob may send marketing emails. You can unsubscribe at any time.",
  buttonBack: "Back",
  buttonNext: "Next",
  buttonDownloadExcel: "Download Excel schedule",
  buttonCreateCompany: "Create company",
  buttonStartAccountTemplate: "Start {productName} {price} & create account",
  buttonSending: "Sending...",
  errorRequiredFieldsStep1: "Please fill in all required fields.",
  errorRequiredFieldsStep2: "Please fill in all fields in step 2.",
  errorConsentRequired: "You must accept marketing emails to continue.",
  errorSubmitFailed: "Could not create the request right now. Please try again in a moment.",
  errorNetwork: "Network error. Check your connection and try again.",
  successBasicTemplate:
    "Thanks! We created your request ({ticketId}). The download step will be connected soon.",
  successOtherTemplate:
    "Thanks! We received your signup ({ticketId}). We will contact you as soon as possible.",
};

const DEFAULT_COPY_DA: NonNullable<EmployerSignupFormProps["copy"]> = {
  labelProduct: "Produkt",
  productBasic: "Basic (gratis)",
  productProPlanner: "Pro Planner",
  productHybridApp: "Hybrid App",
  productAutopilot: "Autopilot",
  labelCompanyName: "Virksomhedsnavn",
  labelFirstName: "Fornavn",
  labelLastName: "Efternavn",
  labelEmail: "E-mail",
  labelVat: "CVR / VAT",
  labelPhone: "Telefon",
  labelAddress: "Adresse",
  labelPostalCode: "Postnr.",
  labelCity: "By",
  labelCountry: "Land",
  placeholderSelectCountry: "Vælg land",
  labelEmployeeCount: "Antal ansatte",
  labelCardholderName: "Kortholders navn",
  labelCardNumber: "Kortnummer",
  labelCardExpiry: "Udløb (MM/AA)",
  labelCardCvc: "CVC",
  placeholderCompanyName: "Fx Cafe Solsiden ApS",
  placeholderFirstName: "Fornavn",
  placeholderLastName: "Efternavn",
  placeholderEmail: "navn@virksomhed.dk",
  placeholderCardholderName: "Navn på kort",
  placeholderCardNumber: "1234 5678 9012 3456",
  placeholderCardExpiry: "MM/AA",
  placeholderCardCvc: "123",
  marketingConsentText:
    "Ved at bestille, så accepterer du at ShiftBob må sende markedsføringsmail. Det kan til enhver tid afmeldes.",
  buttonBack: "Tilbage",
  buttonNext: "Videre",
  buttonDownloadExcel: "Hent Excel vagtplan",
  buttonCreateCompany: "Opret virksomhed",
  buttonStartAccountTemplate: "Start {productName} {price} & opret konto",
  buttonSending: "Sender...",
  errorRequiredFieldsStep1: "Udfyld venligst alle obligatoriske felter.",
  errorRequiredFieldsStep2: "Udfyld venligst alle felter i trin 2.",
  errorConsentRequired: "Du skal acceptere markedsføringsmail for at fortsætte.",
  errorSubmitFailed: "Kunne ikke oprette forespørgslen lige nu. Prøv igen om et øjeblik.",
  errorNetwork: "Netværksfejl. Tjek forbindelsen og prøv igen.",
  successBasicTemplate:
    "Tak! Vi har oprettet din anmodning ({ticketId}). Download-trinnet kobles på snart.",
  successOtherTemplate:
    "Tak! Vi har modtaget din oprettelse ({ticketId}). Vi kontakter dig hurtigst muligt.",
};

function resolveFallbackCopy(
  languageCode?: string
): NonNullable<EmployerSignupFormProps["copy"]> {
  const code = (languageCode ?? "da").toLowerCase();
  if (code.startsWith("da")) return DEFAULT_COPY_DA;
  return DEFAULT_COPY_EN;
}

const COUNTRY_OPTIONS: Array<{ code: string; nativeName: string }> = [
  { code: "AT", nativeName: "Österreich" },
  { code: "BE", nativeName: "België / Belgique / Belgien" },
  { code: "BG", nativeName: "Bălgariya" },
  { code: "CH", nativeName: "Schweiz / Suisse / Svizzera / Svizra" },
  { code: "CY", nativeName: "Kypros / Kıbrıs" },
  { code: "CZ", nativeName: "Česko" },
  { code: "DE", nativeName: "Deutschland" },
  { code: "DK", nativeName: "Danmark" },
  { code: "EE", nativeName: "Eesti" },
  { code: "ES", nativeName: "España" },
  { code: "FI", nativeName: "Suomi" },
  { code: "FR", nativeName: "France" },
  { code: "GB", nativeName: "United Kingdom" },
  { code: "GR", nativeName: "Elláda" },
  { code: "HR", nativeName: "Hrvatska" },
  { code: "HU", nativeName: "Magyarország" },
  { code: "IE", nativeName: "Éire / Ireland" },
  { code: "IS", nativeName: "Ísland" },
  { code: "IT", nativeName: "Italia" },
  { code: "LI", nativeName: "Liechtenstein" },
  { code: "LT", nativeName: "Lietuva" },
  { code: "LU", nativeName: "Lëtzebuerg / Luxembourg" },
  { code: "LV", nativeName: "Latvija" },
  { code: "MT", nativeName: "Malta" },
  { code: "NL", nativeName: "Nederland" },
  { code: "NO", nativeName: "Norge" },
  { code: "PL", nativeName: "Polska" },
  { code: "PT", nativeName: "Portugal" },
  { code: "RO", nativeName: "România" },
  { code: "SE", nativeName: "Sverige" },
  { code: "SI", nativeName: "Slovenija" },
  { code: "SK", nativeName: "Slovensko" },
];

function submitLabelFor(product: ProductId): string {
  if (product === "basic") return "download_excel";
  return "create_company";
}

function priceForProduct(product: ProductId): string {
  if (product === "pro_planner") return "49 EUR";
  if (product === "hybrid_app") return "29 EUR";
  if (product === "autopilot") return "59 EUR";
  return "0 EUR";
}

export function EmployerSignupForm({
  initialProduct,
  languageCode = "da",
  copy: copyProp,
}: EmployerSignupFormProps) {
  const copy = copyProp ?? resolveFallbackCopy(languageCode);
  const productOptions: Array<{ id: ProductId; label: string }> = useMemo(
    () => [
      { id: "basic", label: copy.productBasic },
      { id: "pro_planner", label: copy.productProPlanner },
      { id: "hybrid_app", label: copy.productHybridApp },
      { id: "autopilot", label: copy.productAutopilot },
    ],
    [copy]
  );

  const [step, setStep] = useState<1 | 2>(1);
  const [product, setProduct] = useState<ProductId>(initialProduct);
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [vat, setVat] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [employeeCount, setEmployeeCount] = useState("5-20");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  const submitLabel = useMemo(
    () =>
      submitLabelFor(product) === "download_excel"
        ? copy.buttonDownloadExcel
        : copy.buttonCreateCompany,
    [copy.buttonCreateCompany, copy.buttonDownloadExcel, product]
  );
  const productLabel = useMemo(
    () => productOptions.find((p) => p.id === product)?.label ?? copy.productBasic,
    [copy.productBasic, product, productOptions]
  );
  const startAccountLabel = useMemo(() => {
    const price = priceForProduct(product);
    const template =
      copy.buttonStartAccountTemplate ?? DEFAULT_COPY_EN.buttonStartAccountTemplate;
    return template
      .replace("{productName}", productLabel)
      .replace("{price}", price);
  }, [copy.buttonStartAccountTemplate, product, productLabel]);

  useEffect(() => {
    setProduct(initialProduct);
    setStep(1);
  }, [initialProduct]);

  async function submitLead(params: {
    trimmedCompanyName: string;
    trimmedFirstName: string;
    trimmedLastName: string;
    trimmedEmail: string;
  }) {
    const trimmedVat = vat.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();
    const trimmedPostalCode = postalCode.trim();
    const trimmedCity = city.trim();
    const trimmedCountry = country.trim().toUpperCase();
    const trimmedCardholder = cardholderName.trim();
    const trimmedCardNumber = cardNumber.trim();
    const trimmedCardExpiry = cardExpiry.trim();
    const trimmedCardCvc = cardCvc.trim();

    const details = [
      `Produkt: ${productLabel}`,
      `Virksomhed: ${params.trimmedCompanyName}`,
      `Fornavn: ${params.trimmedFirstName}`,
      `Efternavn: ${params.trimmedLastName}`,
      `E-mail: ${params.trimmedEmail}`,
      `Antal ansatte: ${employeeCount}`,
      `CVR/VAT: ${trimmedVat || "-"}`,
      `Telefon: ${trimmedPhone || "-"}`,
      `Adresse: ${trimmedAddress || "-"}`,
      `Postnr: ${trimmedPostalCode || "-"}`,
      `By: ${trimmedCity || "-"}`,
      `Land: ${trimmedCountry || "-"}`,
      `Kortholder: ${trimmedCardholder || "-"}`,
      `Kortnummer: ${trimmedCardNumber || "-"}`,
      `Udlob: ${trimmedCardExpiry || "-"}`,
      `CVC: ${trimmedCardCvc || "-"}`,
      `Marketing samtykke: ${marketingConsent ? "Ja" : "Nej"}`,
      `Flow trin: ${step}`,
    ].join("\n");

    const res = await fetch("/api/salesbot/support-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        languageCode,
        subject: `Employer signup: ${productLabel}`,
        message: `Ny oprettelsesforesporgsel fra arbejdsgiver:\n\n${details}`,
        name: `${params.trimmedFirstName} ${params.trimmedLastName}`.trim(),
        email: params.trimmedEmail,
      }),
    });
    return (await res.json()) as
      | { ok: true; ticketId: string }
      | { ok: false; error?: string };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const trimmedCompanyName = companyName.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedCompanyName || !trimmedFirstName || !trimmedLastName || !trimmedEmail) {
      setMessage({
        kind: "error",
        text: copy.errorRequiredFieldsStep1,
      });
      return;
    }

    if (!marketingConsent) {
      setMessage({
        kind: "error",
        text: copy.errorConsentRequired,
      });
      return;
    }

    if (step === 1 && product !== "basic") {
      setStep(2);
      return;
    }

    if (step === 2) {
      const trimmedAddress = address.trim();
      const trimmedPostalCode = postalCode.trim();
      const trimmedCity = city.trim();
      const trimmedCountry = country.trim().toUpperCase();
      const trimmedVat = vat.trim();
      const trimmedPhone = phone.trim();
      const trimmedCardholder = cardholderName.trim();
      const trimmedCardNumber = cardNumber.trim();
      const trimmedCardExpiry = cardExpiry.trim();
      const trimmedCardCvc = cardCvc.trim();

      if (
        !trimmedVat ||
        !trimmedPhone ||
        !trimmedAddress ||
        !trimmedPostalCode ||
        !trimmedCity ||
        !trimmedCountry ||
        !trimmedCardholder ||
        !trimmedCardNumber ||
        !trimmedCardExpiry ||
        !trimmedCardCvc
      ) {
        setMessage({
          kind: "error",
          text: copy.errorRequiredFieldsStep2,
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const data = await submitLead({
        trimmedCompanyName,
        trimmedFirstName,
        trimmedLastName,
        trimmedEmail,
      });

      if (!data.ok) {
        setMessage({
          kind: "error",
          text: copy.errorSubmitFailed,
        });
        return;
      }

      setMessage({
        kind: "success",
        text:
          product === "basic"
            ? copy.successBasicTemplate.replace("{ticketId}", data.ticketId)
            : copy.successOtherTemplate.replace("{ticketId}", data.ticketId),
      });
    } catch {
      setMessage({
        kind: "error",
        text: copy.errorNetwork,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          {copy.labelProduct} <span className="text-red-600">*</span>
        </label>
        <select
          required
          value={product}
          onChange={(e) => setProduct(e.target.value as ProductId)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
        >
          {productOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            {copy.labelCompanyName} <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            placeholder={copy.placeholderCompanyName}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            {copy.labelFirstName} <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            placeholder={copy.placeholderFirstName}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            {copy.labelLastName} <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            placeholder={copy.placeholderLastName}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            {copy.labelEmail} <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            placeholder={copy.placeholderEmail}
          />
        </div>

        {step === 2 ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                {copy.labelVat} <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={vat}
                onChange={(e) => setVat(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                {copy.labelPhone} <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                {copy.labelAddress} <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                {copy.labelPostalCode} <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                {copy.labelCity} <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
              />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              {copy.labelCountry} <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            >
              <option value="" disabled>
                {copy.placeholderSelectCountry}
              </option>
              {COUNTRY_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.nativeName}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">{copy.labelEmployeeCount}</label>
          <select
            value={employeeCount}
            onChange={(e) => setEmployeeCount(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
          >
            <option value="1-4">1-4</option>
            <option value="5-20">5-20</option>
            <option value="21-50">21-50</option>
            <option value="51-100">51-100</option>
            <option value="100+">100+</option>
          </select>
        </div>

        {step === 2 ? (
          <div className="sm:col-span-2 rounded-xl border border-[#4A90E2]/25 bg-[#4A90E2]/8 p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  {copy.labelCardholderName} <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                  placeholder={copy.placeholderCardholderName}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  {copy.labelCardNumber} <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                  inputMode="numeric"
                  placeholder={copy.placeholderCardNumber}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  {copy.labelCardExpiry} <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                  placeholder={copy.placeholderCardExpiry}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  {copy.labelCardCvc} <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                  inputMode="numeric"
                  placeholder={copy.placeholderCardCvc}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
        <input
          type="checkbox"
          required
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#4A90E2] focus:ring-[#4A90E2]"
        />
        <span className="text-sm text-zinc-700">
          {copy.marketingConsentText}
        </span>
      </label>

      {message ? (
        <p
          className={`rounded-lg border px-3 py-2 text-sm ${
            message.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step === 2 ? (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            {copy.buttonBack}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={submitting || !marketingConsent}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#4A90E2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3A7FD1] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? copy.buttonSending
            : step === 1
              ? product === "basic"
                ? submitLabel
                : copy.buttonNext
              : product === "basic"
                ? submitLabel
                : startAccountLabel}
        </button>
      </div>
    </form>
  );
}
