import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ArticleBadges, ArticleByline, ArticleCredits, RelatedLinks } from "@/components/editorial/ArticleMeta";
import type { ArticleTemplateProps } from "./types";

/** Large headline with a mixed image/text composition — the default template. */
export default function FeatureTemplate({ article, safeContent, rubricLabel }: ArticleTemplateProps) {
  return (
    <>
      {article.cover_image ? (
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
          <div className="absolute inset-0 flex items-end pb-16 px-6">
            <div className="max-w-3xl mx-auto w-full">
              <p className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-4">{rubricLabel}</p>
              <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-ivory leading-tight">{article.title}</h1>
              {article.subtitle && (
                <p className="font-serif text-xl text-ivory/70 mt-4 max-w-2xl">{article.subtitle}</p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-obsidian pt-16 pb-8 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-4">{rubricLabel}</p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-ivory leading-tight">{article.title}</h1>
            {article.subtitle && (
              <p className="font-serif text-xl text-ivory/70 mt-4 max-w-2xl">{article.subtitle}</p>
            )}
          </div>
        </section>
      )}

      <section className="bg-obsidian py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <ArticleBadges article={article} />
          </div>
          <div className="pb-6 mb-12 border-b border-white/8">
            <ArticleByline article={article} />
          </div>

          <AnimatedSection>
            <div
              className="prose prose-invert prose-lg max-w-none font-sans text-ivory/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </AnimatedSection>

          <ArticleCredits credits={article.credits} />
          <RelatedLinks article={article} />
        </div>
      </section>
    </>
  );
}
