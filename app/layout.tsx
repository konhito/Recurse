import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recurse - Master LeetCode with Spaced Repetition",
  description: "Smart spaced repetition system for LeetCode interview prep. Automatically sync your solutions and review them at scientifically-optimized intervals. Never forget a pattern again.",
  keywords: ["leetcode", "spaced repetition", "interview prep", "coding interview", "algorithm practice", "technical interview", "software engineer", "programming practice"],
  authors: [{ name: "konhito" }],
  creator: "konhito",
  publisher: "Recurse",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://recurse.app",
    siteName: "Recurse",
    title: "Recurse - Master LeetCode with Spaced Repetition",
    description: "Smart spaced repetition system for LeetCode interview prep. Automatically sync your solutions and review them at scientifically-optimized intervals.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Recurse - Spaced Repetition for LeetCode",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Recurse - Master LeetCode with Spaced Repetition",
    description: "Smart spaced repetition system for LeetCode interview prep. Never forget a pattern again.",
    creator: "@konhito",
    images: ["/og-image.png"],
  },

  // Additional Meta
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Manifest
  manifest: "/site.webmanifest",

  // Theme
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3d4f5c" },
    { media: "(prefers-color-scheme: dark)", color: "#2d4f56" },
  ],

  // Verification (add your own codes)
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-zinc-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
