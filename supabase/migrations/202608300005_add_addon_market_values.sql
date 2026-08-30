create table if not exists public.addon_market_values (
  id uuid primary key default gen_random_uuid(),
  addon_id uuid not null references public.addons(id) on delete cascade,
  market_code text not null check (market_code in ('pt', 'uk')),
  currency text not null check (currency in ('EUR', 'GBP')),
  price_amount numeric(12,2),
  price_type text not null default 'from_project' check (price_type in ('project', 'from_project', 'monthly', 'from_monthly', 'custom')),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (addon_id, market_code)
);
alter table public.addon_market_values enable row level security;
create policy "Public can read active addon market values" on public.addon_market_values for select to anon, authenticated using (is_active = true);
create policy "Editors can manage addon market values" on public.addon_market_values for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
revoke all on public.addon_market_values from anon;
grant select on public.addon_market_values to anon;
grant select, insert, update, delete on public.addon_market_values to authenticated;
