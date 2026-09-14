import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "BS4F — Bocconi Students for Fashion",
  description:
    "Bocconi Students for Fashion: editorials, events, and the people bridging fashion and business in Milan.",
  alternates: { canonical: "/home" },
};

export default function HomePage() {
  return <HomePageClient />;
}
