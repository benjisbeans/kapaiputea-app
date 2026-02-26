import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ka Pai Pūtea | Financial Literacy for Young Kiwis",
    template: "%s | Ka Pai Pūtea",
  },
  description:
    "Learn money skills that actually matter. Free gamified financial education built for NZ secondary school students — budgeting, KiwiSaver, tax, credit scores and more.",
  keywords: [
    "financial literacy",
    "New Zealand",
    "NZ students",
    "money skills",
    "KiwiSaver",
    "budgeting",
    "gamified learning",
    "secondary school",
    "financial education",
    "Ka Pai Pūtea",
  ],
  authors: [{ name: "Ka Pai Pūtea" }],
  creator: "Ka Pai Pūtea",
  metadataBase: new URL("https://kapaiputea.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ka Pai Pūtea | Financial Literacy for Young Kiwis",
    description:
      "Learn money skills that actually matter. Free gamified financial education built for NZ secondary school students.",
    url: "https://kapaiputea.com",
    siteName: "Ka Pai Pūtea",
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ka Pai Pūtea | Financial Literacy for Young Kiwis",
    description:
      "Learn money skills that actually matter. Free gamified financial education built for NZ secondary school students.",
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ka Pai Pūtea",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FDE047",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")})}`,
          }}
        />
      </body>
    </html>
  );
}
