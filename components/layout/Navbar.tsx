"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SocialLinks from "@/components/ui/SocialLinks";

const navLinks = [
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "About Us", href: "/about/story" },
      { label: "Meet the Team", href: "/about/board" },
      { label: "Alumni", href: "/about/alumni" },
      { label: "For Professionals", href: "/about/professionals" },
    ],
  },
  { label: "Editorials", href: "/editorials" },
  { label: "Events", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Gallery", href: "/gallery" },
  { label: "Join Our Team", href: "/join" },
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close the desktop dropdown on outside click / Escape.
  useEffect(() => {
    if (!activeDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [activeDropdown]);

  // Mobile drawer: Escape-to-close, focus trap, focus restoration.
  useEffect(() => {
    if (!mobileOpen) return;
    const drawer = mobileDrawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

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
        <nav aria-label="Primary" className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="group flex items-center gap-2">
            <span className="font-serif text-2xl text-ivory tracking-wider group-hover:text-ember transition-colors duration-300">
              BS4F
            </span>
            <span className="hidden sm:block w-px h-5 bg-ember/40" />
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
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === link.label}
                    onClick={() =>
                      setActiveDropdown(activeDropdown === link.label ? null : link.label)
                    }
                    className={`text-xs tracking-editorial uppercase font-sans transition-colors duration-200 flex items-center gap-1 ${
                      pathname.startsWith(link.href)
                        ? "text-ivory"
                        : "text-muted hover:text-ivory"
                    }`}
                  >
                    {link.label}
                    <svg
                      className="w-3 h-3 transition-transform duration-200"
                      style={{ transform: activeDropdown === link.label ? "rotate(180deg)" : "rotate(0deg)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                    className={`relative text-xs tracking-editorial uppercase font-sans transition-colors duration-200 ${
                      pathname.startsWith(link.href)
                        ? "text-ivory"
                        : "text-muted hover:text-ivory"
                    }`}
                  >
                    {link.label}
                    {pathname.startsWith(link.href) && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ember" />
                    )}
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
                        role="menu"
                        aria-label={link.label}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-charcoal border border-white/8 rounded-sm shadow-2xl overflow-hidden"
                      >
                        {link.dropdown.map((item, i) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
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
            ref={mobileToggleRef}
            type="button"
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
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
            id="mobile-nav-drawer"
            ref={mobileDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
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
                          type="button"
                          aria-expanded={activeDropdown === link.label}
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === link.label ? null : link.label
                            )
                          }
                          className="w-full text-left py-4 border-b border-white/8 font-display text-3xl text-ivory flex items-center justify-between"
                        >
                          {link.label}
                          <svg className={`w-5 h-5 text-muted transition-transform duration-300 ${activeDropdown === link.label ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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

            <div className="mt-auto">
              <SocialLinks />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
