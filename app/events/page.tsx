import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import EventCalendar from "@/components/events/EventCalendar";
import EventsMapLoader from "@/components/events/EventsMapLoader";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { MemberEvent } from "@/types/member-event";

export const revalidate = 0;

export default async function EventsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("event_date", { ascending: true });

  const allEvents = (data as MemberEvent[]) || [];
  const todayKey = new Date().toISOString().slice(0, 10);
  const upcoming = allEvents.filter((e) => e.event_date >= todayKey);
  const past = allEvents
    .filter((e) => e.event_date < todayKey)
    .sort((a, b) => (a.event_date < b.event_date ? 1 : -1));

  const byYear = past.reduce<Record<string, MemberEvent[]>>((acc, e) => {
    const year = e.event_date.slice(0, 4);
    acc[year] = acc[year] || [];
    acc[year].push(e);
    return acc;
  }, {});
  const sortedYears = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1645211710746-9629755e6814?w=1920&q=85"
            alt="Piazza del Duomo at night — Events hero"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-obsidian/55" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6">
          <p className="text-2xs text-ivory tracking-[0.4em] uppercase font-sans mb-4 opacity-50">
            BS4F
          </p>
          <h1 className="font-display text-[clamp(5rem,18vw,14rem)] text-ivory leading-none">
            Events
          </h1>
        </div>
      </section>

      {/* Upcoming — calendar */}
      <section className="bg-obsidian py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-3 text-center">
              What&apos;s Coming
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
        </div>
      </section>

      {/* Past events by year */}
      {sortedYears.map((year, yi) => (
        <section key={year} className={`py-20 px-6 border-t border-white/8 ${yi % 2 === 0 ? "bg-obsidian" : "bg-charcoal"}`}>
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-4xl text-ivory mb-12">{year}</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {byYear[year].map((event, i) => (
                <AnimatedSection key={event.id} delay={i * 0.1}>
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
                        {formatDate(event.event_date)}{event.location ? ` · ${event.location}` : ""}
                      </p>
                      <h3 className="font-serif text-xl text-ivory mb-2 group-hover:text-ember transition-colors duration-300">
                        {event.title}
                      </h3>
                      <p className="text-sm text-ivory/50 font-sans leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
