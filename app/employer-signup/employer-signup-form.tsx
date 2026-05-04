"use client";

import { useEffect, useMemo, useState } from "react";

type ProductId = "basic" | "pro_planner" | "hybrid_app" | "autopilot";

type EmployerSignupFormProps = {
  initialProduct: ProductId;
};

type MessageState = { kind: "success" | "error"; text: string } | null;

const PRODUCT_OPTIONS: Array<{ id: ProductId; label: string }> = [
  { id: "basic", label: "Basic (gratis)" },
  { id: "pro_planner", label: "Pro Planner" },
  { id: "hybrid_app", label: "Hybrid App" },
  { id: "autopilot", label: "Autopilot" },
];

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
  if (product === "basic") return "Hent Excel vagtplan";
  return "Opret virksomhed";
}

export function EmployerSignupForm({ initialProduct }: EmployerSignupFormProps) {
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

  const submitLabel = useMemo(() => submitLabelFor(product), [product]);
  const productLabel = useMemo(
    () => PRODUCT_OPTIONS.find((p) => p.id === product)?.label ?? "Basic",
    [product]
  );

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
        languageCode: "da",
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
        text: "Udfyld venligst alle obligatoriske felter.",
      });
      return;
    }

    if (!marketingConsent) {
      setMessage({
        kind: "error",
        text: "Du skal acceptere markedsforingsmail for at fortsaette.",
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
          text: "Udfyld venligst alle felter i trin 2.",
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
          text:
            "Kunne ikke oprette foresporgslen lige nu. Prov igen om et ojeblik.",
        });
        return;
      }

      setMessage({
        kind: "success",
        text:
          product === "basic"
            ? `Tak! Vi har oprettet din anmodning (${data.ticketId}). Download-trinnet kobles paa snart.`
            : `Tak! Vi har modtaget din oprettelse (${data.ticketId}). Vi kontakter dig hurtigst muligt.`,
      });
    } catch {
      setMessage({
        kind: "error",
        text: "Netvaerksfejl. Tjek forbindelsen og prov igen.",
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
          Produkt <span className="text-red-600">*</span>
        </label>
        <select
          required
          value={product}
          onChange={(e) => setProduct(e.target.value as ProductId)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
        >
          {PRODUCT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Virksomhedsnavn <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            placeholder="Fx Cafe Solsiden ApS"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Fornavn <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            placeholder="Fornavn"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Efternavn <span className="text-red-600">*</span>
          </label>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            placeholder="Efternavn"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            E-mail <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            placeholder="navn@virksomhed.dk"
          />
        </div>

        {step === 2 ? (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                CVR / VAT <span className="text-red-600">*</span>
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
                Telefon <span className="text-red-600">*</span>
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
                Adresse <span className="text-red-600">*</span>
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
                Postnr. <span className="text-red-600">*</span>
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
                By <span className="text-red-600">*</span>
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
              Land <span className="text-red-600">*</span>
            </label>
            <select
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
            >
              <option value="" disabled>
                Vælg land
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
          <label className="mb-1 block text-sm font-medium text-zinc-700">Antal ansatte</label>
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
          <>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Kortholders navn <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                placeholder="Navn paa kort"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Kortnummer <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Udlob (MM/AA) <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                placeholder="MM/AA"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                CVC <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
                inputMode="numeric"
                placeholder="123"
              />
            </div>
          </>
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
          Ved at bestille, så accepterer du at ShiftBob må sende
          markedsføringsmail. Det kan til enhver tid afmeldes.
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
            Tilbage
          </button>
        ) : null}
        <button
          type="submit"
          disabled={submitting || !marketingConsent}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#4A90E2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3A7FD1] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Sender..."
            : step === 1
              ? product === "basic"
                ? submitLabel
                : "Videre"
              : submitLabel}
        </button>
      </div>
    </form>
  );
}
