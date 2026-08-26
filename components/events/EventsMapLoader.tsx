"use client";

import dynamic from "next/dynamic";
import type { MemberEvent } from "@/types/member-event";

const EventsMap = dynamic(() => import("./EventsMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-3xl mx-auto h-[420px] border border-white/10 flex items-center justify-center">
      <p className="text-muted text-sm font-sans">Loading map…</p>
    </div>
  ),
});

export default function EventsMapLoader({ events }: { events: MemberEvent[] }) {
  return <EventsMap events={events} />;
}
