import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { MapPin } from "./types";

/** Keyboard/screen-reader-usable alternative to the interactive map. */
export default function PlacesList({ pins }: { pins: MapPin[] }) {
  if (pins.length === 0) {
    return <p className="text-muted text-sm font-sans">Nothing on the map yet — check back soon.</p>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pins.map((pin) => (
        <li key={pin.id} className="border border-white/8 hover:border-white/20 transition-colors">
          <div className="flex gap-4 p-4">
            {pin.photo && (
              <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-charcoal-mid">
                <Image src={pin.photo} alt="" fill className="object-cover" sizes="64px" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-2xs text-ember tracking-editorial uppercase font-sans mb-1">
                {pin.category}
                {pin.date && (
                  <>
                    {" · "}
                    <time dateTime={pin.date}>{formatDate(pin.date)}</time>
                  </>
                )}
              </p>
              <p className="font-serif text-base text-ivory mb-1">{pin.name}</p>
              {pin.description && (
                <p className="text-2xs text-muted font-sans line-clamp-2 mb-2">{pin.description}</p>
              )}
              {pin.rating !== null && (
                <p className="text-2xs text-ember" aria-label={`Rated ${pin.rating} out of 5`}>
                  {"★".repeat(Math.round(pin.rating))}
                  <span className="text-white/20">{"★".repeat(5 - Math.round(pin.rating))}</span>
                </p>
              )}
              {pin.href && (
                <Link
                  href={pin.href}
                  target={pin.href.startsWith("http") ? "_blank" : undefined}
                  rel={pin.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-block mt-2 text-2xs text-ivory hover:text-ember tracking-editorial uppercase font-sans transition-colors"
                >
                  View More →
                </Link>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
