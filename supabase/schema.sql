-- BS4F member articles: run this once in the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)

create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  title text not null,
  subtitle text,
  slug text not null unique,
  -- Secondary/legacy taxonomy (kept — see `series` below for the primary one).
  rubric text not null default 'culture' check (rubric in ('culture', 'business', 'industry-interviews', 'bocco-brands', 'opinions')),
  -- Primary browsing taxonomy shown as tabs on /editorials. Nullable: articles
  -- without one show up in an "Uncategorized" bucket rather than being forced
  -- into a guessed series.
  series text check (series is null or series in ('blog', 'fashion-week', 'milanese-happenings', 'history-of-fashion', 'interviews')),
  tags text[] not null default '{}',
  template text not null default 'feature' check (template in ('feature', 'portrait-interview', 'landscape-spread', 'typographic')),
  content text not null default '',
  cover_image text,
  credits text,
  seo_title text,
  meta_description text,
  social_image text,
  -- related_event_id / related_location_id are added via `alter table` at the
  -- bottom of this file, once the events/places tables they reference exist.
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists articles_author_id_idx on public.articles (author_id);
create index if not exists articles_status_idx on public.articles (status);

alter table public.articles enable row level security;

-- Public visitors can read published articles; authors can also read their own drafts.
create policy "Published articles are publicly readable"
  on public.articles for select
  using (status = 'published' or auth.uid() = author_id);

-- Members can only create articles under their own account.
create policy "Members can insert their own articles"
  on public.articles for insert
  with check (auth.uid() = author_id);

-- Members can only edit their own articles.
create policy "Members can update their own articles"
  on public.articles for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- Members can only delete their own articles.
create policy "Members can delete their own articles"
  on public.articles for delete
  using (auth.uid() = author_id);

-- Keep updated_at current on every change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

-- Storage bucket for in-article and cover images.
insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

-- Anyone can view images (articles are public once published).
create policy "Article images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'article-images');

-- Members can only upload into a folder named after their own user id
-- (path convention: {auth.uid()}/{filename}).
create policy "Members can upload their own article images"
  on storage.objects for insert
  with check (
    bucket_id = 'article-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Members can delete their own article images"
  on storage.objects for delete
  using (
    bucket_id = 'article-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Member-published events (see 003_events_table.sql if this table doesn't exist yet
-- on a project that predates events).
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  title text not null,
  slug text not null unique,
  -- 'bs4f' = organized by BS4F (Upcoming/Past on /events). 'milan' = "What's
  -- Happening in Milan?" — relevant external events/places BS4F is surfacing.
  category text not null default 'bs4f' check (category in ('bs4f', 'milan')),
  event_type text,
  organizer text,
  cover_image text,
  video_url text,
  description text not null default '',
  full_description text,
  price text,
  dress_code text,
  how_to_register text,
  external_url text,
  event_date date not null,
  event_time text,
  location text,
  address text,
  map_lat double precision,
  map_lng double precision,
  -- related_article_id is added via `alter table` at the bottom of this file.
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists events_author_id_idx on public.events (author_id);
create index if not exists events_status_idx on public.events (status);
create index if not exists events_event_date_idx on public.events (event_date);

alter table public.events enable row level security;

create policy "Published events are publicly readable"
  on public.events for select
  using (status = 'published' or auth.uid() = author_id);

create policy "Members can insert their own events"
  on public.events for insert
  with check (auth.uid() = author_id);

create policy "Members can update their own events"
  on public.events for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "Members can delete their own events"
  on public.events for delete
  using (auth.uid() = author_id);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

create policy "Event images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'event-images');

create policy "Members can upload their own event images"
  on storage.objects for insert
  with check (
    bucket_id = 'event-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Members can delete their own event images"
  on storage.objects for delete
  using (
    bucket_id = 'event-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Places for the Map page: venues, businesses, and locations mentioned in
-- articles/events. Same author-owned RLS shape as articles/events.
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  name text not null,
  category text not null default 'venue' check (category in ('venue', 'business', 'place', 'article-location')),
  description text not null default '',
  address text,
  map_lat double precision not null,
  map_lng double precision not null,
  photo text,
  -- Never defaulted/fabricated — null unless a genuine rating is supplied.
  rating numeric check (rating is null or (rating >= 0 and rating <= 5)),
  info_url text,
  related_article_id uuid references public.articles (id) on delete set null,
  related_event_id uuid references public.events (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists places_author_id_idx on public.places (author_id);
create index if not exists places_status_idx on public.places (status);

alter table public.places enable row level security;

create policy "Published places are publicly readable"
  on public.places for select
  using (status = 'published' or auth.uid() = author_id);

create policy "Members can insert their own places"
  on public.places for insert
  with check (auth.uid() = author_id);

create policy "Members can update their own places"
  on public.places for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "Members can delete their own places"
  on public.places for delete
  using (auth.uid() = author_id);

drop trigger if exists places_set_updated_at on public.places;
create trigger places_set_updated_at
  before update on public.places
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('place-images', 'place-images', true)
on conflict (id) do nothing;

create policy "Place images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'place-images');

create policy "Members can upload their own place images"
  on storage.objects for insert
  with check (
    bucket_id = 'place-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Members can delete their own place images"
  on storage.objects for delete
  using (
    bucket_id = 'place-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Cross-links between articles, events, and places — added last so all three
-- tables already exist. Nullable, ON DELETE SET NULL: removing the related
-- row never breaks the article/event that pointed to it.
alter table public.articles add column if not exists related_event_id uuid references public.events (id) on delete set null;
alter table public.articles add column if not exists related_location_id uuid references public.places (id) on delete set null;
alter table public.events add column if not exists related_article_id uuid references public.articles (id) on delete set null;
