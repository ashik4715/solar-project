import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar Store - Easy, Efficient, Affordable Solar Solutions",
  description:
    "Get premium residential and commercial solar energy solutions. Free quotes, professional installation, and lifetime support.",
  keywords: "solar energy, solar panels, solar installation, renewable energy",
  openGraph: {
    title: "Solar Store",
    description: "Premium Solar Energy Solutions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
