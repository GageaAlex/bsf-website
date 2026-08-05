"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import eventsData from "@/data/events.json";
import { formatDate } from "@/lib/utils";

type PastEvent = {
  id: string;
  title: string;
  date: string;
  year: string;
  location: string;
  description: string;
  coverImage: string;
  photos: string[];
  speakers: string[];
  organizer: string;
};

function PhotoCarousel({ photos }: { photos: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="relative">
      <div className="relative aspect-video overflow-hidden bg-charcoal">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image src={photos[active]} alt={`Photo ${active + 1}`} fill className="object-cover" sizes="100vw" />
          </motion.div>
        </AnimatePresence>

        {photos.length > 1 && (
          <>
            <button onClick={() => setActive((active - 1 + photos.length) % photos.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-obsidian/60 hover:bg-obsidian/90 flex items-center justify-center text-ivory transition-colors">
              ←
            </button>
            <button onClick={() => setActive((active + 1) % photos.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-obsidian/60 hover:bg-obsidian/90 flex items-center justify-center text-ivory transition-colors">
              →
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === active ? "bg-ivory" : "bg-ivory/30"}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EventPage({ params }: { params: { slug: string } }) {
  const event = (eventsData.past as PastEvent[]).find((e) => e.id === params.slug);
  if (!event) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden pt-20">
        <Image src={event.coverImage} alt={event.title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-16 px-6">
          <div className="max-w-5xl mx-auto w-full">
            <Link href="/events" className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans mb-6 inline-flex items-center gap-2 transition-colors">
              ← Events
            </Link>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-[clamp(2.5rem,6vw,5rem)] text-ivory leading-tight mt-4">
              {event.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Meta */}
      <section className="bg-obsidian py-16 px-6 border-b border-white/8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Date", value: formatDate(event.date) },
            { label: "Location", value: event.location },
            { label: "Organizer", value: event.organizer },
            { label: "Speakers", value: event.speakers.length > 0 ? event.speakers[0] : "—" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-1">{item.label}</p>
              <p className="text-sm text-ivory font-sans">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="bg-obsidian py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <p className="font-serif text-2xl text-ivory/80 leading-relaxed mb-8">{event.description}</p>
          </AnimatedSection>

          {event.speakers.length > 0 && (
            <AnimatedSection delay={0.1}>
              <div className="mt-10">
                <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-4">Speakers</p>
                <ul className="space-y-2">
                  {event.speakers.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 text-ivory/70 text-sm font-sans">
                      <span className="w-1.5 h-1.5 bg-ember rounded-full" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Photo carousel */}
      {event.photos.length > 0 && (
        <section className="bg-charcoal py-16 px-6 border-t border-white/8">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-8">Photos</p>
              <PhotoCarousel photos={event.photos} />
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}
