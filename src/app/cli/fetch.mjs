#!/usr/bin/env node
/**
 * Simplified runner: English + all purchase types, full pagination.
 * Usage: node cli/fetch.mjs <appid>
 */
import { writeFile } from "node:fs/promises";
import { getAllAppReviews, reviewsResponseToCsv } from "./index.mjs";

const appid = Number(process.argv[2]);
if (!Number.isInteger(appid) || appid <= 0) {
  console.error("Usage: node cli/fetch.mjs <appid>");
  process.exit(1);
}

const data = await getAllAppReviews(appid, {
  query: { language: "english", purchase_type: "all" },
});

const jsonPath = `reviews-${appid}.json`;
const csvPath = `reviews-${appid}.csv`;

await Promise.all([
  writeFile(jsonPath, `${JSON.stringify(data)}\n`, "utf8"),
  writeFile(csvPath, reviewsResponseToCsv(data), "utf8"),
]);

console.error("Wrote", jsonPath, csvPath);
