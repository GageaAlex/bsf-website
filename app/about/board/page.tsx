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
  role: string;
  photo: string | null;
  linkedin: string | null;
};

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
      <p className="text-2xs text-muted tracking-editorial uppercase font-sans mt-0.5">{member.role}</p>
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

export default function BoardPage() {
  const { board, communication, events, members } = membersData as {
    board: Person[];
    communication: Person[];
    events: Person[];
    members: Person[];
  };

  return (
    <>
      {/* Header */}
      <section className="py-20 px-6 bg-obsidian">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-6 flex-wrap mb-3">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.1 }}
              className="text-2xs text-ivory tracking-[0.3em] uppercase font-sans"
            >
              About
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/login"
                className="inline-block border border-white/20 hover:border-white/50 text-ivory px-5 py-2.5 text-2xs tracking-[0.2em] uppercase font-sans transition-colors duration-300"
              >
                Log In
              </Link>
            </motion.div>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none"
          >
            Board & Members
          </motion.h1>
        </div>
      </section>

      {/* Board */}
      <section className="bg-obsidian py-20 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-12">Board</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {board.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.07}>
                <MemberCard member={member} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Communication */}
      <section className="bg-charcoal py-20 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-2">Team</p>
            <h2 className="font-display text-4xl text-ivory mb-12">Communication</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {communication.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.07}>
                <MemberCard member={member} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="bg-obsidian py-20 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-2">Team</p>
            <h2 className="font-display text-4xl text-ivory mb-12">Events</h2>
          </AnimatedSection>
          {events.length === 0 ? (
            <EmptyState text="Team roster coming soon." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {events.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.07}>
                  <MemberCard member={member} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Members */}
      <section className="bg-charcoal py-20 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-2">Team</p>
            <h2 className="font-display text-4xl text-ivory mb-12">Members</h2>
          </AnimatedSection>
          {members.length === 0 ? (
            <EmptyState text="Team roster coming soon." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {members.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.07}>
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
