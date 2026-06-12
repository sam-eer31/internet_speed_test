import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpeedTest - Modern Internet Speed Test",
  description:
    "Test your internet speed with precision. Measure download and upload speeds with our beautiful, real-time speed test powered by Next.js.",
  keywords: [
    "speed test",
    "internet speed",
    "bandwidth test",
    "download speed",
    "upload speed",
    "network speed",
    "internet test",
  ],
  authors: [{ name: "SpeedTest" }],
  openGraph: {
    title: "SpeedTest - Modern Internet Speed Test",
    description:
      "Test your internet speed with precision. Beautiful real-time gauge, live charts, and comprehensive quality scoring.",
    type: "website",
    locale: "en_US",
    siteName: "SpeedTest",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedTest - Modern Internet Speed Test",
    description:
      "Test your internet speed with precision. Beautiful real-time gauge, live charts, and comprehensive quality scoring.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050510] text-white font-[var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
