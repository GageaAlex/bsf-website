import type { Metadata } from "next";
import JoinPageClient from "./JoinPageClient";

export const metadata: Metadata = {
  title: "Join Our Team — BS4F",
  description: "How to apply to Bocconi Students for Fashion.",
  alternates: { canonical: "/join" },
};

export default function JoinPage() {
  return <JoinPageClient />;
}
