import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventEditor from "@/components/dashboard/EventEditor";

export const metadata: Metadata = { title: "New Event — BS4F", robots: { index: false } };

export default async function NewEventPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/new-event");
  }

  const authorName =
    (user.user_metadata?.full_name as string | undefined) || user.email || "Member";

  return <EventEditor mode="new" userId={user.id} authorName={authorName} />;
}
