"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { MemberArticle } from "@/types/member-article";

function StatusBadge({ status }: { status: MemberArticle["status"] }) {
  return (
    <span
      className={`text-2xs tracking-editorial uppercase font-sans px-2.5 py-1 border ${
        status === "published"
          ? "text-ember border-ember/40"
          : "text-muted border-white/15"
      }`}
    >
      {status}
    </span>
  );
}

export default function DashboardClient({
  articles,
  displayName,
}: {
  articles: MemberArticle[];
  displayName: string;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  const handleDelete = async (article: MemberArticle) => {
    const confirmed = window.confirm(
      `Delete "${article.title || "Untitled"}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleteError(null);
    setDeletingIds((prev) => new Set(prev).add(article.id));

    const supabase = createClient();
    const { error } = await supabase.from("articles").delete().eq("id", article.id);

    if (error) {
      setDeleteError(error.message);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(article.id);
        return next;
      });
      return;
    }

    router.refresh();
  };

  const visibleArticles = articles.filter((a) => !deletingIds.has(a.id));

  return (
    <div className="min-h-screen bg-obsidian px-6 py-14">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-6 flex-wrap mb-12">
          <div>
            <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-2">
              BS4F Member Dashboard
            </p>
            <h1 className="font-display text-4xl text-ivory">{displayName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/new"
              className="bg-ember hover:bg-ember-light text-ivory px-5 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300"
            >
              Publish New Article
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="border border-white/15 hover:border-white/40 text-muted hover:text-ivory px-5 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300 disabled:opacity-50"
            >
              {loggingOut ? "Logging out…" : "Log Out"}
            </button>
          </div>
        </div>

        {deleteError && (
          <div className="mb-6 border border-ember/40 bg-ember/10 text-ember text-sm font-sans px-4 py-3">
            {deleteError}
          </div>
        )}

        <div className="border-t border-white/8">
          {visibleArticles.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted font-sans text-sm">
                You haven&apos;t written any articles yet.
              </p>
              <Link
                href="/dashboard/new"
                className="inline-block mt-4 text-2xs text-ember tracking-editorial uppercase font-sans hover:text-ember-light transition-colors"
              >
                Publish your first article →
              </Link>
            </div>
          ) : (
            visibleArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-6 py-6 border-b border-white/8 flex-wrap"
              >
                <div className="min-w-0">
                  <p className="font-serif text-xl text-ivory truncate mb-1.5">
                    {article.title || "Untitled"}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusBadge status={article.status} />
                    <span className="text-2xs text-muted font-sans">
                      Updated {formatDate(article.updated_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {article.status === "published" && (
                    <Link
                      href={`/articles/${article.slug}`}
                      className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/edit/${article.id}`}
                    className="text-2xs text-ivory hover:text-ember tracking-editorial uppercase font-sans transition-colors border border-white/15 hover:border-ember/50 px-4 py-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article)}
                    disabled={deletingIds.has(article.id)}
                    className="text-2xs text-muted hover:text-ember tracking-editorial uppercase font-sans transition-colors border border-white/15 hover:border-ember/50 px-4 py-2 disabled:opacity-50"
                  >
                    {deletingIds.has(article.id) ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <a
          href="/home"
          className="inline-block mt-10 text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
        >
          ← Back to Site
        </a>
      </div>
    </div>
  );
}
