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

export type ApplicationSettings = {
  // ISO "YYYY-MM-DD", interpreted in Europe/Rome local time.
  openDate: string | null;
  closeDate: string | null;
  googleFormUrl: string | null;
  eligibility: string | null;
  contactEmail: string | null;
};

// Application window for the Sept 2026 recruitment round (doc: "Thursday
// September 17th 9:00am" – "Monday September 21st 7:00pm"). The exact
// copy for the /join page lives directly on JoinPageClient.tsx, same as
// the approved About Us copy on StoryPageClient.tsx — this object just
// drives the open/closed boolean the /join page and home CTA read from.
// No Google Form link was supplied ("link will be in our bio" per the
// brief) — leave googleFormUrl null until BS4F provides one.
export const APPLICATION_SETTINGS: ApplicationSettings = {
  openDate: "2026-09-17",
  closeDate: "2026-09-21",
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
  // The doc originally said "ABOUT US section needs to be drafted by our
  // team" — BS4F has since supplied final copy (Sept 2026 brief) and it's
  // live on /about/story. Flagged here so an editor can see at a glance
  // that the current copy is confirmed, not a placeholder.
  isApprovedFinal: boolean;
  note: string;
};

export const ABOUT_US_SETTINGS: AboutUsSettings = {
  isApprovedFinal: true,
  note:
    "Final copy supplied by the BS4F team (Sept 2026 brief) and live on app/about/story/StoryPageClient.tsx.",
};

export type AnnouncementSettings = {
  // Turn the whole modal off without touching AnnouncementModal.tsx.
  enabled: boolean;
  // Bump this when the content below changes so the modal reappears even
  // for visitors who already dismissed an earlier announcement this
  // session — it's part of the sessionStorage dismissal key.
  id: string;
  heading: string;
  date: string;
  time: string;
  message: string;
};

// Single source of truth for the entry announcement modal (components/ui/
// AnnouncementModal.tsx, shown on /home). Update the copy here — no need
// to touch the component itself.
export const ANNOUNCEMENT_SETTINGS: AnnouncementSettings = {
  enabled: true,
  id: "associations-on-display-2026-09-17",
  heading: "Associations on Display",
  date: "Thursday 17th",
  time: "10:00–18:30",
  message: "Waiting for you!",
};
