import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar Store",
  description: "Your trusted solar energy solutions provider.",
  keywords: [
    "solar energy",
    "renewable energy",
    "solar panels",
    "installation",
  ],
  authors: [{ name: "Solar Store Team" }],
  openGraph: {
    title: "Solar Store",
    description: "Your trusted solar energy solutions provider.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Store",
    description: "Your trusted solar energy solutions provider.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style>{`
          body {
            transition: opacity ease-in 0.2s;
          }
          body[unresolved] {
            opacity: 0;
            display: block;
            overflow: hidden;
            position: relative;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
