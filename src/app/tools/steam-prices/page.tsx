"use client";

import { useCallback, useState } from "react";
import Navbar from "@/app/components/Navbar";

const APPDETAILS_EXAMPLE =
  "https://store.steampowered.com/api/appdetails?appids=570&cc=us&filters=price_overview";

type PriceRow = {
  currency: string;
  initial: number;
  final: number;
  initialFormatted: string;
  finalFormatted: string;
  discount_percent: number;
  cc: string;
};

type AllCurrenciesOk = {
  appId: number;
  allCurrencies: true;
  rows: PriceRow[];
  csv: string;
};

export default function SteamPricesPage() {
  const [appId, setAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AllCurrenciesOk | null>(null);

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
        const res = await fetch("/api/prices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appId: id, allCurrencies: true }),
        });
        const payload = (await res.json()) as Record<string, unknown> & {
          error?: string;
        };
        if (!res.ok) {
          setError(
            typeof payload.error === "string"
              ? payload.error
              : `Request failed (${res.status})`,
          );
          return;
        }
        if (typeof payload.error === "string" && payload.error) {
          setError(payload.error);
          return;
        }
        if (
          payload.allCurrencies === true &&
          Array.isArray(payload.rows) &&
          typeof payload.csv === "string"
        ) {
          setResult({
            appId: Number(payload.appId),
            allCurrencies: true,
            rows: payload.rows as PriceRow[],
            csv: payload.csv,
          });
        } else {
          setError("Unexpected response shape.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        setLoading(false);
      }
    },
    [appId],
  );

  const downloadCsv = useCallback(() => {
    if (!result) return;
    const blob = new Blob([result.csv], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `steam-prices-${appId.trim() || "app"}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [result, appId]);

  const downloadJson = useCallback(() => {
    if (!result) return;
    const blob = new Blob(
      [
        JSON.stringify(
          {
            appId: result.appId,
            rows: result.rows.map(
              ({
                currency,
                initial,
                final,
                initialFormatted,
                finalFormatted,
                discount_percent,
              }) => ({
                currency,
                initial: initialFormatted,
                final: finalFormatted,
                initial_minor: initial,
                final_minor: final,
                discount_percent,
              }),
            ),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `steam-prices-${appId.trim() || "app"}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [result, appId]);

  const inputClass =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500";

  return (
    <div className="min-h-screen scroll-smooth bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <main className="px-4 pb-12 pt-20 text-zinc-900 dark:text-zinc-100">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            Steam Store Price
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
            Fetches storefront prices via the public{" "}
            <a
              href={APPDETAILS_EXAMPLE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline decoration-indigo-600/30 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:decoration-indigo-400/30 dark:hover:text-indigo-300"
            >
              appdetails
            </a>{" "}
            endpoint (proxied by{" "}
            <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-xs dark:bg-zinc-800">
              /api/prices
            </code>
            ). The server queries multiple storefront regions, merges by{" "}
            <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-xs dark:bg-zinc-800">
              price_overview.currency
            </code>
            , and returns one row per currency. Prices are formatted as decimals
            with comma thousands separators (e.g.{" "}
            <span className="font-mono">1,234.56</span>); raw Steam minor units
            are still in the JSON as{" "}
            <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-xs dark:bg-zinc-800">
              initial_minor
            </code>{" "}
            /{" "}
            <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-xs dark:bg-zinc-800">
              final_minor
            </code>
            . Free titles may return no rows.
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {loading ? "Fetching all currencies…" : "Fetch all currencies"}
            </button>
            {error ? (
              <p className="text-center text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            ) : null}
          </form>

          {result ? (
            <section className="mt-8 space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
              <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                Results ({result.rows.length} currencies)
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={downloadCsv}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={downloadJson}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Download JSON
                </button>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-500">
                CSV columns:{" "}
                <code className="rounded bg-zinc-200/80 px-1 py-0.5 dark:bg-zinc-800">
                  appid,currency,initial,final,discount_percent
                </code>{" "}
                (<code className="rounded bg-zinc-200/80 px-1 py-0.5 dark:bg-zinc-800">
                  initial
                </code>{" "}
                /{" "}
                <code className="rounded bg-zinc-200/80 px-1 py-0.5 dark:bg-zinc-800">
                  final
                </code>{" "}
                are decimal strings with comma grouping). JSON omits the sample
                region code (<code className="rounded bg-zinc-200/80 px-1 py-0.5 dark:bg-zinc-800">
                  cc
                </code>
                ).
              </p>
              {result.rows.length > 0 ? (
                <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-700">
                  <table className="w-full min-w-[32rem] text-left text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950">
                      <tr>
                        <th className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300">
                          Currency
                        </th>
                        <th className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300">
                          Initial
                        </th>
                        <th className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300">
                          Final
                        </th>
                        <th className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300">
                          Discount %
                        </th>
                        <th className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300">
                          Region (cc)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row) => (
                        <tr
                          key={row.currency}
                          className="border-b border-zinc-100 dark:border-zinc-800"
                        >
                          <td className="px-3 py-2 font-mono text-zinc-900 dark:text-zinc-100">
                            {row.currency}
                          </td>
                          <td className="px-3 py-2 font-mono text-zinc-700 dark:text-zinc-300">
                            {row.initialFormatted}
                          </td>
                          <td className="px-3 py-2 font-mono text-zinc-700 dark:text-zinc-300">
                            {row.finalFormatted}
                          </td>
                          <td className="px-3 py-2 font-mono text-zinc-700 dark:text-zinc-300">
                            {row.discount_percent}
                          </td>
                          <td className="px-3 py-2 font-mono text-zinc-600 dark:text-zinc-400">
                            {row.cc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No paid price data for this app (often free-to-play or
                  unpublished in these regions).
                </p>
              )}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
