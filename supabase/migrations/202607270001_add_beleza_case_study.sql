-- Seed Beleza Rodizio as a normal CMS case-study record.
-- This uses the same table and editable fields as every project created in Admin.

insert into public.case_studies (
  title,
  slug,
  client_name,
  location,
  sector,
  summary,
  challenge,
  solution,
  result,
  services,
  featured,
  display_order,
  status,
  published_at
)
values (
  'From 1K to 13.5K Instagram followers in under a year',
  'beleza-rodizio-instagram-growth',
  'Beleza Rodizio',
  'Stratford-upon-Avon, Hull & Solihull',
  'Restaurant group',
  'A multi-location content and social programme that grew Beleza Rodizio''s Instagram community from approximately 1,000 to 13,500 followers in under a year.',
  'Beleza needed a more consistent digital presence across several locations, with content that could show the full Brazilian rodizio experience and connect seasonal campaigns to real guest occasions.',
  'Hospo Creative built a recurring content and social system spanning photography, short-form video, community management, creator collaborations and campaign-led storytelling for Stratford-upon-Avon, Hull and Solihull.',
  'Instagram grew from approximately 1K to 13.5K followers in under a year. One reporting month reached more than 460K people and generated 4,275 link clicks. A West Midlands Foodie collaboration delivered approximately 131K views and around 400 new followers in one day.',
  array[
    'Social media strategy',
    'Content production',
    'Photography & video',
    'Influencer marketing',
    'Campaign planning',
    'Community management',
    'Multi-location marketing'
  ],
  true,
  1,
  'published',
  now()
)
on conflict (slug) do update
set
  title = excluded.title,
  client_name = excluded.client_name,
  location = excluded.location,
  sector = excluded.sector,
  summary = excluded.summary,
  challenge = excluded.challenge,
  solution = excluded.solution,
  result = excluded.result,
  services = excluded.services,
  featured = excluded.featured,
  display_order = excluded.display_order,
  status = excluded.status,
  published_at = coalesce(public.case_studies.published_at, excluded.published_at);
