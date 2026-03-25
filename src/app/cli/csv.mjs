/** @param {unknown} value */
function csvCell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const columns = [
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

/**
 * Build a CSV string from a Steam `appreviews` JSON response (`reviews` array).
 *
 * @param {Record<string, unknown>} data - Parsed API response with `reviews` array
 * @returns {string}
 */
export function reviewsResponseToCsv(data) {
  const reviews = data?.reviews;
  const header = columns.map(([name]) => name).join(",");
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return `${header}\n`;
  }
  const lines = reviews.map((r) =>
    columns.map(([, get]) => csvCell(get(r))).join(","),
  );
  return `${header}\n${lines.join("\n")}\n`;
}
