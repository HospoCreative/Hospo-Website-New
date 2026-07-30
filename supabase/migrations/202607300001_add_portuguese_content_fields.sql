alter table public.case_studies
  add column if not exists title_pt text,
  add column if not exists sector_pt text,
  add column if not exists summary_pt text,
  add column if not exists challenge_pt text,
  add column if not exists solution_pt text,
  add column if not exists result_pt text,
  add column if not exists services_pt text[] not null default '{}',
  add column if not exists hero_image_alt_pt text;

alter table public.blog_posts
  add column if not exists title_pt text,
  add column if not exists excerpt_pt text,
  add column if not exists content_pt text,
  add column if not exists cover_image_alt_pt text,
  add column if not exists tags_pt text[] not null default '{}';

comment on column public.case_studies.title_pt is 'European Portuguese title. Falls back to title when empty.';
comment on column public.blog_posts.content_pt is 'European Portuguese article body. Falls back to content when empty.';
