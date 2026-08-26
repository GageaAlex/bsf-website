-- BS4F member-published events: run this once in the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)

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
  map_x numeric(5, 2), -- 0-100, percentage position on the Milan map illustration
  map_y numeric(5, 2), -- 0-100
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

-- Storage bucket for event cover images.
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
