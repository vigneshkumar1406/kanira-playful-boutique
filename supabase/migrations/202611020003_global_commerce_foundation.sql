-- KANIRA global-commerce foundation (India-first, INR as canonical catalogue currency).
-- Review and test on a disposable KANIRA development project before applying anywhere.
-- This migration intentionally does not activate live FX rates or international checkout.

begin;

create table if not exists public.currencies (
  code text primary key check (code ~ '^[A-Z]{3}$'),
  name text not null,
  minor_unit smallint not null default 2 check (minor_unit between 0 and 3),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.currencies (code, name, minor_unit, is_active) values
  ('INR', 'Indian Rupee', 2, true),
  ('USD', 'US Dollar', 2, true),
  ('GBP', 'British Pound', 2, true),
  ('EUR', 'Euro', 2, true),
  ('AED', 'UAE Dirham', 2, true),
  ('SGD', 'Singapore Dollar', 2, true),
  ('AUD', 'Australian Dollar', 2, true),
  ('CAD', 'Canadian Dollar', 2, true)
on conflict (code) do update
set name = excluded.name, minor_unit = excluded.minor_unit;

create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  base_currency text not null references public.currencies(code),
  quote_currency text not null references public.currencies(code),
  rate numeric(20, 10) not null check (rate > 0),
  source text not null,
  fetched_at timestamptz not null,
  expires_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint exchange_rate_pair_unique unique (base_currency, quote_currency),
  constraint exchange_rate_distinct_currencies check (base_currency <> quote_currency),
  constraint exchange_rate_expiry_after_fetch check (expires_at > fetched_at)
);

-- Optional fixed market prices. If no row exists, the storefront may show a clearly
-- labelled indicative conversion from the INR catalogue price using a valid FX rate.
create table if not exists public.localized_product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  channel public.sales_channel not null,
  currency_code text not null references public.currencies(code),
  amount_minor integer not null check (amount_minor >= 0),
  is_active boolean not null default true,
  effective_from timestamptz not null default now(),
  effective_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint localized_product_price_window check (effective_until is null or effective_until > effective_from),
);

create unique index if not exists localized_product_price_active_unique
  on public.localized_product_prices(product_id, channel, currency_code)
  where is_active = true;

-- Addresses use the existing pincode field as a destination postal/ZIP code.
-- Indian PIN validation applies only to India; other countries are not forced into 6 digits.
alter table public.addresses
  add column if not exists country_code char(2) not null default 'IN';
alter table public.addresses alter column pincode drop not null;
alter table public.addresses drop constraint if exists addresses_pincode_format;
alter table public.addresses
  add constraint addresses_country_code_format check (country_code ~ '^[A-Z]{2}$');
alter table public.addresses
  add constraint addresses_indian_pincode_format
  check (country_code <> 'IN' or pincode is null or pincode ~ '^[1-9][0-9]{5}$');
comment on column public.product_prices.price_paise is
  'Canonical INR catalogue amount in paise. Fixed local-market prices are stored in localized_product_prices.';
comment on column public.addresses.pincode is
  'Destination postal/ZIP code. Country-specific validation applies; India uses a six-digit PIN.';

-- *_paise columns remain canonical INR snapshots for reconciliation.
-- *_minor columns hold values charged in orders.currency, using that currency's minor unit.
alter table public.orders
  add column if not exists base_currency text not null default 'INR' references public.currencies(code),
  add column if not exists exchange_rate_quote_per_base numeric(20, 10) not null default 1,
  add column if not exists fx_source text,
  add column if not exists fx_captured_at timestamptz,
  add column if not exists subtotal_minor integer,
  add column if not exists discount_minor integer,
  add column if not exists shipping_minor integer,
  add column if not exists tax_minor integer,
  add column if not exists total_minor integer,
  add column if not exists shipping_country_code char(2) not null default 'IN',
  add column if not exists billing_country_code char(2);

update public.orders
set subtotal_minor = coalesce(subtotal_minor, subtotal_paise),
    discount_minor = coalesce(discount_minor, discount_paise),
    shipping_minor = coalesce(shipping_minor, shipping_paise),
    tax_minor = coalesce(tax_minor, tax_paise),
    total_minor = coalesce(total_minor, total_paise),
    base_currency = coalesce(base_currency, 'INR'),
    exchange_rate_quote_per_base = coalesce(exchange_rate_quote_per_base, 1);

alter table public.orders
  alter column subtotal_minor set not null,
  alter column discount_minor set not null,
  alter column shipping_minor set not null,
  alter column tax_minor set not null,
  alter column total_minor set not null,
  alter column subtotal_minor set default 0,
  alter column discount_minor set default 0,
  alter column shipping_minor set default 0,
  alter column tax_minor set default 0,
  alter column total_minor set default 0;

alter table public.orders
  add constraint orders_currency_code_format check (currency ~ '^[A-Z]{3}$'),
  add constraint orders_country_code_format check (shipping_country_code ~ '^[A-Z]{2}$' and (billing_country_code is null or billing_country_code ~ '^[A-Z]{2}$')),
  add constraint orders_exchange_rate_positive check (exchange_rate_quote_per_base > 0),
  add constraint orders_minor_amounts_nonnegative check (
    subtotal_minor >= 0 and discount_minor >= 0 and shipping_minor >= 0
    and tax_minor >= 0 and total_minor >= 0
  );

