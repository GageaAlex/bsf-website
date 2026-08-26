-- Run this in the Supabase SQL Editor if your `articles` table already exists
-- (i.e. you ran schema.sql before rubrics were added).
-- Safe to skip if you're setting up a brand new project from schema.sql.

alter table public.articles
  add column if not exists rubric text not null default 'culture'
  check (rubric in ('culture', 'business', 'industry-interviews', 'bocco-brands', 'opinions'));
