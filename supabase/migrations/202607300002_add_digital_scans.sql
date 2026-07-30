create table if not exists public.digital_scans (
  id uuid primary key default gen_random_uuid(),
  website_url text not null,
  final_url text not null,
  business_name text,
  location text,
  email text not null,
  locale text not null default 'en' check (locale in ('en', 'pt')),
  overall_score integer not null check (overall_score between 0 and 100),
  report jsonb not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'contacted', 'archived')),
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists digital_scans_status_created_idx
on public.digital_scans(status, created_at desc);

drop trigger if exists set_digital_scans_updated_at on public.digital_scans;
create trigger set_digital_scans_updated_at
before update on public.digital_scans
for each row execute function public.set_updated_at();

alter table public.digital_scans enable row level security;

drop policy if exists "Editors can read digital scans" on public.digital_scans;
create policy "Editors can read digital scans"
on public.digital_scans for select
to authenticated
using (public.is_admin_or_editor());

drop policy if exists "Editors can update digital scans" on public.digital_scans;
create policy "Editors can update digital scans"
on public.digital_scans for update
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Admins can delete digital scans" on public.digital_scans;
create policy "Admins can delete digital scans"
on public.digital_scans for delete
to authenticated
using (public.is_admin());

revoke all on public.digital_scans from anon;
grant select, update, delete on public.digital_scans to authenticated;
