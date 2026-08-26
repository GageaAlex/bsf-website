import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventEditor from "@/components/dashboard/EventEditor";
import type { MemberEvent } from "@/types/member-event";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/dashboard/edit-event/${params.id}`);
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!event) notFound();
  if (event.author_id !== user.id) redirect("/dashboard");

  const authorName =
    (user.user_metadata?.full_name as string | undefined) || user.email || "Member";

  return (
    <EventEditor
      mode="edit"
      userId={user.id}
      authorName={authorName}
      event={event as MemberEvent}
    />
  );
}
