import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { MemberArticle } from "@/types/member-article";

export const revalidate = 0;

export default async function ArticlesPage() {
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
          <p className="text-2xs text-ivory/50 tracking-[0.3em] uppercase font-sans mb-3">
            From Our Members
          </p>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none mb-6">
            Member Articles
          </h1>
          <p className="text-ivory/55 text-base font-sans max-w-xl leading-relaxed">
            Written and published directly by BS4F members — unfiltered takes on fashion, culture, and business.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          {publishedArticles.length === 0 ? (
            <p className="text-muted font-sans text-sm">No articles published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {publishedArticles.map((article, i) => (
                <AnimatedSection key={article.id} delay={i * 0.06}>
                  <Link href={`/articles/${article.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-charcoal mb-4">
                      {article.cover_image ? (
                        <Image
                          src={article.cover_image}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-3xl text-ivory/15">BS4F</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
                    </div>
                    <h3 className="font-serif text-xl text-ivory leading-snug mb-2 group-hover:text-ivory/75 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-2xs text-muted font-sans">
                      Written by {article.author_name}
                      {article.published_at ? ` · ${formatDate(article.published_at)}` : ""}
                    </p>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
