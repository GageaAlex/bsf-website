import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ArticleBadges, ArticleByline, ArticleCredits, RelatedLinks } from "@/components/editorial/ArticleMeta";
import type { ArticleTemplateProps } from "./types";

/** Large stacked display headline leading a long-form piece (image8 reference). */
export default function TypographicTemplate({ article, safeContent, rubricLabel }: ArticleTemplateProps) {
  const words = article.title.split(" ");

  return (
    <>
      <section className="bg-obsidian pt-28 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-6">{rubricLabel}</p>
          <h1 className="font-display uppercase text-[clamp(2.5rem,9vw,6rem)] text-ivory leading-[0.92] tracking-tight">
            {words.map((w, i) => (
              <span key={i} className="block">
                {w}
              </span>
            ))}
          </h1>
          {article.subtitle && (
            <p className="font-serif text-lg text-ivory/60 mt-8 max-w-xl mx-auto">{article.subtitle}</p>
          )}
          <div className="flex justify-center mt-6">
            <ArticleBadges article={article} />
          </div>
        </div>
      </section>

      <section className="bg-obsidian py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="pb-6 mb-12 border-b border-white/8">
            <ArticleByline article={article} />
          </div>

          <AnimatedSection>
            <div
              className="prose prose-invert prose-lg max-w-none font-sans text-ivory/80 leading-relaxed first-letter:font-display first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:text-ember"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </AnimatedSection>

          <ArticleCredits credits={article.credits} />
          <RelatedLinks article={article} />
        </div>
      </section>

      {article.cover_image && (
        <section className="relative w-full aspect-[21/9] overflow-hidden bg-charcoal">
          <Image src={article.cover_image} alt={article.title} fill className="object-cover" sizes="100vw" />
        </section>
      )}
    </>
  );
}
