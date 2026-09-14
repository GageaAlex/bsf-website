import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ArticleBadges, ArticleByline, RelatedLinks } from "@/components/editorial/ArticleMeta";
import type { ArticleTemplateProps } from "./types";

/** Wide landscape photography with two-column body text (image9 reference). */
export default function LandscapeSpreadTemplate({ article, safeContent, rubricLabel }: ArticleTemplateProps) {
  return (
    <>
      <section className="bg-obsidian pt-24 md:pt-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-4">{rubricLabel}</p>
          <h1 className="font-display text-[clamp(2.25rem,5vw,4rem)] text-ivory leading-tight mb-4">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="font-serif text-lg text-ivory/70 mb-8 max-w-2xl">{article.subtitle}</p>
          )}
          <div className="mb-4">
            <ArticleBadges article={article} />
          </div>
        </div>
      </section>

      {article.cover_image && (
        <section className="relative w-full aspect-[16/7] mt-6 mb-2 overflow-hidden bg-charcoal">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </section>
      )}
      {article.credits && (
        <p className="text-2xs text-faint font-sans tracking-editorial uppercase px-6 max-w-5xl mx-auto mt-2">
          {article.credits}
        </p>
      )}

      <section className="bg-obsidian py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="pb-6 mb-12 border-b border-white/8">
            <ArticleByline article={article} />
          </div>

          <AnimatedSection>
            <div
              className="prose prose-invert prose-lg max-w-none font-sans text-ivory/80 leading-relaxed sm:columns-2 sm:gap-12"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </AnimatedSection>

          <RelatedLinks article={article} />
        </div>
      </section>
    </>
  );
}
