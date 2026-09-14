"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import alumniData from "@/data/alumni.json";

// No photos, no company/program/location — the doc: "Cut the images for the
// Alumni section (it will just be name, year, and linkedin link if allowed)".
type Alumni = {
  id: string;
  name: string;
  year: string;
  linkedin: string | null;
};

function AlumniCard({ alumni, index }: { alumni: Alumni; index: number }) {
  return (
    <AnimatedSection delay={index * 0.04}>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25 }}
        className="group bg-charcoal-light border border-white/5 hover:border-white/15 transition-colors duration-300 px-6 py-5 flex items-center justify-between gap-4"
      >
        <div>
          <p className="font-serif text-lg text-ivory">{alumni.name}</p>
          <p className="text-2xs text-muted tracking-editorial uppercase font-sans mt-0.5">
            Class of {alumni.year}
          </p>
        </div>
        {alumni.linkedin && (
          <a
            href={alumni.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
          >
            <span className="w-6 h-6 border border-current flex items-center justify-center text-2xs">IN</span>
            LinkedIn
          </a>
        )}
      </motion.div>
    </AnimatedSection>
  );
}

export default function AlumniPageClient() {
  const alumni = alumniData as Alumni[];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alumni;
    return alumni.filter((a) => a.name.toLowerCase().includes(q) || a.year.includes(q));
  }, [alumni, query]);

  const byClass = useMemo(() => {
    return filtered.reduce<Record<string, Alumni[]>>((acc, a) => {
      acc[a.year] = acc[a.year] || [];
      acc[a.year].push(a);
      return acc;
    }, {});
  }, [filtered]);

  const sortedClasses = Object.keys(byClass).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      {/* Header */}
      <section className="py-20 px-6 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.1 }}
            className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans mb-3"
          >
            About
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none mb-6"
          >
            Alumni
          </motion.h1>

          {alumni.length > 8 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-sm">
              <label htmlFor="alumni-search" className="sr-only">
                Search alumni by name or class year
              </label>
              <input
                id="alumni-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or year…"
                className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Alumni grid by class */}
      {alumni.length === 0 ? (
        <section className="py-20 px-6 bg-obsidian border-t border-white/8">
          <div className="max-w-7xl mx-auto">
            <div className="py-10 border border-dashed border-white/10">
              <p className="text-muted text-sm font-sans text-center max-w-md mx-auto">
                Our alumni list is still being put together. Check back soon, or reach out if you&apos;re a
                BS4F alum who&apos;d like to be listed here.
              </p>
            </div>
          </div>
        </section>
      ) : sortedClasses.length === 0 ? (
        <section className="py-20 px-6 bg-obsidian border-t border-white/8">
          <p className="text-muted text-sm font-sans text-center">No alumni match &ldquo;{query}&rdquo;.</p>
        </section>
      ) : (
        sortedClasses.map((classYear, ci) => (
          <section
            key={classYear}
            className={`py-16 px-6 border-t border-white/8 ${ci % 2 === 0 ? "bg-obsidian" : "bg-charcoal"}`}
          >
            <div className="max-w-4xl mx-auto">
              <AnimatedSection>
                <h2 className="font-display text-2xl text-ivory mb-10">Class of {classYear}</h2>
              </AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {byClass[classYear].map((a, i) => (
                  <AlumniCard key={a.id} alumni={a} index={i} />
                ))}
              </div>
            </div>
          </section>
        ))
      )}
    </>
  );
}
