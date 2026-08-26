import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { RUBRICS, type MemberArticle } from "@/types/member-article";

export const revalidate = 0;

export function generateStaticParams() {
  return RUBRICS.map((r) => ({ rubric: r.id }));
}

export default async function RubricPage({ params }: { params: { rubric: string } }) {
  const meta = RUBRICS.find((r) => r.id === params.rubric);
  if (!meta) notFound();

  const supabase = createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("rubric", params.rubric)
    .order("published_at", { ascending: false });

  const rubricArticles = (articles as MemberArticle[]) || [];

  return (
    <>
      <section className="py-20 px-6 bg-obsidian border-b border-white/8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/editorials"
            className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans mb-6 inline-flex items-center gap-2 transition-colors"
          >
            ← Editorials
          </Link>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none mt-3 mb-4">
            {meta.label}
          </h1>
          <p className="text-ivory/50 text-base font-sans max-w-lg leading-relaxed">
            {meta.description}
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          {rubricArticles.length === 0 ? (
            <p className="text-muted text-sm font-sans">No articles published yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {rubricArticles.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/editorials/${article.rubric}/${article.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-charcoal mb-5">
                    {article.cover_image ? (
                      <Image
                        src={article.cover_image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={i < 3}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-3xl text-ivory/15">BS4F</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
                  </div>
                  <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-2">
                    {estimateReadingTime(article.content)} min read
                  </p>
                  <h2 className="font-serif text-2xl text-ivory leading-snug mb-2 group-hover:text-ivory/70 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-2xs text-muted font-sans">
                    {article.author_name}
                    {article.published_at ? ` · ${formatDate(article.published_at)}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
