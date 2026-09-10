-- Editable Instagram embeds used by the Selected Work and Reels Gallery sections.
-- The table is additive and is shared by the homepage, Photography & Video and Social Media.

create table if not exists public.portfolio_embeds (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('selected_work', 'reels')),
  instagram_url text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section, instagram_url)
);

create index if not exists portfolio_embeds_section_sort_idx
  on public.portfolio_embeds (section, published, sort_order);

alter table public.portfolio_embeds enable row level security;

drop policy if exists "Public can read published portfolio embeds" on public.portfolio_embeds;
create policy "Public can read published portfolio embeds"
  on public.portfolio_embeds for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Editors can manage portfolio embeds" on public.portfolio_embeds;
create policy "Editors can manage portfolio embeds"
  on public.portfolio_embeds for all
  to authenticated
  using (public.is_admin_or_editor())
  with check (public.is_admin_or_editor());

insert into public.portfolio_embeds (section, instagram_url, sort_order, published)
values
  ('selected_work', 'https://www.instagram.com/p/Chbzn6FjuEa/', 10, true),
  ('selected_work', 'https://www.instagram.com/p/DO_boWTDRMc/', 20, true),
  ('selected_work', 'https://www.instagram.com/p/C8WaAkSOLP3/', 30, true),
  ('selected_work', 'https://www.instagram.com/p/C7UNghgO7FU/', 40, true),
  ('selected_work', 'https://www.instagram.com/p/DOgotIUiZfu/', 50, true),
  ('selected_work', 'https://www.instagram.com/p/C5LS5n5KxnJ/', 60, true),
  ('selected_work', 'https://www.instagram.com/p/DIEo6UkoXuc/', 70, true),
  ('selected_work', 'https://www.instagram.com/p/DY-Gx8OjOP9/', 80, true),
  ('selected_work', 'https://www.instagram.com/p/DC3_dYWtY25/', 90, true),
  ('reels', 'https://www.instagram.com/p/DRkUWq1Cs1X/', 10, true),
  ('reels', 'https://www.instagram.com/reel/C6LpA0eqq27/', 20, true),
  ('reels', 'https://www.instagram.com/p/DQ_tVW7CGxs/', 30, true),
  ('reels', 'https://www.instagram.com/p/DXW36Uxj6yy/', 40, true),
  ('reels', 'https://www.instagram.com/p/DYO3X3UD9dl/', 50, true),
  ('reels', 'https://www.instagram.com/p/DWlgA6tjQXv/', 60, true),
  ('reels', 'https://www.instagram.com/p/DUtU344le3b/', 70, true),
  ('reels', 'https://www.instagram.com/p/DVO0SP-jKp/', 80, true),
  ('reels', 'https://www.instagram.com/p/DGgU27vB6po/', 90, true)
on conflict (section, instagram_url) do nothing;
