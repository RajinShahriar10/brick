import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "BRICK ÉLITE™ — The World's Most Exclusive Red Brick",
    template: "%s | BRICK ÉLITE",
  },
  description:
    "A single red brick, reimagined. Precision-machined from hand-selected Tuscan clay, kiln-fired for 72 hours at 2,200°F, sealed with a 12-layer nano-ceramic coating, and individually serialized.",
  keywords: ["luxury", "brick", "design", "collectible", "craftsmanship", "italian", "architecture", "premium"],
  authors: [{ name: "BRICK ÉLITE" }],
  creator: "BRICK ÉLITE",
  publisher: "BRICK ÉLITE",
  metadataBase: new URL("https://brick-elite.vercel.app"),
  openGraph: {
    title: "BRICK ÉLITE™ — The World's Most Exclusive Red Brick",
    description:
      "A single red brick, reimagined. Precision-machined from hand-selected Tuscan clay, kiln-fired for 72 hours at 2,200°F.",
    url: "https://brick-elite.vercel.app",
    siteName: "BRICK ÉLITE",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "BRICK ÉLITE — Premium Red Brick",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BRICK ÉLITE™ — The World's Most Exclusive Red Brick",
    description:
      "A single red brick, reimagined. Precision-machined from hand-selected Tuscan clay.",
    images: ["/og.jpg"],
    creator: "@brickelite",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://brick-elite.vercel.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "BRICK ÉLITE™ Original",
  description:
    "A single red brick, reimagined. Precision-machined from hand-selected Tuscan clay, kiln-fired for 72 hours at 2,200°F.",
  brand: {
    "@type": "Brand",
    name: "BRICK ÉLITE",
  },
  offers: {
    "@type": "Offer",
    price: "9999",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "128",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
