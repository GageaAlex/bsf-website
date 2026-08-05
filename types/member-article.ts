export type ArticleStatus = "draft" | "published";

export type MemberArticle = {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};
