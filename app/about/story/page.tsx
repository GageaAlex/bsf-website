"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";

const socials = [
  { label: "Instagram", href: "https://instagram.com/bs4f_bocconi", icon: "IG" },
  { label: "LinkedIn", href: "https://linkedin.com/company/bs4f", icon: "IN" },
  { label: "TikTok", href: "https://tiktok.com/@bs4f", icon: "TT" },
];

export default function StoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=85"
          alt="BS4F team"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-obsidian/60" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
        <div className="relative z-10 flex flex-col items-start justify-end h-full max-w-7xl mx-auto px-6 pb-16">
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
            className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none"
          >
            Our Story
          </motion.h1>
        </div>
      </section>

      {/* Body */}
      <section className="bg-obsidian py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <p className="font-serif text-2xl text-ivory/80 leading-relaxed mb-10">
              BS4F — Bocconi Students for Fashion — was born from a simple conviction:
              that the fashion industry deserved to be taken seriously at one of Europe&apos;s
              leading business schools.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="prose prose-invert prose-lg max-w-none text-ivory/65 font-sans leading-relaxed space-y-6">
              <p>
                Founded in 2022 by a group of students passionate about both fashion and business,
                BS4F set out to bridge two worlds that had long spoken past each other. We believed —
                and still believe — that fashion is not just an industry worth studying, but one that
                offers a uniquely powerful lens through which to understand culture, economics,
                globalisation, and identity.
              </p>
              <p>
                In just a few years, we have grown from a small group of enthusiasts meeting in
                library rooms to a community of over 200 members, a recognised publication covering
                everything from runway economics to sustainability policy, and a regular presence at
                Milan and Paris Fashion Weeks.
              </p>
              <p>
                We publish editorials across five rubrics. We organise panels, workshops, and social
                events throughout the academic year. We send delegations to fashion weeks. We connect
                our members with industry professionals. And we do all of it with the rigour,
                curiosity, and ambition that a Bocconi education demands.
              </p>
              <p>
                We are writers, strategists, event producers, and visual thinkers — united by a
                common belief that fashion is worth thinking about carefully.
              </p>
            </div>
          </AnimatedSection>

          {/* Pull quote */}
          <AnimatedSection delay={0.2}>
            <blockquote className="my-16 pl-8 border-l-2 border-ember">
              <p className="font-serif text-2xl text-ivory/75 leading-relaxed italic">
                &ldquo;We believe fashion is the most compelling lens through which to understand
                culture, business, and society.&rdquo;
              </p>
            </blockquote>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="prose prose-invert prose-lg max-w-none text-ivory/65 font-sans leading-relaxed">
              <p>
                Our team changes each year. What stays the same is the standard we hold ourselves to:
                original thinking, genuine curiosity, and a refusal to treat fashion as anything less
                than the serious subject it is.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social links */}
      <section className="bg-charcoal border-t border-white/8 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-8">
              Follow Our Work
            </p>
            <div className="flex flex-wrap gap-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-ivory/70 hover:text-ivory transition-colors duration-200"
                >
                  <span className="w-9 h-9 border border-white/15 group-hover:border-ember flex items-center justify-center text-2xs font-sans transition-colors duration-200">
                    {s.icon}
                  </span>
                  <span className="text-sm font-sans tracking-wide">{s.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-ember">→</span>
                </a>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
