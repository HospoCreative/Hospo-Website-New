-- Initial editable templates. These are inserted once and never overwrite CMS edits.
insert into public.packages (
  slug, name, market, description, price_amount, price_currency, price_type,
  included_items, excluded_items, featured, badge, sort_order
) values
  ('restaurant-content-partner', 'Content Partner', 'restaurant', 'For hospitality businesses managing their own channels but needing a consistent pipeline of professional content.', 650, 'EUR', 'monthly',
    array['Monthly content planning', '1 monthly production session, up to approximately 3 hours', '20–25 professionally edited photographs', '4 short-form vertical videos', 'Food, drinks, atmosphere, team and service coverage', 'Creative shot list', 'Professional editing and colour grading', 'Organised monthly content library'],
    array['Social media management', 'Paid media spend'], false, null, 10),
  ('restaurant-presence-content', 'Presence & Content', 'restaurant', 'For restaurants that want professional content and consistent management of their social presence.', 950, 'EUR', 'monthly',
    array['Monthly strategy and content planning', 'Monthly professional content production', 'Photography', '4 short-form videos / Reels', 'Up to 8 additional feed or carousel pieces', 'Instagram + Facebook management', 'Copywriting', 'Content calendar', 'Scheduling and publishing', 'Planned Stories', 'Light community management', 'Monthly performance review'],
    array['Paid media spend'], true, 'Most popular', 20),
  ('restaurant-growth-bookings', 'Growth & Bookings', 'restaurant', 'For hospitality businesses ready to connect content with customer acquisition and measurable growth.', 1350, 'EUR', 'monthly',
    array['Everything in Presence & Content', 'Up to 6 short-form videos', 'Meta Ads management', 'Google Business Profile optimisation', 'Review and reputation strategy', 'Campaign planning for menus, launches, events and seasonal periods', 'Booking journey recommendations', 'Landing page optimisation where applicable', 'Commercial performance reporting', 'Monthly strategy call'],
    array['Advertising spend paid directly by the client'], false, null, 30),
  ('hotel-content-partner', 'Content Partner', 'hotel', 'For properties with an internal marketing team that need a reliable hospitality content partner.', 950, 'EUR', 'from_monthly',
    array['Monthly creative planning', 'Professional production sessions based on agreed content plan', '30–40 edited photographs', '3–4 vertical videos', 'Rooms, F&B, facilities, team and experiences', 'Drone where appropriate and legally possible', 'Seasonal campaign assets', 'Content for social, website, OTA and digital campaigns', 'Organised asset library'],
    array[]::text[], false, null, 10),
  ('hotel-brand-demand', 'Brand & Demand', 'hotel', 'For independent hotels and stays requiring both professional content and ongoing digital marketing support.', 1650, 'EUR', 'from_monthly',
    array['Everything in Content Partner', 'Monthly strategy', 'Social media management', 'Google Business Profile optimisation', 'Review and reputation strategy', 'Seasonal campaigns', 'Digital presence optimisation', 'Website and booking journey reviews', 'Monthly performance reporting', 'Strategy call'],
    array[]::text[], true, 'Recommended', 20),
  ('hotel-direct-growth', 'Direct Growth', 'hotel', 'For hospitality businesses looking to connect content, performance marketing and the direct booking journey.', 2450, 'EUR', 'from_monthly',
    array['Everything in Brand & Demand', 'Paid media management', 'Google and/or Meta campaigns depending on strategy', 'SEO and local visibility support', 'Website conversion recommendations', 'Booking journey optimisation', 'Email / CRM campaigns', 'Direct booking campaigns', 'Analytics', 'Commercial performance review'],
    array['Media spend and third-party platform costs'], false, null, 30)
on conflict (slug) do nothing;

insert into public.addons (slug, name, market, description, price_amount, price_currency, price_type, sort_order) values
  ('restaurant-meta-ads', 'Meta Ads Management', 'restaurant', 'Campaign management for restaurant and hospitality demand.', 350, 'EUR', 'from_monthly', 10),
  ('restaurant-google-ads', 'Google Ads Management', 'restaurant', 'Search campaign management for intent-led demand.', 400, 'EUR', 'from_monthly', 20),
  ('restaurant-google-meta', 'Google + Meta Management', 'restaurant', 'Combined paid media management.', 650, 'EUR', 'from_monthly', 30),
  ('restaurant-local-visibility', 'Google Business & Local Visibility', 'restaurant', 'Optimisation for local discovery and reputation.', 250, 'EUR', 'from_monthly', 40),
  ('hotel-photography-refresh', 'Property Photography Refresh', 'hotel', 'A focused refreshed image library for the property.', 850, 'EUR', 'from_project', 10),
  ('hotel-content-day', 'Hotel Content Day', 'hotel', 'Dedicated content production day.', 1350, 'EUR', 'from_project', 20),
  ('hotel-full-property-story', 'Full Property Story', 'hotel', 'A broader visual story across the property and experience.', 1950, 'EUR', 'from_project', 30),
  ('hotel-meta-ads', 'Meta Ads', 'hotel', 'Campaign management for hotel demand.', 350, 'EUR', 'from_monthly', 40),
  ('hotel-google-ads', 'Google Ads', 'hotel', 'Search campaign management for direct demand.', null, 'EUR', 'custom', 50),
  ('hotel-crm-retention', 'CRM / Retention', 'hotel', 'Retention and guest lifecycle support.', null, 'EUR', 'custom', 60)
on conflict (slug) do nothing;
