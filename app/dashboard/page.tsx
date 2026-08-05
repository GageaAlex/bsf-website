import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MemberArticle } from "@/types/member-article";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("author_id", user.id)
    .order("updated_at", { ascending: false });

  const displayName =
    (user.user_metadata?.full_name as string | undefined) || user.email || "Member";

  return (
    <DashboardClient
      articles={(articles as MemberArticle[]) || []}
      displayName={displayName}
    />
  );
}
