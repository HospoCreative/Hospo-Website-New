# Supabase CMS Setup

This website can run with local fallback content, but the CMS/admin area needs Supabase.

## 1. Environment Variables

Add these in Vercel Project Settings > Environment Variables:

```env
NEXT_PUBLIC_SITE_URL=https://hospocreative.com
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

## Local Supabase development

Local Supabase is isolated from the linked production project. It starts from the migrations in this repository and never copies production data.

```bash
# Start or stop the local stack.
npx supabase@latest start
npx supabase@latest stop

# Rebuild the local database from every migration and local seed file.
npx supabase@latest db reset

# Inspect local URLs and public development credentials.
npx supabase@latest status
```

For this project, local application values belong in ignored `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_local_publishable_key
```

Do not add production values to local files. Do not add a service-role key to browser code.

Create development-only CMS users after starting or resetting Supabase. The password is provided at runtime and is never committed:

```bash
export LOCAL_CMS_PASSWORD='choose-a-local-password'
DOCKER_BIN=/Applications/Docker.app/Contents/Resources/bin/docker ./scripts/create-local-cms-users.sh
```

The script creates `admin@hospo.local` and `editor@hospo.local` with the existing `admin` and `editor` profile roles. Use those accounts only against the local stack.

Before a production migration: validate locally, reset from migrations, test RLS and application behaviour, review code, create a local checkpoint, then apply the migration to production only with explicit approval and deploy compatible application code afterwards.
