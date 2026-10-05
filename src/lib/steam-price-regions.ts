/**
 * Representative Steam storefront `cc` (ISO 3166-1 alpha-2) values used to
 * discover {@link https://partner.steamgames.com/doc/store/pricing/currencies | Steam wallet currencies}.
 * Responses are merged by currency. Regional USD prices stay separate rows:
 * `USD`, `USD_CIS`, `USD_LATAM`, `USD_MENA`, and `USD_SASIA`.
 */
const USD_CIS = ["am", "az", "by", "ge", "kg", "md", "tj", "tm", "uz"] as const;
const USD_LATAM = [
  "ar",
  "bo",
  "bz",
  "ec",
  "gt",
  "gy",
  "hn",
  "ni",
  "pa",
  "py",
  "sr",
  "sv",
  "ve",
] as const;
const USD_MENA = [
  "bh",
  "dz",
  "eg",
  "iq",
  "jo",
  "lb",
  "ly",
  "ma",
  "om",
  "ps",
  "sd",
  "tn",
  "tr",
  "ye",
] as const;
const USD_SASIA = ["bd", "bt", "lk", "np", "pk"] as const;

const USD_REGION_BY_CC = new Map<string, string>();
for (const cc of USD_CIS) USD_REGION_BY_CC.set(cc, "USD_CIS");
for (const cc of USD_LATAM) USD_REGION_BY_CC.set(cc, "USD_LATAM");
for (const cc of USD_MENA) USD_REGION_BY_CC.set(cc, "USD_MENA");
for (const cc of USD_SASIA) USD_REGION_BY_CC.set(cc, "USD_SASIA");

/**
 * Row key for a storefront price. Non-USD currencies merge by currency code.
 * USD from a Steam region group is kept as its own price (`USD_CIS`, and so on).
 * Other USD storefronts share the US price and use `USD`.
 */
export function steamPriceRowKey(currency: string, cc: string): string {
  if (currency !== "USD") return currency;
  return USD_REGION_BY_CC.get(cc) ?? "USD";
}
export const STEAM_PRICE_FETCH_CCS: readonly string[] = [
  "us",
  "gb",
  "de",
  "ru",
  "pl",
  "br",
  "tr",
  "au",
  "ca",
  "nz",
  "ch",
  "no",
  "se",
  "dk",
  "cn",
  "jp",
  "kr",
  "in",
  "mx",
  "cl",
  "pe",
  "co",
  "cr",
  "ua",
  "kz",
  "qa",
  "ae",
  "sa",
  "za",
  "id",
  "my",
  "ph",
  "sg",
  "th",
  "vn",
  "tw",
  "hk",
  "il",
  "uy",
  "ar",
  "pk",
  "bd",
  "eg",
  "ng",
  "ke",
  "ma",
  "kw",
  "bh",
  "om",
  "lb",
  "jo",
  "is",
  "rs",
  "ba",
  "ge",
  "am",
  "az",
  "by",
  "md",
  "mn",
  "np",
  "lk",
];
