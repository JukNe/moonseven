import { steamMinorToMajor } from "@/lib/steam-currency-format";

const USD_RATES_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json";

const CACHE_MS = 60 * 60 * 1000;

type UsdRates = Map<string, number>;

let cached: { expires: number; rates: UsdRates } | null = null;

function formatUsd(amount: number): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(amount);
  return formatted;
}

/** Units of each currency per 1 USD. Null when the rate feed is unavailable. */
export async function fetchUsdRates(): Promise<UsdRates | null> {
  if (cached && cached.expires > Date.now()) return cached.rates;
  try {
    const res = await fetch(USD_RATES_URL, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return cached?.rates ?? null;
    const json = (await res.json()) as { usd?: Record<string, unknown> };
    const table = json.usd;
    if (!table) return cached?.rates ?? null;
    const rates: UsdRates = new Map();
    for (const [code, value] of Object.entries(table)) {
      if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        rates.set(code, value);
      }
    }
    if (rates.size === 0) return cached?.rates ?? null;
    cached = { expires: Date.now() + CACHE_MS, rates };
    return rates;
  } catch {
    return cached?.rates ?? null;
  }
}

/** Initial Steam price in USD. Regional USD rows are already dollars. */
export function priceToUsd(
  rowCurrency: string,
  minor: number,
  rates: UsdRates | null,
): string | null {
  const steamCurrency = rowCurrency.startsWith("USD") ? "USD" : rowCurrency;
  const major = steamMinorToMajor(steamCurrency, minor);
  if (steamCurrency === "USD") return formatUsd(major);
  const perUsd = rates?.get(steamCurrency.toLowerCase());
  if (!perUsd) return null;
  return formatUsd(major / perUsd);
}
