import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import EventsMapLoader from "@/components/events/EventsMapLoader";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { MemberEvent } from "@/types/member-event";

export const revalidate = 0;

async function getEvent(slug: string): Promise<MemberEvent | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return (data as MemberEvent) || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEvent(params.slug);
  if (!event) return {};
  return {
    title: `${event.title} — BS4F Events`,
    description: event.description || undefined,
    alternates: { canonical: `/events/${params.slug}` },
    openGraph: {
      title: event.title,
      description: event.description || undefined,
      images: event.cover_image ? [{ url: event.cover_image }] : undefined,
      type: "website",
    },
  };
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const typedEvent = await getEvent(params.slug);
  if (!typedEvent) notFound();

  const metaItems = [
    { label: "Date", value: formatDate(typedEvent.event_date) },
    ...(typedEvent.event_time ? [{ label: "Time", value: typedEvent.event_time }] : []),
    ...(typedEvent.event_type ? [{ label: "Type", value: typedEvent.event_type }] : []),
    ...(typedEvent.location ? [{ label: "Location", value: typedEvent.location }] : []),
    ...(typedEvent.address ? [{ label: "Address", value: typedEvent.address }] : []),
    ...(typedEvent.price ? [{ label: "Price", value: typedEvent.price }] : []),
    ...(typedEvent.dress_code ? [{ label: "Dress Code", value: typedEvent.dress_code }] : []),
    { label: "Organizer", value: typedEvent.organizer || typedEvent.author_name },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: typedEvent.title,
    startDate: typedEvent.event_date,
    location: typedEvent.location
      ? { "@type": "Place", name: typedEvent.location, address: typedEvent.address || undefined }
      : undefined,
    image: typedEvent.cover_image || undefined,
    description: typedEvent.description || undefined,
    organizer: { "@type": "Organization", name: typedEvent.organizer || "Bocconi Students for Fashion" },
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden pt-20 bg-charcoal">
        {typedEvent.video_url ? (
          <video
            src={typedEvent.video_url}
            poster={typedEvent.cover_image || undefined}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          typedEvent.cover_image && (
            <Image src={typedEvent.cover_image} alt={typedEvent.title} fill className="object-cover" sizes="100vw" priority />
          )
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
            {(typedEvent.full_description || typedEvent.description) && (
              <p className="font-serif text-2xl text-ivory/80 leading-relaxed mb-10 whitespace-pre-line">
                {typedEvent.full_description || typedEvent.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {typedEvent.how_to_register && (
                <>
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
                </>
              )}
              {typedEvent.external_url && (
                <a
                  href={typedEvent.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-sans text-ivory border border-white/20 hover:border-ember px-6 py-3.5 transition-colors duration-300"
                >
                  More Information →
                </a>
              )}
              {typedEvent.related_article_id && (
                <Link
                  href="/editorials"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-sans text-ivory border border-white/20 hover:border-ember px-6 py-3.5 transition-colors duration-300"
                >
                  Related Article →
                </Link>
              )}
            </div>
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
