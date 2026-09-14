"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function SplashPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(() => router.push("/home"), 900);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-obsidian flex items-center justify-center">
      {/* Background image */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: leaving ? 1.15 : 1.02, opacity: leaving ? 0 : 1 }}
        transition={{ duration: leaving ? 0.9 : 6, ease: leaving ? [0.76, 0, 0.24, 1] : "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/mfw-prada.jpg"
          alt="Prada FW24 Menswear — Milan Fashion Week"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-obsidian/65" />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian to-transparent" />
        {/* Top gradient */}
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-obsidian/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        animate={leaving ? { opacity: 0, y: -30 } : {}}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-10 px-6 text-center"
      >
        {/* Logo — white crest, above the eyebrow text (per Matilde's request) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-[clamp(220px,40vw,480px)]"
        >
          <Image
            src="/bs4f-logo-white.png"
            alt="Bocconi Students for Fashion"
            width={925}
            height={675}
            className="w-full h-auto object-contain drop-shadow-[0_2px_24px_rgba(255,255,255,0.12)]"
            priority
          />
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="text-2xs text-ivory/50 uppercase font-sans tracking-[0.3em]"
        >
          Bocconi University &nbsp;·&nbsp; Milan
        </motion.p>

        {/* Enter button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          onClick={handleEnter}
          className="group relative mt-2 px-10 py-4 border border-ivory/30 text-ivory text-xs tracking-[0.25em] uppercase font-sans overflow-hidden hover:border-ivory/80 transition-colors duration-500"
        >
          {/* Fill on hover */}
          <span className="absolute inset-0 bg-ember translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
          <span className="relative">Enter</span>
        </motion.button>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-ivory/50 to-transparent"
          />
          <span className="text-2xs text-ivory/40 tracking-[0.25em] uppercase">Scroll</span>
        </motion.div>
      </motion.div>

      {/* Corner tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 right-8 text-2xs text-ivory/50 tracking-editorial uppercase font-sans hidden sm:block"
      >
        Est. 2022
      </motion.div>
    </div>
  );
}
