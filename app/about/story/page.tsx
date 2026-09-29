import type { Metadata } from "next";
import StoryPageClient from "./StoryPageClient";

export const metadata: Metadata = {
  title: "About Us — BS4F",
  description:
    "Bocconi Students For Fashion was founded in 2013 to bring students closer to their passion and professional aspirations in fashion and luxury.",
  alternates: { canonical: "/about/story" },
};

export default function StoryPage() {
  return <StoryPageClient />;
}
