export type ArticleStatus = "draft" | "published";

export type Rubric =
  | "culture"
  | "business"
  | "industry-interviews"
  | "bocco-brands"
  | "opinions";

export const RUBRICS: { id: Rubric; label: string; description: string }[] = [
  { id: "culture", label: "Culture", description: "Fashion through a cultural lens — history, identity, aesthetics, and society." },
  { id: "business", label: "Business", description: "The economics of fashion — markets, brands, and the business of luxury." },
  { id: "industry-interviews", label: "Industry Interviews", description: "One-on-one conversations with professionals shaping the fashion industry." },
  { id: "bocco-brands", label: "Bocco Brands", description: "Spotlight on fashion brands and ventures built by Bocconi students and alumni." },
  { id: "opinions", label: "Opinions", description: "Perspectives, commentary, and takes from the BS4F team." },
];

export type MemberArticle = {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  slug: string;
  rubric: Rubric;
  content: string;
  cover_image: string | null;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};
