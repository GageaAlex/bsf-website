"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SocialLinks from "@/components/ui/SocialLinks";
import {
  APPLICATION_SETTINGS,
  HAS_SOCIAL_LINKS,
  SOCIAL_LINKS,
  isApplicationOpen,
  isValidGoogleFormUrl,
} from "@/data/site-settings";

const coverLetterPrompts = [
  "Why you want to become a BS4F member",
  "Relevant skills and experience",
  "Your vision: tell us what you want to bring to BS4F!",
];

export default function JoinPageClient() {
  const open = isApplicationOpen(APPLICATION_SETTINGS);
  const formUrl = isValidGoogleFormUrl(APPLICATION_SETTINGS.googleFormUrl)
    ? APPLICATION_SETTINGS.googleFormUrl
    : null;

  return (
    <>
      {/* Hero — dark editorial photo, condensed heading, red date emphasis */}
      <section className="relative min-h-[75vh] overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/013-alchetipo.jpg"
            alt="A BS4F member front row at a Milan Fashion Week show"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-obsidian/70" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-obsidian to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 w-full text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${open ? "bg-ember" : "bg-muted"}`}
              aria-hidden="true"
            />
            <span className="text-2xs text-ivory/80 tracking-[0.3em] uppercase font-sans">
              {open ? "Applications open now" : "Recruitment"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(3rem,10vw,8rem)] text-ivory leading-none mb-6 tracking-tight"
          >
            Applications
          </motion.h1>

          <AnimatedSection delay={0.2}>
            <p className="text-ivory text-sm sm:text-base tracking-[0.2em] uppercase font-sans mb-8">
              Applications will be accepted from
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <p className="font-display font-bold text-ember-light text-xl sm:text-2xl uppercase tracking-wide">
                <time dateTime="2026-09-17T09:00">Thursday September 17th 9:00am</time>
              </p>
              <span className="hidden sm:block w-8 h-px bg-white/20" aria-hidden="true" />
              <p className="font-display font-bold text-ember-light text-xl sm:text-2xl uppercase tracking-wide">
                <time dateTime="2026-09-21T19:00">Monday September 21st 7:00pm</time>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Requirements + CTA */}
      <section className="bg-obsidian py-20 px-6 border-b border-white/8">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <p className="font-serif text-xl sm:text-2xl text-ivory leading-relaxed mb-10">
              A CV + Cover Letter is required, plus any additional document you believe will set
              you apart.
            </p>

            {formUrl ? (
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-ember text-ivory px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:bg-ember-light transition-colors duration-300"
              >
                Apply Now →
              </a>
            ) : SOCIAL_LINKS.instagram ? (
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-ember/50 text-ivory px-8 py-4 text-xs tracking-[0.25em] uppercase font-sans hover:border-ember hover:bg-ember/10 transition-colors duration-300"
              >
                Link Will Be In Our Bio →
              </a>
            ) : (
              <p className="inline-block text-ivory text-xs tracking-[0.25em] uppercase font-sans border-b-2 border-ember pb-1">
                Link Will Be In Our Bio
              </p>
            )}

            {APPLICATION_SETTINGS.eligibility && (
              <p className="text-ivory/60 text-sm font-sans mt-10 max-w-lg mx-auto">
                {APPLICATION_SETTINGS.eligibility}
              </p>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Cover letter guidance */}
      <section className="bg-charcoal py-20 px-6 border-b border-white/8">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <h2 className="font-display text-2xl sm:text-3xl text-ivory text-center mb-10">
              In your Cover Letter, we want to know:
            </h2>
            <ol className="space-y-6">
              {coverLetterPrompts.map((prompt, i) => (
                <li key={prompt} className="flex gap-5 items-start">
                  <span className="font-display text-ember-light text-2xl leading-none shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-ivory/85 font-sans text-base sm:text-lg leading-relaxed pt-0.5">
                    {prompt}
                  </span>
                </li>
              ))}
            </ol>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact */}
      {(APPLICATION_SETTINGS.contactEmail || !open) && (
        <section className="bg-obsidian py-16 px-6 border-b border-white/8">
          <div className="max-w-2xl mx-auto text-center">
            <AnimatedSection>
              {!open && (
                <p className="text-ivory/50 font-sans text-sm mb-6 max-w-md mx-auto">
                  Outside the application window? Follow BS4F on our socials to be the first to
                  know when the next one opens.
                </p>
              )}
              {APPLICATION_SETTINGS.contactEmail && (
                <a
                  href={`mailto:${APPLICATION_SETTINGS.contactEmail}`}
                  className="inline-flex items-center gap-3 border border-white/20 text-ivory px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:border-ivory/60 transition-colors duration-300"
                >
                  Contact Us
                </a>
              )}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Social links */}
      {HAS_SOCIAL_LINKS && (
        <section className="bg-charcoal py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <SocialLinks linkClassName="text-sm text-muted hover:text-ivory font-sans tracking-editorial uppercase transition-colors" />
          </div>
        </section>
      )}
    </>
  );
}
