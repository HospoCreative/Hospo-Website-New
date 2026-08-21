-- Preserve existing numeric assessment rows while supporting a genuine
-- not-applicable state for profile-specific criteria.
alter table public.prospect_scores
  add column if not exists is_not_applicable boolean not null default false;

alter table public.prospect_scores
  alter column score drop not null;
