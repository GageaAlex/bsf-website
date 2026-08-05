import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import articlesData from "@/data/articles.json";
import { formatDate } from "@/lib/utils";

type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  rubric: string;
  author: { name: string; role: string; bio: string; photo: string };
  coverImage: string;
  date: string;
  readingTime: number;
  excerpt: string;
  published: boolean;
};

const rubricMeta: Record<string, { label: string; description: string }> = {
  culture: { label: "Culture", description: "Fashion through a cultural lens — history, identity, aesthetics, and society." },
  business: { label: "Business", description: "The economics of fashion — markets, brands, and the business of luxury." },
  "industry-interviews": { label: "Industry Interviews", description: "One-on-one conversations with professionals shaping the fashion industry." },
  "bocco-brands": { label: "Bocco Brands", description: "Spotlight on fashion brands and ventures built by Bocconi students and alumni." },
  opinions: { label: "Opinions", description: "Perspectives, commentary, and takes from the BS4F team." },
};

export function generateStaticParams() {
  return Object.keys(rubricMeta).map((rubric) => ({ rubric }));
}

export default function RubricPage({ params }: { params: { rubric: string } }) {
  const meta = rubricMeta[params.rubric];
  if (!meta) notFound();

  const articles = (articlesData as Article[]).filter(
    (a) => a.rubric === params.rubric && a.published
  );

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
          {articles.length === 0 ? (
            <p className="text-muted text-sm font-sans">No articles published yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/editorials/${article.rubric}/${article.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-charcoal mb-5">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={i < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
                  </div>
                  <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-2">
                    {article.readingTime} min read
                  </p>
                  <h2 className="font-serif text-2xl text-ivory leading-snug mb-2 group-hover:text-ivory/70 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-ivory/50 text-sm font-sans leading-relaxed mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <p className="text-2xs text-muted font-sans">
                    {article.author.name} · {formatDate(article.date)}
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
