"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
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

const rubrics = [
  { id: "culture", label: "Culture", description: "Fashion through a cultural lens" },
  { id: "business", label: "Business", description: "The economics of fashion" },
  { id: "industry-interviews", label: "Industry Interviews", description: "Conversations with industry leaders" },
  { id: "bocco-brands", label: "Bocco Brands", description: "Bocconi entrepreneurs in fashion" },
  { id: "opinions", label: "Opinions", description: "Perspectives & commentary" },
];

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/editorials/${article.rubric}/${article.slug}`}
      className="group shrink-0 w-72 sm:w-80"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal mb-4">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-2xs text-ember tracking-editorial uppercase font-sans">
            {article.readingTime} min read
          </span>
        </div>
      </div>
      <h3 className="font-serif text-xl text-ivory leading-snug mb-2 group-hover:text-ivory/75 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-2xs text-muted font-sans">
        {article.author.name} · {formatDate(article.date)}
      </p>
    </Link>
  );
}

function RubricRow({ rubric }: { rubric: typeof rubrics[0] }) {
  const articles = (articlesData as Article[]).filter(
    (a) => a.rubric === rubric.id && a.published
  );

  if (articles.length === 0) return null;

  return (
    <AnimatedSection>
      <div className="mb-20">
        {/* Row header */}
        <div className="flex items-end justify-between mb-8 px-6 max-w-7xl mx-auto">
          <div>
            <p className="text-2xs text-muted tracking-[0.25em] uppercase font-sans mb-1">
              Rubric
            </p>
            <Link
              href={`/editorials/${rubric.id}`}
              className="group inline-flex items-center gap-3"
            >
              <h2 className="font-display text-3xl sm:text-4xl text-ivory group-hover:text-ember transition-colors duration-300">
                {rubric.label}
              </h2>
              <span className="text-muted group-hover:text-ember transition-colors">→</span>
            </Link>
            <p className="text-sm text-muted font-sans mt-1">{rubric.description}</p>
          </div>
          <Link
            href={`/editorials/${rubric.id}`}
            className="hidden sm:block text-xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
          >
            View all
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 px-6 pb-4" style={{ paddingRight: "1.5rem" }}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function EditorialsPage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 px-6 bg-obsidian border-b border-white/8">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.1 }}
            className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans mb-3"
          >
            BS4F Publication
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none mb-6"
          >
            Editorials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.4 }}
            className="text-ivory/55 text-base font-sans max-w-xl leading-relaxed"
          >
            Five rubrics. One voice. Culture, business, interviews, student brands, and sharp opinions — published throughout the academic year.
          </motion.p>
        </div>
      </section>

      {/* Rubric rows */}
      <section className="py-16 bg-obsidian">
        {rubrics.map((rubric) => (
          <RubricRow key={rubric.id} rubric={rubric} />
        ))}
      </section>

      {/* Member articles promo */}
      <section className="py-16 px-6 bg-charcoal border-t border-white/8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="text-2xs text-muted tracking-[0.25em] uppercase font-sans mb-2">
              Written By Members
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-ivory">Member Articles</h2>
          </div>
          <Link
            href="/articles"
            className="inline-block border border-white/20 hover:border-white/50 text-ivory px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300"
          >
            Read Member Articles →
          </Link>
        </div>
      </section>
    </>
  );
}
