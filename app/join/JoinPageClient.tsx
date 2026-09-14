"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SocialLinks from "@/components/ui/SocialLinks";
import {
  APPLICATION_SETTINGS,
  HAS_SOCIAL_LINKS,
  isApplicationOpen,
  isValidGoogleFormUrl,
} from "@/data/site-settings";

export default function JoinPageClient() {
  const open = isApplicationOpen(APPLICATION_SETTINGS);
  const hasSteps = APPLICATION_SETTINGS.steps.length > 0;
  const formUrl = isValidGoogleFormUrl(APPLICATION_SETTINGS.googleFormUrl)
    ? APPLICATION_SETTINGS.googleFormUrl
    : null;

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
            {open ? "Applications are open — here's how to apply." : "Recruitment happens once per semester."}
          </motion.p>
        </div>
      </section>

      {/* Status banner */}
      <section className="bg-obsidian py-10 px-6 border-b border-white/8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div
              className={`flex items-center gap-3 border px-5 py-4 ${
                open ? "border-ember/40 bg-ember/10" : "border-white/10 bg-charcoal"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${open ? "bg-ember" : "bg-muted"}`}
                aria-hidden="true"
              />
              <p className="text-sm font-sans text-ivory">
                {open
                  ? "Applications are currently open."
                  : "Applications are currently closed. Follow us to know when the next window opens."}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Process steps */}
      <section className="bg-obsidian py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-16">The Process</p>
          </AnimatedSection>

          {hasSteps ? (
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-ember via-white/10 to-transparent hidden sm:block" />
              <div className="space-y-12">
                {APPLICATION_SETTINGS.steps.map((step, i) => (
                  <AnimatedSection key={step.title} delay={i * 0.1}>
                    <div className="flex gap-8 items-start">
                      <div className="relative shrink-0 w-16 h-16 border border-ember/50 flex items-center justify-center bg-obsidian z-10">
                        <span className="font-display text-sm text-ember">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className="font-display text-2xl text-ivory mb-2">{step.title}</h3>
                        <p className="text-ivory/60 text-sm font-sans leading-relaxed max-w-lg">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-10 border border-dashed border-white/10">
              <p className="text-muted text-sm font-sans text-center max-w-md mx-auto">
                The step-by-step process is being finalized by the BS4F team — check back soon for the
                full application timeline.
              </p>
            </div>
          )}

          {APPLICATION_SETTINGS.eligibility && (
            <p className="text-ivory/60 text-sm font-sans mt-10 max-w-lg">
              {APPLICATION_SETTINGS.eligibility}
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-obsidian border-t border-white/8 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-display text-5xl text-ivory mb-4">
              {open ? "Ready to Apply?" : "Applications Aren't Open Right Now"}
            </h2>
            <p className="text-ivory/50 font-sans text-base mb-10 max-w-md mx-auto">
              {open
                ? "Fill out the form below before the window closes."
                : "Follow BS4F on our socials to be the first to know when the next window opens."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              {open && formUrl && (
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-ember text-ivory px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:bg-ember-light transition-colors duration-300"
                >
                  Apply Now →
                </a>
              )}
              {APPLICATION_SETTINGS.contactEmail && (
                <a
                  href={`mailto:${APPLICATION_SETTINGS.contactEmail}`}
                  className="inline-flex items-center gap-3 border border-white/20 text-ivory px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans hover:border-ivory/60 transition-colors duration-300"
                >
                  Contact Us
                </a>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social links */}
      {HAS_SOCIAL_LINKS && (
        <section className="bg-charcoal border-t border-white/8 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <SocialLinks linkClassName="text-sm text-muted hover:text-ivory font-sans tracking-editorial uppercase transition-colors" />
          </div>
        </section>
      )}
    </>
  );
}
