"use client";

import { useMemo, useState } from "react";
import ArticleCard from "@/components/editorial/ArticleCard";
import ArticleCarousel from "@/components/editorial/ArticleCarousel";
import { filterArticlesBySeries, sortArticlesNewestFirst } from "@/lib/repository";
import { SERIES, type MemberArticle } from "@/types/member-article";

const TABS = [...SERIES, { id: "uncategorized" as const, label: "More" }];

export default function EditorialsTabs({ articles }: { articles: MemberArticle[] }) {
  const buckets = useMemo(() => {
    const map = new Map<string, MemberArticle[]>();
    for (const tab of TABS) {
      map.set(tab.id, sortArticlesNewestFirst(filterArticlesBySeries(articles, tab.id)));
    }
    return map;
  }, [articles]);

  const availableTabs = TABS.filter((t) => (buckets.get(t.id) || []).length > 0);
  const [active, setActive] = useState(availableTabs[0]?.id);

  if (availableTabs.length === 0) return null;

  return (
    <div>
      <div role="tablist" aria-label="Editorial series" className="flex flex-wrap gap-2 sm:gap-3 px-6 max-w-7xl mx-auto mb-12">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-xs tracking-editorial uppercase font-sans border transition-colors duration-200 ${
              active === tab.id
                ? "border-ember text-ivory bg-ember/10"
                : "border-white/10 text-muted hover:text-ivory hover:border-white/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {availableTabs.map((tab) => {
        const tabArticles = buckets.get(tab.id) || [];
        if (active !== tab.id || tabArticles.length === 0) return null;
        const [tabLatest, ...tabRest] = tabArticles;
        return (
          <div key={tab.id} role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`}>
            <div className="px-6 max-w-7xl mx-auto mb-10">
              <ArticleCard article={tabLatest} className="w-full sm:w-96" />
            </div>
            {tabRest.length > 0 && <ArticleCarousel articles={tabRest} label={tab.label} />}
          </div>
        );
      })}
    </div>
  );
}
