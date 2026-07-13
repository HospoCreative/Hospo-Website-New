# Content Management Guide

## Public Landing Page Copy

Main page copy is in:

```text
content/sections/site.ts
```

The old path `data/site.ts` re-exports this file so older components keep working.

## Fallback Content

Fallback content keeps the public site alive if Supabase is not configured:

```text
content/fallback/caseStudies.ts
content/fallback/blogPosts.ts
content/fallback/clientLogos.ts
```

The client-logo fallback intentionally starts empty. Do not add invented logos.

## Images

Local images are organized under:

```text
public/images
```

For CMS content, upload images to Supabase Storage:

```text
case-study-media
blog-media
client-logos
```

Then paste the public URL into the admin CMS form.

## Admin Routes

```text
/admin/login
/admin
/admin/case-studies
/admin/case-studies/new
/admin/case-studies/[id]
/admin/blog
/admin/blog/new
/admin/blog/[id]
/admin/clients
/admin/media
```

Admin users can create and edit case studies, blog posts and client logos. The media screen explains which Supabase bucket to use.

## Visual Rules

- No text directly over portfolio images.
- No number labels on photos.
- No fake client names or placeholder logos.
- Project/client information must sit outside image areas.
- Use navy, white and restrained yellow accents.
