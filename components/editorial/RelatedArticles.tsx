import ArticleCard from "@/components/editorial/ArticleCard";
import type { MemberArticle } from "@/types/member-article";

export default function RelatedArticles({ articles }: { articles: MemberArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="border-t border-white/8 pt-12 mt-16">
      <p className="text-2xs text-muted tracking-[0.25em] uppercase font-sans mb-8">
        Related Articles
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} className="w-full" />
        ))}
      </div>
    </section>
  );
}
