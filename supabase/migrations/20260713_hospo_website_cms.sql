create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client_name text not null,
  location text,
  sector text,
  summary text not null,
  challenge text,
  solution text,
  result text,
  services text[] not null default '{}',
  hero_image text,
  hero_image_alt text,
  featured boolean not null default false,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_study_media (
  id uuid primary key default gen_random_uuid(),
  case_study_id uuid not null references public.case_studies(id) on delete cascade,
  media_type text not null default 'image' check (media_type in ('image', 'video', 'embed')),
  src text not null,
  alt text not null,
  caption text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image text,
  cover_image_alt text,
  author_name text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_logos (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  logo_url text not null,
  alternate_logo_url text,
  alt text not null,
  url text,
  sort_order integer not null default 0,
  published boolean not null default false,
  related_case_study_id uuid references public.case_studies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists case_studies_status_order_idx on public.case_studies(status, display_order);
create index if not exists case_studies_featured_idx on public.case_studies(featured) where featured = true;
create index if not exists case_study_media_case_order_idx on public.case_study_media(case_study_id, sort_order);
create index if not exists blog_posts_status_published_idx on public.blog_posts(status, published_at desc);
create index if not exists client_logos_published_order_idx on public.client_logos(published, sort_order);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_case_studies_updated_at on public.case_studies;
create trigger set_case_studies_updated_at
before update on public.case_studies
for each row execute function public.set_updated_at();

drop trigger if exists set_case_study_media_updated_at on public.case_study_media;
create trigger set_case_study_media_updated_at
before update on public.case_study_media
for each row execute function public.set_updated_at();

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_client_logos_updated_at on public.client_logos;
create trigger set_client_logos_updated_at
before update on public.client_logos
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.is_admin_or_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin', 'editor'), false)
$$;

alter table public.profiles enable row level security;
alter table public.case_studies enable row level security;
alter table public.case_study_media enable row level security;
alter table public.blog_posts enable row level security;
alter table public.client_logos enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published case studies" on public.case_studies;
create policy "Public can read published case studies"
on public.case_studies for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Editors can read all case studies" on public.case_studies;
create policy "Editors can read all case studies"
on public.case_studies for select
to authenticated
using (public.is_admin_or_editor());

drop policy if exists "Editors can insert case studies" on public.case_studies;
create policy "Editors can insert case studies"
on public.case_studies for insert
to authenticated
with check (public.is_admin_or_editor());

drop policy if exists "Editors can update case studies" on public.case_studies;
create policy "Editors can update case studies"
on public.case_studies for update
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Admins can delete case studies" on public.case_studies;
create policy "Admins can delete case studies"
on public.case_studies for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read published case study media" on public.case_study_media;
create policy "Public can read published case study media"
on public.case_study_media for select
to anon, authenticated
using (
  published = true
  and exists (
    select 1
    from public.case_studies
    where case_studies.id = case_study_media.case_study_id
      and case_studies.status = 'published'
  )
);

drop policy if exists "Editors can manage case study media" on public.case_study_media;
create policy "Editors can manage case study media"
on public.case_study_media for all
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
on public.blog_posts for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Editors can manage blog posts" on public.blog_posts;
create policy "Editors can manage blog posts"
on public.blog_posts for all
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Admins can delete blog posts" on public.blog_posts;
create policy "Admins can delete blog posts"
on public.blog_posts for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read published client logos" on public.client_logos;
create policy "Public can read published client logos"
on public.client_logos for select
to anon, authenticated
using (published = true);

drop policy if exists "Editors can manage client logos" on public.client_logos;
create policy "Editors can manage client logos"
on public.client_logos for all
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Admins can delete client logos" on public.client_logos;
create policy "Admins can delete client logos"
on public.client_logos for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'case-study-media',
    'case-study-media',
    true,
    52428800,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
  ),
  (
    'blog-media',
    'blog-media',
    true,
    26214400,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'client-logos',
    'client-logos',
    true,
    10485760,
    array['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']
  )
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read website media" on storage.objects;
create policy "Public can read website media"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('case-study-media', 'blog-media', 'client-logos'));

drop policy if exists "Editors can upload website media" on storage.objects;
create policy "Editors can upload website media"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('case-study-media', 'blog-media', 'client-logos')
  and public.is_admin_or_editor()
);

drop policy if exists "Editors can update website media" on storage.objects;
create policy "Editors can update website media"
on storage.objects for update
to authenticated
using (
  bucket_id in ('case-study-media', 'blog-media', 'client-logos')
  and public.is_admin_or_editor()
)
with check (
  bucket_id in ('case-study-media', 'blog-media', 'client-logos')
  and public.is_admin_or_editor()
);

drop policy if exists "Admins can delete website media" on storage.objects;
create policy "Admins can delete website media"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('case-study-media', 'blog-media', 'client-logos')
  and public.is_admin()
);
