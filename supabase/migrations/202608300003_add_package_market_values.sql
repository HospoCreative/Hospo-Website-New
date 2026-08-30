-- Market values keep one package identity while allowing independent UK and Portugal pricing.
create table if not exists public.package_market_values (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  market_code text not null check (market_code in ('pt', 'uk')),
  currency text not null check (currency in ('EUR', 'GBP')),
  price_amount numeric(12,2),
  price_type text not null default 'monthly' check (price_type in ('project', 'from_project', 'monthly', 'from_monthly', 'custom')),
  price_note text,
  description text,
  deliverables text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (package_id, market_code)
);

create index if not exists package_market_values_market_active_idx on public.package_market_values(market_code, is_active);
drop trigger if exists set_package_market_values_updated_at on public.package_market_values;
create trigger set_package_market_values_updated_at before update on public.package_market_values for each row execute function public.set_updated_at();

alter table public.package_market_values enable row level security;
create policy "Public can read active package market values" on public.package_market_values for select to anon, authenticated using (is_active = true);
create policy "Editors can manage package market values" on public.package_market_values for all to authenticated using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());
revoke all on public.package_market_values from anon;
grant select on public.package_market_values to anon;
grant select, insert, update, delete on public.package_market_values to authenticated;
