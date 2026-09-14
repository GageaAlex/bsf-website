export type ArticleStatus = "draft" | "published";

// Secondary/legacy taxonomy — a metadata filter, not the primary browse axis.
export type Rubric =
  | "culture"
  | "business"
  | "industry-interviews"
  | "bocco-brands"
  | "opinions";

export const RUBRICS: { id: Rubric; label: string; description: string }[] = [
  { id: "culture", label: "Culture", description: "Fashion through a cultural lens — history, religion, identity, aesthetics, and society." },
  { id: "business", label: "Business", description: "Long-form Debrief features and the economics of fashion — markets, brands, and the business of luxury." },
  { id: "industry-interviews", label: "Industry Interviews", description: "One-on-one conversations with alumni and professionals shaping the fashion industry." },
  { id: "bocco-brands", label: "Bocco Brands", description: "Spotlight on fashion brands and ventures built by Bocconi students." },
  { id: "opinions", label: "Opinion Pieces", description: "Perspectives, commentary, and takes from the BS4F team." },
];

// Primary browsing taxonomy — the tabs on /editorials (Louis's GC request).
// Nullable on the article itself: unassigned articles show in "Uncategorized"
// rather than being forced into a guessed series.
export type Series =
  | "blog"
  | "fashion-week"
  | "milanese-happenings"
  | "history-of-fashion"
  | "interviews";

export const SERIES: { id: Series; label: string }[] = [
  { id: "blog", label: "Blog" },
  { id: "fashion-week", label: "Fashion Week" },
  { id: "milanese-happenings", label: "Milanese Happenings" },
  { id: "history-of-fashion", label: "History of Fashion" },
  { id: "interviews", label: "Interviews" },
];

// The 4 layout variants from the requirements doc's article-template
// references (image17/11/9/8): a mixed feature, a portrait-led interview, a
// landscape photo-essay spread, and a typography-led long-form feature.
export type ArticleTemplate =
  | "feature"
  | "portrait-interview"
  | "landscape-spread"
  | "typographic";

export const TEMPLATES: { id: ArticleTemplate; label: string; description: string }[] = [
  { id: "feature", label: "Feature", description: "Large headline with a mixed image/text composition." },
  { id: "portrait-interview", label: "Portrait Interview", description: "Full-bleed portrait alongside the interview text." },
  { id: "landscape-spread", label: "Landscape Spread", description: "Wide landscape photography with two-column body text." },
  { id: "typographic", label: "Typographic", description: "Large stacked display headline leading a long-form piece." },
];

export type MemberArticle = {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  subtitle: string | null;
  slug: string;
  rubric: Rubric;
  series: Series | null;
  tags: string[];
  template: ArticleTemplate;
  content: string;
  cover_image: string | null;
  credits: string | null;
  seo_title: string | null;
  meta_description: string | null;
  social_image: string | null;
  related_event_id: string | null;
  related_location_id: string | null;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};
