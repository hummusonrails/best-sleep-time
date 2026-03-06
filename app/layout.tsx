import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, JetBrains_Mono, Inter } from "next/font/google";
import { I18nProvider } from "best-time-ui";
import { translations } from "@/lib/i18n";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bestsleepingtime.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Best Sleep Time",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
  title: {
    default: "Best Sleep Time | הזמן הטוב לשינה",
    template: "%s | Best Sleep Time",
  },
  description:
    "Real-time safety app for Israelis — analyzes Pikud HaOref rocket alert data to recommend the safest times to nap or sleep. Stay informed, stay safe.",
  keywords: [
    "rocket alerts",
    "Israel safety",
    "Pikud HaOref",
    "פיקוד העורף",
    "best sleep time",
    "הזמן הטוב לשינה",
    "real-time alerts",
    "צבע אדום",
    "alert analysis",
    "safe time to sleep",
    "nap safety",
    "Iron Dome",
    "כיפת ברזל",
  ],
  authors: [
    {
      name: "Ben Greenberg",
      url: "https://www.hummusonrails.com/",
    },
  ],
  creator: "Ben Greenberg",
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
  openGraph: {
    title: "Best Sleep Time | הזמן הטוב לשינה",
    description:
      "Is it safe to sleep right now? Real-time rocket alert analysis for Israelis — powered by Pikud HaOref data.",
    siteName: "Best Sleep Time",
    locale: "en_US",
    type: "website",
    url: "https://bestsleepingtime.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Sleep Time | הזמן הטוב לשינה",
    description:
      "Is it safe to sleep right now? Real-time rocket alert analysis for Israelis.",
  },
  alternates: {
    languages: {
      "en": "/",
      "he": "/",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1E1E1C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${cormorant.variable} ${jetbrains.variable} ${inter.variable} antialiased`}
      >
        <I18nProvider translations={translations} storageKey="bslt-lang">
          {children}
        </I18nProvider>
        <ServiceWorkerRegistration />
        {/* GoatCounter — replace with your script tag */}
        <Script
          data-goatcounter="https://bestsleepingtime.goatcounter.com/count"
          src="//gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
