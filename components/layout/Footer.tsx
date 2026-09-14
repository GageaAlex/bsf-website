import Link from "next/link";
import SocialLinks from "@/components/ui/SocialLinks";
import { HAS_SOCIAL_LINKS } from "@/data/site-settings";

const links = [
  { label: "About Us", href: "/about/story" },
  { label: "Editorials", href: "/editorials" },
  { label: "Events", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Meet the Team", href: "/about/board" },
  { label: "Alumni", href: "/about/alumni" },
  { label: "Gallery", href: "/gallery" },
  { label: "Join Our Team", href: "/join" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div
          className={`grid grid-cols-1 gap-12 mb-16 ${
            HAS_SOCIAL_LINKS ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {/* Brand */}
          <div>
            <Link href="/home" className="inline-block mb-4">
              <span className="font-display text-4xl text-ivory">BS4F</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Bocconi Students for Fashion. Bridging the worlds of fashion and business from the heart of Milan.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-2xs text-muted tracking-editorial uppercase mb-5">Navigation</p>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ivory/70 hover:text-ivory transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          {HAS_SOCIAL_LINKS && (
            <div>
              <p className="text-2xs text-muted tracking-editorial uppercase mb-5">Follow</p>
              <SocialLinks
                className="flex-col items-start gap-3"
                linkClassName="text-sm text-ivory/70 hover:text-ember transition-colors"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-2xs text-faint tracking-editorial uppercase">
            Bocconi Students for Fashion
          </p>
          <p className="text-2xs text-faint tracking-editorial uppercase">
            Milan, Italy
          </p>
        </div>
      </div>
    </footer>
  );
}
