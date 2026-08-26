import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import EventsMapLoader from "@/components/events/EventsMapLoader";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { MemberEvent } from "@/types/member-event";

export const revalidate = 0;

export default async function EventPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!event) notFound();

  const typedEvent = event as MemberEvent;
  const metaItems = [
    { label: "Date", value: formatDate(typedEvent.event_date) },
    ...(typedEvent.event_time ? [{ label: "Time", value: typedEvent.event_time }] : []),
    ...(typedEvent.location ? [{ label: "Location", value: typedEvent.location }] : []),
    ...(typedEvent.price ? [{ label: "Price", value: typedEvent.price }] : []),
    ...(typedEvent.dress_code ? [{ label: "Dress Code", value: typedEvent.dress_code }] : []),
    { label: "Organizer", value: typedEvent.author_name },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden pt-20 bg-charcoal">
        {typedEvent.cover_image && (
          <Image src={typedEvent.cover_image} alt={typedEvent.title} fill className="object-cover" sizes="100vw" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-16 px-6">
          <div className="max-w-5xl mx-auto w-full">
            <Link href="/events" className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans mb-6 inline-flex items-center gap-2 transition-colors">
              ← Events
            </Link>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-ivory leading-tight mt-4">
              {typedEvent.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Meta */}
      <section className="bg-obsidian py-16 px-6 border-b border-white/8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
          {metaItems.map((item) => (
            <div key={item.label}>
              <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-1">{item.label}</p>
              <p className="text-sm text-ivory font-sans">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Description + register CTA */}
      <section className="bg-obsidian py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            {typedEvent.description && (
              <p className="font-serif text-2xl text-ivory/80 leading-relaxed mb-10 whitespace-pre-line">
                {typedEvent.description}
              </p>
            )}
            {typedEvent.how_to_register && (
              <div>
                {/^https?:\/\//.test(typedEvent.how_to_register) ? (
                  <a
                    href={typedEvent.how_to_register}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-sans text-ivory bg-ember hover:bg-ember-light px-6 py-3.5 transition-colors duration-300"
                  >
                    Sign Up →
                  </a>
                ) : (
                  <div className="border border-white/10 bg-charcoal p-5">
                    <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-2">How to Register</p>
                    <p className="text-sm text-ivory/80 font-sans leading-relaxed">{typedEvent.how_to_register}</p>
                  </div>
                )}
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Map */}
      {typedEvent.map_lat !== null && typedEvent.map_lng !== null && (
        <section className="bg-charcoal py-16 px-6 border-t border-white/8">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-8 text-center">Location</p>
              <EventsMapLoader events={[typedEvent]} />
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}
