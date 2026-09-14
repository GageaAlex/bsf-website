import type { Metadata } from "next";
import BoardPageClient from "./BoardPageClient";

export const metadata: Metadata = {
  title: "Meet the Team — BS4F",
  description: "The board and teams behind Bocconi Students for Fashion.",
  alternates: { canonical: "/about/board" },
};

export default function BoardPage() {
  return <BoardPageClient />;
}
