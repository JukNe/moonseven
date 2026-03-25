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
  description: "Coming soon... 🌒",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Moon Seven",
    title: "Moon Seven",
    description: "Coming soon... 🌒",
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
    description: "Coming soon... 🌒",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('darkMode');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = stored !== null ? stored === 'true' : prefersDark;
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${lunasima.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <SmoothSectionScroll />
        {children}
      </body>
    </html>
  );
}
