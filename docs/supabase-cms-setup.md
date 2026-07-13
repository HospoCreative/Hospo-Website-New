# Supabase CMS Setup

This website can run with local fallback content, but the CMS/admin area needs Supabase.

## 1. Environment Variables

Add these in Vercel Project Settings > Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://www.hospoagency.com
NEXT_PUBLIC_SUPABASE_URL=https://yqbomwtrletnasaxkndr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Do not put a service-role key in browser code. Only add `SUPABASE_SERVICE_ROLE_KEY` if you later build server-only scripts that need it.

## 2. Link The Supabase Project Locally

Use the Supabase CLI from this project folder:

```bash
supabase login
supabase init
supabase link --project-ref yqbomwtrletnasaxkndr
```

If the CLI asks for the database password, use the Supabase project database password. The publishable key is not the database password.

## 3. Apply The Migration

Run the SQL file:

```bash
supabase db push
```

Or paste this file into the Supabase SQL Editor:

```text
supabase/migrations/20260713_hospo_website_cms.sql
```

The migration creates:

- `profiles`
- `case_studies`
- `case_study_media`
- `blog_posts`
- `client_logos`
- Storage buckets for case studies, blog media and client logos
- RLS policies for public reads and admin/editor management

## 4. Create The First Admin

1. In Supabase, create the user in Authentication.
2. Copy the user ID.
3. Run this SQL, replacing the ID and email:

```sql
insert into public.profiles (id, email, full_name, role)
values (
  'PASTE_AUTH_USER_ID_HERE',
  'hospo.agency@gmail.com',
  'Hospo Admin',
  'admin'
)
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    updated_at = now();
```

After that, log in at:

```text
/admin/login
```

## 5. Content Rules

- Publish only final case studies and articles.
- Add only genuine supplied client logos.
- The public client-logo section is hidden until at least three published logos exist.
- Portfolio images must stay clean: no text, labels or captions over the image itself.
