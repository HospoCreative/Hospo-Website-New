-- Commercial proposals V1. This migration is additive and keeps public access
-- limited to explicit, redacted RPC payloads for active proposal links.

alter table public.prospect_activity
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  name_pt text,
  market text not null default 'general' check (market in ('restaurant', 'hotel', 'general')),
  description text,
  description_pt text,
  price_amount numeric(12,2),
  price_currency text not null default 'EUR' check (price_currency in ('EUR', 'GBP')),
  price_type text not null default 'project' check (price_type in ('project', 'from_project', 'monthly', 'from_monthly', 'custom')),
  price_note text,
  price_note_pt text,
  included_items text[] not null default '{}',
  included_items_pt text[] not null default '{}',
  excluded_items text[] not null default '{}',
  excluded_items_pt text[] not null default '{}',
  commercial_terms text,
  commercial_terms_pt text,
  featured boolean not null default false,
  badge text,
  badge_pt text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  name_pt text,
  market text not null default 'general' check (market in ('restaurant', 'hotel', 'general')),
  description text,
  description_pt text,
  price_amount numeric(12,2),
  price_currency text not null default 'EUR' check (price_currency in ('EUR', 'GBP')),
  price_type text not null default 'project' check (price_type in ('project', 'from_project', 'monthly', 'from_monthly', 'custom')),
  price_note text,
  price_note_pt text,
  included_items text[] not null default '{}',
  included_items_pt text[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  prospect_id uuid references public.prospects(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'ready', 'sent', 'viewed', 'interested', 'accepted', 'declined', 'archived')),
  language text not null default 'en' check (language in ('en', 'pt')),
  template_type text not null default 'custom' check (template_type in ('restaurant', 'hotel', 'custom')),
  proposal_date date not null default current_date,
  sent_at timestamptz,
  valid_until date,
  client_name text,
  business_name text,
  business_type text,
  contact_name text,
  contact_email text,
  website_url text,
  market text,
  location text,
  headline text,
  introduction text,
  prepared_for text,
  prepared_by text,
  personal_message text,
  objectives text[] not null default '{}',
  observations jsonb not null default '[]'::jsonb,
  opportunities jsonb not null default '[]'::jsonb,
  commercial_details jsonb not null default '{}'::jsonb,
  cta_config jsonb not null default '{}'::jsonb,
  package_id uuid references public.packages(id) on delete set null,
  package_snapshot jsonb,
  package_overrides jsonb not null default '{}'::jsonb,
  first_viewed_at timestamptz,
  last_viewed_at timestamptz,
  view_count integer not null default 0 check (view_count >= 0),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposal_addons (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  addon_id uuid references public.addons(id) on delete set null,
  addon_snapshot jsonb not null default '{}'::jsonb,
  overrides jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proposal_case_studies (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  case_study_id uuid references public.case_studies(id) on delete set null,
  case_study_snapshot jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (proposal_id, case_study_id)
);

create table if not exists public.proposal_media (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  source_url text not null,
  alt_text text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.proposal_events (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  event_type text not null check (event_type in ('created', 'package_selected', 'ready', 'sent', 'viewed', 'cta_clicked', 'accepted', 'declined', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists packages_market_active_sort_idx on public.packages(market, is_active, sort_order);
create index if not exists addons_market_active_sort_idx on public.addons(market, is_active, sort_order);
create index if not exists proposals_status_updated_idx on public.proposals(status, updated_at desc);
create index if not exists proposals_prospect_created_idx on public.proposals(prospect_id, created_at desc) where prospect_id is not null;
create index if not exists proposal_addons_proposal_sort_idx on public.proposal_addons(proposal_id, sort_order);
create index if not exists proposal_case_studies_proposal_sort_idx on public.proposal_case_studies(proposal_id, sort_order);
create index if not exists proposal_media_proposal_sort_idx on public.proposal_media(proposal_id, sort_order);
create index if not exists proposal_events_proposal_created_idx on public.proposal_events(proposal_id, created_at desc);

drop trigger if exists set_packages_updated_at on public.packages;
create trigger set_packages_updated_at before update on public.packages for each row execute function public.set_updated_at();
drop trigger if exists set_addons_updated_at on public.addons;
create trigger set_addons_updated_at before update on public.addons for each row execute function public.set_updated_at();
drop trigger if exists set_proposals_updated_at on public.proposals;
create trigger set_proposals_updated_at before update on public.proposals for each row execute function public.set_updated_at();
drop trigger if exists set_proposal_addons_updated_at on public.proposal_addons;
create trigger set_proposal_addons_updated_at before update on public.proposal_addons for each row execute function public.set_updated_at();

alter table public.packages enable row level security;
alter table public.addons enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_addons enable row level security;
alter table public.proposal_case_studies enable row level security;
alter table public.proposal_media enable row level security;
alter table public.proposal_events enable row level security;

create policy "Public can read active packages" on public.packages for select to anon, authenticated using (is_active = true);
create policy "Editors can read packages" on public.packages for select to authenticated using (public.is_admin_or_editor());
create policy "Editors can insert packages" on public.packages for insert to authenticated with check (public.is_admin_or_editor());
create policy "Editors can update packages" on public.packages for update to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Admins can delete packages" on public.packages for delete to authenticated using (public.is_admin());

create policy "Public can read active addons" on public.addons for select to anon, authenticated using (is_active = true);
create policy "Editors can read addons" on public.addons for select to authenticated using (public.is_admin_or_editor());
create policy "Editors can insert addons" on public.addons for insert to authenticated with check (public.is_admin_or_editor());
create policy "Editors can update addons" on public.addons for update to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Admins can delete addons" on public.addons for delete to authenticated using (public.is_admin());

create policy "Editors can manage proposals" on public.proposals for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors can manage proposal addons" on public.proposal_addons for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors can manage proposal case studies" on public.proposal_case_studies for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors can manage proposal media" on public.proposal_media for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors can read proposal events" on public.proposal_events for select to authenticated using (public.is_admin_or_editor());
create policy "Editors can add proposal events" on public.proposal_events for insert to authenticated with check (public.is_admin_or_editor());
create policy "Admins can delete proposal events" on public.proposal_events for delete to authenticated using (public.is_admin());

revoke all on public.packages, public.addons, public.proposals, public.proposal_addons, public.proposal_case_studies, public.proposal_media, public.proposal_events from anon;
grant select on public.packages, public.addons to anon;
grant select, insert, update, delete on public.packages, public.addons, public.proposals, public.proposal_addons, public.proposal_case_studies, public.proposal_media, public.proposal_events to authenticated;

-- Returns only the redacted, commercial public payload. Draft, Ready and Archived
-- proposals never produce a result, even when callers know a slug.
create or replace function public.get_sent_proposal(p_slug text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', p.id,
    'slug', p.slug,
    'status', p.status,
    'language', p.language,
    'template_type', p.template_type,
    'proposal_date', p.proposal_date,
    'valid_until', p.valid_until,
    'client_name', p.client_name,
    'business_name', p.business_name,
    'business_type', p.business_type,
    'website_url', p.website_url,
    'market', p.market,
    'location', p.location,
    'headline', p.headline,
    'introduction', p.introduction,
    'prepared_for', p.prepared_for,
    'prepared_by', p.prepared_by,
    'personal_message', p.personal_message,
    'objectives', p.objectives,
    'observations', p.observations,
    'opportunities', p.opportunities,
    'commercial_details', p.commercial_details,
    'cta_config', p.cta_config,
    'package_snapshot', p.package_snapshot,
    'package_overrides', p.package_overrides,
    'addons', coalesce((
      select jsonb_agg(jsonb_build_object('snapshot', pa.addon_snapshot, 'overrides', pa.overrides, 'sort_order', pa.sort_order) order by pa.sort_order, pa.created_at)
      from public.proposal_addons pa
      where pa.proposal_id = p.id
    ), '[]'::jsonb),
    'case_studies', coalesce((
      select jsonb_agg(jsonb_build_object('snapshot', pcs.case_study_snapshot, 'sort_order', pcs.sort_order) order by pcs.sort_order, pcs.created_at)
      from public.proposal_case_studies pcs
      where pcs.proposal_id = p.id
    ), '[]'::jsonb),
    'media', coalesce((
      select jsonb_agg(jsonb_build_object('source_url', pm.source_url, 'alt_text', pm.alt_text, 'media_type', pm.media_type, 'sort_order', pm.sort_order) order by pm.sort_order, pm.created_at)
      from public.proposal_media pm
      where pm.proposal_id = p.id
    ), '[]'::jsonb)
  )
  from public.proposals p
  where p.slug = p_slug
    and p.status in ('sent', 'viewed', 'interested', 'accepted', 'declined');
$$;

-- Public tracking is deliberately narrow: it can only record a view or CTA click
-- for a currently active public proposal. No proposal data is returned.
create or replace function public.record_proposal_public_event(p_slug text, p_event_type text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_proposal public.proposals%rowtype;
  v_is_first_view boolean := false;
begin
  if p_event_type not in ('viewed', 'cta_clicked') then
    raise exception 'Unsupported public proposal event';
  end if;

  select * into v_proposal
  from public.proposals
  where slug = p_slug
    and status in ('sent', 'viewed', 'interested', 'accepted', 'declined')
  for update;

  if not found then
    return;
  end if;

  if p_event_type = 'viewed' then
    v_is_first_view := v_proposal.first_viewed_at is null;
    update public.proposals
    set status = case when status = 'sent' then 'viewed' else status end,
        first_viewed_at = coalesce(first_viewed_at, now()),
        last_viewed_at = now(),
        view_count = view_count + 1
    where id = v_proposal.id;
  end if;

  insert into public.proposal_events (proposal_id, event_type, metadata)
  values (v_proposal.id, p_event_type, jsonb_build_object('source', 'public_proposal'));

  if p_event_type = 'viewed' and v_is_first_view and v_proposal.prospect_id is not null then
    insert into public.prospect_activity (prospect_id, activity_type, description, metadata)
    values (v_proposal.prospect_id, 'proposal_viewed', 'Proposal first viewed.', jsonb_build_object('proposal_id', v_proposal.id));
  end if;
end;
$$;

revoke all on function public.get_sent_proposal(text) from public;
revoke all on function public.record_proposal_public_event(text, text) from public;
grant execute on function public.get_sent_proposal(text) to anon, authenticated;
grant execute on function public.record_proposal_public_event(text, text) to anon, authenticated;
