import type { Metadata } from "next";
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
  title: "LKPS Results",
  description: "LKPS Results",
  authors: [
    {
      name: "Aniruddh",
      url: "https://twitter.com/icantcodefyi",
    },
  ],
  openGraph: {
    title: "LKPS Results",
    description: "LKPS Results",
    images: [
      {
        url: "/og.jpeg",
        width: 1200,
        height: 630,
        alt: "LKPS Results",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LKPS Results",
    description: "LKPS Results",
    creator: "@icantcodefyi",
    images: ["/og.jpeg"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://lkps.ani.ink"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head> */}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
