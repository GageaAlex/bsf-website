"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import eventsData from "@/data/events.json";
import { formatDate } from "@/lib/utils";

type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  poster: string;
  signupLink: string;
  category: string;
};

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

export default function EventsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { upcoming, past } = eventsData as { upcoming: UpcomingEvent[]; past: PastEvent[] };

  // Group past events by year
  const byYear = past.reduce<Record<string, PastEvent[]>>((acc, e) => {
    acc[e.year] = acc[e.year] || [];
    acc[e.year].push(e);
    return acc;
  }, {});
  const sortedYears = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      {/* Hero — full-screen video-style with animated title exit on scroll */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-[-10%] z-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85"
            alt="Events hero"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-obsidian/55" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
        </motion.div>

        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.3 }}
            className="text-2xs text-ivory tracking-[0.4em] uppercase font-sans mb-4"
          >
            BS4F
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(5rem,18vw,14rem)] text-ivory leading-none"
          >
            Events
          </motion.h1>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-10 bg-gradient-to-b from-ivory/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* Upcoming events */}
      <section className="bg-obsidian py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-3">What&apos;s Coming</p>
            <h2 className="font-display text-5xl text-ivory mb-16">Upcoming</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map((event, i) => (
              <AnimatedSection key={event.id} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="group border border-white/8 hover:border-white/20 transition-colors duration-300">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={event.poster}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-ember text-ivory text-2xs tracking-editorial uppercase px-3 py-1 font-sans">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-2">
                      {formatDate(event.date)} · {event.time}
                    </p>
                    <h3 className="font-serif text-xl text-ivory mb-2">{event.title}</h3>
                    <p className="text-sm text-muted font-sans mb-1">{event.location}</p>
                    <p className="text-sm text-ivory/55 font-sans leading-relaxed mt-3 mb-5">
                      {event.description}
                    </p>
                    <a
                      href={event.signupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-sans text-ivory border border-ivory/20 hover:border-ember hover:text-ember px-5 py-3 transition-colors duration-300"
                    >
                      Sign Up →
                    </a>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Past events by year */}
      {sortedYears.map((year, yi) => (
        <section key={year} className={`py-20 px-6 border-t border-white/8 ${yi % 2 === 0 ? "bg-charcoal" : "bg-obsidian"}`}>
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-4xl text-ivory mb-12">{year}</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {byYear[year].map((event, i) => (
                <AnimatedSection key={event.id} delay={i * 0.1}>
                  <Link href={`/events/${event.id}`} className="group flex gap-6 items-start">
                    <div className="relative w-40 h-28 shrink-0 overflow-hidden">
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                        sizes="160px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-1">
                        {formatDate(event.date)} · {event.location}
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
