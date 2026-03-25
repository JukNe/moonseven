import type { AppReviewsQueryParams, PurchaseType } from "./steam-reviews";

const PURCHASE: PurchaseType[] = ["all", "steam", "non_steam_purchase"];

export function isPurchaseType(s: string): s is PurchaseType {
  return PURCHASE.includes(s as PurchaseType);
}

export type ParsedReviewsRequest = {
  query: AppReviewsQueryParams;
  startCursor?: string;
  maxPages: number;
};

const FILTERS = new Set(["recent", "updated", "all"]);
const REVIEW_TYPES = new Set(["all", "positive", "negative"]);

/**
 * Maps posted JSON to Steam Get Reviews query params + pagination options.
 * @see https://partner.steamgames.com/doc/store/getreviews
 */
export function parseReviewsRequestBody(
  b: Record<string, unknown>,
): ParsedReviewsRequest {
  const query: AppReviewsQueryParams = {};
  const maxPagesRaw = Number(b.maxPages);
  const maxPages =
    Number.isFinite(maxPagesRaw) && maxPagesRaw >= 1
      ? Math.min(500, Math.floor(maxPagesRaw))
      : 500;

  if (typeof b.filter === "string" && FILTERS.has(b.filter)) {
    query.filter = b.filter as AppReviewsQueryParams["filter"];
  }

  if (b.dayRange !== undefined && b.dayRange !== "" && b.dayRange !== null) {
    const n = Number(b.dayRange);
    if (Number.isFinite(n) && n >= 1 && n <= 365) {
      query.day_range = Math.floor(n);
    }
  }

  if (
    typeof b.reviewType === "string" &&
    REVIEW_TYPES.has(b.reviewType)
  ) {
    query.review_type = b.reviewType as AppReviewsQueryParams["review_type"];
  }

  if (b.numPerPage !== undefined && b.numPerPage !== "" && b.numPerPage !== null) {
    const n = Number(b.numPerPage);
    if (Number.isFinite(n) && n >= 1 && n <= 100) {
      query.num_per_page = Math.floor(n);
    }
  }

  if (b.filterOfftopic === "include") {
    query.filter_offtopic_activity = 0;
  }

  let startCursor: string | undefined;
  if (typeof b.startCursor === "string" && b.startCursor.trim().length > 0) {
    startCursor = b.startCursor.trim();
  }

  return { query, startCursor, maxPages };
}
