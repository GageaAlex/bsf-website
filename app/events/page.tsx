import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import EventCalendar from "@/components/events/EventCalendar";
import EventsMapLoader from "@/components/events/EventsMapLoader";
import EventsHero from "@/components/events/EventsHero";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import {
  classifyEvents,
  filterEventsByCategory,
  getPublishedEvents,
  groupPastEventsByYear,
} from "@/lib/repository";
import { EVENTS_HERO_SETTINGS } from "@/data/site-settings";
import type { MemberEvent } from "@/types/member-event";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Events — BS4F",
  description: "BS4F events past and upcoming, plus what's happening in fashion around Milan.",
  alternates: { canonical: "/events" },
};

function PastEventRow({ event }: { event: MemberEvent }) {
  return (
    <Link href={`/events/${event.slug}`} className="group flex gap-6 items-start">
      <div className="relative w-40 h-28 shrink-0 overflow-hidden bg-charcoal-mid">
        {event.cover_image && (
          <Image
            src={event.cover_image}
            alt={event.title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            sizes="160px"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-1">
          <time dateTime={event.event_date}>{formatDate(event.event_date)}</time>
          {event.location ? ` · ${event.location}` : ""}
        </p>
        <h3 className="font-serif text-xl text-ivory mb-2 group-hover:text-ember transition-colors duration-300">
          {event.title}
        </h3>
        <p className="text-sm text-ivory/50 font-sans leading-relaxed line-clamp-2">{event.description}</p>
      </div>
    </Link>
  );
}

export default async function EventsPage() {
  const supabase = createClient();
  const allEvents = await getPublishedEvents(supabase);

  const bs4fEvents = filterEventsByCategory(allEvents, "bs4f");
  const milanEvents = filterEventsByCategory(allEvents, "milan");
  const { upcoming, past } = classifyEvents(bs4fEvents);
  const byYear = groupPastEventsByYear(past);
  const sortedYears = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));
  const { upcoming: milanUpcoming } = classifyEvents(milanEvents);

  return (
    <>
      <EventsHero
        videoUrl={EVENTS_HERO_SETTINGS.videoUrl}
        posterImage={EVENTS_HERO_SETTINGS.posterImage}
        subtitle={EVENTS_HERO_SETTINGS.subtitle}
      />

      {/* BS4F Events — upcoming calendar */}
      <section className="bg-obsidian py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-3 text-center">
              BS4F Events
            </p>
            <h2 className="font-display text-5xl text-ivory mb-16 text-center">Upcoming</h2>
          </AnimatedSection>

          {upcoming.length === 0 ? (
            <p className="text-muted text-sm font-sans text-center">No upcoming events yet — check back soon.</p>
          ) : (
            <AnimatedSection delay={0.1}>
              <EventCalendar events={upcoming} />
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Map */}
      <section className="bg-charcoal py-24 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-3 text-center">
              Around Milan
            </p>
            <h2 className="font-display text-5xl text-ivory mb-16 text-center">Where</h2>
          </AnimatedSection>
          {upcoming.filter((e) => e.map_lat !== null).length === 0 ? (
            <p className="text-muted text-sm font-sans text-center">No pinned event locations yet.</p>
          ) : (
            <AnimatedSection delay={0.1}>
              <EventsMapLoader events={upcoming} />
            </AnimatedSection>
          )}
          <div className="text-center mt-10">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-sans text-ivory border-b border-ivory/30 pb-1 hover:border-ember hover:text-ember transition-colors"
            >
              Open the Full Map →
            </Link>
          </div>
        </div>
      </section>

      {/* Past BS4F events by year */}
      {sortedYears.map((year, yi) => (
        <section key={year} className={`py-20 px-6 border-t border-white/8 ${yi % 2 === 0 ? "bg-obsidian" : "bg-charcoal"}`}>
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-4xl text-ivory mb-12">{year}</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {byYear[year].map((event, i) => (
                <AnimatedSection key={event.id} delay={i * 0.1}>
                  <PastEventRow event={event} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* What's Happening in Milan */}
      <section className="bg-charcoal py-24 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-3 text-center">
              Around the City
            </p>
            <h2 className="font-display text-5xl text-ivory mb-16 text-center">
              What&apos;s Happening in Milan?
            </h2>
          </AnimatedSection>

          {milanUpcoming.length === 0 ? (
            <p className="text-muted text-sm font-sans text-center">
              No Milan happenings added yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {milanUpcoming.map((event, i) => (
                <AnimatedSection key={event.id} delay={i * 0.08}>
                  <Link href={`/events/${event.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-mid mb-4">
                      {event.cover_image && (
                        <Image
                          src={event.cover_image}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                    </div>
                    <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-1">
                      <time dateTime={event.event_date}>{formatDate(event.event_date)}</time>
                    </p>
                    <h3 className="font-serif text-lg text-ivory group-hover:text-ivory/75 transition-colors">
                      {event.title}
                    </h3>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
