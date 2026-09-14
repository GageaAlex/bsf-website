"use client";

import { useRef } from "react";
import ArticleCard from "@/components/editorial/ArticleCard";
import type { MemberArticle } from "@/types/member-article";

/**
 * Horizontally-scrolling row with visible, keyboard-operable prev/next
 * buttons. Native overflow-x scroll + scroll-snap already gives touch swipe
 * and keyboard (Tab through the article links) without extra JS.
 */
export default function ArticleCarousel({
  articles,
  label,
}: {
  articles: MemberArticle[];
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * (track.clientWidth * 0.8), behavior: "smooth" });
  };

  if (articles.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollSnapType: "x proximity" }}
      >
        <div className="flex gap-6 px-6 pb-4">
          {articles.map((article) => (
            <div key={article.id} style={{ scrollSnapAlign: "start" }}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>

      {articles.length > 2 && (
        <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-6">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${label} left`}
            className="w-9 h-9 border border-white/15 hover:border-ember text-muted hover:text-ember flex items-center justify-center transition-colors"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${label} right`}
            className="w-9 h-9 border border-white/15 hover:border-ember text-muted hover:text-ember flex items-center justify-center transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
