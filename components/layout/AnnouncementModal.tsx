"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ANNOUNCEMENT_SETTINGS } from "@/data/site-settings";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const DISMISS_KEY = `bs4f-announcement-dismissed:${ANNOUNCEMENT_SETTINGS.id}`;

export default function AnnouncementModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Show once per browser session, unless a previous visit already dismissed
  // this exact announcement (tracked by ANNOUNCEMENT_SETTINGS.id).
  useEffect(() => {
    if (!ANNOUNCEMENT_SETTINGS.enabled) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // sessionStorage unavailable (private browsing, etc.) — show once and move on.
    }
    setOpen(true);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Nothing to persist to — the modal simply won't remember for next time.
    }
  };

  // Focus trap, Escape-to-close, background scroll lock, focus restoration.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;
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
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open]);

  if (!ANNOUNCEMENT_SETTINGS.enabled) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) dismiss();
          }}
        >
          <div className="absolute inset-0 bg-obsidian/85 backdrop-blur-sm" />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-heading"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 w-full max-w-sm overflow-hidden border border-white/10 bg-charcoal shadow-2xl max-h-[90vh]"
          >
            <div className="relative aspect-[3/4] min-h-[420px]">
              <Image
                src="/images/gallery/more-040-enriquez.jpg"
                alt="A BS4F garment display at Milan Fashion Week"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 384px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/75 to-obsidian/20" />

              <button
                ref={closeButtonRef}
                type="button"
                onClick={dismiss}
                aria-label="Close announcement"
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center border border-white/40 bg-obsidian/40 text-ivory hover:border-ivory hover:bg-obsidian/70 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              </button>

              <div className="relative z-10 flex h-full flex-col items-center justify-end gap-3 px-6 pb-10 text-center">
                <p
                  id="announcement-heading"
                  className="font-display font-bold text-ember-light text-2xl sm:text-3xl uppercase tracking-wide leading-tight"
                >
                  {ANNOUNCEMENT_SETTINGS.heading}
                </p>
                <p className="font-display text-ivory text-3xl sm:text-4xl leading-none mt-1">
                  {ANNOUNCEMENT_SETTINGS.date}
                </p>
                <p className="text-ivory text-lg sm:text-xl font-sans tracking-[0.15em]">
                  {ANNOUNCEMENT_SETTINGS.time}
                </p>
                <p className="text-ivory/80 font-serif italic text-base mt-2">
                  {ANNOUNCEMENT_SETTINGS.message}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
