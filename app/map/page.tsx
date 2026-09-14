import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PlacesMapLoader from "@/components/map/PlacesMapLoader";
import PlacesList from "@/components/map/PlacesList";
import { createClient } from "@/lib/supabase/server";
import { getPublishedEvents, getPublishedPlaces } from "@/lib/repository";
import { PLACE_CATEGORIES } from "@/types/place";
import type { MapPin } from "@/components/map/types";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Map — BS4F",
  description: "Events, venues, and places from BS4F — plotted around Milan.",
  alternates: { canonical: "/map" },
};

const placeCategoryLabel = new Map(PLACE_CATEGORIES.map((c) => [c.id, c.label]));

export default async function MapPage() {
  const supabase = createClient();
  const [events, places] = await Promise.all([
    getPublishedEvents(supabase),
    getPublishedPlaces(supabase),
  ]);

  // Resolve related_article_id -> a real /editorials/[rubric]/[slug] href for
  // places that link to an article (stable-id lookup, not title matching).
  const articleIds = places.map((p) => p.related_article_id).filter((id): id is string => !!id);
  const articleHrefById = new Map<string, string>();
  if (articleIds.length > 0) {
    const { data: articles } = await supabase
      .from("articles")
      .select("id, rubric, slug")
      .in("id", articleIds);
    for (const a of articles || []) {
      articleHrefById.set(a.id, `/editorials/${a.rubric}/${a.slug}`);
    }
  }

  const eventPins: MapPin[] = events
    .filter((e): e is typeof e & { map_lat: number; map_lng: number } => e.map_lat !== null && e.map_lng !== null)
    .map((e) => ({
      id: `event-${e.id}`,
      kind: "event",
      name: e.title,
      description: e.description,
      category: e.event_type || "Event",
      photo: e.cover_image,
      rating: null,
      date: e.event_date,
      lat: e.map_lat,
      lng: e.map_lng,
      href: `/events/${e.slug}`,
    }));

  const placePins: MapPin[] = places.map((p) => ({
    id: `place-${p.id}`,
    kind: "place",
    name: p.name,
    description: p.description,
    category: placeCategoryLabel.get(p.category) || p.category,
    photo: p.photo,
    rating: p.rating,
    date: null,
    lat: p.map_lat,
    lng: p.map_lng,
    href: p.related_article_id
      ? articleHrefById.get(p.related_article_id) || p.info_url
      : p.info_url,
  }));

  const pins = [...eventPins, ...placePins];

  return (
    <>
      <section className="py-20 px-6 bg-obsidian border-b border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="none">
            <p className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans mb-3 opacity-50">
              Around Milan
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none mb-6">Map</h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-ivory/55 text-base font-sans max-w-xl leading-relaxed">
              Events, venues, businesses, and places mentioned in our articles — everything BS4F has pinned around the city.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 px-6 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          {pins.length === 0 ? (
            <p className="text-muted text-sm font-sans">Nothing pinned yet — check back soon.</p>
          ) : (
            <AnimatedSection delay={0.1}>
              <PlacesMapLoader pins={pins} />
            </AnimatedSection>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-charcoal border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="font-display text-2xl text-ivory mb-2">All Locations</h2>
            <p className="text-2xs text-muted font-sans mb-10">
              A list view of everything on the map above, for keyboard and screen-reader navigation.
            </p>
          </AnimatedSection>
          <PlacesList pins={pins} />
        </div>
      </section>
    </>
  );
}
