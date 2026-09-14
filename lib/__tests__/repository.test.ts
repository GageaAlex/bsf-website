import { describe, expect, it } from "vitest";
import {
  classifyEvents,
  filterArticlesByRubric,
  filterArticlesBySeries,
  filterEventsByCategory,
  getFeaturedArticle,
  getRelatedArticlesFor,
  groupPastEventsByYear,
  sortArticlesNewestFirst,
} from "@/lib/repository";
import type { MemberArticle } from "@/types/member-article";
import type { MemberEvent } from "@/types/member-event";

function makeArticle(overrides: Partial<MemberArticle>): MemberArticle {
  return {
    id: overrides.id || "a1",
    author_id: "u1",
    author_name: "Author",
    title: "Title",
    subtitle: null,
    slug: "title",
    rubric: "culture",
    series: null,
    tags: [],
    template: "feature",
    content: "<p>hello</p>",
    cover_image: null,
    credits: null,
    seo_title: null,
    meta_description: null,
    social_image: null,
    related_event_id: null,
    related_location_id: null,
    status: "published",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    published_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeEvent(overrides: Partial<MemberEvent>): MemberEvent {
  return {
    id: overrides.id || "e1",
    author_id: "u1",
    author_name: "Author",
    title: "Event",
    slug: "event",
    category: "bs4f",
    event_type: null,
    organizer: null,
    cover_image: null,
    video_url: null,
    description: "",
    full_description: null,
    price: null,
    dress_code: null,
    how_to_register: null,
    external_url: null,
    event_date: "2026-06-01",
    event_time: null,
    location: null,
    address: null,
    map_lat: null,
    map_lng: null,
    related_article_id: null,
    status: "published",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    published_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("sortArticlesNewestFirst / getFeaturedArticle", () => {
  it("puts the newest published_at first", () => {
    const older = makeArticle({ id: "old", published_at: "2026-01-01T00:00:00.000Z" });
    const newer = makeArticle({ id: "new", published_at: "2026-06-01T00:00:00.000Z" });
    const sorted = sortArticlesNewestFirst([older, newer]);
    expect(sorted.map((a) => a.id)).toEqual(["new", "old"]);
    expect(getFeaturedArticle([older, newer])?.id).toBe("new");
  });

  it("returns null when there are no articles", () => {
    expect(getFeaturedArticle([])).toBeNull();
  });
});

describe("filterArticlesBySeries / filterArticlesByRubric", () => {
  const blog = makeArticle({ id: "blog", series: "blog" });
  const interview = makeArticle({ id: "interview", series: "interviews" });
  const uncategorized = makeArticle({ id: "none", series: null });

  it("filters by a real series", () => {
    const result = filterArticlesBySeries([blog, interview, uncategorized], "blog");
    expect(result.map((a) => a.id)).toEqual(["blog"]);
  });

  it("buckets articles with no series under 'uncategorized'", () => {
    const result = filterArticlesBySeries([blog, interview, uncategorized], "uncategorized");
    expect(result.map((a) => a.id)).toEqual(["none"]);
  });

  it("filters by rubric independently of series", () => {
    const bocco = makeArticle({ id: "bocco", rubric: "bocco-brands" });
    const result = filterArticlesByRubric([blog, bocco], "bocco-brands");
    expect(result.map((a) => a.id)).toEqual(["bocco"]);
  });
});

describe("getRelatedArticlesFor", () => {
  it("prioritizes same series, then same rubric, excludes itself, respects limit", () => {
    const current = makeArticle({ id: "current", series: "blog", rubric: "culture" });
    const sameSeries = makeArticle({ id: "same-series", series: "blog", rubric: "business" });
    const sameRubric = makeArticle({ id: "same-rubric", series: "interviews", rubric: "culture" });
    const other = makeArticle({ id: "other", series: "history-of-fashion", rubric: "opinions" });
    const self = current;

    const related = getRelatedArticlesFor(current, [self, sameSeries, sameRubric, other], 2);
    expect(related).toHaveLength(2);
    expect(related.map((a) => a.id)).toEqual(["same-series", "same-rubric"]);
    expect(related.find((a) => a.id === "current")).toBeUndefined();
  });
});

describe("classifyEvents", () => {
  const now = new Date("2026-06-15T12:00:00.000Z");

  it("treats an event dated today as upcoming (inclusive boundary)", () => {
    const today = makeEvent({ id: "today", event_date: "2026-06-15" });
    const { upcoming, past } = classifyEvents([today], now);
    expect(upcoming.map((e) => e.id)).toEqual(["today"]);
    expect(past).toHaveLength(0);
  });

  it("sorts upcoming soonest-first and past newest-first", () => {
    const soon = makeEvent({ id: "soon", event_date: "2026-06-20" });
    const later = makeEvent({ id: "later", event_date: "2026-07-01" });
    const recentPast = makeEvent({ id: "recent-past", event_date: "2026-06-01" });
    const oldPast = makeEvent({ id: "old-past", event_date: "2025-01-01" });

    const { upcoming, past } = classifyEvents([later, soon, oldPast, recentPast], now);
    expect(upcoming.map((e) => e.id)).toEqual(["soon", "later"]);
    expect(past.map((e) => e.id)).toEqual(["recent-past", "old-past"]);
  });
});

describe("groupPastEventsByYear", () => {
  it("groups by the event_date's year", () => {
    const e1 = makeEvent({ id: "e1", event_date: "2025-03-01" });
    const e2 = makeEvent({ id: "e2", event_date: "2025-11-01" });
    const e3 = makeEvent({ id: "e3", event_date: "2024-05-01" });
    const grouped = groupPastEventsByYear([e1, e2, e3]);
    expect(Object.keys(grouped).sort()).toEqual(["2024", "2025"]);
    expect(grouped["2025"].map((e) => e.id)).toEqual(["e1", "e2"]);
  });
});

describe("filterEventsByCategory", () => {
  it("separates BS4F events from Milan happenings", () => {
    const bs4f = makeEvent({ id: "bs4f-event", category: "bs4f" });
    const milan = makeEvent({ id: "milan-event", category: "milan" });
    expect(filterEventsByCategory([bs4f, milan], "bs4f").map((e) => e.id)).toEqual(["bs4f-event"]);
    expect(filterEventsByCategory([bs4f, milan], "milan").map((e) => e.id)).toEqual(["milan-event"]);
  });
});
