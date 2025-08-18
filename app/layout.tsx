import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Bookmark Manager",
  description: "A modern, responsive bookmark manager built with Next.js",
  icons: {
    icon: "/cat.png",
  },
  openGraph: {
    title: "Bookmark Manager",
    description: "A modern, responsive bookmark manager built with Next.js",
    url: "https://bm.tubagusnm.com",
    siteName: "Bookmark Manager",
    images: [
      {
        url: "/og-img.png",
        width: 800,
        height: 600,
        alt: "og image",
      },
      {
        url: "/og-img.png",
        width: 1800,
        height: 1600,
        alt: "og image",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
