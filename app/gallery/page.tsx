"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import galleryData from "@/data/gallery.json";

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: string;
};

function MasonryColumn({
  images,
  direction,
}: {
  images: GalleryImage[];
  direction: "up" | "down";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const range = direction === "up" ? ["-5%", "5%"] : ["5%", "-5%"];
  const y = useTransform(scrollYProgress, [0, 1], range);

  return (
    <motion.div ref={ref} style={{ y }} className="flex flex-col gap-3">
      {images.map((img, i) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
          className="relative overflow-hidden group"
          style={{
            aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "1/1" : "4/3",
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {/* Category overlay */}
          <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/30 transition-colors duration-500 flex items-end p-3 opacity-0 group-hover:opacity-100">
            <span className="text-2xs text-ivory/70 tracking-editorial uppercase font-sans">
              {img.category}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function GalleryPage() {
  const images = galleryData as GalleryImage[];

  // Split into 3-4 columns
  const cols = [
    images.filter((_, i) => i % 3 === 0),
    images.filter((_, i) => i % 3 === 1),
    images.filter((_, i) => i % 3 === 2),
  ];

  return (
    <>
      {/* Header */}
      <section className="py-16 px-6 bg-obsidian">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.1 }}
              className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans mb-3"
            >
              Visual Archive
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none"
            >
              Gallery
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="hidden sm:block text-sm text-muted font-sans"
          >
            {images.length} images
          </motion.p>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="bg-obsidian pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: 2 columns */}
          <div className="grid grid-cols-2 md:hidden gap-3">
            {images.map((img, i) => (
              <div key={img.id} className={`relative overflow-hidden ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>

          {/* Desktop: 3 columns with opposing scroll directions */}
          <div className="hidden md:grid grid-cols-3 gap-3">
            <MasonryColumn images={cols[0]} direction="up" />
            <MasonryColumn images={cols[1]} direction="down" />
            <MasonryColumn images={cols[2]} direction="up" />
          </div>
        </div>
      </section>

      {/* Social links */}
      <section className="bg-charcoal border-t border-white/8 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans">Follow for more</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex gap-8">
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "TikTok", href: "https://tiktok.com" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-ivory/70 hover:text-ivory font-sans transition-colors group flex items-center gap-2">
                  {s.label}
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
