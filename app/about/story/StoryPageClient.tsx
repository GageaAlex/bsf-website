"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SocialLinks from "@/components/ui/SocialLinks";
import { HAS_SOCIAL_LINKS } from "@/data/site-settings";

const aboutPages = [
  { label: "Meet the Team", href: "/about/board" },
  { label: "Alumni", href: "/about/alumni" },
  { label: "For Professionals", href: "/about/professionals" },
];

export default function StoryPageClient() {
  return (
    <>
      {/* About Us — dark, black-and-white editorial photo with centered copy */}
      <section className="relative min-h-[85vh] overflow-hidden flex items-center">
        <Image
          src="/images/gallery/044-ermanno-scervino.jpg"
          alt="Backstage at a Milan Fashion Week show"
          fill
          className="object-cover grayscale"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-obsidian/75" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-obsidian/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian/80 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans mb-3"
          >
            About
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(2.75rem,7vw,5.5rem)] text-ivory leading-none mb-10"
          >
            About Us
          </motion.h1>

          <AnimatedSection delay={0.15}>
            <p className="font-serif text-[clamp(1.15rem,2.4vw,1.6rem)] text-ivory leading-relaxed">
              Bocconi Students For Fashion was founded in 2013, with the aim of bringing students
              closer to their passion and their professional career aspirations in the fashion and
              luxury world.
            </p>
            <p className="font-serif text-[clamp(1.15rem,2.4vw,1.6rem)] text-ivory leading-relaxed mt-6">
              By joining this association you will get the chance to broaden your network, develop
              new skills, and most importantly, have fun while building your path towards a
              successful career in the fashion and luxury industry!
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Explore more about us */}
      <section className="bg-charcoal border-t border-white/8 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-8">
              Explore More
            </p>
            <div className="flex flex-wrap gap-4">
              {aboutPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group flex items-center gap-4 border border-white/15 hover:border-ember px-8 py-5 transition-colors duration-300"
                >
                  <span className="font-serif text-xl text-ivory">{page.label}</span>
                  <span className="text-ember opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social links */}
      {HAS_SOCIAL_LINKS && (
        <section className="bg-obsidian border-t border-white/8 py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-8">
                Follow Our Work
              </p>
              <SocialLinks linkClassName="text-sm text-ivory/70 hover:text-ivory font-sans transition-colors" />
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}
