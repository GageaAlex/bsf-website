"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { APPLICATION_SETTINGS, isApplicationOpen } from "@/data/site-settings";

type SectionEntry = {
  id: string;
  label: string;
  href: string;
  image: string;
  description: string;
};

const baseSections: SectionEntry[] = [
  {
    id: "about",
    label: "About Us",
    href: "/about/story",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
    description: "Who we are, what we stand for, and the people who make it happen.",
  },
  {
    id: "editorials",
    label: "Editorials",
    href: "/editorials",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
    description: "Our writers' room, covering culture, business, interviews, and opinion.",
  },
  {
    id: "events",
    label: "Events",
    href: "/events",
    image: "https://images.unsplash.com/photo-1645211710746-9629755e6814?w=1200&q=80",
    description: "Fashion weeks, panels, aperitivi, and everything in between.",
  },
  {
    id: "map",
    label: "Map",
    href: "/map",
    image: "https://images.unsplash.com/photo-1645211710746-9629755e6814?w=1200&q=80",
    description: "Events, venues, and places BS4F is pinning around Milan.",
  },
  {
    id: "team",
    label: "Meet the Team",
    href: "/about/board",
    image: "/images/ermanno-scervino-audience.jpg",
    description: "The board and teams behind BS4F.",
  },
  {
    id: "alumni",
    label: "Alumni",
    href: "/about/alumni",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    description: "Where our graduates have gone since BS4F.",
  },
  {
    id: "gallery",
    label: "Gallery",
    href: "/gallery",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80",
    description: "A visual archive of our seasons, shows, and stories.",
  },
];

const joinSection: SectionEntry = {
  id: "join",
  label: "Join Our Team",
  href: "/join",
  image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
  description: "Applications are open. Come build something remarkable with us.",
};

function SectionRow({ section, index }: { section: SectionEntry; index: number }) {
  const reversed = index % 2 === 1;
  return (
    <AnimatedSection delay={Math.min(index * 0.04, 0.3)}>
      <Link
        href={section.href}
        className="group grid grid-cols-1 sm:grid-cols-[minmax(0,220px)_1fr] gap-5 sm:gap-8 items-center py-7 sm:py-8 border-b border-white/8"
      >
        <div
          className={`relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-charcoal ${
            reversed ? "sm:order-2" : ""
          }`}
        >
          <Image
            src={section.image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 220px"
          />
        </div>
        <div className={reversed ? "sm:order-1 sm:text-right" : ""}>
          <p className="text-2xs text-ember/70 tracking-[0.3em] uppercase font-sans mb-2">
            0{index + 1}
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] text-ivory leading-none mb-2 group-hover:text-ivory/80 transition-colors">
            {section.label}
          </h2>
          <p className={`text-ivory/55 text-sm font-sans leading-relaxed mb-3 max-w-sm ${reversed ? "sm:ml-auto" : ""}`}>
            {section.description}
          </p>
          <span className="inline-flex items-center gap-2 text-2xs tracking-[0.2em] uppercase font-sans text-muted group-hover:text-ember transition-colors duration-300">
            Explore →
          </span>
        </div>
      </Link>
    </AnimatedSection>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.06]);

  const applicationsOpen = isApplicationOpen(APPLICATION_SETTINGS);
  const sections = applicationsOpen ? [...baseSections, joinSection] : baseSections;

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <Image
            src="/mfw-prada.jpg"
            alt="Prada FW24 Menswear — Milan Fashion Week"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-obsidian/50" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian to-transparent" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 flex flex-col items-center gap-4"
        >
          {/* Logo crest — white on transparent, above the eyebrow text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-[clamp(220px,38vw,460px)]"
          >
            <Image
              src="/bs4f-logo-white.png"
              alt="Bocconi Students for Fashion"
              width={925}
              height={675}
              className="w-full h-auto object-contain drop-shadow-[0_2px_32px_rgba(255,255,255,0.1)]"
              priority
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 0.5, letterSpacing: "0.3em" }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="text-2xs text-ivory uppercase font-sans tracking-[0.3em]"
          >
            Milan · Bocconi University
          </motion.p>
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

      {/* Intro blurb */}
      <section className="bg-charcoal py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="font-serif text-[clamp(1.4rem,3vw,2.2rem)] text-ivory/85 leading-relaxed text-center">
              We&apos;re the fashion students of Bocconi: writers, editors, strategists, and creatives
              who take fashion seriously as a way to understand culture, business, and society.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Compact section index — kept close together rather than one screen per section */}
      <section className="bg-obsidian px-6">
        <div className="max-w-4xl mx-auto border-t border-white/8">
          {sections.map((section, i) => (
            <SectionRow key={section.id} section={section} index={i} />
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-ember py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <AnimatedSection direction="right">
            <h2 className="font-display text-4xl sm:text-5xl text-ivory">
              Join the conversation.
            </h2>
          </AnimatedSection>
          <AnimatedSection direction="left" delay={0.15}>
            <Link
              href="/join"
              className="inline-flex items-center gap-3 bg-ivory text-obsidian px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:bg-ivory/90 transition-colors duration-300"
            >
              {applicationsOpen ? "Apply Now →" : "Learn More →"}
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
