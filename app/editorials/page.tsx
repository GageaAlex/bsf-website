import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { createClient } from "@/lib/supabase/server";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { RUBRICS } from "@/types/member-article";
import type { MemberArticle } from "@/types/member-article";

export const revalidate = 0;

function ArticleCard({ article }: { article: MemberArticle }) {
  return (
    <Link
      href={`/editorials/${article.rubric}/${article.slug}`}
      className="group shrink-0 w-72 sm:w-80"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal mb-4">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="320px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-3xl text-ivory/15">BS4F</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-2xs text-ember tracking-editorial uppercase font-sans">
            {estimateReadingTime(article.content)} min read
          </span>
        </div>
      </div>
      <h3 className="font-serif text-xl text-ivory leading-snug mb-2 group-hover:text-ivory/75 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-2xs text-muted font-sans">
        {article.author_name}
        {article.published_at ? ` · ${formatDate(article.published_at)}` : ""}
      </p>
    </Link>
  );
}

function RubricRow({
  rubric,
  articles,
}: {
  rubric: (typeof RUBRICS)[number];
  articles: MemberArticle[];
}) {
  if (articles.length === 0) return null;

  return (
    <AnimatedSection>
      <div className="mb-20">
        <div className="flex items-end justify-between mb-8 px-6 max-w-7xl mx-auto">
          <div>
            <p className="text-2xs text-muted tracking-[0.25em] uppercase font-sans mb-1">
              Rubric
            </p>
            <Link href={`/editorials/${rubric.id}`} className="group inline-flex items-center gap-3">
              <h2 className="font-display text-3xl sm:text-4xl text-ivory group-hover:text-ember transition-colors duration-300">
                {rubric.label}
              </h2>
              <span className="text-muted group-hover:text-ember transition-colors">→</span>
            </Link>
            <p className="text-sm text-muted font-sans mt-1">{rubric.description}</p>
          </div>
          <Link
            href={`/editorials/${rubric.id}`}
            className="hidden sm:block text-xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 px-6 pb-4" style={{ paddingRight: "1.5rem" }}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default async function EditorialsPage() {
  const supabase = createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const publishedArticles = (articles as MemberArticle[]) || [];

  return (
    <>
      <section className="py-20 px-6 bg-obsidian border-b border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="none">
            <p className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans mb-3 opacity-50">
              BS4F Publication
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none mb-6">
              Editorials
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-ivory/55 text-base font-sans max-w-xl leading-relaxed">
              Five rubrics. One voice. Culture, business, interviews, student brands, and sharp opinions — written and published by BS4F members.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 bg-obsidian">
        {publishedArticles.length === 0 ? (
          <p className="text-muted text-sm font-sans px-6 max-w-7xl mx-auto">
            No articles published yet — check back soon.
          </p>
        ) : (
          RUBRICS.map((rubric) => (
            <RubricRow
              key={rubric.id}
              rubric={rubric}
              articles={publishedArticles.filter((a) => a.rubric === rubric.id)}
            />
          ))
        )}
      </section>
    </>
  );
}
