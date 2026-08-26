"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "Our Story", href: "/about/story" },
      { label: "Board & Members", href: "/about/board" },
      { label: "Alumni", href: "/about/alumni" },
      { label: "For Professionals", href: "/about/professionals" },
    ],
  },
  { label: "Editorials", href: "/editorials" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Join Our Team", href: "/join" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-obsidian/95 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="group flex items-center gap-2">
            <span className="font-serif text-2xl text-ivory tracking-wider group-hover:text-ember transition-colors duration-300">
              BS4F
            </span>
            <span className="hidden sm:block w-px h-5 bg-ash" />
            <span className="hidden sm:block text-2xs text-muted tracking-editorial uppercase font-sans">
              Bocconi Students for Fashion
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.dropdown ? (
                  <button
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={`text-xs tracking-editorial uppercase font-sans transition-colors duration-200 flex items-center gap-1 ${
                      pathname.startsWith(link.href)
                        ? "text-ivory"
                        : "text-muted hover:text-ivory"
                    }`}
                  >
                    {link.label}
                    <svg className="w-3 h-3 transition-transform duration-200" style={{ transform: activeDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={`text-xs tracking-editorial uppercase font-sans transition-colors duration-200 ${
                      pathname.startsWith(link.href)
                        ? "text-ivory"
                        : "text-muted hover:text-ivory"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {link.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setActiveDropdown(link.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-charcoal border border-white/8 rounded-sm shadow-2xl overflow-hidden"
                      >
                        {link.dropdown.map((item, i) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-5 py-3 text-xs tracking-editorial uppercase font-sans text-muted hover:text-ivory hover:bg-white/5 transition-colors duration-150 ${
                              i !== link.dropdown!.length - 1
                                ? "border-b border-white/5"
                                : ""
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px bg-ivory origin-center"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-px bg-ivory"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px bg-ivory origin-center"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-obsidian flex flex-col pt-24 px-8 pb-10"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <div key={link.href}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                  >
                    {link.dropdown ? (
                      <>
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === link.label ? null : link.label
                            )
                          }
                          className="w-full text-left py-4 border-b border-white/8 font-display text-3xl text-ivory flex items-center justify-between"
                        >
                          {link.label}
                          <svg className={`w-5 h-5 text-muted transition-transform duration-300 ${activeDropdown === link.label ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {activeDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              {link.dropdown.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className="block py-3 pl-4 text-muted text-sm tracking-editorial uppercase hover:text-ivory transition-colors"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        className="block py-4 border-b border-white/8 font-display text-3xl text-ivory"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex gap-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ivory transition-colors text-xs tracking-editorial uppercase">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ivory transition-colors text-xs tracking-editorial uppercase">LinkedIn</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ivory transition-colors text-xs tracking-editorial uppercase">TikTok</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
