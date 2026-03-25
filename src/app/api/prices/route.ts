import { NextResponse } from "next/server";
import { formatSteamPriceDecimal } from "@/lib/steam-currency-format";
import { fetchAppDetailsPriceOverview } from "@/lib/steam-store";
import { STEAM_PRICE_FETCH_CCS } from "@/lib/steam-price-regions";

export const maxDuration = 120;

type SteamPriceRow = {
  currency: string;
  /** Steam minor units (integer). */
  initial: number;
  final: number;
  /** Formatted decimals with "," thousands separators (en-US). */
  initialFormatted: string;
  finalFormatted: string;
  discount_percent: number;
  cc: string;
};

function parseAppId(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

function parseCc(value: unknown): string {
  if (typeof value !== "string" || value.length < 2) return "us";
  return value.slice(0, 2).toLowerCase();
}

function parseFilters(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return "price_overview";
}

type SteamAppDetailsEntry = {
  success?: boolean;
  data?: unknown;
};

function unwrapAppDetails(
  json: unknown,
  appId: number,
): { ok: true; data: unknown } | { ok: false; message: string } {
  if (typeof json !== "object" || json === null) {
    return { ok: false, message: "Unexpected Steam response." };
  }
  const record = json as Record<string, unknown>;
  const key = String(appId);
  const entry = record[key] as SteamAppDetailsEntry | undefined;
  if (!entry || typeof entry !== "object") {
    return { ok: false, message: "No data for this app ID in Steam response." };
  }
  if (entry.success !== true) {
    return {
      ok: false,
      message: "App not found or not available on the Steam Store.",
    };
  }
  return { ok: true, data: entry.data ?? null };
}

function parsePriceOverview(data: unknown): {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
} | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  const po = d.price_overview;
  if (typeof po !== "object" || po === null) return null;
  const p = po as Record<string, unknown>;
  const currency = p.currency;
  if (typeof currency !== "string") return null;
  return {
    currency,
    initial: Number(p.initial ?? 0),
    final: Number(p.final ?? 0),
    discount_percent: Number(p.discount_percent ?? 0),
  };
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function buildPricesCsv(appId: number, rows: SteamPriceRow[]): string {
  const header = "appid,currency,initial,final,discount_percent";
  const lines = [header];
  for (const r of rows) {
    lines.push(
      [
        String(appId),
        escapeCsvCell(r.currency),
        escapeCsvCell(r.initialFormatted),
        escapeCsvCell(r.finalFormatted),
        String(r.discount_percent),
      ].join(","),
    );
  }
  return lines.join("\n");
}

const BATCH_SIZE = 8;

async function fetchAllCurrencyPrices(appId: number): Promise<{
  rows: SteamPriceRow[];
  csv: string;
}> {
  const byCurrency = new Map<string, SteamPriceRow>();

  for (let i = 0; i < STEAM_PRICE_FETCH_CCS.length; i += BATCH_SIZE) {
    const batch = STEAM_PRICE_FETCH_CCS.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (cc) => {
        try {
          const raw = await fetchAppDetailsPriceOverview({
            appId,
            cc,
            filters: "price_overview",
          });
          const unwrapped = unwrapAppDetails(raw, appId);
          if (!unwrapped.ok) return;
          const parsed = parsePriceOverview(unwrapped.data);
          if (!parsed) return;
          if (!byCurrency.has(parsed.currency)) {
            const cur = parsed.currency;
            byCurrency.set(cur, {
              currency: cur,
              initial: parsed.initial,
              final: parsed.final,
              initialFormatted: formatSteamPriceDecimal(cur, parsed.initial),
              finalFormatted: formatSteamPriceDecimal(cur, parsed.final),
              discount_percent: parsed.discount_percent,
              cc,
            });
          }
        } catch {
          /* ignore per-region failures */
        }
      }),
    );
  }

  const rows = [...byCurrency.values()].sort((a, b) =>
    a.currency.localeCompare(b.currency),
  );
  return { rows, csv: buildPricesCsv(appId, rows) };
}

/**
 * POST JSON:
 * - `{ "appId": 570, "allCurrencies": true }` — fetch storefront prices for every
 *   discovered currency (merged from multiple `cc` regions), returns `rows` + `csv`.
 * - `{ "appId": 570, "cc": "us", "filters": "price_overview" }` — single-region
 *   mirror of Steam appdetails.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const appId = parseAppId(b.appId);
  if (appId === null) {
    return NextResponse.json(
      { error: "Enter a positive integer Steam app ID." },
      { status: 400 },
    );
  }

  if (b.allCurrencies === true) {
    try {
      const { rows, csv } = await fetchAllCurrencyPrices(appId);
      return NextResponse.json({
        appId,
        allCurrencies: true,
        rows,
        csv,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Fetch failed";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  const cc = parseCc(b.cc);
  const filters = parseFilters(b.filters);

  try {
    const raw = await fetchAppDetailsPriceOverview({ appId, cc, filters });
    const unwrapped = unwrapAppDetails(raw, appId);
    if (!unwrapped.ok) {
      return NextResponse.json({ error: unwrapped.message }, { status: 404 });
    }
    return NextResponse.json({
      appId,
      cc,
      filters,
      data: unwrapped.data,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Fetch failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

/**
 * GET query:
 * - `?appids=570&allCurrencies=1` — same as POST all-currencies.
 * - `?appids=570&cc=us&filters=price_overview` — single-region.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const appId = parseAppId(
    searchParams.get("appids") ?? searchParams.get("appId"),
  );
  if (appId === null) {
    return NextResponse.json(
      {
        error:
          "Missing or invalid app ID. Use ?appids=3321460 (or appId=3321460).",
      },
      { status: 400 },
    );
  }

  const allFlag =
    searchParams.get("allCurrencies") || searchParams.get("all");
  if (
    allFlag === "1" ||
    allFlag === "true" ||
    allFlag?.toLowerCase() === "yes"
  ) {
    try {
      const { rows, csv } = await fetchAllCurrencyPrices(appId);
      return NextResponse.json({
        appId,
        allCurrencies: true,
        rows,
        csv,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Fetch failed";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  const cc = parseCc(searchParams.get("cc"));
  const filters = parseFilters(searchParams.get("filters"));

  try {
    const raw = await fetchAppDetailsPriceOverview({ appId, cc, filters });
    const unwrapped = unwrapAppDetails(raw, appId);
    if (!unwrapped.ok) {
      return NextResponse.json({ error: unwrapped.message }, { status: 404 });
    }
    return NextResponse.json({
      appId,
      cc,
      filters,
      data: unwrapped.data,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Fetch failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
