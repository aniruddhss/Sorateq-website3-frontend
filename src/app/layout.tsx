import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { InitialLoader } from "@/components/InitialLoader";
import { themeInitScript } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorateq | AI-Native Product Studio — Ideas in. Products out.",
  description:
    "Sorateq is an AI-native product and development studio. We design, engineer, and launch modern software products, AI platforms, and SaaS web applications through fast, lean iterations.",
  keywords: [
    "AI studio",
    "SaaS development",
    "MVP development",
    "Next.js engineering",
    "pgvector",
    "AI engineering",
    "product studio",
    "lean software development",
  ],
  authors: [{ name: "Sorateq Studio" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "256x256", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Sorateq | AI-Native Product Studio",
    description: "Ideas in. Products out. We design, engineer, and launch digital products through fast, lean iterations.",
    url: "https://sorateq.com",
    siteName: "Sorateq",
    type: "website",
    images: [
      {
        url: "/sorateq-logo-high.png",
        width: 1312,
        height: 1199,
        alt: "Sorateq Logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col md:flex-row bg-[var(--background)] text-[var(--foreground)] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <InitialLoader />
        <Navigation />
        <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0 pl-0 md:pl-16">{children}</main>
      </body>
    </html>
  );
}
