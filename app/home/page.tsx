"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

const sections = [
  {
    id: "about",
    label: "About",
    href: "/about/story",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=85",
    description: "Who we are, what we stand for, and the people who make it happen.",
  },
  {
    id: "editorials",
    label: "Editorials",
    href: "/editorials",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85",
    description: "Culture, business, industry interviews, and opinions — our writers' room.",
  },
  {
    id: "events",
    label: "Events",
    href: "/events",
    image: "https://images.unsplash.com/photo-1645211710746-9629755e6814?w=1600&q=85",
    description: "Fashion weeks, panels, aperitivi, and everything in between.",
  },
  {
    id: "gallery",
    label: "Gallery",
    href: "/gallery",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85",
    description: "A visual archive of our seasons, shows, and stories.",
  },
  {
    id: "join",
    label: "Join Our Team",
    href: "/join",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=85",
    description: "Applications are open. Come build something remarkable with us.",
  },
];

function ParallaxSection({
  section,
  index,
}: {
  section: (typeof sections)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-center">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-[-10%] z-0">
        <Image
          src={section.image}
          alt={section.label}
          fill
          className="object-cover"
          sizes="100vw"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-obsidian/55" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-obsidian/30 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <AnimatedSection delay={0.1}>
          <div
            className={`max-w-2xl ${index % 2 === 0 ? "ml-0" : "ml-auto text-right"}`}
          >
            <p className="text-2xs text-ivory/40 tracking-[0.3em] uppercase font-sans mb-4">
              0{index + 1}
            </p>
            <h2 className="font-display text-[clamp(3.5rem,8vw,7rem)] text-ivory leading-none mb-6">
              {section.label}
            </h2>
            <p className="text-ivory/60 text-base font-sans leading-relaxed mb-8 max-w-sm">
              {section.description}
            </p>
            <Link
              href={section.href}
              className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-sans text-ivory border-b border-ivory/30 pb-1 hover:border-ember hover:text-ember transition-colors duration-300"
            >
              Explore
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 6 }}
                className="inline-block"
              >
                →
              </motion.span>
            </Link>
          </div>
        </AnimatedSection>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
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
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 0.5, letterSpacing: "0.3em" }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="text-2xs text-ivory uppercase font-sans tracking-[0.3em]"
          >
            Milan · Bocconi University
          </motion.p>
          {/* Logo crest — white on transparent */}
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
      <section className="bg-charcoal py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="font-serif text-[clamp(1.4rem,3vw,2.2rem)] text-ivory/85 leading-relaxed text-center">
              We are the fashion students of Bocconi — writers, editors, strategists, and creatives
              who believe that fashion is the most compelling lens through which to understand culture, business, and society.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <p className="font-display text-4xl text-ember">200+</p>
                <p className="text-2xs text-muted tracking-editorial uppercase mt-1">Members</p>
              </div>
              <div className="w-px h-12 bg-ash" />
              <div className="text-center">
                <p className="font-display text-4xl text-ember">4</p>
                <p className="text-2xs text-muted tracking-editorial uppercase mt-1">Fashion Weeks</p>
              </div>
              <div className="w-px h-12 bg-ash" />
              <div className="text-center">
                <p className="font-display text-4xl text-ember">50+</p>
                <p className="text-2xs text-muted tracking-editorial uppercase mt-1">Partners</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Parallax sections */}
      {sections.map((section, i) => (
        <ParallaxSection key={section.id} section={section} index={i} />
      ))}

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
              Apply Now →
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
