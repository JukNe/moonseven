/**
 * Steam `price_overview.initial` / `final` are integer minor units for most
 * currencies (e.g. USD cents ÷ 100). Zero-fraction currencies (e.g. JPY) use
 * the integer as the whole amount.
 *
 * @see https://partner.steamgames.com/doc/store/pricing/currencies
 */
const ZERO_FRACTION_DIGITS = new Set<string>([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "ISK",
  "JPY",
  "KMF",
  "KRW",
  "PYG",
  "RWF",
  "UGX",
  "UYI",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
  "COP",
  "CRC",
  "IDR",
  "HUF",
]);

function fractionDigitsForCurrency(currency: string): number {
  return ZERO_FRACTION_DIGITS.has(currency) ? 0 : 2;
}

/** Convert Steam minor units to major units (e.g. cents → dollars). */
export function steamMinorToMajor(currency: string, minor: number): number {
  const fd = fractionDigitsForCurrency(currency);
  if (fd === 0) return minor;
  return minor / 100;
}

/**
 * Decimal string with "," thousands separators and "." as decimal point (en-US).
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
