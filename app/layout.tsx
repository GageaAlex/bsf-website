import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BS4F — Bocconi Students for Fashion",
  description:
    "The leading fashion association at Bocconi University. Bridging fashion and business through culture, creativity, and community.",
  keywords: ["fashion", "Bocconi", "students", "association", "Milan", "BS4F"],
  openGraph: {
    title: "BS4F — Bocconi Students for Fashion",
    description: "The leading fashion association at Bocconi University.",
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
      <body className="bg-obsidian text-ivory antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
