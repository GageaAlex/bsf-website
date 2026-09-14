import Link from "next/link";
import CopyLinkButton from "@/components/ui/CopyLinkButton";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { RUBRICS, SERIES, type MemberArticle } from "@/types/member-article";

const rubricLookup = new Map(RUBRICS.map((r) => [r.id, r.label]));
const seriesLookup = new Map(SERIES.map((s) => [s.id, s.label]));

export function ArticleBadges({ article }: { article: MemberArticle }) {
  const badges = [
    article.series ? seriesLookup.get(article.series) : null,
    rubricLookup.get(article.rubric),
    ...article.tags,
  ].filter(Boolean) as string[];

  return (
    <ul className="flex flex-wrap gap-2">
      {badges.map((b) => (
        <li
          key={b}
          className="text-2xs text-ember tracking-editorial uppercase font-sans border border-ember/30 px-2.5 py-1"
        >
          {b}
        </li>
      ))}
    </ul>
  );
}

export function ArticleByline({ article }: { article: MemberArticle }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-charcoal-mid flex items-center justify-center shrink-0" aria-hidden="true">
          <span className="font-serif text-sm text-ivory/70">
            {article.author_name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm text-ivory font-sans">Written by {article.author_name}</p>
          <p className="text-2xs text-muted font-sans">
            {article.published_at && (
              <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
            )}
            {" · "}
            {estimateReadingTime(article.content)} min read
          </p>
        </div>
      </div>
      <CopyLinkButton />
    </div>
  );
}

export function ArticleCredits({ credits }: { credits: string | null }) {
  if (!credits) return null;
  return <p className="text-2xs text-faint font-sans tracking-editorial uppercase mt-6">{credits}</p>;
}

export function RelatedLinks({ article }: { article: MemberArticle }) {
  if (!article.related_event_id && !article.related_location_id) return null;
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {article.related_event_id && (
        <Link
          href={`/events`}
          className="text-2xs text-ivory hover:text-ember tracking-editorial uppercase font-sans border border-white/15 hover:border-ember/50 px-4 py-2 transition-colors"
        >
          Related Event →
        </Link>
      )}
      {article.related_location_id && (
        <Link
          href={`/map`}
          className="text-2xs text-ivory hover:text-ember tracking-editorial uppercase font-sans border border-white/15 hover:border-ember/50 px-4 py-2 transition-colors"
        >
          View on Map →
        </Link>
      )}
    </div>
  );
}
