// Shared data-access layer: Supabase query wrappers (server components call
// these instead of building ad-hoc queries per page) plus pure helper
// functions that take plain arrays so they're independently unit-testable
// without a database. See lib/__tests__ for the tests against the pure half.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemberArticle, Rubric, Series } from "@/types/member-article";
import type { MemberEvent } from "@/types/member-event";
import type { Place } from "@/types/place";

// ---------------------------------------------------------------------------
// Pure helpers — no I/O, safe to unit test directly.
// ---------------------------------------------------------------------------

export function sortArticlesNewestFirst(articles: MemberArticle[]): MemberArticle[] {
  return [...articles].sort((a, b) => {
    const aDate = a.published_at ?? a.created_at;
    const bDate = b.published_at ?? b.created_at;
    return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
  });
}

export function getFeaturedArticle(articles: MemberArticle[]): MemberArticle | null {
  return sortArticlesNewestFirst(articles)[0] ?? null;
}

export function filterArticlesBySeries(
  articles: MemberArticle[],
  series: Series | "uncategorized"
): MemberArticle[] {
  return articles.filter((a) =>
    series === "uncategorized" ? a.series === null : a.series === series
  );
}

export function filterArticlesByRubric(articles: MemberArticle[], rubric: Rubric): MemberArticle[] {
  return articles.filter((a) => a.rubric === rubric);
}

export function getRelatedArticlesFor(
  article: MemberArticle,
  allArticles: MemberArticle[],
  limit = 3
): MemberArticle[] {
  const pool = allArticles.filter((a) => a.id !== article.id);
  const sameSeries = article.series ? pool.filter((a) => a.series === article.series) : [];
  const sameRubric = pool.filter((a) => a.rubric === article.rubric && !sameSeries.includes(a));
  const rest = pool.filter((a) => !sameSeries.includes(a) && !sameRubric.includes(a));
  return sortArticlesNewestFirst([...sameSeries, ...sameRubric, ...rest]).slice(0, limit);
}

/** Boundary is inclusive-past/exclusive-future: an event dated `now` counts as upcoming. */
export function classifyEvents(
  events: MemberEvent[],
  now: Date = new Date()
): { upcoming: MemberEvent[]; past: MemberEvent[] } {
  const todayKey = now.toISOString().slice(0, 10);
  const upcoming = events
    .filter((e) => e.event_date >= todayKey)
    .sort((a, b) => (a.event_date < b.event_date ? -1 : a.event_date > b.event_date ? 1 : 0));
  const past = events
    .filter((e) => e.event_date < todayKey)
    .sort((a, b) => (a.event_date < b.event_date ? 1 : a.event_date > b.event_date ? -1 : 0));
  return { upcoming, past };
}

export function groupPastEventsByYear(past: MemberEvent[]): Record<string, MemberEvent[]> {
  return past.reduce<Record<string, MemberEvent[]>>((acc, e) => {
    const year = e.event_date.slice(0, 4);
    acc[year] = acc[year] || [];
    acc[year].push(e);
    return acc;
  }, {});
}

export function filterEventsByCategory(
  events: MemberEvent[],
  category: MemberEvent["category"]
): MemberEvent[] {
  return events.filter((e) => e.category === category);
}

// ---------------------------------------------------------------------------
// Supabase-backed reads — thin wrappers so pages don't duplicate query shape.
// A future-dated published_at is treated as "scheduled, not yet live": the
// public read filter requires published_at <= now() in addition to
// status = 'published'.
// ---------------------------------------------------------------------------

export async function getPublishedArticles(supabase: SupabaseClient): Promise<MemberArticle[]> {
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  return (data as MemberArticle[]) || [];
}

export async function getPublishedEvents(supabase: SupabaseClient): Promise<MemberEvent[]> {
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("event_date", { ascending: true });
  return (data as MemberEvent[]) || [];
}

export async function getPublishedPlaces(supabase: SupabaseClient): Promise<Place[]> {
  const { data } = await supabase.from("places").select("*").eq("status", "published");
  return (data as Place[]) || [];
}
