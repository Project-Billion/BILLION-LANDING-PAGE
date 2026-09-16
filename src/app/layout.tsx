import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic, Newsreader } from "next/font/google";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { brand, hero, skipLinkLabel } from "@/content/site";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
  /* Normal only: no italic display text exists, and a preloaded italic face delayed the hero LCP. */
  style: ["normal"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Arabic face for the Proof chat still; Geist has no Arabic glyphs. Below the fold, so not preloaded. */
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500"],
  preload: false,
});

export const metadata: Metadata = {
  title: brand.title,
  description: hero.sub,
  openGraph: {
    title: brand.title,
    description: hero.sub,
    siteName: brand.name,
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#f5f2ec",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${geistSans.variable} ${geistMono.variable} ${plexArabic.variable}`}
    >
      <body>
        <a
          href="#main"
          className="skip-link btn inline-flex min-h-11 items-center rounded-sm bg-ink px-4 text-ui font-medium text-paper"
        >
          {skipLinkLabel}
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
