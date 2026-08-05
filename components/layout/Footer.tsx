import Link from "next/link";

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

const links = [
  { label: "About", href: "/about/story" },
  { label: "Editorials", href: "/editorials" },
  { label: "Member Articles", href: "/articles" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Join Our Team", href: "/join" },
  { label: "For Professionals", href: "/about/professionals" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
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
          <div>
            <p className="text-2xs text-muted tracking-editorial uppercase mb-5">Follow</p>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ivory/70 hover:text-ember transition-colors flex items-center gap-2 group"
                  >
                    {s.label}
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-2xs text-faint tracking-editorial uppercase">
            &copy; {new Date().getFullYear()} BS4F — Bocconi Students for Fashion
          </p>
          <p className="text-2xs text-faint tracking-editorial uppercase">
            Milan, Italy
          </p>
        </div>
      </div>
    </footer>
  );
}
