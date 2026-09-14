"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "./types";

const PlacesMap = dynamic(() => import("./PlacesMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] border border-white/10 flex items-center justify-center">
      <p className="text-muted text-sm font-sans">Loading map…</p>
    </div>
  ),
});

export default function PlacesMapLoader({ pins }: { pins: MapPin[] }) {
  return <PlacesMap pins={pins} />;
}
