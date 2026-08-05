import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArticleEditor from "@/components/dashboard/ArticleEditor";

export default async function NewArticlePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/new");
  }

  const authorName =
    (user.user_metadata?.full_name as string | undefined) || user.email || "Member";

  return <ArticleEditor mode="new" userId={user.id} authorName={authorName} />;
}
