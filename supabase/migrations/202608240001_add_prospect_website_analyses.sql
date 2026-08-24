-- Phase 2A: bounded, internal website evidence runs for prospects.
create table if not exists public.prospect_analyses (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  analysis_type text not null default 'website' check (analysis_type = 'website'),
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'partial', 'failed')),
  scanner_version text not null default 'website-scanner-v1',
  website_url text not null,
  final_url text,
  pages_discovered integer not null default 0 check (pages_discovered >= 0 and pages_discovered <= 15),
  pages_scanned integer not null default 0 check (pages_scanned >= 0 and pages_scanned <= 15),
  evidence_count integer not null default 0 check (evidence_count >= 0),
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prospect_evidence (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  analysis_id uuid not null references public.prospect_analyses(id) on delete cascade,
  evidence_key text not null check (evidence_key ~ '^WEB_[A-Z0-9_]+$'),
  evidence_group text not null check (evidence_group in ('overview', 'conversion', 'pages', 'contact_discovery', 'technical')),
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  page_url text,
  value jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists prospect_analyses_prospect_created_idx on public.prospect_analyses(prospect_id, created_at desc);
create unique index if not exists prospect_analyses_active_website_idx on public.prospect_analyses(prospect_id, analysis_type) where status in ('queued', 'running');
create index if not exists prospect_evidence_analysis_group_idx on public.prospect_evidence(analysis_id, evidence_group, evidence_key);

drop trigger if exists set_prospect_analyses_updated_at on public.prospect_analyses;
create trigger set_prospect_analyses_updated_at before update on public.prospect_analyses for each row execute function public.set_updated_at();

alter table public.prospect_analyses enable row level security;
alter table public.prospect_evidence enable row level security;

create policy "Editors can manage prospect analyses" on public.prospect_analyses for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
create policy "Editors can manage prospect evidence" on public.prospect_evidence for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());

revoke all on public.prospect_analyses, public.prospect_evidence from anon;
grant select, insert, update, delete on public.prospect_analyses, public.prospect_evidence to authenticated;
