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
    page.tsx             # Editorials landing — rubric rows (/editorials)
    [rubric]/
      page.tsx           # Rubric page (/editorials/culture)
      [slug]/
        page.tsx         # Article page (/editorials/culture/my-article)
  events/
    page.tsx             # Events landing (/events)
    [slug]/
      page.tsx           # Individual event (/events/ev-p1)
  gallery/               # Masonry gallery (/gallery)
  join/                  # Join Our Team (/join)
  admin/                 # CMS admin panel (/admin) — password: bs4f2024
  login/                 # Member login, sign-up, forgot-password (/login)
  auth/
    callback/            # Exchanges Supabase email-link codes for a session (/auth/callback)
  reset-password/        # Set a new password after a reset-link click (/reset-password)
  dashboard/
    page.tsx             # Member dashboard — own articles (/dashboard)
    new/                 # Publish new article (/dashboard/new)
    edit/[id]/           # Edit own article (/dashboard/edit/:id)
  articles/
    page.tsx             # Public member articles listing (/articles)
    [slug]/               # Public member article page (/articles/my-article)

components/
  layout/
    Navbar.tsx           # Sticky nav with dropdown + mobile drawer
    Footer.tsx           # Site footer
  ui/
    AnimatedSection.tsx  # Scroll-triggered reveal wrapper
    PageTransition.tsx   # Page-level fade transitions
  dashboard/
    ArticleEditor.tsx    # TipTap rich-text editor used by /dashboard/new and /dashboard/edit
  auth/
    ResetPasswordForm.tsx # New-password form used by /reset-password

data/                    # Mock CMS — JSON files
  articles.json          # All editorial articles
  events.json            # Upcoming + past events
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

supabase/
  schema.sql              # Database table, RLS policies, storage bucket — run in Supabase SQL Editor

public/
  uploads/               # File upload destination for admin
```

---

## How to Add Content

### Articles
Edit `data/articles.json`. Each article needs:
```json
{
  "id": "unique-id",
  "slug": "url-slug",
  "title": "Article Title",
  "subtitle": "Subtitle",
  "rubric": "culture",
  "author": { "name": "...", "role": "...", "bio": "...", "photo": "url" },
  "coverImage": "url",
  "date": "YYYY-MM-DD",
  "readingTime": 7,
  "layout": "template-1",
  "excerpt": "Short excerpt",
  "content": "Full text...",
  "published": true
}
```
Rubric options: `culture` | `business` | `industry-interviews` | `bocco-brands` | `opinions`
Layout options: `template-1` (full-bleed hero) | `template-2` (side-by-side) | `template-3` (centered cinematic)

### Events
Edit `data/events.json`. Two arrays: `upcoming` and `past`.

### Members / Board
Edit `data/members.json`. Add to `board` array or to the relevant team in `teams`.

### Alumni
Edit `data/alumni.json`. Add an object with `name`, `graduatingClass`, `company`, `position`, `bocconProgram`, `location`, `linkedin`, `photo`.

### Gallery
Edit `data/gallery.json`. Add `{ "id", "src", "alt", "category" }`.

---

## Admin Panel

Visit `/admin`. Default password: `bs4f2024`.

> To change the password: edit `ADMIN_PASSWORD` in `app/admin/page.tsx` and move it to an environment variable before deploying.

---

## Member Login & Article Publishing

Members can log in, write and publish articles from a docs-style editor, edit their own articles, and the public can read published articles at `/articles`. This is powered by [Supabase](https://supabase.com) (Auth + Postgres + Storage), chosen because it's free-tier friendly and gives us auth, a database, and file storage in one project with server-side security rules (Row Level Security).

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
- The `articles` table (title, content, cover image, author, status, timestamps).
- Row Level Security policies: anyone can read **published** articles, but only the author can read/edit/delete their own drafts and articles.
- A public `article-images` Storage bucket with policies so members can only upload into their own folder.

No further configuration is needed — RLS is enforced by Postgres itself, not just the app code.

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
3. Click **Publish New Article**, add a title, write content, optionally add a cover image and inline images, then **Save Draft** or **Publish**.
4. Drafts stay private — visiting `/articles` should not show them, but they appear on the member's own `/dashboard`.
5. Publishing redirects to the live article at `/articles/your-article-slug`, which shows the title, "Written by [Name]", the publish date, and inline images.
6. From the dashboard, click **Edit** on any of your own articles to change it — try editing an article belonging to a different account's ID directly via the URL (`/dashboard/edit/:id`) to confirm it redirects you back to `/dashboard` (ownership check).
7. Click **Delete** on an article, confirm the prompt, and confirm it disappears from the dashboard and (if it was published) from `/articles`.
8. Click **Log Out** on the dashboard, then try visiting `/dashboard` directly — you should be redirected to `/login`.
9. Test **Forgot password?** with a real account email and confirm the emailed link lets you set a new password and lands you on `/dashboard`.

---

## Upgrading to a Real CMS

The JSON data structure is designed to be Sanity/Contentful-compatible. When ready:
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
