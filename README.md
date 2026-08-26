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
  layout.tsx             # Root layout (fonts, metadata)
  home/                  # Home page (/home)
  about/
    story/               # Our Story (/about/story)
    board/               # Board & Members (/about/board)
    alumni/              # Alumni (/about/alumni)
    professionals/       # For Professionals (/about/professionals)
  editorials/
    page.tsx             # Editorials landing — rubric rows, Supabase-backed (/editorials)
    [rubric]/
      page.tsx           # Rubric page (/editorials/culture)
      [slug]/
        page.tsx         # Article page (/editorials/culture/my-article)
  events/
    page.tsx             # Events landing — calendar + Milan map, Supabase-backed (/events)
    [slug]/
      page.tsx           # Individual event (/events/my-event)
  gallery/               # Masonry gallery (/gallery)
  join/                  # Join Our Team (/join)
  admin/                 # CMS admin panel (/admin) — password: bs4f2024
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
    Navbar.tsx           # Sticky nav with dropdown + mobile drawer
    Footer.tsx           # Site footer
  ui/
    AnimatedSection.tsx  # Scroll-triggered reveal wrapper
    PageTransition.tsx   # Page-level fade transitions
  dashboard/
    ArticleEditor.tsx    # TipTap rich-text editor used by /dashboard/new and /dashboard/edit
    EventEditor.tsx      # Event form used by /dashboard/new-event and /dashboard/edit-event
  events/
    EventCalendar.tsx    # Month-view calendar for /events, click a day to expand
    MilanMap.tsx          # Low-poly Milan illustration with clickable event pins
    MilanMapBackground.tsx # The shared static SVG illustration itself
    MapPinPicker.tsx      # Click-to-place pin picker used inside EventEditor
  auth/
    ResetPasswordForm.tsx # New-password form used by /reset-password

data/                    # Mock CMS — JSON files
  articles.json          # Unused now — editorials are Supabase-backed, kept as an empty [] placeholder
  events.json            # Unused now — events are Supabase-backed, kept as an empty placeholder
  members.json           # Board + team members
  alumni.json            # Alumni directory
  gallery.json           # Gallery images
  professionals.json     # "For Professionals" page content

lib/
  utils.ts               # formatDate, readingTimeLabel, slugify, cn
  supabase/
    client.ts            # Browser Supabase client
    server.ts             # Server Component Supabase client
    middleware.ts         # Session refresh helper used by middleware.ts

types/
  member-article.ts       # MemberArticle type (Supabase `articles` table row)
  member-event.ts         # MemberEvent type (Supabase `events` table row)

supabase/
  schema.sql              # Full database schema (articles + events), RLS policies, storage buckets — run in Supabase SQL Editor
  002_add_rubric_column.sql  # Incremental migration, only needed on projects from before rubrics existed
  003_events_table.sql       # Incremental migration, only needed on projects from before events existed

public/
  uploads/               # File upload destination for admin
```

---

## How to Add Content

### Articles
Articles are no longer stored in JSON — they're published by members through `/dashboard/new`, backed by Supabase (see [Member Login & Article Publishing](#member-login--article-publishing)). There's no admin-side "add article" form anymore.

### Events
Events are no longer stored in JSON either — they're published by members through `/dashboard/new-event`, backed by Supabase. "Upcoming" vs "Past" is computed automatically from each event's date, not maintained as separate lists.

### Members / Board
Edit `data/members.json`. Add to `board` array or to the relevant team in `teams`.

### Alumni
Edit `data/alumni.json`. Add an object with `name`, `graduatingClass`, `company`, `position`, `bocconProgram`, `location`, `linkedin`, `photo`.

### Gallery
Edit `data/gallery.json`. Add `{ "id", "src", "alt", "category" }`.

---

## Admin Panel

Visit `/admin`. Default password: `bs4f2024`. Covers Members and Alumni only — articles and events are managed by members themselves via `/dashboard`, not from here.

> To change the password: edit `ADMIN_PASSWORD` in `app/admin/page.tsx` and move it to an environment variable before deploying.

---

## Member Login, Articles & Events

Members can log in, write and publish articles from a docs-style editor with a rubric picker, and publish events with a picture, description, price, dress code, registration info, and a pin on a low-poly Milan map — all from the same `/dashboard`. The public reads published articles on the Editorials pages (`/editorials`, `/editorials/[rubric]`, `/editorials/[rubric]/[slug]`) and sees events on a calendar + map at `/events`. This is powered by [Supabase](https://supabase.com) (Auth + Postgres + Storage), chosen because it's free-tier friendly and gives us auth, a database, and file storage in one project with server-side security rules (Row Level Security).

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
- The `articles` table (title, content, cover image, author, rubric, status, timestamps).
- The `events` table (title, description, price, dress code, registration info, date/time, location, map pin, status, timestamps).
- Row Level Security policies for both: anyone can read **published** rows, but only the author can read/edit/delete their own drafts and rows.
- Public `article-images` and `event-images` Storage buckets, each with policies so members can only upload into their own folder.

No further configuration is needed — RLS is enforced by Postgres itself, not just the app code. Supabase's SQL Editor will show a "destructive operations" warning before running this — that's just because it contains `CREATE TABLE` / `DROP TRIGGER IF EXISTS` statements; it's safe to run and doesn't touch any existing data.

If your project already existed before rubrics or events were added, run [`supabase/002_add_rubric_column.sql`](supabase/002_add_rubric_column.sql) and/or [`supabase/003_events_table.sql`](supabase/003_events_table.sql) too (skip both on a brand-new project — `schema.sql` already includes them).

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

| Token | Value |
|---|---|
| `obsidian` | `#0A0A0A` |
| `charcoal` | `#111111` |
| `ember` | `#C0392B` |
| `ivory` | `#F5F0EB` |
| `muted` | `#888888` |
| Font serif | Playfair Display |
| Font sans | Inter |
| Font display | DM Serif Display |
