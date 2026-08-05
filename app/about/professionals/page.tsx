"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import proData from "@/data/professionals.json";

export default function ProfessionalsPage() {
  return (
    <>
      {/* Hero — CV-style header */}
      <section className="py-24 px-6 bg-charcoal border-b border-white/8">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.1 }}
            className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans mb-3"
          >
            For Professionals
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(2.5rem,6vw,5rem)] text-ivory leading-none mb-8"
          >
            {proData.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-ivory text-lg font-sans leading-relaxed max-w-2xl"
          >
            {proData.intro}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-14 border-t border-white/8"
          >
            {proData.stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-5xl text-ember">{stat.value}</p>
                <p className="text-2xs text-muted tracking-editorial uppercase font-sans mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Skills matrix */}
      <section className="py-20 px-6 bg-obsidian">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-12">Competencies</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {proData.skills.map((skillGroup, i) => (
              <AnimatedSection key={skillGroup.category} delay={i * 0.1}>
                <div className="border border-white/8 p-8">
                  <h3 className="font-serif text-xl text-ivory mb-5">{skillGroup.category}</h3>
                  <ul className="space-y-2">
                    {skillGroup.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-ivory/60 font-sans">
                        <span className="text-ember mt-0.5 shrink-0">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Major projects */}
      <section className="py-20 px-6 bg-charcoal border-t border-white/8">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-12">Major Projects</p>
          </AnimatedSection>
          <div className="space-y-8">
            {proData.majorProjects.map((project, i) => (
              <AnimatedSection key={project.title} delay={i * 0.1}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-white/8 pb-8">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-2">{project.years}</p>
                    <h3 className="font-serif text-2xl text-ivory mb-3">{project.title}</h3>
                    <p className="text-ivory/60 text-sm font-sans leading-relaxed">{project.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Notable wins */}
      <section className="py-20 px-6 bg-obsidian border-t border-white/8">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-12">Highlights</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {proData.notableWins.map((win, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="flex items-start gap-4 p-6 bg-charcoal-light border border-white/5">
                  <span className="text-ember font-display text-2xl leading-none shrink-0">
                    0{i + 1}
                  </span>
                  <p className="text-ivory/70 text-sm font-sans leading-relaxed">{win}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6 bg-ember">
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-display text-4xl text-ivory mb-4">Get in Touch</h2>
            <p className="text-ivory/70 font-sans text-base mb-8">
              Interested in partnering, speaking, or recruiting through BS4F?
            </p>
            <a
              href={`mailto:${proData.contactEmail}`}
              className="inline-flex items-center gap-3 bg-ivory text-obsidian px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:bg-ivory/90 transition-colors duration-300"
            >
              {proData.contactEmail}
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
