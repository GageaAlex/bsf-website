import type { Metadata } from "next";
import StoryPageClient from "./StoryPageClient";

export const metadata: Metadata = {
  title: "Our Story — BS4F",
  description: "The story of Bocconi Students for Fashion.",
  alternates: { canonical: "/about/story" },
};

export default function StoryPage() {
  return <StoryPageClient />;
}
