-- Saved Eats schema: one table holding every saved Instagram post.
-- kind = 'original'  : 116 authoritative creator recipes (caption or creator_website)
-- kind = 'copycat'   : 226 clearly-badged copycat reconstructions
-- kind = 'non_recipe': 1 archived post with no copycat ('Happy meals day 11')
-- (The 2 other non-recipe posts live in copycats_merged.json with explanatory
--  descriptions and empty ingredient lists; they import as kind='copycat'.)

create table if not exists public.recipes (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('original', 'copycat', 'non_recipe')),
  post_id text not null unique,
  permalink text not null default '',
  username text not null default '',
  original_title text not null default '',
  title text not null default '',
  description text not null default '',
  ingredients_json text not null default '[]',
  instructions_json text not null default '[]',
  cuisine text not null default '',
  themes_json text not null default '[]',
  substitutes_json text not null default '[]',
  source text not null default '',
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;

drop policy if exists "Public read access" on public.recipes;
create policy "Public read access"
  on public.recipes for select
  using (true);

create index if not exists recipes_kind_idx on public.recipes (kind);
create index if not exists recipes_cuisine_idx on public.recipes (cuisine);
