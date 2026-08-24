-- Phase 2B Lite: database-backed, bounded analysis jobs and private assets.
alter table public.prospect_analyses
  add column if not exists current_stage text,
  add column if not exists attempt_count integer not null default 0 check (attempt_count >= 0 and attempt_count <= 2),
  add column if not exists claimed_at timestamptz,
  add column if not exists heartbeat_at timestamptz,
  add column if not exists next_attempt_at timestamptz,
  add column if not exists last_error text;

alter table public.prospect_analyses drop constraint if exists prospect_analyses_status_check;
alter table public.prospect_analyses add constraint prospect_analyses_status_check
  check (status in ('queued', 'running', 'processing', 'retrying', 'completed', 'partial', 'failed'));

alter table public.prospect_evidence drop constraint if exists prospect_evidence_evidence_group_check;
alter table public.prospect_evidence add constraint prospect_evidence_evidence_group_check
  check (evidence_group in ('overview', 'conversion', 'pages', 'contact_discovery', 'technical', 'rendering', 'performance'));

drop index if exists public.prospect_analyses_active_website_idx;
create unique index prospect_analyses_active_website_idx on public.prospect_analyses(prospect_id, analysis_type)
  where status in ('queued', 'running', 'processing', 'retrying');
create index if not exists prospect_analyses_worker_queue_idx on public.prospect_analyses(status, next_attempt_at, created_at)
  where status in ('queued', 'processing', 'retrying');

create table if not exists public.prospect_analysis_assets (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.prospect_analyses(id) on delete cascade,
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  asset_type text not null check (asset_type = 'screenshot'),
  page_type text not null,
  source_url text not null,
  storage_path text not null unique,
  viewport text not null check (viewport in ('desktop', 'mobile')),
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  created_at timestamptz not null default now()
);

create index if not exists prospect_analysis_assets_analysis_idx on public.prospect_analysis_assets(analysis_id, created_at);
alter table public.prospect_analysis_assets enable row level security;
create policy "Editors can manage prospect analysis assets" on public.prospect_analysis_assets for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
revoke all on public.prospect_analysis_assets from anon;
grant select, insert, update, delete on public.prospect_analysis_assets to authenticated;

insert into storage.buckets (id, name, public)
values ('prospect-analysis-assets', 'prospect-analysis-assets', false)
on conflict (id) do update set public = false;

create policy "Editors can read prospect analysis assets" on storage.objects for select to authenticated
  using (bucket_id = 'prospect-analysis-assets' and public.is_admin_or_editor());
create policy "Editors can write prospect analysis assets" on storage.objects for insert to authenticated
  with check (bucket_id = 'prospect-analysis-assets' and public.is_admin_or_editor());
create policy "Editors can update prospect analysis assets" on storage.objects for update to authenticated
  using (bucket_id = 'prospect-analysis-assets' and public.is_admin_or_editor())
  with check (bucket_id = 'prospect-analysis-assets' and public.is_admin_or_editor());
create policy "Editors can delete prospect analysis assets" on storage.objects for delete to authenticated
  using (bucket_id = 'prospect-analysis-assets' and public.is_admin_or_editor());

create or replace function public.claim_next_prospect_analysis_job()
returns setof public.prospect_analyses
language plpgsql security definer set search_path = public as $$
begin
  return query
  with candidate as (
    select id from public.prospect_analyses
    where attempt_count < 2
      and (
        status = 'queued'
        or (status = 'retrying' and (next_attempt_at is null or next_attempt_at <= now()))
        or (status = 'processing' and heartbeat_at < now() - interval '10 minutes')
      )
    order by created_at
    for update skip locked
    limit 1
  )
  update public.prospect_analyses analysis
  set status = 'processing', current_stage = 'html_collection', attempt_count = analysis.attempt_count + 1,
      claimed_at = now(), heartbeat_at = now(), next_attempt_at = null, last_error = null
  from candidate
  where analysis.id = candidate.id
  returning analysis.*;
end;
$$;

revoke all on function public.claim_next_prospect_analysis_job() from public, anon, authenticated;
grant execute on function public.claim_next_prospect_analysis_job() to service_role;
