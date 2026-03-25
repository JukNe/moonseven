"use client";

import { useCallback, useState } from "react";
import {
  FILTER_OPTIONS,
  LANGUAGE_OPTIONS,
  OFFTOPIC_FILTER_OPTIONS,
  PURCHASE_TYPE_OPTIONS,
  REVIEW_TYPE_OPTIONS,
} from "@/lib/form-options";
import { LanguageMultiSelect } from "@/app/components/LanguageMultiSelect";
import Navbar from "@/app/components/Navbar";

type ApiOk = {
  data: Record<string, unknown>;
  csv: string;
};

const DOCS_URL = "https://partner.steamgames.com/doc/store/getreviews";

export default function SteamReviewsPage() {
  const [appId, setAppId] = useState("");
  const [languages, setLanguages] = useState<string[]>(["english"]);
  const [purchaseType, setPurchaseType] = useState("all");
  const [filter, setFilter] = useState("recent");
  const [dayRange, setDayRange] = useState("");
  const [reviewType, setReviewType] = useState("all");
  const [numPerPage, setNumPerPage] = useState("");
  const [filterOfftopic, setFilterOfftopic] = useState("default");
  const [startCursor, setStartCursor] = useState("");
  const [maxPages, setMaxPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiOk | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setResult(null);
      const id = Number(appId.trim());
      if (!Number.isInteger(id) || id <= 0) {
        setError("Enter a positive integer app ID.");
        return;
      }
      setLoading(true);
      try {
        const body: Record<string, unknown> = {
          appId: id,
          languages,
          purchaseType,
          filter,
          reviewType,
          filterOfftopic,
        };
        if (dayRange.trim() !== "") {
          const d = Number(dayRange.trim());
          if (Number.isFinite(d)) body.dayRange = d;
        }
        if (numPerPage.trim() !== "") {
          const n = Number(numPerPage.trim());
          if (Number.isFinite(n)) body.numPerPage = n;
        }
        if (startCursor.trim() !== "") {
          body.startCursor = startCursor.trim();
        }
        if (maxPages.trim() !== "") {
          const m = Number(maxPages.trim());
          if (Number.isFinite(m)) body.maxPages = m;
        }

        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const payload = (await res.json()) as ApiOk & { error?: string };
        if (!res.ok) {
          setError(payload.error ?? `Request failed (${res.status})`);
          return;
        }
        if ("error" in payload && payload.error) {
          setError(payload.error);
          return;
        }
        setResult({ data: payload.data, csv: payload.csv });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        setLoading(false);
      }
    },
    [
      appId,
      languages,
      purchaseType,
      filter,
      dayRange,
      reviewType,
      numPerPage,
      filterOfftopic,
      startCursor,
      maxPages,
    ],
  );

  const downloadJson = useCallback(() => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result.data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `reviews-${appId.trim() || "app"}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [result, appId]);

  const downloadCsv = useCallback(() => {
    if (!result) return;
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `reviews-${appId.trim() || "app"}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [result, appId]);

  const summary = result?.data.query_summary as
    | Record<string, unknown>
    | undefined;
  const reviews = result?.data.reviews as unknown[] | undefined;
  const mergedFrom = result?.data.merged_from_languages as
    | string[]
    | undefined;
  const hasSummary = summary && typeof summary === "object";

  const inputClass =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500";
  const selectClass = `${inputClass} cursor-pointer`;

  return (
    <div className="min-h-screen scroll-smooth bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <main className="px-4 pb-12 pt-20 text-zinc-900 dark:text-zinc-100">
        <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
          Steam Review Fetcher
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          Fetches reviews via the Steam{" "}
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline decoration-indigo-600/30 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:decoration-indigo-400/30 dark:hover:text-indigo-300"
          >
            Get Reviews
          </a>{" "}
          API (server-side). Pick languages (merged when multiple), purchase
          type, and optional advanced parameters.
        </p>

        <form
          className="mt-8 space-y-5 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
          onSubmit={onSubmit}
        >
          <div>
            <label
              htmlFor="appId"
              className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
            >
              Steam app ID
            </label>
            <input
              id="appId"
              name="appId"
              type="text"
              inputMode="numeric"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              autoComplete="off"
              className={inputClass}
            />
          </div>
          <div>
            <LanguageMultiSelect
              id="languages"
              label="Languages"
              options={LANGUAGE_OPTIONS}
              value={languages}
              onChange={setLanguages}
            />
          </div>
          <div>
            <label
              htmlFor="purchaseType"
              className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
            >
              Purchase type
            </label>
            <select
              id="purchaseType"
              name="purchaseType"
              value={purchaseType}
              onChange={(e) => setPurchaseType(e.target.value)}
              className={selectClass}
            >
              {PURCHASE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-white dark:bg-zinc-950">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <details className="group rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3 text-sm text-zinc-700 select-none dark:text-zinc-300">
              <span className="inline-block text-zinc-500 transition-transform duration-200 group-open:rotate-90 dark:text-zinc-400">
                ▸
              </span>
              Advanced API parameters
            </summary>
            <div className="space-y-4 border-t border-zinc-200 px-3 pb-4 pt-3 dark:border-zinc-700">
              <div>
                <label
                  htmlFor="filter"
                  className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Filter (sort / paging)
                </label>
                <select
                  id="filter"
                  name="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={selectClass}
                >
                  {FILTER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-white dark:bg-zinc-950">
                      {o.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-500">
                  Use <strong className="text-zinc-800 dark:text-zinc-300">recent</strong> or{" "}
                  <strong className="text-zinc-800 dark:text-zinc-300">updated</strong> when walking
                  all pages with cursors.{" "}
                  <strong className="text-zinc-800 dark:text-zinc-300">all</strong> uses helpfulness
                  and can use day range below.
                </p>
              </div>
              <div>
                <label
                  htmlFor="dayRange"
                  className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Day range
                </label>
                <input
                  id="dayRange"
                  name="dayRange"
                  type="number"
                  min={1}
                  max={365}
                  placeholder="1–365 (only applies when filter is “all”)"
                  value={dayRange}
                  onChange={(e) => setDayRange(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="reviewType"
                  className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Review type
                </label>
                <select
                  id="reviewType"
                  name="reviewType"
                  value={reviewType}
                  onChange={(e) => setReviewType(e.target.value)}
                  className={selectClass}
                >
                  {REVIEW_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-white dark:bg-zinc-950">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="numPerPage"
                  className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Reviews per page (num_per_page)
                </label>
                <input
                  id="numPerPage"
                  name="numPerPage"
                  type="number"
                  min={1}
                  max={100}
                  placeholder="Default 100 (max 100)"
                  value={numPerPage}
                  onChange={(e) => setNumPerPage(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="filterOfftopic"
                  className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Off-topic / review bombs
                </label>
                <select
                  id="filterOfftopic"
                  name="filterOfftopic"
                  value={filterOfftopic}
                  onChange={(e) => setFilterOfftopic(e.target.value)}
                  className={selectClass}
                >
                  {OFFTOPIC_FILTER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-white dark:bg-zinc-950">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="startCursor"
                  className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Start cursor (optional)
                </label>
                <input
                  id="startCursor"
                  name="startCursor"
                  type="text"
                  placeholder="First page: often * — or paste cursor from a prior response"
                  value={startCursor}
                  onChange={(e) => setStartCursor(e.target.value)}
                  autoComplete="off"
                  className={inputClass}
                />
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-500">
                  Not used when multiple languages are selected.
                </p>
              </div>
              <div>
                <label
                  htmlFor="maxPages"
                  className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Max pages (safety cap)
                </label>
                <input
                  id="maxPages"
                  name="maxPages"
                  type="number"
                  min={1}
                  max={500}
                  placeholder="500 (default)"
                  value={maxPages}
                  onChange={(e) => setMaxPages(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </details>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {loading ? "Fetching…" : "Fetch reviews"}
          </button>
          {error ? (
            <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : null}
        </form>

        {result ? (
          <section className="mt-8 space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
              Results
            </h2>
            {mergedFrom && mergedFrom.length > 1 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Merged languages:{" "}
                <strong className="text-zinc-900 dark:text-zinc-200">
                  {mergedFrom.join(", ")}
                </strong>{" "}
                (reviews deduped by ID)
              </p>
            ) : null}
            {hasSummary ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                  <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                    Total reviews (filter)
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {String(summary?.total_reviews ?? "—")}
                  </span>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                  <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                    Score label
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {String(summary?.review_score_desc ?? "—")}
                  </span>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                  <span className="block text-xs text-zinc-600 dark:text-zinc-400">Positive</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {String(summary?.total_positive ?? "—")}
                  </span>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                  <span className="block text-xs text-zinc-600 dark:text-zinc-400">Negative</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {String(summary?.total_negative ?? "—")}
                  </span>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 sm:col-span-2">
                  <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                    Rows fetched
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {reviews?.length ?? 0}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Rows fetched: {reviews?.length ?? 0}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadJson}
                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Download JSON
              </button>
              <button
                type="button"
                onClick={downloadCsv}
                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Download CSV
              </button>
            </div>
            <pre className="max-h-[min(24rem,50vh)] overflow-auto rounded-md border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              {JSON.stringify(result.data, null, 2).slice(0, 12000)}
              {JSON.stringify(result.data, null, 2).length > 12000
                ? "\n… (truncated in preview)"
                : ""}
            </pre>
          </section>
        ) : null}
        </div>
      </main>
    </div>
  );
}
