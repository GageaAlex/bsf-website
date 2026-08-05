"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import membersData from "@/data/members.json";

type BoardMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  linkedin: string;
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  linkedin: string;
};

type Team = {
  name: string;
  members: TeamMember[];
};

function MemberCard({ member }: { member: BoardMember | TeamMember }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-mid mb-4">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
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
      </div>
      <p className="font-serif text-lg text-ivory">{member.name}</p>
      <p className="text-2xs text-muted tracking-editorial uppercase font-sans mt-0.5">{member.role}</p>
    </motion.div>
  );
}

export default function BoardPage() {
  const { board, boardGroupPhoto, teams } = membersData as {
    board: BoardMember[];
    boardGroupPhoto: string;
    teams: Team[];
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
            className="font-display text-[clamp(3rem,7vw,6rem)] text-ivory leading-none mb-12"
          >
            Board & Members
          </motion.h1>

          {/* Group photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-[21/9] overflow-hidden"
          >
            <Image
              src={boardGroupPhoto}
              alt="BS4F Board 2024"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-2xs text-ivory/60 tracking-editorial uppercase font-sans">
                BS4F Board — 2024/25
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Board */}
      <section className="bg-obsidian py-20 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-12">Board</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {board.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.07}>
                <MemberCard member={member} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Teams */}
      {(teams as Team[]).map((team, ti) => (
        <section
          key={team.name}
          className={`py-20 px-6 border-t border-white/8 ${ti % 2 === 0 ? "bg-charcoal" : "bg-obsidian"}`}
        >
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <p className="text-2xs text-muted tracking-[0.3em] uppercase font-sans mb-2">Team</p>
              <h2 className="font-display text-4xl text-ivory mb-12">{team.name}</h2>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {team.members.map((member, i) => (
                <AnimatedSection key={member.id} delay={i * 0.07}>
                  <MemberCard member={member} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
