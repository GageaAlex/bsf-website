import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FeaturedArticle from "@/components/editorial/FeaturedArticle";
import EditorialsTabs from "@/components/editorial/EditorialsTabs";
import { createClient } from "@/lib/supabase/server";
import { getFeaturedArticle, getPublishedArticles } from "@/lib/repository";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Editorials — BS4F",
  description:
    "BS4F's editorial publication: culture, business, industry interviews, student brands, and opinion — written and published by our members.",
  alternates: { canonical: "/editorials" },
};

export default async function EditorialsPage() {
  const supabase = createClient();
  const publishedArticles = await getPublishedArticles(supabase);
  const featured = getFeaturedArticle(publishedArticles);

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
              Blog, Fashion Week, Milanese Happenings, History of Fashion, and Interviews — written and published by BS4F members.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {publishedArticles.length === 0 ? (
        <section className="py-16 px-6 bg-obsidian">
          <p className="text-muted text-sm font-sans max-w-7xl mx-auto">
            No articles published yet — check back soon.
          </p>
        </section>
      ) : (
        <>
          {featured && (
            <section className="py-16 px-6 bg-obsidian border-b border-white/8">
              <div className="max-w-7xl mx-auto">
                <FeaturedArticle article={featured} />
              </div>
            </section>
          )}

          <section className="py-16 bg-obsidian">
            <EditorialsTabs articles={publishedArticles} />
          </section>
        </>
      )}
    </>
  );
}
