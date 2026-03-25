import Link from "next/link";
import Navbar from "../components/Navbar";

export default function ToolsPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <main className="px-4 pb-16 pt-20 text-zinc-900 dark:text-zinc-100">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">
            Tools
          </h1>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            <li>
              <Link
                href="/tools/steam-reviews"
                className="group block rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/50"
              >
                <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
                  Steam Review Fetcher
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Download Steam store reviews for an app via the Get Reviews
                  API—filter by language, purchase type, and more.
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Open tool
                  <span
                    className="ml-1 transition group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/tools/steam-prices"
                className="group block rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/50"
              >
                <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
                  Steam Store Price
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Fetch merged storefront prices across regions and download CSV
                  (app ID, currency, and Steam minor-unit prices).
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Open tool
                  <span
                    className="ml-1 transition group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