alter table public.order_items
  add column if not exists unit_price_minor integer,
  add column if not exists line_total_minor integer;

update public.order_items
set unit_price_minor = coalesce(unit_price_minor, unit_price_paise),
    line_total_minor = coalesce(line_total_minor, line_total_paise);

alter table public.order_items
  alter column unit_price_minor set not null,
  alter column line_total_minor set not null,
  add constraint order_item_minor_amounts_nonnegative
  check (unit_price_minor >= 0 and line_total_minor >= 0);

alter table public.payment_transactions
  add column if not exists amount_minor integer;

update public.payment_transactions
set amount_minor = coalesce(amount_minor, amount_paise);

alter table public.payment_transactions
  alter column amount_minor set not null,
  add constraint payment_minor_amount_nonnegative check (amount_minor >= 0);

create index if not exists exchange_rates_expiry_idx
  on public.exchange_rates(base_currency, is_active, expires_at);
create index if not exists localized_product_prices_lookup_idx
  on public.localized_product_prices(product_id, channel, currency_code, is_active);


drop trigger if exists currencies_set_updated_at on public.currencies;
create trigger currencies_set_updated_at before update on public.currencies
for each row execute function public.set_updated_at();

drop trigger if exists exchange_rates_set_updated_at on public.exchange_rates;
create trigger exchange_rates_set_updated_at before update on public.exchange_rates
for each row execute function public.set_updated_at();

drop trigger if exists localized_product_prices_set_updated_at on public.localized_product_prices;
create trigger localized_product_prices_set_updated_at before update on public.localized_product_prices
for each row execute function public.set_updated_at();

alter table public.currencies enable row level security;
alter table public.exchange_rates enable row level security;
alter table public.localized_product_prices enable row level security;

-- SECURITY DEFINER is retained only for this narrowly-scoped role lookup.
-- A fixed empty search_path prevents object-shadowing in public/temp schemas.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$function$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "returns_customer_submit" on public.return_requests;
create policy "returns_customer_submit"
on public.return_requests for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.orders o
    where o.id = public.return_requests.order_id and o.user_id = auth.uid()
  )
  and (
    order_item_id is null
    or exists (
      select 1 from public.order_items oi
      where oi.id = public.return_requests.order_item_id and oi.order_id = public.return_requests.order_id
    )
  )
);

drop policy if exists "reviews_customer_submit" on public.product_reviews;
create policy "reviews_customer_submit"
on public.product_reviews for insert to authenticated
with check (
  user_id = auth.uid()
  and is_approved = false
  and order_id is not null
  and exists (
    select 1
    from public.orders o
    join public.order_items oi on oi.order_id = o.id
    where o.id = public.product_reviews.order_id
      and o.user_id = auth.uid()
      and oi.product_id = public.product_reviews.product_id
  )
);

drop policy if exists "currencies_public_active_read" on public.currencies;
create policy "currencies_public_active_read"
on public.currencies for select
using (is_active = true or public.is_admin());

drop policy if exists "currencies_admin_manage" on public.currencies;
create policy "currencies_admin_manage"
on public.currencies for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "exchange_rates_public_current_read" on public.exchange_rates;
create policy "exchange_rates_public_current_read"
on public.exchange_rates for select
using ((is_active = true and expires_at > now()) or public.is_admin());

drop policy if exists "exchange_rates_admin_manage" on public.exchange_rates;
create policy "exchange_rates_admin_manage"
on public.exchange_rates for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "localized_prices_public_channel_read" on public.localized_product_prices;
create policy "localized_prices_public_channel_read"
on public.localized_product_prices for select
using (
  is_active = true
  and effective_from <= now()
  and (effective_until is null or effective_until > now())
  and exists (
    select 1 from public.products p
    where p.id = product_id and p.is_published = true
  )
  and (
    channel = 'retail'
    or public.is_admin()
    or exists (
      select 1 from public.profiles pr
      where pr.id = auth.uid() and pr.wholesale_approved = true
    )
  )
);

drop policy if exists "localized_prices_admin_manage" on public.localized_product_prices;
create policy "localized_prices_admin_manage"
on public.localized_product_prices for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Public Data API access is explicitly granted. RLS above remains the row boundary.
grant usage on schema public to anon, authenticated;
grant select on public.currencies, public.exchange_rates to anon, authenticated;
grant select on public.localized_product_prices to anon, authenticated;
grant insert, update, delete on public.currencies, public.exchange_rates, public.localized_product_prices to authenticated;

-- The server-side PostgREST helper uses the service_role key. Grant its required
-- object privileges explicitly because newer Supabase defaults may not auto-grant them.
grant select, insert, update, delete on
  public.profiles, public.addresses, public.categories, public.products,
  public.product_prices, public.product_variants, public.product_images,
  public.orders, public.order_items, public.payment_transactions,
  public.inventory_movements, public.return_requests, public.product_reviews,
  public.store_settings, public.currencies, public.exchange_rates,
  public.localized_product_prices
to service_role;

commit;
