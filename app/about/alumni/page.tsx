"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import alumniData from "@/data/alumni.json";

type Alumni = {
  id: string;
  name: string;
  graduatingClass: string;
  company: string;
  position: string;
  bocconProgram: string;
  location: string;
  linkedin: string;
  photo: string;
};

function AlumniCard({ alumni, index }: { alumni: Alumni; index: number }) {
  return (
    <AnimatedSection delay={index * 0.06}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="group bg-charcoal-light border border-white/5 hover:border-white/15 transition-colors duration-300 overflow-hidden"
      >
        {/* Photo */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={alumni.photo}
            alt={alumni.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-obsidian/80 text-ivory/60 text-2xs tracking-editorial uppercase px-2 py-1 font-sans">
              {alumni.graduatingClass}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="font-serif text-lg text-ivory mb-1">{alumni.name}</p>
          <p className="text-sm text-ember font-sans font-medium">{alumni.position}</p>
          <p className="text-xs text-muted font-sans mt-0.5">{alumni.company}</p>

          <div className="mt-4 pt-4 border-t border-white/8 space-y-2">
            <div className="flex gap-2">
              <span className="text-2xs text-faint tracking-editorial uppercase font-sans w-16 shrink-0">Program</span>
              <span className="text-2xs text-ivory/60 font-sans">{alumni.bocconProgram}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-2xs text-faint tracking-editorial uppercase font-sans w-16 shrink-0">Location</span>
              <span className="text-2xs text-ivory/60 font-sans">{alumni.location}</span>
            </div>
          </div>

          <a
            href={alumni.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
          >
            <span className="w-5 h-5 border border-current flex items-center justify-center text-2xs">IN</span>
            LinkedIn
          </a>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function AlumniPage() {
  const alumni = alumniData as Alumni[];

  // Group by graduating class
  const byClass = alumni.reduce<Record<string, Alumni[]>>((acc, a) => {
    acc[a.graduatingClass] = acc[a.graduatingClass] || [];
    acc[a.graduatingClass].push(a);
    return acc;
  }, {});

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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.4 }}
            className="text-ivory/55 text-base font-sans max-w-xl leading-relaxed"
          >
            Our alumni now work at the world&apos;s leading fashion houses, luxury conglomerates, consultancies, and media companies.
          </motion.p>
        </div>
      </section>

      {/* Alumni grid by class */}
      {sortedClasses.map((classYear, ci) => (
        <section
          key={classYear}
          className={`py-16 px-6 border-t border-white/8 ${ci % 2 === 0 ? "bg-obsidian" : "bg-charcoal"}`}
        >
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <h2 className="font-display text-2xl text-ivory mb-10">
                Class of {classYear}
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {byClass[classYear].map((a, i) => (
                <AlumniCard key={a.id} alumni={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
