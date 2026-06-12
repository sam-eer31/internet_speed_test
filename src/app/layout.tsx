import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flynk - Internet Speed Test",
  description:
    "Test your internet speed with precision. Measure download and upload speeds with our beautiful, real-time speed test powered by Flynk.",
  keywords: [
    "speed test",
    "internet speed",
    "bandwidth test",
    "download speed",
    "upload speed",
    "network speed",
    "internet test",
    "flynk",
  ],
  authors: [{ name: "Flynk" }],
  openGraph: {
    title: "Flynk - Internet Speed Test",
    description:
      "Test your internet speed with precision. Beautiful real-time gauge, live charts, and comprehensive quality scoring.",
    type: "website",
    locale: "en_US",
    siteName: "Flynk",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flynk - Internet Speed Test",
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
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Prevent FOUC: apply data-theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("speedtest-theme");var r=t==="light"?"light":t==="dark"?"dark":window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",r)}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-[var(--font-inter)]" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
