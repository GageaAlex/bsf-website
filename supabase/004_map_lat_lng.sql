-- Run this in the Supabase SQL Editor if your `events` table already exists
-- (i.e. you ran 003_events_table.sql before the map switched from the custom
-- Milan illustration to a real interactive map). Safe to skip on a brand new
-- project — schema.sql already includes these columns.

alter table public.events drop column if exists map_x;
alter table public.events drop column if exists map_y;
alter table public.events add column if not exists map_lat double precision;
alter table public.events add column if not exists map_lng double precision;
