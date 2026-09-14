import type { Metadata } from "next";
import AlumniPageClient from "./AlumniPageClient";

export const metadata: Metadata = {
  title: "Alumni — BS4F",
  description: "Where BS4F alumni have gone since graduating.",
  alternates: { canonical: "/about/alumni" },
};

export default function AlumniPage() {
  return <AlumniPageClient />;
}
