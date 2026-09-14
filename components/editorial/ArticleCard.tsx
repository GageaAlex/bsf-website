import Image from "next/image";
import Link from "next/link";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { RUBRICS, type MemberArticle } from "@/types/member-article";

const rubricLookup = new Map(RUBRICS.map((r) => [r.id, r.label]));

export default function ArticleCard({
  article,
  className = "shrink-0 w-72 sm:w-80",
}: {
  article: MemberArticle;
  className?: string;
}) {
  return (
    <Link href={`/editorials/${article.rubric}/${article.slug}`} className={`group ${className}`}>
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
      <p className="text-2xs text-faint tracking-editorial uppercase font-sans mb-1.5">
        {rubricLookup.get(article.rubric)}
      </p>
      <h3 className="font-serif text-xl text-ivory leading-snug mb-2 group-hover:text-ivory/75 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-2xs text-muted font-sans">
        {article.author_name}
        {article.published_at && (
          <>
            {" · "}
            <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
          </>
        )}
      </p>
    </Link>
  );
}
