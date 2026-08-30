-- Content Creation packages use the existing commercial library and retain
-- independent UK and Portugal values. This migration is additive.

alter table public.packages
  add column if not exists category text not null default 'marketing';

alter table public.addons
  add column if not exists category text not null default 'marketing';

alter table public.package_market_values
  add column if not exists production_duration text,
  add column if not exists minimum_commitment text,
  add column if not exists cta_label text,
  add column if not exists cta_destination text,
  add column if not exists excluded_items text[] not null default '{}';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'packages_category_check') then
    alter table public.packages add constraint packages_category_check check (category in ('marketing', 'content_creation'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'addons_category_check') then
    alter table public.addons add constraint addons_category_check check (category in ('marketing', 'content_creation'));
  end if;
end $$;

create index if not exists packages_category_active_sort_idx on public.packages(category, is_active, sort_order);
create index if not exists addons_category_active_sort_idx on public.addons(category, is_active, sort_order);

insert into public.packages (slug, name, name_pt, market, category, featured, badge, badge_pt, is_active, sort_order)
values
  ('photography-session', 'Photography Session', 'Sessão de Fotografia', 'general', 'content_creation', false, null, null, true, 110),
  ('social-content-session', 'Social Content Session', 'Sessão de Conteúdo Social', 'general', 'content_creation', false, null, null, true, 120),
  ('content-day', 'Content Day', 'Content Day', 'general', 'content_creation', true, 'Most popular', 'Mais procurado', true, 130),
  ('content-production-partner', 'Content Partner', 'Content Partner', 'general', 'content_creation', false, 'For ongoing content needs', 'Para conteúdo mensal', true, 140)
on conflict (slug) do update set
  name = excluded.name,
  name_pt = excluded.name_pt,
  market = excluded.market,
  category = excluded.category,
  featured = excluded.featured,
  badge = excluded.badge,
  badge_pt = excluded.badge_pt,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.package_market_values (package_id, market_code, currency, price_amount, price_type, description, deliverables, excluded_items, production_duration, minimum_commitment, cta_label, cta_destination, is_active)
select id, 'pt', 'EUR',
  case slug when 'photography-session' then 350 when 'social-content-session' then 450 when 'content-day' then 650 else 600 end,
  case when slug = 'content-production-partner' then 'monthly' else 'project' end,
  case slug
    when 'photography-session' then 'Renove a forma como o seu negócio é apresentado com uma biblioteca de fotografia profissional.'
    when 'social-content-session' then 'Crie uma nova seleção de fotografia e vídeo curto para os seus canais digitais.'
    when 'content-day' then 'Crie uma biblioteca visual completa de fotografia e vídeo num único dia de produção.'
    else 'Mantenha a sua marca abastecida com conteúdo profissional novo todos os meses.'
  end,
  case slug
    when 'photography-session' then array['20–30 fotografias editadas profissionalmente', 'Até 3 horas de fotografia', 'Comida, bebidas, interiores, quartos, espaços, pessoas, equipa, ambiente ou detalhes conforme o negócio', 'Planeamento criativo básico e lista de captações', 'Seleção e edição profissional', 'Correção de cor', 'Entrega em alta resolução', 'Versões otimizadas para digital']
    when 'social-content-session' then array['15–20 fotografias editadas profissionalmente', '2 vídeos verticais de curta duração', 'Até 3 horas de produção', 'Planeamento criativo e lista de captações', 'Edição de fotografia e vídeo', 'Correção de cor', 'Vídeos preparados para redes sociais', '1 ronda de pequenos ajustes aos vídeos']
    when 'content-day' then array['35–50 fotografias editadas profissionalmente', '4 vídeos verticais de curta duração', 'Até 6 horas de produção', 'Planeamento criativo e lista de captações', 'Maior variedade de espaços, produtos, equipa, serviço, ambiente ou experiência de cliente', 'Edição de fotografia e vídeo', 'Correção de cor', 'Conteúdo organizado para utilização digital', '1 ronda de pequenos ajustes aos vídeos']
    else array['1 Content Day por mês', 'Até 6 horas de produção', '35–50 fotografias editadas profissionalmente', '4 vídeos verticais de curta duração', 'Planeamento criativo mensal', 'Lista mensal de captações com base em prioridades, campanhas e sazonalidade', 'Edição profissional e correção de cor', 'Biblioteca de conteúdos organizada', '1 ronda de pequenos ajustes aos vídeos']
  end,
  case slug
    when 'photography-session' then array['Produção de vídeo', 'Gestão de redes sociais', 'Media pago', 'Ficheiros RAW']
    when 'social-content-session' then array['Gestão de redes sociais', 'Media pago', 'Filmagem em bruto']
    when 'content-day' then array[]::text[]
    else array[]::text[]
  end,
  case when slug in ('photography-session', 'social-content-session') then 'Até 3 horas' else 'Até 6 horas' end,
  case when slug = 'content-production-partner' then 'Mínimo de 3 meses' else null end,
  case slug when 'photography-session' then 'Reservar Sessão' when 'social-content-session' then 'Reservar Sessão' when 'content-day' then 'Reservar Content Day' else 'Falar sobre Content Partner' end,
  '/contact', true
from public.packages
where slug in ('photography-session', 'social-content-session', 'content-day', 'content-production-partner')
on conflict (package_id, market_code) do update set
  currency = excluded.currency, price_amount = excluded.price_amount, price_type = excluded.price_type,
  description = excluded.description, deliverables = excluded.deliverables, excluded_items = excluded.excluded_items,
  production_duration = excluded.production_duration, minimum_commitment = excluded.minimum_commitment,
  cta_label = excluded.cta_label, cta_destination = excluded.cta_destination, is_active = excluded.is_active;

insert into public.package_market_values (package_id, market_code, currency, price_amount, price_type, description, deliverables, excluded_items, production_duration, minimum_commitment, cta_label, cta_destination, is_active)
select id, 'uk', 'GBP',
  case slug when 'photography-session' then 425 when 'social-content-session' then 550 when 'content-day' then 795 else 725 end,
  case when slug = 'content-production-partner' then 'monthly' else 'project' end,
  case slug
    when 'photography-session' then 'Refresh the way your business is presented with a professional photography library.'
    when 'social-content-session' then 'Build a fresh bank of professional photo and short-form video content for your digital channels.'
    when 'content-day' then 'Create a complete visual library of professional photography and video in one production day.'
    else 'Keep your brand consistently supplied with fresh, professional content every month.'
  end,
  case slug
    when 'photography-session' then array['20–30 professionally edited photographs', 'Up to 3 hours of photography', 'Food, drinks, interiors, rooms, spaces, people, team, atmosphere or details, depending on the business', 'Basic creative planning and shot list', 'Professional selection and editing', 'Colour grading', 'High-resolution delivery', 'Digital-optimised versions']
    when 'social-content-session' then array['15–20 professionally edited photographs', '2 short-form vertical videos', 'Up to 3 hours of production', 'Creative planning and shot list', 'Professional photography and video editing', 'Colour grading', 'Videos prepared for social media use', '1 round of minor video revisions']
    when 'content-day' then array['35–50 professionally edited photographs', '4 short-form vertical videos', 'Up to 6 hours of production', 'Creative planning and shot list', 'Greater variety of spaces, products, team, service, atmosphere or guest experience', 'Professional photography and video editing', 'Colour grading', 'Content organised for digital use', '1 round of minor video revisions']
    else array['1 Content Day each month', 'Up to 6 hours of production', '35–50 professionally edited photographs', '4 short-form vertical videos', 'Monthly creative planning', 'Monthly shot list based on current priorities, campaigns and seasonal needs', 'Professional editing and colour grading', 'Ongoing organised content library', '1 round of minor video revisions']
  end,
  case slug
    when 'photography-session' then array['Video production', 'Social media management', 'Paid media', 'RAW files']
    when 'social-content-session' then array['Social media management', 'Paid media', 'Raw footage']
    when 'content-day' then array[]::text[]
    else array[]::text[]
  end,
  case when slug in ('photography-session', 'social-content-session') then 'Up to 3 hours' else 'Up to 6 hours' end,
  case when slug = 'content-production-partner' then 'Minimum 3 months' else null end,
  case slug when 'photography-session' then 'Book a Photography Session' when 'social-content-session' then 'Book a Content Session' when 'content-day' then 'Book a Content Day' else 'Become a Content Partner' end,
  '/contact', true
from public.packages
where slug in ('photography-session', 'social-content-session', 'content-day', 'content-production-partner')
on conflict (package_id, market_code) do update set
  currency = excluded.currency, price_amount = excluded.price_amount, price_type = excluded.price_type,
  description = excluded.description, deliverables = excluded.deliverables, excluded_items = excluded.excluded_items,
  production_duration = excluded.production_duration, minimum_commitment = excluded.minimum_commitment,
  cta_label = excluded.cta_label, cta_destination = excluded.cta_destination, is_active = excluded.is_active;

insert into public.addons (slug, name, name_pt, market, category, is_active, sort_order)
values
  ('extra-short-form-video', 'Extra short-form video', 'Vídeo vertical adicional', 'general', 'content_creation', true, 110),
  ('extra-ten-edited-photographs', 'Extra 10 edited photographs', '10 fotografias editadas adicionais', 'general', 'content_creation', true, 120),
  ('additional-production-hour', 'Additional production hour', 'Hora adicional de produção', 'general', 'content_creation', true, 130),
  ('drone-photography-video', 'Drone photography / video', 'Fotografia / vídeo com drone', 'general', 'content_creation', true, 140),
  ('raw-footage-delivery', 'Raw footage delivery', 'Entrega de filmagem em bruto', 'general', 'content_creation', true, 150),
  ('additional-location', 'Additional location', 'Localização adicional', 'general', 'content_creation', false, 160),
  ('models-talent', 'Models / talent', 'Modelos / talento', 'general', 'content_creation', false, 170)
on conflict (slug) do update set
  name = excluded.name, name_pt = excluded.name_pt, market = excluded.market, category = excluded.category,
  is_active = excluded.is_active, sort_order = excluded.sort_order;

insert into public.addon_market_values (addon_id, market_code, currency, price_amount, price_type, description, is_active)
select id, 'pt', 'EUR',
  case slug when 'extra-short-form-video' then 100 when 'extra-ten-edited-photographs' then 75 when 'additional-production-hour' then 120 when 'drone-photography-video' then 150 when 'raw-footage-delivery' then 150 else null end,
  case when slug in ('additional-location', 'models-talent') then 'custom' else 'from_project' end,
  case slug when 'extra-short-form-video' then 'Vídeo vertical adicional para redes sociais e canais digitais.' when 'extra-ten-edited-photographs' then 'Mais 10 fotografias editadas profissionalmente.' when 'additional-production-hour' then 'Tempo adicional de produção no local.' when 'drone-photography-video' then 'Captação aérea, sujeita a condições e permissões.' when 'raw-footage-delivery' then 'Entrega de filmagem em bruto.' else 'Sob consulta.' end,
  true
from public.addons where slug in ('extra-short-form-video', 'extra-ten-edited-photographs', 'additional-production-hour', 'drone-photography-video', 'raw-footage-delivery', 'additional-location', 'models-talent')
on conflict (addon_id, market_code) do update set currency = excluded.currency, price_amount = excluded.price_amount, price_type = excluded.price_type, description = excluded.description, is_active = excluded.is_active;

insert into public.addon_market_values (addon_id, market_code, currency, price_amount, price_type, description, is_active)
select id, 'uk', 'GBP',
  case slug when 'extra-short-form-video' then 125 when 'extra-ten-edited-photographs' then 95 when 'additional-production-hour' then 150 when 'drone-photography-video' then 195 when 'raw-footage-delivery' then 195 else null end,
  case when slug in ('additional-location', 'models-talent') then 'custom' else 'from_project' end,
  case slug when 'extra-short-form-video' then 'An additional short-form vertical video for social and digital channels.' when 'extra-ten-edited-photographs' then 'Ten more professionally edited photographs.' when 'additional-production-hour' then 'Additional on-site production time.' when 'drone-photography-video' then 'Aerial capture, subject to conditions and permissions.' when 'raw-footage-delivery' then 'Delivery of raw video footage.' else 'Quoted separately.' end,
  true
from public.addons where slug in ('extra-short-form-video', 'extra-ten-edited-photographs', 'additional-production-hour', 'drone-photography-video', 'raw-footage-delivery', 'additional-location', 'models-talent')
on conflict (addon_id, market_code) do update set currency = excluded.currency, price_amount = excluded.price_amount, price_type = excluded.price_type, description = excluded.description, is_active = excluded.is_active;
