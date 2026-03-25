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

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "We're working on something exciting. Stay tuned!",
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
