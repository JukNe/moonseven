const STEAM_APPDETAILS =
  "https://store.steampowered.com/api/appdetails" as const;

export type FetchAppDetailsOptions = {
  appId: number;
  /** Steam store country code (e.g. `us`, `gb`, `fi`). */
  cc?: string;
  /** Comma-separated filters; default `price_overview`. */
  filters?: string;
  timeoutMs?: number;
};

/**
 * @see https://partner.steamgames.com/doc/webapi/ISteamApps (Store front: appdetails)
 * Example: `?appids=3321460&cc=us&filters=price_overview`
 */
export async function fetchAppDetailsPriceOverview(
  options: FetchAppDetailsOptions,
): Promise<unknown> {
  const {
    appId,
    cc = "us",
    filters = "price_overview",
    timeoutMs = 30_000,
  } = options;

  const params = new URLSearchParams();
  params.set("appids", String(appId));
  params.set("cc", cc.toLowerCase());
  params.set("filters", filters);

  const url = `${STEAM_APPDETAILS}?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "MoonSeven/1.0 (+https://moonseven.gg)",
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    throw new Error(`Steam HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<unknown>;
}
