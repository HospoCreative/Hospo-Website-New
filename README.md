# Hospo Website New

A standalone Next.js one-page website for Hospo Creative, built as a clean hospitality marketing content landing page.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:3000`.

If another project is already using port 3000, run:

```bash
npm run dev -- -H 0.0.0.0 -p 3001
```

Then open `http://localhost:3001`.

## Build

```bash
npm run lint
npm run typecheck
npm run build
```

## Editing Content

- Main copy, contact links and section text: `data/site.ts`
- Service categories: `data/services.ts`
- Work image links: `data/images.ts`
- Reel/embed links: `data/reels.ts`
- Social links: `data/socials.ts`
- Page section order: `app/page.tsx`
- Brand styling: `app/globals.css` and `tailwind.config.ts`
- Components: `components`

## Replacing Assets

Replace the assets in:

- `public/logos`
- hospitality imagery is currently in `public/images/work`, `public/images/reels`, `public/images/gallery` and `public/images/about`
- videos are in `public/videos`

Keep file paths aligned with the files in `data`.

## Notes

- This is a single landing page, not a multi-page website.
- The current CTA links open email or social channels; there is no backend form.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel when connecting the production domain.
