# HOSPO Creative — SEO audit and implementation

Date: 20 September 2026

## Scope and evidence

This audit reviewed the Next.js application, its public crawl controls, rendered metadata implementation, internal-link structure and public production responses. It does not claim keyword volumes, ranking positions or Search Console data; those require access to Google Search Console and should be used to refine this plan after deployment.

## Architecture

The website uses the Next.js App Router. Commercial pages are rendered on the server, so their main text, headings and metadata are available in the initial HTML. The homepage, case-study archive and some CMS-driven content are deliberately dynamic because they read published content from Supabase. They are SSR, not client-only pages; they are not currently built as SSG/ISR documents.

Client-side motion and FAQ interaction are progressively layered on top of server-rendered copy. The principal hero image uses Next Image priority loading; below-the-fold images retain native lazy loading. Image optimisation is configured for AVIF and WebP.

## Production crawl findings

- `https://hospocreative.com/robots.txt` allows public crawling, blocks `/admin` and `/api/`, and points to the XML sitemap.
- `www` redirects to the non-`www` canonical host with HTTP 308. HTTP redirects to HTTPS.
- Indexable pages use the shared `buildPageMetadata` helper, which generates self-canonicals and reciprocal `en-GB`, `pt-PT` and `x-default` alternates.
- Private pages remain excluded: `/pt/investimento`, `/packages`, hotel/restaurant package previews, proposal routes and CMS routes have `noindex` and are absent from the sitemap.
- The two content-creation package landing pages intentionally remain separate campaigns. They have their own canonicals and no hreflang pairing, respecting the requirement that they are not connected.

## Issues found and corrected

1. **SEO service URL redirected away from its own intent.** `/services/seo-google-visibility` and `/pt/services/seo-google-visibility` redirected to AI Search. This made it impossible to build a standalone commercial page for hotel and restaurant SEO, while mixing two different search intents. The redirect has been removed. SEO and AI Search are now separate pages.
2. **SEO service was absent from the sitemap and primary service navigation.** Both English and Portuguese service URLs now appear in the sitemap and are linked from the services index, homepage service overview, footer, header navigation, sector pages and relevant case studies.
3. **Portuguese homepage positioning was too broad.** The PT hero and page metadata now state that HOSPO is a specialist agency for hotels, restaurants and F&B brands in Portugal. UK capability remains present elsewhere and on the English website.
4. **Commercial service intent was generic.** Each core service now has a purpose-built PT title, meta description and H1, including Social Media, Photography & Video, SEO, Websites, OTAs and Strategy & Campaigns.
5. **No dedicated, useful Portugal market pages existed.** Added substantive `/pt/algarve` and `/pt/lisboa` pages, with distinct market context, intended audiences, relevant service links, FAQs and clear statements that HOSPO works in those markets. No office, client, partnership or ranking claims have been added.
6. **Breadcrumb context and service schema were inconsistent.** Sector, service and location pages now include visible breadcrumbs plus valid `BreadcrumbList`; service pages include truthful `Service` structured data. Existing Organization, WebSite, Article and CreativeWork markup remains in place.
7. **Font connection caused an avoidable render delay.** Added early preconnects for Google Fonts. The design continues to use its existing font system.

## Internal linking now in place

- PT homepage → hotel sector, restaurant sector, Algarve, Lisbon and core services.
- Hotel and restaurant sector pages → relevant service pages.
- Services → relevant sectors, related services, case studies and contact.
- Location pages → hotel/restaurants sectors, five core services and the other Portugal market.
- Case-study service labels link to a matching commercial service only when the label is unambiguous.
- Footer provides permanent routes to Algarve and Lisbon, along with the restored SEO service.

## Post-deployment checks

1. Deploy the change, then submit `https://hospocreative.com/sitemap.xml` in Google Search Console.
2. Request indexing for `/pt`, `/pt/services/seo-google-visibility`, `/pt/algarve` and `/pt/lisboa` after the deployed HTML is live.
3. In Search Console, inspect coverage, canonical selection and hreflang status for PT and EN URLs.
4. Use the Performance report to validate the actual queries and pages earning impressions before expanding content. Do not infer volume or rankings from this plan.
5. Track Core Web Vitals from field data. If LCP remains weak, prioritise the measured LCP image and consider self-hosting the two web fonts; do not lower portfolio image quality without evidence.

