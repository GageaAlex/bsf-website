import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { MemberArticle } from "@/types/member-article";

export const revalidate = 0;

export default async function MemberArticlePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!article) notFound();

  const typedArticle = article as MemberArticle;
  const safeContent = DOMPurify.sanitize(typedArticle.content);

  return (
    <>
      <div className="fixed top-20 left-6 z-40 hidden lg:block">
        <Link
          href="/articles"
          className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
        >
          ← Back
        </Link>
      </div>

      {typedArticle.cover_image ? (
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src={typedArticle.cover_image}
            alt={typedArticle.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
          <div className="absolute inset-0 flex items-end pb-16 px-6">
            <div className="max-w-3xl mx-auto w-full">
              <p className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-4">
                Member Article
              </p>
              <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-ivory leading-tight">
                {typedArticle.title}
              </h1>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-obsidian pt-16 pb-8 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-4">
              Member Article
            </p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-ivory leading-tight">
              {typedArticle.title}
            </h1>
          </div>
        </section>
      )}

      <section className="bg-obsidian py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12 pb-6 border-b border-white/8">
            <div className="w-10 h-10 rounded-full bg-charcoal-mid flex items-center justify-center shrink-0">
              <span className="font-serif text-sm text-ivory/70">
                {typedArticle.author_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-ivory font-sans">Written by {typedArticle.author_name}</p>
              {typedArticle.published_at && (
                <p className="text-2xs text-muted font-sans">{formatDate(typedArticle.published_at)}</p>
              )}
            </div>
          </div>

          <AnimatedSection>
            <div
              className="prose prose-invert prose-lg max-w-none font-sans text-ivory/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
