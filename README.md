# BS4F Website

Bocconi Students for Fashion — official association website.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Supabase (Auth, Postgres, Storage)

---

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase project keys, see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site itself runs without Supabase configured, but the member login, dashboard, and article publishing features require it — see [Member Login & Article Publishing](#member-login--article-publishing) below.

---

## Folder Structure

```
app/
  page.tsx               # Splash/entry page (/)
  layout.tsx             # Root layout (fonts, metadata, MotionConfig, skip link)
  home/                  # Home page (/home) — compact section index, not full-height panels
  about/
    story/               # About Us / Our Story (/about/story) — draft copy, see data/site-settings.ts
    board/               # Meet the Team (/about/board) — board hero + full roster directory
    alumni/              # Alumni (/about/alumni) — name/year/LinkedIn only, no photos
    professionals/       # For Professionals (/about/professionals)
  editorials/
    page.tsx             # Editorials landing — featured newest + series tabs, Supabase-backed (/editorials)
    [rubric]/
      page.tsx           # Rubric page, secondary taxonomy (/editorials/culture)
      [slug]/
        page.tsx         # Article page — renders by template variant (/editorials/culture/my-article)
  events/
    page.tsx             # Events landing — video-ready hero, BS4F vs Milan split (/events)
    [slug]/
      page.tsx           # Individual event (/events/my-event)
  map/                   # Map — events + places on one Leaflet map + list view (/map)
  gallery/               # "From Our Cameras" masonry gallery (/gallery)
  join/                  # Join Our Team — config-driven application status (/join)
  admin/                 # Signed-in-only pointer to /dashboard (the old fake CMS was removed — see below)
  login/                 # Member login, sign-up, forgot-password (/login)
  auth/
    callback/            # Exchanges Supabase email-link codes for a session (/auth/callback)
  reset-password/        # Set a new password after a reset-link click (/reset-password)
  dashboard/
    page.tsx             # Member dashboard — own articles + events (/dashboard)
    new/                 # Publish new article (/dashboard/new)
    edit/[id]/           # Edit own article (/dashboard/edit/:id)
    new-event/           # Publish new event (/dashboard/new-event)
    edit-event/[id]/     # Edit own event (/dashboard/edit-event/:id)

components/
  layout/
    Navbar.tsx           # Sticky nav, keyboard/click-accessible dropdown, mobile drawer with focus trap
    Footer.tsx           # Site footer
  ui/
    AnimatedSection.tsx  # Scroll-triggered reveal wrapper
    PageTransition.tsx   # Page-level fade transitions
    SocialLinks.tsx      # Renders only the socials configured in data/site-settings.ts
  editorial/
    templates/           # The 4 article layout variants (feature, portrait-interview, landscape-spread, typographic)
    ArticleCard.tsx, ArticleCarousel.tsx, FeaturedArticle.tsx, EditorialsTabs.tsx, RelatedArticles.tsx, ArticleMeta.tsx
  map/
    PlacesMap.tsx         # Leaflet map merging events + places, category filter, popup preview
    PlacesList.tsx         # Accessible list alternative to the map
  dashboard/
    ArticleEditor.tsx    # TipTap rich-text editor used by /dashboard/new and /dashboard/edit
    EventEditor.tsx      # Event form used by /dashboard/new-event and /dashboard/edit-event
  events/
    EventCalendar.tsx    # Month-view calendar for /events, click a day to expand
    EventsHero.tsx        # Video-ready hero with scroll-out title, reduced-motion fallback
    EventsMap.tsx          # Leaflet map (OSM/CARTO tiles) with clickable event pins
    MapPinPicker.tsx      # Click-to-place pin picker used inside EventEditor
  auth/
    ResetPasswordForm.tsx # New-password form used by /reset-password

data/                    # Mock CMS — JSON files, plus one typed config file
  articles.json          # Unused now — editorials are Supabase-backed, kept as an empty [] placeholder
  events.json            # Unused now — events are Supabase-backed, kept as an empty placeholder
  members.json           # Board + Communications + Events team rosters (see below)
  alumni.json            # Alumni directory — name/year/LinkedIn only, no photos (currently empty)
  gallery.json           # Gallery images (currently empty — see "Gallery" below)
  professionals.json     # "For Professionals" page content
  site-settings.ts        # Socials, application window, events-hero video slot, About Us draft flag — see below

lib/
  utils.ts               # formatDate, readingTimeLabel, slugify, cn
  repository.ts           # Supabase query wrappers + pure sort/filter/classify helpers (unit-tested)
  supabase/
    client.ts            # Browser Supabase client
    server.ts             # Server Component Supabase client
    middleware.ts         # Session refresh helper used by middleware.ts

types/
  member-article.ts       # MemberArticle type + RUBRICS (secondary taxonomy) + SERIES (primary taxonomy) + TEMPLATES
  member-event.ts         # MemberEvent type + EVENT_CATEGORIES (bs4f / milan)
  place.ts                # Place type (Map page: venues, businesses, article locations)

supabase/
  schema.sql              # Full database schema (articles, events, places), RLS policies, storage buckets — run in Supabase SQL Editor
  002_add_rubric_column.sql  # Incremental migration, only needed on projects from before rubrics existed
  003_events_table.sql       # Incremental migration, only needed on projects from before events existed
  004_map_lat_lng.sql         # Incremental migration, only needed on projects from before the interactive map existed
  005_editorial_event_extensions.sql  # Incremental migration: places table + article/event dek, taxonomy, template, SEO, and relation columns — only needed on projects that ran schema.sql before Sept 2026
```

---

## How to Add Content

### Articles
Articles are no longer stored in JSON — they're published by members through `/dashboard/new`, backed by Supabase (see [Member Login & Article Publishing](#member-login--article-publishing)). Each article also has a `series` (the primary Editorials-page tabs: Blog, Fashion Week, Milanese Happenings, History of Fashion, Interviews), a `rubric` (the older secondary taxonomy: Culture, Business, Industry Interviews, Bocco Brands, Opinion Pieces), a layout `template` (feature / portrait-interview / landscape-spread / typographic), and optional tags, credits, SEO fields, and related event/location links — all editable from the dashboard editor.

### Events
Events are no longer stored in JSON either — they're published by members through `/dashboard/new-event`, backed by Supabase. Each event has a `category` (`bs4f` for BS4F-organized events, `milan` for "What's Happening in Milan?"). "Upcoming" vs "Past" is computed automatically from each event's date, not maintained as separate lists.

### Places (Map)
Places (venues, businesses, locations mentioned in articles) aren't authored from the dashboard UI yet — insert rows directly into the Supabase `places` table (same shape as `articles`/`events`: `name`, `category`, `description`, `address`, `map_lat`, `map_lng`, `photo`, optional `rating` 0–5, `info_url`, `related_article_id`, `related_event_id`, `status`). They show up automatically on `/map` alongside events that have map coordinates.

### Members / Board / Teams
Edit `data/members.json` — three arrays: `board`, `communications`, `events`. Each person is `{ id, name, role, teams: string[], photo, linkedin, cohort, sortOrder, active }`. `photo`/`linkedin`/`role`/`cohort` can be `null`; the UI hides what's missing rather than showing a broken image or dead link.

### Alumni
Edit `data/alumni.json`. Add `{ "id", "name", "year", "linkedin" }` — deliberately no photo, company, or program field (the requirements doc: alumni entries should be "just name, year, and linkedin link if allowed"). `linkedin` may be `null`.

### Gallery
Edit `data/gallery.json`. Add `{ "id", "src", "alt", "category" }`, with images under `public/images/gallery/`. Currently seeded with 92 photos sampled (~1 in 3 per show) from the Comms team's MFW FW26-27 Drive folder, resized/compressed for web and downsized from HEIC where needed. Add more from the same Drive (or a future one) the same way — download, `sips -s format jpeg` for any `.HEIC` files, resize to ≤1800px on the long edge, drop into `public/images/gallery/`, and add an entry here. The page's empty state only shows when this file is `[]`.

### Site-wide settings
Edit `data/site-settings.ts` for: `SOCIAL_LINKS` (Instagram/TikTok/LinkedIn — a link only renders once its URL is set here), `APPLICATION_SETTINGS` (open/close dates, step-by-step instructions, Google Form URL, eligibility, contact — drives the `/join` page's open/closed state and CTA), `EVENTS_HERO_SETTINGS` (background video URL for the Events hero, falls back to a static image while unset), and `ABOUT_US_SETTINGS` (flags whether the `/about/story` copy has been approved as final by the BS4F team).

---

## Admin Panel

There isn't one anymore. `/admin` used to be a client-side "CMS" gated by a password shipped in the browser bundle (`bs4f2024`), whose Save buttons didn't actually persist anything — no fetch/API call, just a fake "Saved ✓" toast. That's an unfinished tool exposed publicly, which is a real problem, not a convenience, so it's been removed rather than half-fixed. `/admin` now just redirects a signed-out visitor to `/login` and shows a signed-in member a pointer to `/dashboard`.

Articles and events already have a real, working, server-authorized authoring flow at `/dashboard` (see below). Members, alumni, and gallery content are plain data files edited directly in the repo — see [How to Add Content](#how-to-add-content) above for the exact shape of each file.

---

## Member Login, Articles & Events

Members can log in, write and publish articles from a docs-style editor with a series/rubric/template picker, and publish events with a picture, description, price, dress code, registration info, and a pin on a real interactive map — all from the same `/dashboard`. The public reads published articles on the Editorials pages (`/editorials`, `/editorials/[rubric]`, `/editorials/[rubric]/[slug]`) and sees events on a calendar + map at `/events` and `/map`. This is powered by [Supabase](https://supabase.com) (Auth + Postgres + Storage), chosen because it's free-tier friendly and gives us auth, a database, and file storage in one project with server-side security rules (Row Level Security).

**Mae and Louis (or any BS4F member) get publishing access just by having an account** — there's no separate admin role or allow-list to configure. Row Level Security is ownership-based, not role-based: any authenticated member can create/edit/delete their own articles and events, and anyone can read published ones. So "Mae and Louis can't publish" is an onboarding step (give them accounts, per step 3 below), not a missing feature.

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In **Project Settings → API**, copy the **Project URL** and **anon public** key.
3. Create `.env.local` in the project root (copy from `.env.local.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   Restart `npm run dev` after adding this file.

### 2. Set up the database, storage, and security rules

Open the Supabase Dashboard → **SQL Editor** → **New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates:
- The `articles` table (title, subtitle, content, cover image, author, series, rubric, template, tags, credits, SEO fields, related event/location, status, timestamps).
- The `events` table (title, description, category (BS4F/Milan), price, dress code, registration info, date/time, location, map pin, video, related article, status, timestamps).
- The `places` table (Map page: venues, businesses, article/event locations, optional rating, status, timestamps).
- Row Level Security policies for all three: anyone can read **published** rows, but only the author can read/edit/delete their own drafts and rows.
- Public `article-images`, `event-images`, and `place-images` Storage buckets, each with policies so members can only upload into their own folder.

No further configuration is needed — RLS is enforced by Postgres itself, not just the app code. Supabase's SQL Editor will show a "destructive operations" warning before running this — that's just because it contains `CREATE TABLE` / `DROP TRIGGER IF EXISTS` statements; it's safe to run and doesn't touch any existing data.

If your project already existed before rubrics, events, the interactive map, or the Sept 2026 editorial/event extensions were added, run [`supabase/002_add_rubric_column.sql`](supabase/002_add_rubric_column.sql), [`supabase/003_events_table.sql`](supabase/003_events_table.sql), [`supabase/004_map_lat_lng.sql`](supabase/004_map_lat_lng.sql), and/or [`supabase/005_editorial_event_extensions.sql`](supabase/005_editorial_event_extensions.sql) too (skip all of them on a brand-new project — `schema.sql` already includes everything).

### 3. Create member accounts

Members can create their own account — click **New member? Sign up** on `/login`, which asks for name, email, and password (`supabase.auth.signUp`). Whether they need to click an email confirmation link before their first login depends on your project's **Authentication → Providers → Email → Confirm email** setting (on by default for new Supabase projects). Either way, the login page handles both cases automatically.

You can also add accounts directly from the Supabase Dashboard if you prefer to onboard members yourself:
1. Go to **Authentication → Users → Add User**.
2. Enter the member's email and a temporary password, and share it with them.
3. They can log in immediately at `/login`.

**Password reset:** click **Forgot password?** on `/login`, enter the account email, and a reset link is emailed via Supabase. Clicking it signs the browser in with a one-time recovery session and lands on `/reset-password` to set a new password — no dashboard-side configuration needed.

### 4. Test the flow

1. Visit `/about/board` (Board & Members) and click **Log In** — or go directly to `/login`.
2. Log in with a member account (or sign up for a new one). You're redirected to `/dashboard`.
3. Click **Publish New Article**, pick a rubric, a publish date, a title, write content, optionally add a cover image and inline images, then **Save Draft** or **Publish**. The publish date is fully manual — useful for backdating articles (e.g. migrated content) or correcting it later; it's not tied to when you actually clicked Publish.
4. Drafts stay private — visiting `/editorials` or `/editorials/[rubric]` should not show them, but they appear on the member's own `/dashboard`.
5. Publishing redirects to the live article at `/editorials/[rubric]/your-article-slug`, which shows the title, "Written by [Name]", the publish date, and inline images — and it should also appear in that rubric's row on `/editorials` and grid on `/editorials/[rubric]`.
6. From the dashboard, click **Edit** on any of your own articles to change it — try editing an article belonging to a different account's ID directly via the URL (`/dashboard/edit/:id`) to confirm it redirects you back to `/dashboard` (ownership check).
7. Click **Delete** on an article, confirm the prompt, and confirm it disappears from the dashboard and (if it was published) from the Editorials pages.
8. Click **Log Out** on the dashboard, then try visiting `/dashboard` directly — you should be redirected to `/login`.
9. Test **Forgot password?** with a real account email and confirm the emailed link lets you set a new password and lands you on `/dashboard`.
10. From `/dashboard`, click **Publish New Event** — add a picture, title, description, date (**must be a real future date** — anything today or earlier is treated as a past event and won't show on the calendar/map), time, location, price, dress code, registration info, and click on the mini map to place a pin, then **Publish**.
11. Visit `/events` — your event's date should show a marker on the calendar (navigate months with the arrows if it's not in the current month); click that day to expand a preview, then **More Info** to reach the full event page.
12. Scroll to the map below the calendar — your event's pin should appear at the position you clicked; click it to expand the same kind of preview, then **View More Information**.
13. Once the event's date has passed, it should automatically move out of the calendar/map and appear under **Past Events**, grouped by year — no manual step needed.

---

## Upgrading to a Real CMS

Articles and events already run on a real backend (Supabase). The remaining JSON data (members, alumni, gallery, professionals) is designed to be Sanity/Contentful-compatible if you want to move those too. When ready:
1. Create matching schemas in your CMS
2. Replace `import data from "@/data/xxx.json"` with API fetch calls
3. Add `revalidate` or `cache` directives as needed for ISR

---

## Design Tokens

Defined in `tailwind.config.ts`, plus a few hardcoded hex values in `app/globals.css` (scrollbar, selection, focus ring) that should stay in sync with these.

| Token | Value |
|---|---|
| `obsidian` | `#0A0A0A` |
| `charcoal` | `#111111` |
| `ember` | `#950606` (dark red, per the brand swatch — not the earlier brighter `#C0392B`) |
| `ember-light` | `#B91C1C` |
| `ember-dark` | `#5C0303` |
| `ivory` | `#F5F0EB` |
| `muted` | `#888888` |
| Font (serif/sans/display) | Times New Roman — a deliberate site-wide choice (`app/globals.css` forces it on every element); this is intentional, not a fallback |

---

## Testing

```bash
npm test
```

Runs `vitest` against the pure logic in `lib/repository.ts` and `data/site-settings.ts` — newest-article sorting, series/rubric filtering, related-article resolution, upcoming/past event classification, and application open/closed date math (including the Europe/Rome timezone boundary). These don't need a database or a browser; they test plain functions with plain arrays in, plain results out.

There's no component/E2E test runner configured (no Playwright/RTL in this repo) — UI, keyboard, and visual behavior is verified manually in a browser instead of automated. `npm run lint` and `npx tsc --noEmit` cover static checks, and `npm run build` is the final gate.
