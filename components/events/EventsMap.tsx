"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { formatDate } from "@/lib/utils";
import type { MemberEvent } from "@/types/member-event";

const MILAN_CENTER: [number, number] = [45.4642, 9.19];

function pinIcon(active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#C0392B;border:2px solid #F5F0EB;box-shadow:0 0 0 ${active ? 4 : 0}px rgba(192,57,43,0.35);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function FitToMarkers({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  if (positions.length > 1) {
    map.fitBounds(positions, { padding: [40, 40], maxZoom: 15 });
  }
  return null;
}

export default function EventsMap({ events }: { events: MemberEvent[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const pinned = events.filter(
    (e): e is MemberEvent & { map_lat: number; map_lng: number } =>
      e.map_lat !== null && e.map_lng !== null
  );
  const active = pinned.find((e) => e.id === activeId) || null;
  const positions: [number, number][] = pinned.map((e) => [e.map_lat, e.map_lng]);
  const center = positions[0] || MILAN_CENTER;

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="h-[420px] border border-white/10 overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%", background: "#111111" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <FitToMarkers positions={positions} />
          {pinned.map((event) => (
            <Marker
              key={event.id}
              position={[event.map_lat, event.map_lng]}
              icon={pinIcon(activeId === event.id)}
              eventHandlers={{
                click: () => setActiveId(activeId === event.id ? null : event.id),
              }}
            />
          ))}
        </MapContainer>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 bg-charcoal border border-white/15 shadow-2xl flex gap-4 p-4 max-w-sm"
          >
            {active.cover_image && (
              <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                <Image src={active.cover_image} alt={active.title} fill className="object-cover" sizes="80px" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-1">
                {formatDate(active.event_date)}
              </p>
              <p className="font-serif text-lg text-ivory truncate mb-1">{active.title}</p>
              <p className="text-2xs text-muted font-sans mb-2">{active.location}</p>
              <Link
                href={`/events/${active.slug}`}
                className="text-2xs text-ivory hover:text-ember tracking-editorial uppercase font-sans transition-colors"
              >
                View More Information →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
