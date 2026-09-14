// Central, typed configuration for content that either (a) is genuinely
// site-wide (socials, application window) or (b) is still pending from the
// client. Nothing here is fabricated — every null/empty value is a real gap,
// named so it's obvious where to fill it in once the real content arrives.
// See README.md "Missing Assets" for the full list and where each one goes.

export type SocialLinks = {
  instagram: string | null;
  tiktok: string | null;
  linkedin: string | null;
};

// BS4F's real Instagram and TikTok URLs were not included in the requirements
// doc or repo ("DO NOT FORGET TO PUT THE RIGHT LINKS TO THE TIKTOK AND
// INSTAGRAM" — doc, Sept 2026). Fill these in with the verified account URLs;
// <SocialLinks /> (components/ui/SocialLinks.tsx) hides any link left null.
export const SOCIAL_LINKS: SocialLinks = {
  instagram: null,
  tiktok: null,
  linkedin: null,
};

export const HAS_SOCIAL_LINKS = Object.values(SOCIAL_LINKS).some(Boolean);

export type ApplicationStep = {
  title: string;
  description: string;
};

export type ApplicationSettings = {
  // ISO "YYYY-MM-DD", interpreted in Europe/Rome local time.
  openDate: string | null;
  closeDate: string | null;
  steps: ApplicationStep[];
  googleFormUrl: string | null;
  eligibility: string | null;
  contactEmail: string | null;
};

// Pending: "Steps to applying to BS4F still need to be drafted + google form
// link placed on the website for the duration of applications" (doc). Once
// BS4F supplies these, fill in steps/googleFormUrl/dates here — the /join
// page and home CTA both read from this object and update automatically.
export const APPLICATION_SETTINGS: ApplicationSettings = {
  openDate: null,
  closeDate: null,
  steps: [],
  googleFormUrl: null,
  eligibility: null,
  contactEmail: null,
};

const ROME_TZ = "Europe/Rome";

function toRomeDateString(date: Date): string {
  // en-CA formats as YYYY-MM-DD, which sorts/compares like ISO.
  return new Intl.DateTimeFormat("en-CA", { timeZone: ROME_TZ }).format(date);
}

/** Pure so it's independently testable — pass `now` explicitly in tests. */
export function isApplicationOpen(
  settings: Pick<ApplicationSettings, "openDate" | "closeDate">,
  now: Date = new Date()
): boolean {
  if (!settings.openDate) return false;
  const today = toRomeDateString(now);
  if (today < settings.openDate) return false;
  if (settings.closeDate && today > settings.closeDate) return false;
  return true;
}

/** Only render a Google Form link if it actually looks like one. */
export function isValidGoogleFormUrl(url: string | null): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "docs.google.com" || parsed.hostname === "forms.gle")
    );
  } catch {
    return false;
  }
}

export type EventsHeroSettings = {
  // Pending: "TikTok team can be in charge of filming this content + we can
  // use videos from BS4F dinner and fashion week events" (doc). Until
  // supplied, the Events hero falls back to a static image.
  videoUrl: string | null;
  posterImage: string;
  subtitle: string;
};

export const EVENTS_HERO_SETTINGS: EventsHeroSettings = {
  videoUrl: null,
  posterImage: "https://images.unsplash.com/photo-1645211710746-9629755e6814?w=1920&q=85",
  subtitle: "What has BS4F been up to?",
};

export type AboutUsSettings = {
  // The doc explicitly says "ABOUT US section needs to be drafted by our
  // team" — the current prose on /about/story predates that note and has
  // not been confirmed as final client copy. Flagged here so an editor
  // knows to replace it; not shown on the live page.
  isApprovedFinal: boolean;
  note: string;
};

export const ABOUT_US_SETTINGS: AboutUsSettings = {
  isApprovedFinal: false,
  note:
    "Draft copy pending final sign-off from the BS4F team (see requirements doc, Sept 2026). Replace app/about/story/page.tsx copy once approved and set isApprovedFinal to true.",
};
