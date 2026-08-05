import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArticleEditor from "@/components/dashboard/ArticleEditor";
import type { MemberArticle } from "@/types/member-article";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/dashboard/edit/${params.id}`);
  }

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!article) notFound();
  if (article.author_id !== user.id) redirect("/dashboard");

  const authorName =
    (user.user_metadata?.full_name as string | undefined) || user.email || "Member";

  return (
    <ArticleEditor
      mode="edit"
      userId={user.id}
      authorName={authorName}
      article={article as MemberArticle}
    />
  );
}
