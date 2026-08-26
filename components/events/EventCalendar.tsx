"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { MemberEvent } from "@/types/member-event";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function EventCalendar({ events }: { events: MemberEvent[] }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const eventsByDay = useMemo(() => {
    const map: Record<string, MemberEvent[]> = {};
    for (const event of events) {
      const key = event.event_date; // already YYYY-MM-DD
      map[key] = map[key] || [];
      map[key].push(event);
    }
    return map;
  }, [events]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const expandedEvents = expandedKey ? eventsByDay[expandedKey] || [] : [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => { setViewDate(new Date(year, month - 1, 1)); setExpandedKey(null); }}
          className="text-muted hover:text-ivory transition-colors text-lg px-2"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="font-display text-2xl text-ivory">
          {MONTH_NAMES[month]} {year}
        </p>
        <button
          onClick={() => { setViewDate(new Date(year, month + 1, 1)); setExpandedKey(null); }}
          className="text-muted hover:text-ivory transition-colors text-lg px-2"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-2xs text-muted tracking-editorial uppercase font-sans text-center py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = dateKey(date);
          const dayEvents = eventsByDay[key];
          const hasEvents = !!dayEvents?.length;
          const isExpanded = expandedKey === key;

          return (
            <button
              key={i}
              disabled={!hasEvents}
              onClick={() => setExpandedKey(isExpanded ? null : key)}
              className={`aspect-square flex flex-col items-center justify-center gap-1 border transition-colors duration-200 ${
                isExpanded
                  ? "border-ember bg-ember/10"
                  : hasEvents
                    ? "border-white/15 hover:border-ember/60 cursor-pointer"
                    : "border-white/5 cursor-default"
              }`}
            >
              <span className={`text-sm font-sans ${hasEvents ? "text-ivory" : "text-muted/50"}`}>
                {date.getDate()}
              </span>
              {hasEvents && <span className="w-1.5 h-1.5 rounded-full bg-ember" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {expandedKey && expandedEvents.length > 0 && (
          <motion.div
            key={expandedKey}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-8 space-y-4">
              {expandedEvents.map((event) => (
                <div key={event.id} className="flex gap-4 border border-white/10 p-4">
                  {event.cover_image && (
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                      <Image src={event.cover_image} alt={event.title} fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                  <div className="min-w-0">
                    {event.event_time && (
                      <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-1">
                        {event.event_time}
                      </p>
                    )}
                    <p className="font-serif text-lg text-ivory mb-1">{event.title}</p>
                    {event.description && (
                      <p className="text-sm text-ivory/55 font-sans leading-relaxed line-clamp-2 mb-2">
                        {event.description}
                      </p>
                    )}
                    <Link
                      href={`/events/${event.slug}`}
                      className="text-2xs text-ivory hover:text-ember tracking-editorial uppercase font-sans transition-colors"
                    >
                      More Info →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
