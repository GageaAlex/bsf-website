import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// This used to be a client-side "CMS" gated by a password shipped in the
// browser bundle, whose Save buttons didn't persist anything at all (no
// fetch/API call — the fields just reset). That's an unfinished admin tool
// exposed publicly, which is exactly what it shouldn't be. Articles and
// events already have a real, working, server-authorized authoring flow at
// /dashboard. Members/alumni/gallery are plain data files edited via the
// repo (see README.md "How to Add Content") — there's no missing capability
// here to half-fix, so this route is now just a signed-in-only pointer to
// where content actually gets edited, instead of a fake tool.
export const metadata: Metadata = { title: "Admin — BS4F", robots: { index: false } };

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-3xl text-ivory mb-4">Admin</p>
        <p className="text-ivory/60 text-sm font-sans leading-relaxed mb-8">
          Articles and events are published from your own dashboard. Members, alumni, and gallery
          content live in versioned data files and are updated directly in the repository — see{" "}
          <code className="text-ivory/80 text-xs">README.md</code> for the exact fields.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-ember hover:bg-ember-light text-ivory px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300"
        >
          Go to Dashboard →
        </Link>
      </div>
    </div>
  );
}
