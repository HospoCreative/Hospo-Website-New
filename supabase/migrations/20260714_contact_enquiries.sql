create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text not null,
  email text not null,
  website text,
  business_type text,
  location text,
  services text[] not null default '{}',
  challenge text not null,
  timeframe text,
  message text,
  privacy_accepted boolean not null default true,
  consent_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_enquiries_status_created_idx
on public.contact_enquiries(status, created_at desc);

drop trigger if exists set_contact_enquiries_updated_at on public.contact_enquiries;
create trigger set_contact_enquiries_updated_at
before update on public.contact_enquiries
for each row execute function public.set_updated_at();

alter table public.contact_enquiries enable row level security;

drop policy if exists "Public can submit contact enquiries" on public.contact_enquiries;
create policy "Public can submit contact enquiries"
on public.contact_enquiries for insert
to anon, authenticated
with check (
  status = 'new'
  and privacy_accepted = true
  and admin_notes is null
);

drop policy if exists "Editors can read contact enquiries" on public.contact_enquiries;
create policy "Editors can read contact enquiries"
on public.contact_enquiries for select
to authenticated
using (public.is_admin_or_editor());

drop policy if exists "Editors can update contact enquiries" on public.contact_enquiries;
create policy "Editors can update contact enquiries"
on public.contact_enquiries for update
to authenticated
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

drop policy if exists "Admins can delete contact enquiries" on public.contact_enquiries;
create policy "Admins can delete contact enquiries"
on public.contact_enquiries for delete
to authenticated
using (public.is_admin());

grant insert on public.contact_enquiries to anon, authenticated;
grant select, update on public.contact_enquiries to authenticated;
grant delete on public.contact_enquiries to authenticated;
