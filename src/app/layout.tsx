import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fetchSeoForPath } from "@/lib/seo";

const baseMetadata: Metadata = {
  title: "Solar Store",
  description: "Your trusted solar energy solutions provider.",
  keywords: [
    "solar energy",
    "renewable energy",
    "solar panels",
    "installation",
  ],
  authors: [{ name: "Solar Store Team" }],
  icons: {
    icon: "/favicon.ico",
  },
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

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoForPath("/");
  if (!seo) return baseMetadata;

  return {
    ...baseMetadata,
    ...seo,
    openGraph: {
      ...baseMetadata.openGraph,
      ...seo.openGraph,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...seo.twitter,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
