import type { Metadata, Viewport } from "next";
import { Geist_Mono, IBM_Plex_Sans_Arabic, Outfit } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { brand, hero, skipLinkLabel } from "@/content/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Arabic face for the Proof chat still; Outfit has no Arabic glyphs. Below the fold, so not preloaded. */
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
  themeColor: "#121212",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} ${plexArabic.variable}`}
    >
      <body>
        <MotionProvider>
          <a
            href="#main"
            className="skip-link btn inline-flex min-h-11 items-center rounded-sm bg-fg px-4 text-ui font-medium text-bg"
          >
            {skipLinkLabel}
          </a>
          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
