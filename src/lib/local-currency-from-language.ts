/**
 * Maps UI language to a local billing hint currency when unambiguous.
 * EUR-zone languages return null (no redundant conversion shown).
 * en-US shows USD only.
 * Rates are indicative for display only — list prices remain in EUR.
 */
type LocalCurrencyConfig = {
  code: string;
  locale: string;
  eurRate: number;
  maximumFractionDigits?: number;
};

const LANGUAGE_LOCAL_CURRENCY: Record<string, LocalCurrencyConfig> = {
  "en-US": { code: "USD", locale: "en-US", eurRate: 1.08 },
  da: { code: "DKK", locale: "da-DK", eurRate: 7.46 },
  sv: { code: "SEK", locale: "sv-SE", eurRate: 11.35 },
  cs: { code: "CZK", locale: "cs-CZ", eurRate: 25.2 },
  pl: { code: "PLN", locale: "pl-PL", eurRate: 4.32 },
  hu: { code: "HUF", locale: "hu-HU", eurRate: 395, maximumFractionDigits: 0 },
  ro: { code: "RON", locale: "ro-RO", eurRate: 4.97 },
  bg: { code: "BGN", locale: "bg-BG", eurRate: 1.96 },
};

function resolveLocalCurrency(
  languageCode: string | null | undefined
): LocalCurrencyConfig | null {
  if (languageCode == null) return null;

  const normalized = languageCode.trim();
  if (!normalized) return null;

  const direct = LANGUAGE_LOCAL_CURRENCY[normalized];
  if (direct) return direct;

  const primary = normalized.split("-")[0]?.toLowerCase();
  if (!primary) return null;

  return LANGUAGE_LOCAL_CURRENCY[primary] ?? null;
}

export function formatLocalPriceHint(
  eurAmount: number,
  languageCode: string | null | undefined
): string | null {
  if (!Number.isFinite(eurAmount) || eurAmount <= 0) return null;

  const currency = resolveLocalCurrency(languageCode);
  if (!currency) return null;

  const localAmount = eurAmount * currency.eurRate;
  const formatted = new Intl.NumberFormat(currency.locale, {
    minimumFractionDigits: currency.maximumFractionDigits === 0 ? 0 : 2,
    maximumFractionDigits: currency.maximumFractionDigits ?? 2,
  }).format(localAmount);

  return `(${formatted} ${currency.code})`;
}
