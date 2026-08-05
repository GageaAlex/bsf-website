"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";

const steps = [
  {
    code: "AOD",
    title: "AOD",
    subtitle: "Apply on Day",
    description: "Applications open once per semester. Watch our Instagram for the exact date. The window is short — usually 48 hours.",
  },
  {
    code: "APR",
    title: "Aperitivo",
    subtitle: "Meet the Team",
    description: "Shortlisted applicants are invited to an informal aperitivo with current members. No pressure — just a chance to see if the fit is right.",
  },
  {
    code: "APP",
    title: "Application",
    subtitle: "Written Form",
    description: "A short written application asking about your interests, which team you'd like to join, and what you'd bring to BS4F.",
  },
  {
    code: "INT",
    title: "Interview",
    subtitle: "15-min Conversation",
    description: "A brief interview with a board member. We're looking for curiosity, drive, and a genuine passion for fashion — not a polished CV.",
  },
  {
    code: "FM",
    title: "First Meeting",
    subtitle: "Welcome In",
    description: "Successful applicants are invited to the first team meeting of the semester. This is where it begins.",
  },
];

const interviewTips = [
  "We don't care about industry experience. We care about how you think.",
  "Come with at least one opinion. About a brand, a campaign, a trend — anything. Be ready to defend it.",
  "If you're unsure which team to apply for, tell us why. Uncertainty with reasoning beats false confidence.",
  "We value intellectual curiosity over polish. It's okay to say you don't know something.",
  "Read at least one recent BS4F editorial before the interview.",
];

export default function JoinPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=85"
            alt="Join BS4F"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans mb-3"
          >
            Applications
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(3rem,8vw,7rem)] text-ivory leading-none mb-4"
          >
            Join Our Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4 }}
            className="text-ivory text-lg font-sans max-w-xl leading-relaxed"
          >
            We recruit once per semester. Here&apos;s how the process works.
          </motion.p>
        </div>
      </section>

      {/* Process steps */}
      <section className="bg-obsidian py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-16">The Process</p>
          </AnimatedSection>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-ember via-white/10 to-transparent hidden sm:block" />

            <div className="space-y-12">
              {steps.map((step, i) => (
                <AnimatedSection key={step.code} delay={i * 0.1}>
                  <div className="flex gap-8 items-start">
                    {/* Step indicator */}
                    <div className="relative shrink-0 w-16 h-16 border border-ember/50 flex items-center justify-center bg-obsidian z-10">
                      <span className="font-display text-sm text-ember">{String(i + 1).padStart(2, "0")}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-baseline gap-3 mb-2">
                        <h3 className="font-display text-2xl text-ivory">{step.title}</h3>
                        <span className="text-2xs text-ember tracking-editorial uppercase font-sans">{step.subtitle}</span>
                      </div>
                      <p className="text-ivory/60 text-sm font-sans leading-relaxed max-w-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interview tips */}
      <section className="bg-charcoal border-t border-white/8 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-4">Preparation</p>
            <h2 className="font-display text-4xl text-ivory mb-12">Interview Tips</h2>
          </AnimatedSection>
          <div className="space-y-4">
            {interviewTips.map((tip, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="flex items-start gap-5 p-6 border border-white/8 hover:border-white/15 transition-colors duration-300">
                  <span className="font-display text-3xl text-ember/40 leading-none shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-ivory/70 text-sm font-sans leading-relaxed pt-1">{tip}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="bg-obsidian border-t border-white/8 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-display text-5xl text-ivory mb-4">Ready to Apply?</h2>
            <p className="text-ivory/50 font-sans text-base mb-10 max-w-md mx-auto">
              Applications open every semester. Follow us on Instagram to be the first to know when the window opens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href="https://instagram.com/bs4f_bocconi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-ember text-ivory px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:bg-ember-light transition-colors duration-300"
              >
                Follow on Instagram →
              </a>
              <a
                href="mailto:info@bs4f.it"
                className="inline-flex items-center gap-3 border border-white/20 text-ivory px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:border-ivory/60 transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social links */}
      <section className="bg-charcoal border-t border-white/8 py-12 px-6">
        <div className="max-w-4xl mx-auto flex gap-8">
          {[
            { label: "Instagram", href: "https://instagram.com" },
            { label: "LinkedIn", href: "https://linkedin.com" },
            { label: "TikTok", href: "https://tiktok.com" },
          ].map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="text-sm text-muted hover:text-ivory font-sans tracking-editorial uppercase transition-colors">
              {s.label}
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
