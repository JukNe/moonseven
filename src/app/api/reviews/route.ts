import { NextResponse } from "next/server";
import {
  getAllAppReviews,
  reviewsResponseToCsv,
  type AppReviewsResponse,
  type PurchaseType,
} from "../../../lib/steam-reviews";
import { parseReviewsRequestBody, isPurchaseType } from "../../../lib/reviews-request";

export const maxDuration = 300;

function normalizeLanguages(body: Record<string, unknown>): string[] {
  const raw = body.languages;
  if (Array.isArray(raw)) {
    const list = raw.filter(
      (x): x is string => typeof x === "string" && x.length > 0,
    );
    return [...new Set(list)];
  }
  const single = body.language;
  if (typeof single === "string" && single.length > 0) {
    return [single];
  }
  return ["english"];
}

function mergeUniqueReviews(batches: unknown[][]): unknown[] {
  const seen = new Set<string>();
  const out: unknown[] = [];
  for (const batch of batches) {
    for (const r of batch) {
      if (typeof r !== "object" || r === null) continue;
      const id = (r as { recommendationid?: unknown }).recommendationid;
      const key = id !== undefined && id !== null ? String(id) : "";
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(r);
    }
  }
  return out;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const appId = Number(b.appId);
  const rawPurchase =
    typeof b.purchaseType === "string" ? b.purchaseType : "all";
  let purchaseType: PurchaseType = "all";
  if (isPurchaseType(rawPurchase)) {
    purchaseType = rawPurchase;
  }

  let languages = normalizeLanguages(b);
  if (languages.length === 0) {
    languages = ["english"];
  }
  if (languages.includes("all")) {
    languages = ["all"];
  }

  if (!Number.isInteger(appId) || appId <= 0) {
    return NextResponse.json(
      { error: "Enter a positive integer Steam app ID." },
      { status: 400 },
    );
  }

  const { query: steamQuery, startCursor, maxPages } =
    parseReviewsRequestBody(b);

  try {
    if (languages.length === 1) {
      const data = await getAllAppReviews(appId, {
        query: {
          ...steamQuery,
          language: languages[0],
          purchase_type: purchaseType,
        },
        startCursor,
        maxPages,
      });
      const csv = reviewsResponseToCsv(data);
      return NextResponse.json({ data, csv });
    }

    if (startCursor) {
      return NextResponse.json(
        {
          error:
            "Start cursor is not supported when multiple languages are selected. Use one language or clear the cursor.",
        },
        { status: 400 },
      );
    }

    const results = await Promise.all(
      languages.map((lang) =>
        getAllAppReviews(appId, {
          query: {
            ...steamQuery,
            language: lang,
            purchase_type: purchaseType,
          },
          maxPages,
        }),
      ),
    );

    const mergedReviews = mergeUniqueReviews(
      results.map((r) => (Array.isArray(r.reviews) ? r.reviews : [])),
    );
    const first = results[0];

    const data: AppReviewsResponse & {
      merged_from_languages?: string[];
    } = {
      success: first?.success ?? 1,
      query_summary: {
        total_reviews: mergedReviews.length,
        num_reviews: mergedReviews.length,
        review_score_desc: `${languages.length} languages (merged, deduped)`,
        merged_languages: languages.join(", "),
      },
      reviews: mergedReviews,
      merged_from_languages: languages,
    };

    const csv = reviewsResponseToCsv(data);
    return NextResponse.json({ data, csv });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Fetch failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
