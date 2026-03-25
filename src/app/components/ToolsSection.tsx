import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";
import Section from "./Section";

export default function ToolsSection() {
  return (
    <Section id="tools" className="bg-white dark:bg-black">
      <RevealOnScroll>
        <h2 className="mb-4 text-4xl font-bold text-black dark:text-zinc-50 md:text-5xl">
          Tools
        </h2>
      </RevealOnScroll>
      <RevealOnScroll delayMs={90}>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-xl">
          Small utilities built for our workflows. Pick a tool below.
        </p>
      </RevealOnScroll>
      <div className="text-left">
        <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          <li>
            <RevealOnScroll delayMs={140}>
              <Link
                href="/tools/steam-reviews"
                className="group block rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/50"
              >
                <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
                  Steam review fetcher
                </h3>
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
            </RevealOnScroll>
          </li>
        </ul>
      </div>
    </Section>
  );
}
