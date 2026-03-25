// @ts-check
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { reviewsResponseToCsv } from "./csv.mjs";

/**
 * @typedef {Object} AppReviewsQueryParams
 * @property {string} [cursor]
 * @property {number} [num_per_page]
 * @property {"recent"|"updated"|"all"} [filter]
 * @property {string} [language]
 * @property {number} [day_range]
 * @property {"all"|"positive"|"negative"} [review_type]
 * @property {"all"|"steam"|"non_steam_purchase"} [purchase_type]
 * @property {0|1} [filter_offtopic_activity]
 */

/**
 * @typedef {Object} GetAppReviewsOptions
 * @property {AppReviewsQueryParams} [query]
 * @property {number} [timeoutMs]
 */

/**
 * @typedef {Object} GetAllAppReviewsOptions
 * @property {AppReviewsQueryParams} [query]
 * @property {number} [timeoutMs]
 * @property {number} [maxPages]
 */

const BASE_URL = "https://store.steampowered.com/appreviews";

const isMain =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

/**
 * GET https://store.steampowered.com/appreviews/<appid>?json=1
 *
 * @param {number} appid - Steam app ID
 * @param {GetAppReviewsOptions} [options]
 * @returns {Promise<Record<string, unknown>>}
 */
export async function getAppReviews(appid, options = {}) {
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
  return res.json();
}

/**
 * Fetch every page of reviews by following `cursor` until a page returns no reviews.
 * Defaults: `filter=recent`, `num_per_page=100`, `language=all`, `purchase_type=all`.
 * The API alone omits language/purchase_type and behaves like the store “English” +
 * “Steam purchase” slice (~fewer reviews than the store headline). Override via `query`.
 *
 * @param {number} appid
 * @param {GetAllAppReviewsOptions} [options]
 * @returns {Promise<Record<string, unknown>>}
 */
export async function getAllAppReviews(appid, options = {}) {
  const {
    query: userQuery = {},
    timeoutMs = 30_000,
    maxPages = 500,
  } = options;
  /** @type {AppReviewsQueryParams} */
  const query = {
    num_per_page: 100,
    filter: "recent",
    language: "all",
    purchase_type: "all",
    ...userQuery,
  };

  /** @type {Record<string, unknown> | undefined} */
  let first;
  const allReviews = [];
  /** @type {string | undefined} */
  let cursor;
  /** @type {string | undefined} */
  let lastCursor;
  let pageIndex = 0;

  while (pageIndex < maxPages) {
    /** @type {AppReviewsQueryParams} */
    const q = { ...query };
    if (cursor) q.cursor = cursor;
    const data = await getAppReviews(appid, { query: q, timeoutMs });
    if (!first) first = data;

    const batch = data.reviews;
    if (!Array.isArray(batch) || batch.length === 0) break;
    allReviews.push(...batch);

    const next = data.cursor;
    if (typeof next !== "string" || !next || next === lastCursor) break;
    lastCursor = next;
    cursor = next;
    pageIndex++;
  }

  return {
    success: first?.success ?? 1,
    query_summary: first?.query_summary,
    reviews: allReviews,
    cursor: lastCursor,
  };
}

export { reviewsResponseToCsv } from "./csv.mjs";

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
  /** @type {{ pretty: boolean, quiet: boolean, printOnly: boolean, singlePage: boolean, language: string | null, purchaseType: string | null, outJson: string | null, outCsv: string | null, fromJson: string | null, appid: number | null }} */
  const opts = {
    pretty: false,
    quiet: false,
    printOnly: false,
    singlePage: false,
    language: null,
    purchaseType: null,
    outJson: null,
    outCsv: null,
    fromJson: null,
    appid: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--pretty") opts.pretty = true;
    else if (a === "--quiet") opts.quiet = true;
    else if (a === "--print-only") opts.printOnly = true;
    else if (a === "--single-page") opts.singlePage = true;
    else if (a === "--language") opts.language = argv[++i] ?? null;
    else if (a === "--purchase-type") opts.purchaseType = argv[++i] ?? null;
    else if (a === "--out-json") opts.outJson = argv[++i] ?? null;
    else if (a === "--out-csv") opts.outCsv = argv[++i] ?? null;
    else if (a === "--from-json") opts.fromJson = argv[++i] ?? null;
    else if (/^\d+$/.test(a)) opts.appid = Number(a);
    else {
      console.error("Unknown argument:", a);
      process.exit(1);
    }
  }
  return opts;
}

if (isMain) {
  const opts = parseArgs(process.argv);
  if (!opts.fromJson && opts.appid && !opts.printOnly && !opts.outJson) {
    opts.outJson = `reviews-${opts.appid}.json`;
  }

  async function run() {
    /** @type {Record<string, unknown>} */
    let data;

    if (opts.fromJson) {
      const raw = await readFile(opts.fromJson, "utf8");
      data = JSON.parse(raw);
    } else {
      if (!opts.appid || !Number.isInteger(opts.appid) || opts.appid <= 0) {
        console.error(
          "Usage: node cli/index.mjs <appid> [--pretty] [--quiet] [--print-only] [--single-page] [--language <lang>] [--purchase-type <type>] [--out-json <file>] [--out-csv <file>]",
        );
        console.error(
          "       (default: all pages → reviews-<appid>.json; --single-page = one API page only)",
        );
        console.error(
          "       node cli/index.mjs --from-json <saved.json> [--out-csv <file>] [--out-json <file>]",
        );
        process.exit(1);
      }
      /** @type {AppReviewsQueryParams} */
      const q = {};
      if (opts.language) q.language = opts.language;
      if (opts.purchaseType) {
        q.purchase_type = /** @type {AppReviewsQueryParams["purchase_type"]} */ (
          opts.purchaseType
        );
      }
      /** @type {GetAppReviewsOptions | GetAllAppReviewsOptions} */
      const fetchOpts = Object.keys(q).length ? { query: q } : {};
      data = opts.singlePage
        ? await getAppReviews(opts.appid, fetchOpts)
        : await getAllAppReviews(opts.appid, fetchOpts);
    }

    const fileOut = Boolean(opts.outJson || opts.outCsv);
    const tasks = [];
    if (opts.outJson) {
      const json = opts.pretty
        ? `${JSON.stringify(data, null, 2)}\n`
        : `${JSON.stringify(data)}\n`;
      tasks.push(writeFile(opts.outJson, json, "utf8"));
    }
    if (opts.outCsv) {
      tasks.push(writeFile(opts.outCsv, reviewsResponseToCsv(data), "utf8"));
    }
    await Promise.all(tasks);

    if (fileOut && !opts.quiet) {
      if (opts.outJson) console.error("Wrote", opts.outJson);
      if (opts.outCsv) console.error("Wrote", opts.outCsv);
    }
    if (!fileOut) {
      console.log(
        JSON.stringify(data, null, opts.pretty ? 2 : undefined),
      );
    }
  }

  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
