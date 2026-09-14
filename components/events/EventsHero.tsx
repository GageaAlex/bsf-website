"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export default function EventsHero({
  videoUrl,
  posterImage,
  subtitle,
}: {
  videoUrl: string | null;
  posterImage: string;
  subtitle: string;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [videoPlaying, setVideoPlaying] = useState(!prefersReducedMotion);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -160]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        {videoUrl && videoPlaying ? (
          <video
            src={videoUrl}
            poster={posterImage}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image
            src={posterImage}
            alt="BS4F events — Piazza del Duomo at night"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-obsidian/55" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
      </div>

      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 text-center px-6"
      >
        <p className="text-2xs text-ivory tracking-[0.4em] uppercase font-sans mb-4 opacity-50">BS4F</p>
        <h1 className="font-display text-[clamp(5rem,18vw,14rem)] text-ivory leading-none">Events</h1>
        {subtitle && (
          <p className="text-ivory/60 text-sm sm:text-base font-sans tracking-wide mt-4">{subtitle}</p>
        )}
      </motion.div>

      {videoUrl && (
        <button
          type="button"
          onClick={() => setVideoPlaying((p) => !p)}
          className="absolute bottom-8 right-8 z-10 text-2xs text-ivory/70 hover:text-ivory tracking-editorial uppercase font-sans border border-white/20 hover:border-white/50 px-4 py-2 transition-colors"
        >
          {videoPlaying ? "Pause Video" : "Play Video"}
        </button>
      )}
    </section>
  );
}
