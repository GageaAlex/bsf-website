import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MemberArticle } from "@/types/member-article";
import type { MemberEvent } from "@/types/member-event";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const [{ data: articles }, { data: events }] = await Promise.all([
    supabase
      .from("articles")
      .select("*")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("events")
      .select("*")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  const displayName =
    (user.user_metadata?.full_name as string | undefined) || user.email || "Member";

  return (
    <DashboardClient
      articles={(articles as MemberArticle[]) || []}
      events={(events as MemberEvent[]) || []}
      displayName={displayName}
    />
  );
}
