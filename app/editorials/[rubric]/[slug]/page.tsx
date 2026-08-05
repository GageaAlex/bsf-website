"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import articlesData from "@/data/articles.json";
import { formatDate, readingTimeLabel } from "@/lib/utils";

type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  rubric: string;
  layout: string;
  author: { name: string; role: string; bio: string; photo: string };
  coverImage: string;
  date: string;
  readingTime: number;
  excerpt: string;
  content: string;
  published: boolean;
};

const rubricLabels: Record<string, string> = {
  culture: "Culture",
  business: "Business",
  "industry-interviews": "Industry Interviews",
  "bocco-brands": "Bocco Brands",
  opinions: "Opinions",
};

function CopyLinkButton({ slug: _slug }: { slug: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors border border-white/10 hover:border-white/30 px-4 py-2"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      Copy Link
    </button>
  );
}

// Template 1: Full-bleed hero, left-aligned body
function Template1({ article }: { article: Article }) {
  return (
    <>
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-16 px-6">
          <div className="max-w-3xl">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-4">
              {rubricLabels[article.rubric]}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-[clamp(2.5rem,6vw,5rem)] text-ivory leading-tight mb-4">
              {article.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ delay: 0.4 }}
              className="font-serif text-xl text-ivory italic leading-relaxed">{article.subtitle}</motion.p>
          </div>
        </div>
      </section>

      <section className="bg-obsidian py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/8">
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src={article.author.photo} alt={article.author.name} fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <p className="text-sm text-ivory font-sans">{article.author.name}</p>
                <p className="text-2xs text-muted font-sans">{formatDate(article.date)} · {readingTimeLabel(article.readingTime)}</p>
              </div>
            </div>
            <CopyLinkButton slug={article.slug} />
          </div>

          <AnimatedSection>
            <div className="prose prose-invert prose-lg max-w-none font-sans text-ivory/70 leading-relaxed">
              <p className="font-serif text-2xl text-ivory/85 leading-relaxed mb-8">{article.excerpt}</p>
              <p>{article.content}</p>
              <p className="mt-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              <p className="mt-6">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

// Template 2: Side-by-side title and image
function Template2({ article }: { article: Article }) {
  return (
    <>
      <section className="bg-obsidian py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <p className="text-2xs text-ember tracking-[0.3em] uppercase font-sans mb-6">{rubricLabels[article.rubric]}</p>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-ivory leading-tight mb-6">{article.title}</h1>
            <p className="font-serif text-xl text-ivory/60 italic leading-relaxed mb-10">{article.subtitle}</p>
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src={article.author.photo} alt={article.author.name} fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <p className="text-sm text-ivory font-sans">{article.author.name}</p>
                <p className="text-2xs text-muted font-sans">{formatDate(article.date)} · {readingTimeLabel(article.readingTime)}</p>
              </div>
            </div>
            <CopyLinkButton slug={article.slug} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative aspect-[4/5] overflow-hidden">
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="50vw" priority />
          </motion.div>
        </div>
      </section>
      <section className="bg-charcoal py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="prose prose-invert prose-lg max-w-none font-sans text-ivory/70 leading-relaxed">
              <p className="font-serif text-2xl text-ivory/85 leading-relaxed mb-8">{article.excerpt}</p>
              <p>{article.content}</p>
              <p className="mt-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p className="mt-6">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

// Template 3: Magazine-style centered hero text over image
function Template3({ article }: { article: Article }) {
  return (
    <>
      <section className="relative h-screen max-h-[90vh] overflow-hidden flex items-center justify-center text-center">
        <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-obsidian/65" />
        <motion.div className="relative z-10 px-6 max-w-4xl" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <p className="text-2xs text-ember tracking-[0.4em] uppercase font-sans mb-6">{rubricLabels[article.rubric]}</p>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] text-ivory leading-none mb-6">{article.title}</h1>
          <p className="font-serif text-xl text-ivory/65 italic leading-relaxed max-w-2xl mx-auto mb-10">{article.subtitle}</p>
          <p className="text-2xs text-ivory/40 tracking-editorial uppercase font-sans">
            {article.author.name} · {formatDate(article.date)} · {readingTimeLabel(article.readingTime)}
          </p>
        </motion.div>
      </section>
      <section className="bg-obsidian py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/8">
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src={article.author.photo} alt={article.author.name} fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <p className="text-sm text-ivory font-sans">{article.author.name}</p>
                <p className="text-2xs text-muted font-sans">{article.author.role}</p>
              </div>
            </div>
            <CopyLinkButton slug={article.slug} />
          </div>
          <AnimatedSection>
            <div className="prose prose-invert prose-lg max-w-none font-sans text-ivory/70 leading-relaxed">
              <p className="font-serif text-2xl text-ivory/85 leading-relaxed mb-8">{article.excerpt}</p>
              <p>{article.content}</p>
              <p className="mt-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p className="mt-6">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

export default function ArticlePage({ params }: { params: { rubric: string; slug: string } }) {
  const article = (articlesData as Article[]).find(
    (a) => a.slug === params.slug && a.rubric === params.rubric && a.published
  );
  if (!article) notFound();

  return (
    <>
      {/* Back nav */}
      <div className="fixed top-20 left-6 z-40 hidden lg:block">
        <Link
          href="/editorials"
          className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
        >
          ← Back
        </Link>
      </div>

      {article.layout === "template-1" && <Template1 article={article} />}
      {article.layout === "template-2" && <Template2 article={article} />}
      {article.layout === "template-3" && <Template3 article={article} />}

      {/* About the Author */}
      <section className="bg-charcoal border-t border-white/8 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-8">About the Author</p>
            <div className="flex items-start gap-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                <Image src={article.author.photo} alt={article.author.name} fill className="object-cover" sizes="64px" />
              </div>
              <div>
                <p className="font-serif text-xl text-ivory mb-1">{article.author.name}</p>
                <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-3">{article.author.role}</p>
                <p className="text-sm text-ivory/60 font-sans leading-relaxed">{article.author.bio}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
