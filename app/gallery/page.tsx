import type { Metadata } from "next";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "From Our Cameras — BS4F Gallery",
  description: "BS4F's own photo archive — events, shows, and behind the scenes.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
