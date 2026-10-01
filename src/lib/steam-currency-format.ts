/**
 * Steam `price_overview.initial` / `final` are integer hundredths for every
 * live store currency (cents, sen, jeon, xu, and so on).
 *
 * Some currencies must be charged in whole major units (increments of at least
 * 100 hundredths), so the store shows them without a fractional part.
 *
 * @see https://partner.steamgames.com/doc/store/pricing/currencies
 */
const WHOLE_UNIT_CURRENCIES = new Set<string>([
  "CLP",
  "COP",
  "CRC",
  "IDR",
  "INR",
  "JPY",
  "KRW",
  "KZT",
  "TWD",
  "UAH",
  "UYU",
  "VND",
]);

function fractionDigitsForCurrency(currency: string): number {
  return WHOLE_UNIT_CURRENCIES.has(currency) ? 0 : 2;
}

/** Convert Steam hundredths to major units (e.g. cents → dollars, sen → yen). */
export function steamMinorToMajor(_currency: string, minor: number): number {
  return minor / 100;
}

/**
 * Decimal string with "," thousands separators and "." as the decimal point.
 * Whole-unit currencies omit the fractional part (e.g. JPY `1,200`).
 */
export function formatSteamPriceDecimal(currency: string, minor: number): string {
  const major = steamMinorToMajor(currency, minor);
  const fd = fractionDigitsForCurrency(currency);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fd,
    maximumFractionDigits: fd,
    useGrouping: true,
  }).format(major);
}
