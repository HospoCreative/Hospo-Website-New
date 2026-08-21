create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_type text not null check (business_type in ('Hotel', 'Boutique Hotel', 'Guesthouse', 'Aparthotel', 'Accommodation', 'Restaurant', 'Cafe', 'Bar', 'F&B Group', 'Other')),
  website_url text not null,
  location text,
  city text,
  country text,
  market text not null check (market in ('Portugal', 'United Kingdom', 'Other')),
  google_url text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  booking_url text,
  expedia_url text,
  tripadvisor_url text,
  reservation_url text,
  lead_fit text not null default 'B' check (lead_fit in ('A', 'B', 'C')),
  pipeline_status text not null default 'New' check (pipeline_status in ('New', 'To Analyse', 'Analysis Ready', 'Ready for Outreach', 'Contacted', 'Follow-up 1', 'Follow-up 2', 'Replied', 'Meeting', 'Proposal', 'Negotiation', 'Won', 'Lost', 'Paused')),
  digital_presence_score integer check (digital_presence_score between 0 and 100),
  opportunity_score integer check (opportunity_score between 0 and 100),
  priority text not null default 'LOW' check (priority in ('HOT', 'WARM', 'WATCH', 'LOW')),
  primary_service text,
  secondary_service text,
  owner_user_id uuid references public.profiles(id) on delete set null,
  notes text,
  commercial_fit smallint check (commercial_fit between 1 and 5),
  contactability smallint check (contactability between 1 and 5),
  commercial_trigger smallint check (commercial_trigger between 1 and 5),
  evidence_quality smallint check (evidence_quality between 1 and 5),
  last_contact_at timestamptz,
  next_followup_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prospect_contacts (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  name text not null,
  job_title text,
  email text,
  phone text,
  linkedin_url text,
  contact_type text,
  source text,
  is_primary boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prospect_scores (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  category text not null,
  score smallint not null check (score between 1 and 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (prospect_id, category)
);

create table if not exists public.prospect_activity (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  activity_type text not null,
  description text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists prospects_pipeline_priority_idx on public.prospects(pipeline_status, priority, opportunity_score desc);
create index if not exists prospects_followup_idx on public.prospects(next_followup_at) where next_followup_at is not null;
create index if not exists prospects_market_type_idx on public.prospects(market, business_type);
create index if not exists prospect_contacts_prospect_idx on public.prospect_contacts(prospect_id, is_primary desc);
create index if not exists prospect_scores_prospect_idx on public.prospect_scores(prospect_id);
create index if not exists prospect_activity_prospect_created_idx on public.prospect_activity(prospect_id, created_at desc);

drop trigger if exists set_prospects_updated_at on public.prospects;
create trigger set_prospects_updated_at before update on public.prospects for each row execute function public.set_updated_at();
drop trigger if exists set_prospect_contacts_updated_at on public.prospect_contacts;
create trigger set_prospect_contacts_updated_at before update on public.prospect_contacts for each row execute function public.set_updated_at();
drop trigger if exists set_prospect_scores_updated_at on public.prospect_scores;
create trigger set_prospect_scores_updated_at before update on public.prospect_scores for each row execute function public.set_updated_at();

alter table public.prospects enable row level security;
alter table public.prospect_contacts enable row level security;
alter table public.prospect_scores enable row level security;
alter table public.prospect_activity enable row level security;

create policy "Editors can read prospects" on public.prospects for select to authenticated using (public.is_admin_or_editor());
create policy "Editors can insert prospects" on public.prospects for insert to authenticated with check (public.is_admin_or_editor());
create policy "Editors can update prospects" on public.prospects for update to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Admins can delete prospects" on public.prospects for delete to authenticated using (public.is_admin());

create policy "Editors can manage prospect contacts" on public.prospect_contacts for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors can manage prospect scores" on public.prospect_scores for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors can read prospect activity" on public.prospect_activity for select to authenticated using (public.is_admin_or_editor());
create policy "Editors can add prospect activity" on public.prospect_activity for insert to authenticated with check (public.is_admin_or_editor());

revoke all on public.prospects, public.prospect_contacts, public.prospect_scores, public.prospect_activity from anon;
grant select, insert, update, delete on public.prospects, public.prospect_contacts, public.prospect_scores, public.prospect_activity to authenticated;
