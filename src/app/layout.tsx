import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { paper } from "@/lib/paper";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-serif-display",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(paper.siteUrl),
  alternates: { canonical: "/" },
  title: `${paper.title} — ${paper.author}`,
  description:
    "A LightGBM and XGBoost study showing that static terrain features from 30 m Copernicus DEMs stabilize multi-step water level residual forecasting at NOAA tide stations, an 84.38% RMSE improvement.",
  authors: [{ name: paper.author }],
  keywords: [
    "water level forecasting",
    "residual correction",
    "XGBoost",
    "LightGBM",
    "digital elevation model",
    "NOAA",
    "Copernicus DEM",
    "hydrology",
    "machine learning",
  ],
  openGraph: {
    title: paper.title,
    description:
      "Static terrain features anchor autoregressive water level forecasts — an 84.38% RMSE improvement over a temporal-only baseline.",
    type: "article",
    url: paper.siteUrl,
    siteName: `${paper.journal} · ${paper.volume}`,
    authors: [paper.author],
  },
  twitter: {
    card: "summary_large_image",
    title: paper.title,
    description:
      "Static terrain features anchor autoregressive water level forecasts — an 84.38% RMSE improvement over a temporal-only baseline.",
  },
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} ${serif.variable} ${mono.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
