import { SOCIAL_LINKS } from "@/data/site-settings";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "linkedin", label: "LinkedIn" },
] as const;

/**
 * Renders only the socials configured in data/site-settings.ts. Real BS4F
 * Instagram/TikTok URLs weren't supplied yet, so by default this renders
 * nothing rather than a fake/generic link — see SOCIAL_LINKS for where to
 * add them.
 */
export default function SocialLinks({
  className,
  linkClassName,
}: {
  className?: string;
  linkClassName?: string;
}) {
  const active = PLATFORMS.filter((p) => SOCIAL_LINKS[p.key]);
  if (active.length === 0) return null;

  return (
    <ul className={cn("flex items-center gap-6", className)}>
      {active.map((p) => (
        <li key={p.key}>
          <a
            href={SOCIAL_LINKS[p.key]!}
            target="_blank"
            rel="noopener noreferrer"
            className={
              linkClassName ??
              "text-xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
            }
          >
            {p.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
