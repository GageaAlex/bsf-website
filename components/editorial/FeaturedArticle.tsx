import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { RUBRICS, type MemberArticle } from "@/types/member-article";

const rubricLookup = new Map(RUBRICS.map((r) => [r.id, r.label]));

/** Newest published article, featured prominently at the top of /editorials. */
export default function FeaturedArticle({ article }: { article: MemberArticle }) {
  const href = `/editorials/${article.rubric}/${article.slug}`;
  const excerpt = article.subtitle || article.meta_description;

  return (
    <AnimatedSection>
      <Link href={href} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative aspect-[16/10] lg:aspect-[4/3] overflow-hidden bg-charcoal order-1">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-5xl text-ivory/15">BS4F</span>
            </div>
          )}
        </div>
        <div className="order-2">
          <p className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-4">
            Newest — {rubricLookup.get(article.rubric)}
          </p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] text-ivory leading-[1.02] mb-5 group-hover:text-ivory/80 transition-colors">
            {article.title}
          </h2>
          {excerpt && (
            <p className="text-ivory/60 text-base font-sans leading-relaxed mb-6 max-w-lg">{excerpt}</p>
          )}
          <p className="text-2xs text-muted font-sans mb-6">
            {article.author_name}
            {article.published_at && (
              <>
                {" · "}
                <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
              </>
            )}
            {" · "}
            {estimateReadingTime(article.content)} min read
          </p>
          <span className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-sans text-ivory border-b border-ivory/30 pb-1 group-hover:border-ember group-hover:text-ember transition-colors duration-300">
            Read the Full Article →
          </span>
        </div>
      </Link>
    </AnimatedSection>
  );
}
