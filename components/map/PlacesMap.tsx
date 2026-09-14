"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { formatDate } from "@/lib/utils";
import type { MapPin } from "./types";

const MILAN_CENTER: [number, number] = [45.4642, 9.19];

function pinIcon(active: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#950606;border:2px solid #F5F0EB;box-shadow:0 0 0 ${active ? 4 : 0}px rgba(149,6,6,0.35);"></div>`,
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

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`Rated ${rating} out of 5`} className="text-ember text-xs tracking-wide">
      {"★".repeat(Math.round(rating))}
      <span className="text-white/20">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

export default function PlacesMap({ pins }: { pins: MapPin[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set(pins.map((p) => p.category)))], [pins]);
  const visible = category === "all" ? pins : pins.filter((p) => p.category === category);
  const active = visible.find((p) => p.id === activeId) || null;
  const positions: [number, number][] = visible.map((p) => [p.lat, p.lng]);
  const center = positions[0] || MILAN_CENTER;

  return (
    <div className="w-full">
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter map by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`px-3.5 py-2 text-2xs tracking-editorial uppercase font-sans border transition-colors ${
                category === c
                  ? "border-ember text-ivory bg-ember/10"
                  : "border-white/10 text-muted hover:text-ivory hover:border-white/30"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="h-[480px] border border-white/10 overflow-hidden">
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
            {visible.map((pin) => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={pinIcon(activeId === pin.id)}
                eventHandlers={{ click: () => setActiveId(activeId === pin.id ? null : pin.id) }}
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
              {active.photo && (
                <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                  <Image src={active.photo} alt={active.name} fill className="object-cover" sizes="80px" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-1">
                  {active.category}
                  {active.date && <> · <time dateTime={active.date}>{formatDate(active.date)}</time></>}
                </p>
                <p className="font-serif text-lg text-ivory truncate mb-1">{active.name}</p>
                {active.description && (
                  <p className="text-2xs text-muted font-sans mb-2 line-clamp-2">{active.description}</p>
                )}
                {active.rating !== null && (
                  <div className="mb-2">
                    <Stars rating={active.rating} />
                  </div>
                )}
                {active.href && (
                  <Link
                    href={active.href}
                    target={active.href.startsWith("http") ? "_blank" : undefined}
                    rel={active.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-2xs text-ivory hover:text-ember tracking-editorial uppercase font-sans transition-colors"
                  >
                    View More Information →
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
