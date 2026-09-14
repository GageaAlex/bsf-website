"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SocialLinks from "@/components/ui/SocialLinks";
import { HAS_SOCIAL_LINKS } from "@/data/site-settings";
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
  // Fixed pixel offsets, not percentages: a percentage-based transform scales
  // with the column's own height, and with dozens of stacked images that
  // height can be huge — a "small 5%" parallax would then translate by
  // hundreds of pixels and shove the column up over the header above it.
  const range = direction === "up" ? ["-24px", "24px"] : ["24px", "-24px"];
  const y = useTransform(scrollYProgress, [0, 1], range);

  return (
    <motion.div ref={ref} style={{ y }} className="flex flex-col gap-2">
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
            loading="lazy"
            className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function EmptyGalleryState() {
  return (
    <div className="max-w-2xl mx-auto py-20 text-center border border-dashed border-white/10">
      <p className="text-muted text-sm font-sans leading-relaxed px-6">
        The gallery is empty for now — the Comms team&apos;s photo bundle hasn&apos;t landed yet.
        <br />
        Once it does, drop the images into{" "}
        <code className="text-ivory/70 text-xs">data/gallery.json</code> and they&apos;ll show up here.
      </p>
    </div>
  );
}

export default function GalleryPageClient() {
  const images = galleryData as GalleryImage[];

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
              className="font-display uppercase text-[clamp(2.5rem,8vw,7rem)] text-ivory leading-[0.92]"
            >
              From Our Cameras
            </motion.h1>
          </div>
          {images.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="hidden sm:block text-sm text-muted font-sans"
            >
              {images.length} images
            </motion.p>
          )}
        </div>
      </section>

      {/* Masonry grid / empty state */}
      <section className="bg-obsidian pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {images.length === 0 ? (
            <EmptyGalleryState />
          ) : (
            <>
              {/* Mobile: 2 columns */}
              <div className="grid grid-cols-2 md:hidden gap-2">
                {images.map((img, i) => (
                  <div key={img.id} className={`relative overflow-hidden ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                    <Image src={img.src} alt={img.alt} fill loading="lazy" className="object-cover" sizes="50vw" />
                  </div>
                ))}
              </div>

              {/* Desktop: 3 columns with opposing scroll directions, tight gutters */}
              <div className="hidden md:grid grid-cols-3 gap-2">
                <MasonryColumn images={cols[0]} direction="up" />
                <MasonryColumn images={cols[1]} direction="down" />
                <MasonryColumn images={cols[2]} direction="up" />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Social links */}
      {HAS_SOCIAL_LINKS && (
        <section className="bg-charcoal border-t border-white/8 py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <AnimatedSection>
              <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans">Follow for more</p>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <SocialLinks linkClassName="text-sm text-ivory/70 hover:text-ivory font-sans transition-colors" />
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  );
}
