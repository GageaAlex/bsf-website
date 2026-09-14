import type { MemberArticle } from "@/types/member-article";

export type ArticleTemplateProps = {
  article: MemberArticle;
  safeContent: string;
  rubricLabel: string;
};
