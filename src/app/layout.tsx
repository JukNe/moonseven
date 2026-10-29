import type { Metadata } from "next";
import { Geist_Mono, Lunasima } from "next/font/google";
import SmoothSectionScroll from "./components/SmoothSectionScroll";
import "./globals.css";

const lunasima = Lunasima({
  variable: "--font-lunasima",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Production URL — used to turn relative image paths into absolute og:image URLs. */
const siteUrl = "https://moonseven.gg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Moon Seven",
    template: "%s · Moon Seven",
  },
  description: "Coming soon… 🌒",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Moon Seven",
    title: "Moon Seven",
    description: "Coming soon… 🌒",
    images: [
      {
        url: "/Moon-Seven-Logo_nws.png",
        alt: "Moon Seven",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon Seven",
    description: "Coming soon… 🌒",
    images: ["/Moon-Seven-Logo_nws.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#fafafa" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('darkMode');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = stored !== null ? stored === 'true' : prefersDark;
                  document.documentElement.classList.toggle('dark', shouldBeDark);
                  const meta = document.querySelector('meta[name="theme-color"]');
                  if (meta) meta.setAttribute('content', shouldBeDark ? '#0a0a0a' : '#fafafa');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${lunasima.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-md focus-visible:bg-white focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-black focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Skip to content
        </a>
        <SmoothSectionScroll />
        {children}
      </body>
    </html>
  );
}
