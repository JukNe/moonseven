const BASE_URL = "https://store.steampowered.com/appreviews";

export type PurchaseType = "all" | "steam" | "non_steam_purchase";

export type AppReviewsQueryParams = {
  cursor?: string;
  num_per_page?: number;
  filter?: "recent" | "updated" | "all";
  language?: string;
  day_range?: number;
  review_type?: "all" | "positive" | "negative";
  purchase_type?: PurchaseType;
  filter_offtopic_activity?: 0 | 1;
};

export type GetAppReviewsOptions = {
  query?: AppReviewsQueryParams;
  timeoutMs?: number;
};

export type GetAllAppReviewsOptions = {
  query?: AppReviewsQueryParams;
  timeoutMs?: number;
  maxPages?: number;
  /**
   * First-request `cursor` only (e.g. `*` or value from a prior response).
   * Not merged with `query.cursor` (pagination uses API responses after the first page).
   */
  startCursor?: string;
};

export type AppReviewsResponse = {
  success?: number;
  query_summary?: Record<string, unknown>;
  reviews?: unknown[];
  cursor?: string;
};

export async function getAppReviews(
  appid: number,
  options: GetAppReviewsOptions = {},
): Promise<AppReviewsResponse> {
  const { query = {}, timeoutMs = 30_000 } = options;
  const params = new URLSearchParams({ json: "1" });
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    params.set(k, String(v));
  }
  const url = `${BASE_URL}/${appid}?${params}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "SteamReviewFetcher/1.0" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return (await res.json()) as AppReviewsResponse;
}

export async function getAllAppReviews(
  appid: number,
  options: GetAllAppReviewsOptions = {},
): Promise<AppReviewsResponse> {
  const {
    query: userQueryRaw = {},
    timeoutMs = 30_000,
    maxPages = 500,
    startCursor,
  } = options;
  const { cursor: _discardCursor, ...userQuery } = userQueryRaw;
  const query: AppReviewsQueryParams = {
    num_per_page: 100,
    filter: "recent",
    language: "all",
    purchase_type: "all",
    ...userQuery,
  };

  let first: AppReviewsResponse | undefined;
  const allReviews: unknown[] = [];
  let paginationCursor: string | undefined = startCursor;
  let lastCursor: string | undefined;
  let pageIndex = 0;

  while (pageIndex < maxPages) {
    const q: AppReviewsQueryParams = { ...query };
    if (paginationCursor) q.cursor = paginationCursor;
    const data = await getAppReviews(appid, { query: q, timeoutMs });
    if (!first) first = data;

    const batch = data.reviews;
    if (!Array.isArray(batch) || batch.length === 0) break;
    allReviews.push(...batch);

    const next = data.cursor;
    if (typeof next !== "string" || !next || next === lastCursor) break;
    lastCursor = next;
    paginationCursor = next;
    pageIndex++;
  }

  return {
    success: first?.success ?? 1,
    query_summary: first?.query_summary,
    reviews: allReviews,
    cursor: lastCursor,
  };
}

type SteamReview = {
  recommendationid?: unknown;
  author?: {
    steamid?: unknown;
    personaname?: unknown;
    profile_url?: unknown;
    playtime_forever?: unknown;
    playtime_at_review?: unknown;
  };
  language?: unknown;
  review?: unknown;
  timestamp_created?: unknown;
  timestamp_updated?: unknown;
  voted_up?: unknown;
  votes_up?: unknown;
  votes_funny?: unknown;
  comment_count?: unknown;
  steam_purchase?: unknown;
};

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const columns: [string, (r: SteamReview) => unknown][] = [
  ["recommendationid", (r) => r.recommendationid],
  ["author_steamid", (r) => r.author?.steamid],
  ["author_personaname", (r) => r.author?.personaname],
  ["author_profile_url", (r) => r.author?.profile_url],
  ["language", (r) => r.language],
  ["review", (r) => r.review],
  ["timestamp_created", (r) => r.timestamp_created],
  ["timestamp_updated", (r) => r.timestamp_updated],
  ["voted_up", (r) => r.voted_up],
  ["votes_up", (r) => r.votes_up],
  ["votes_funny", (r) => r.votes_funny],
  ["comment_count", (r) => r.comment_count],
  ["steam_purchase", (r) => r.steam_purchase],
  ["playtime_forever", (r) => r.author?.playtime_forever],
  ["playtime_at_review", (r) => r.author?.playtime_at_review],
];

export function reviewsResponseToCsv(data: AppReviewsResponse): string {
  const reviews = data.reviews;
  const header = columns.map(([name]) => name).join(",");
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return `${header}\n`;
  }
  const lines = reviews.map((row) => {
    const r = row as SteamReview;
    return columns.map(([, get]) => csvCell(get(r))).join(",");
  });
  return `${header}\n${lines.join("\n")}\n`;
}
