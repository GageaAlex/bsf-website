import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ArticleBadges, ArticleByline, ArticleCredits, RelatedLinks } from "@/components/editorial/ArticleMeta";
import type { ArticleTemplateProps } from "./types";

/** Full-bleed portrait cover alongside the interview text (image17/11 reference). */
export default function PortraitInterviewTemplate({ article, safeContent, rubricLabel }: ArticleTemplateProps) {
  return (
    <section className="bg-obsidian pt-24 md:pt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-12 lg:gap-16">
        {/* Portrait column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {article.cover_image && (
            <div className="relative aspect-[3/4] overflow-hidden bg-charcoal">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
              />
            </div>
          )}
          <ArticleCredits credits={article.credits} />
        </div>

        {/* Text column */}
        <div className="pb-16 max-w-2xl">
          <p className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-4">{rubricLabel}</p>
          <h1 className="font-display italic text-[clamp(2.5rem,5vw,4.5rem)] text-ivory leading-[0.95] mb-4">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="font-serif text-lg text-ivory/70 mb-8 max-w-xl">{article.subtitle}</p>
          )}

          <div className="mb-4">
            <ArticleBadges article={article} />
          </div>
          <div className="pb-6 mb-10 border-b border-white/8">
            <ArticleByline article={article} />
          </div>

          <AnimatedSection>
            <div
              className="prose prose-invert prose-lg max-w-none font-sans text-ivory/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </AnimatedSection>

          <RelatedLinks article={article} />
        </div>
      </div>
    </section>
  );
}
