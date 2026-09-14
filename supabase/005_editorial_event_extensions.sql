-- Run this in the Supabase SQL Editor if your `articles`/`events` tables
-- already existed before this migration (i.e. before the Sept 2026 redesign
-- pass). Safe to skip on a brand new project — schema.sql already includes
-- all of this. Purely additive: no existing rows or columns are touched.

-- Places table (Map page: venues, businesses, article/event locations).
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
  rating numeric check (rating is null or (rating >= 0 and rating <= 5)),
  info_url text,
  related_article_id uuid,
  related_event_id uuid,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists places_author_id_idx on public.places (author_id);
create index if not exists places_status_idx on public.places (status);

alter table public.places enable row level security;

drop policy if exists "Published places are publicly readable" on public.places;
create policy "Published places are publicly readable"
  on public.places for select
  using (status = 'published' or auth.uid() = author_id);

drop policy if exists "Members can insert their own places" on public.places;
create policy "Members can insert their own places"
  on public.places for insert
  with check (auth.uid() = author_id);

drop policy if exists "Members can update their own places" on public.places;
create policy "Members can update their own places"
  on public.places for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Members can delete their own places" on public.places;
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

drop policy if exists "Place images are publicly readable" on storage.objects;
create policy "Place images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'place-images');

drop policy if exists "Members can upload their own place images" on storage.objects;
create policy "Members can upload their own place images"
  on storage.objects for insert
  with check (
    bucket_id = 'place-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Members can delete their own place images" on storage.objects;
create policy "Members can delete their own place images"
  on storage.objects for delete
  using (
    bucket_id = 'place-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- articles: dek/taxonomy/template/SEO/credits/relations
alter table public.articles add column if not exists subtitle text;
alter table public.articles add column if not exists series text;
alter table public.articles drop constraint if exists articles_series_check;
alter table public.articles add constraint articles_series_check
  check (series is null or series in ('blog', 'fashion-week', 'milanese-happenings', 'history-of-fashion', 'interviews'));
alter table public.articles add column if not exists tags text[] not null default '{}';
alter table public.articles add column if not exists template text not null default 'feature';
alter table public.articles drop constraint if exists articles_template_check;
alter table public.articles add constraint articles_template_check
  check (template in ('feature', 'portrait-interview', 'landscape-spread', 'typographic'));
alter table public.articles add column if not exists credits text;
alter table public.articles add column if not exists seo_title text;
alter table public.articles add column if not exists meta_description text;
alter table public.articles add column if not exists social_image text;
alter table public.articles add column if not exists related_event_id uuid references public.events (id) on delete set null;
alter table public.articles add column if not exists related_location_id uuid references public.places (id) on delete set null;

-- events: BS4F/Milan split, richer fields, relations
alter table public.events add column if not exists category text not null default 'bs4f';
alter table public.events drop constraint if exists events_category_check;
alter table public.events add constraint events_category_check check (category in ('bs4f', 'milan'));
alter table public.events add column if not exists event_type text;
alter table public.events add column if not exists organizer text;
alter table public.events add column if not exists video_url text;
alter table public.events add column if not exists full_description text;
alter table public.events add column if not exists external_url text;
alter table public.events add column if not exists address text;
alter table public.events add column if not exists related_article_id uuid references public.articles (id) on delete set null;

-- places → articles/events FKs (deferred until here since places existed
-- without them above, to avoid a forward reference during table creation).
alter table public.places drop constraint if exists places_related_article_id_fkey;
alter table public.places add constraint places_related_article_id_fkey
  foreign key (related_article_id) references public.articles (id) on delete set null;
alter table public.places drop constraint if exists places_related_event_id_fkey;
alter table public.places add constraint places_related_event_id_fkey
  foreign key (related_event_id) references public.events (id) on delete set null;
