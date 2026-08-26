-- BS4F member articles: run this once in the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)

create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  title text not null,
  slug text not null unique,
  rubric text not null default 'culture' check (rubric in ('culture', 'business', 'industry-interviews', 'bocco-brands', 'opinions')),
  content text not null default '',
  cover_image text,
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
  cover_image text,
  description text not null default '',
  price text,
  dress_code text,
  how_to_register text,
  event_date date not null,
  event_time text,
  location text,
  map_lat double precision,
  map_lng double precision,
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
