import type { Metadata } from "next";
import ProfessionalsPageClient from "./ProfessionalsPageClient";

export const metadata: Metadata = {
  title: "For Professionals — BS4F",
  description: "What BS4F members bring to the table — for partners, recruiters, and speakers.",
  alternates: { canonical: "/about/professionals" },
};

export default function ProfessionalsPage() {
  return <ProfessionalsPageClient />;
}
