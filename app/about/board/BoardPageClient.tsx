"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import DefaultAvatar from "@/components/ui/DefaultAvatar";
import membersData from "@/data/members.json";

type Person = {
  id: string;
  name: string;
  role: string | null;
  teams: string[];
  photo: string | null;
  linkedin: string | null;
  cohort: string | null;
  sortOrder: number;
  active: boolean;
};

function bySortOrder(a: Person, b: Person) {
  return a.sortOrder - b.sortOrder;
}

function MemberCard({ member }: { member: Person }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-mid mb-4">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <DefaultAvatar className="w-full h-full" />
        )}
        {member.linkedin && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-ivory text-xs tracking-editorial uppercase font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <span className="w-6 h-6 border border-ivory/50 flex items-center justify-center text-2xs">IN</span>
              LinkedIn
            </a>
          </>
        )}
      </div>
      <p className="font-serif text-lg text-ivory">{member.name}</p>
      {member.role && (
        <p className="text-2xs text-muted tracking-editorial uppercase font-sans mt-0.5">{member.role}</p>
      )}
      {member.teams.length > 1 && (
        <p className="text-2xs text-ember tracking-editorial uppercase font-sans mt-0.5">
          {member.teams.join(" · ")}
        </p>
      )}
    </motion.div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-10 border border-dashed border-white/10">
      <p className="text-muted text-sm font-sans text-center">{text}</p>
    </div>
  );
}

export default function BoardPageClient() {
  const { board, communications, events } = membersData as {
    board: Person[];
    communications: Person[];
    events: Person[];
  };

  const activeBoard = board.filter((m) => m.active).sort(bySortOrder);
  const activeComms = communications.filter((m) => m.active).sort(bySortOrder);
  const activeEvents = events.filter((m) => m.active).sort(bySortOrder);

  return (
    <>
      {/* Hero — same audience photo used for the "Meet the Team" row on /home */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden flex items-end">
        <Image
          src="/images/ermanno-scervino-audience.jpg"
          alt="BS4F members at the Ermanno Scervino show, Milan Fashion Week."
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans mb-3 opacity-70">About</p>
            <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] text-ivory leading-none">
              Meet the Team
            </h1>
          </div>
          <Link
            href="/login"
            className="inline-block border border-white/30 hover:border-white/60 bg-obsidian/40 backdrop-blur-sm text-ivory px-5 py-2.5 text-2xs tracking-[0.2em] uppercase font-sans transition-colors duration-300"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Board */}
      <section className="bg-obsidian py-20 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-12">Board</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeBoard.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.07}>
                <MemberCard member={member} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Communications */}
      <section className="bg-charcoal py-20 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-2">Team</p>
            <h2 className="font-display text-4xl text-ivory mb-12">Communications</h2>
          </AnimatedSection>
          {activeComms.length === 0 ? (
            <EmptyState text="Team roster coming soon." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {activeComms.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.05}>
                  <MemberCard member={member} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events */}
      <section className="bg-obsidian py-20 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-2">Team</p>
            <h2 className="font-display text-4xl text-ivory mb-12">Events</h2>
          </AnimatedSection>
          {activeEvents.length === 0 ? (
            <EmptyState text="Team roster coming soon." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {activeEvents.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.05}>
                  <MemberCard member={member} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
