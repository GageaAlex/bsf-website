import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import RelatedArticles from "@/components/editorial/RelatedArticles";
import FeatureTemplate from "@/components/editorial/templates/FeatureTemplate";
import PortraitInterviewTemplate from "@/components/editorial/templates/PortraitInterviewTemplate";
import LandscapeSpreadTemplate from "@/components/editorial/templates/LandscapeSpreadTemplate";
import TypographicTemplate from "@/components/editorial/templates/TypographicTemplate";
import { createClient } from "@/lib/supabase/server";
import { getPublishedArticles, getRelatedArticlesFor } from "@/lib/repository";
import { RUBRICS, type MemberArticle } from "@/types/member-article";

export const revalidate = 0;

async function getArticle(rubric: string, slug: string): Promise<MemberArticle | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("rubric", rubric)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .single();
  return (data as MemberArticle) || null;
}

export async function generateMetadata({
  params,
}: {
  params: { rubric: string; slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.rubric, params.slug);
  if (!article) return {};

  const title = article.seo_title || article.title;
  const description = article.meta_description || article.subtitle || undefined;
  const image = article.social_image || article.cover_image || undefined;

  return {
    title: `${title} — BS4F`,
    description,
    alternates: { canonical: `/editorials/${params.rubric}/${params.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [{ url: image }] : undefined,
      publishedTime: article.published_at || undefined,
      authors: [article.author_name],
    },
  };
}

const TEMPLATE_COMPONENTS = {
  feature: FeatureTemplate,
  "portrait-interview": PortraitInterviewTemplate,
  "landscape-spread": LandscapeSpreadTemplate,
  typographic: TypographicTemplate,
} as const;

export default async function ArticlePage({
  params,
}: {
  params: { rubric: string; slug: string };
}) {
  const meta = RUBRICS.find((r) => r.id === params.rubric);
  if (!meta) notFound();

  const article = await getArticle(params.rubric, params.slug);
  if (!article) notFound();

  const safeContent = DOMPurify.sanitize(article.content);
  const supabase = createClient();
  const allPublished = await getPublishedArticles(supabase);
  const related = getRelatedArticlesFor(article, allPublished);

  const TemplateComponent = TEMPLATE_COMPONENTS[article.template] || FeatureTemplate;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.meta_description || article.subtitle || undefined,
    image: article.social_image || article.cover_image || undefined,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at,
    author: { "@type": "Person", name: article.author_name },
    publisher: { "@type": "Organization", name: "Bocconi Students for Fashion" },
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="fixed top-20 left-6 z-40 hidden lg:block">
        <Link
          href="/editorials"
          className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
        >
          ← Back
        </Link>
      </div>

      <TemplateComponent article={article} safeContent={safeContent} rubricLabel={meta.label} />

      <div className="bg-obsidian px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <RelatedArticles articles={related} />
        </div>
      </div>
    </>
  );
}
