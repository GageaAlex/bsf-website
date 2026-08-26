"use client";

export default function CopyLinkButton() {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors border border-white/10 hover:border-white/30 px-4 py-2"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      Copy Link
    </button>
  );
}
