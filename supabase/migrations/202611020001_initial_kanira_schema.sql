-- KANIRA commerce foundation
-- Apply only to a dedicated KANIRA Supabase project. Never run against Honey Badger.
-- Checkout/order creation and payment verification must be performed by trusted server code.

create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum (
    'pending_payment', 'confirmed', 'processing', 'packed',
    'shipped', 'delivered', 'cancelled', 'return_requested', 'refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.sales_channel as enum ('retail', 'wholesale');
exception when duplicate_object then null; end $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'customer',
  wholesale_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  landmark text,
  city text not null,
  district text,
  state text not null default 'Tamil Nadu',
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint addresses_pincode_format check (pincode ~ '^[0-9]{6}$')
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  fabric text,
  care_instructions text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  wholesale_moq integer,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_wholesale_moq_positive check (wholesale_moq is null or wholesale_moq > 0)
);

create table if not exists public.product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  channel public.sales_channel not null,
  price_paise integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_id, channel),
  constraint product_price_nonnegative check (price_paise >= 0)
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  colour_name text,
  colour_code text,
  size_label text not null,
  stock_quantity integer not null default 0,
  reserved_quantity integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint variant_stock_nonnegative check (stock_quantity >= 0 and reserved_quantity >= 0),
  constraint variant_reserved_lte_stock check (reserved_quantity <= stock_quantity)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique(storage_path)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  channel public.sales_channel not null default 'retail',
  status public.order_status not null default 'pending_payment',
  payment_status public.payment_status not null default 'pending',
  payment_method text,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  shipping_address jsonb not null,
  billing_address jsonb,
  subtotal_paise integer not null,
  discount_paise integer not null default 0,
  shipping_paise integer not null default 0,
  tax_paise integer not null default 0,
  total_paise integer not null,
  currency text not null default 'INR',
  customer_note text,
  courier_name text,
  tracking_number text,
  tracking_url text,
  placed_at timestamptz not null default now(),
  delivered_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint order_amounts_nonnegative check (
    subtotal_paise >= 0 and discount_paise >= 0 and shipping_paise >= 0
    and tax_paise >= 0 and total_paise >= 0
  )
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name_snapshot text not null,
  sku_snapshot text,
  size_snapshot text,
  colour_snapshot text,
  unit_price_paise integer not null,
  quantity integer not null,
  line_total_paise integer not null,
  created_at timestamptz not null default now(),
  constraint order_item_quantity_positive check (quantity > 0),
  constraint order_item_amounts_nonnegative check (unit_price_paise >= 0 and line_total_paise >= 0)
);

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'razorpay',
  provider_order_id text unique,
  provider_payment_id text unique,
  provider_signature_verified boolean not null default false,
  amount_paise integer not null,
  currency text not null default 'INR',
  status public.payment_status not null default 'pending',
  raw_event jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payment_amount_nonnegative check (amount_paise >= 0)
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  order_id uuid references public.orders(id) on delete set null,
  movement_type text not null check (movement_type in ('opening', 'restock', 'sale', 'return', 'adjustment', 'reservation', 'release')),
  quantity_delta integer not null,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.return_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  reason text not null,
  description text,
  evidence_storage_paths text[] not null default '{}',
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'approved', 'rejected', 'pickup_scheduled', 'received', 'refunded', 'closed')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists products_category_published_idx on public.products(category_id, is_published, sort_order);
create index if not exists variants_product_idx on public.product_variants(product_id);
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists orders_phone_created_idx on public.orders(customer_phone, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists reviews_product_approved_idx on public.product_reviews(product_id, is_approved, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists addresses_set_updated_at on public.addresses;
create trigger addresses_set_updated_at before update on public.addresses for each row execute function public.set_updated_at();
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists product_prices_set_updated_at on public.product_prices;\ncreate trigger product_prices_set_updated_at before update on public.product_prices for each row execute function public.set_updated_at();\ndrop trigger if exists variants_set_updated_at on public.product_variants;
create trigger variants_set_updated_at before update on public.product_variants for each row execute function public.set_updated_at();
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();
drop trigger if exists payments_set_updated_at on public.payment_transactions;
create trigger payments_set_updated_at before update on public.payment_transactions for each row execute function public.set_updated_at();
drop trigger if exists returns_set_updated_at on public.return_requests;
create trigger returns_set_updated_at before update on public.return_requests for each row execute function public.set_updated_at();
drop trigger if exists reviews_set_updated_at on public.product_reviews;
create trigger reviews_set_updated_at before update on public.product_reviews for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_prices enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.return_requests enable row level security;
alter table public.product_reviews enable row level security;
alter table public.store_settings enable row level security;

create policy "profiles_read_own_or_admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles_insert_own_customer" on public.profiles for insert to authenticated with check (id = auth.uid() and role = 'customer');
create policy "profiles_customer_update_own" on public.profiles for update to authenticated using (id = auth.uid() and role = 'customer') with check (id = auth.uid() and role = 'customer');
create policy "profiles_admin_manage" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "addresses_owner_all" on public.addresses for all to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

create policy "categories_public_active" on public.categories for select using (is_active = true or public.is_admin());
create policy "categories_admin_manage" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "products_public_published" on public.products for select using (is_published = true or public.is_admin());
create policy "products_admin_manage" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "product_prices_channel_access" on public.product_prices for select using (
  is_active = true
  and exists (select 1 from public.products p where p.id = product_id and p.is_published = true)
  and (
    channel = 'retail'
    or public.is_admin()
    or exists (select 1 from public.profiles pr where pr.id = auth.uid() and pr.wholesale_approved = true)
  )
);
create policy "product_prices_admin_manage" on public.product_prices for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "variants_public_active_for_published_products" on public.product_variants for select using (
  is_active = true and exists (select 1 from public.products p where p.id = product_id and p.is_published = true)
  or public.is_admin()
);
create policy "variants_admin_manage" on public.product_variants for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "images_public_for_published_products" on public.product_images for select using (
  exists (select 1 from public.products p where p.id = product_id and p.is_published = true)
  or public.is_admin()
);
create policy "images_admin_manage" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "orders_customer_read_own" on public.orders for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "orders_admin_update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- No client INSERT/DELETE policy for orders. Trusted server code must validate prices, stock and payment.

create policy "order_items_read_own_or_admin" on public.order_items for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);
-- No client write policy for order items; server creates immutable price snapshots.

create policy "payments_read_own_or_admin" on public.payment_transactions for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);
-- No client write policy for payment records; only verified server/webhook code may change them.

create policy "inventory_admin_read" on public.inventory_movements for select to authenticated using (public.is_admin());
create policy "inventory_admin_insert" on public.inventory_movements for insert to authenticated with check (public.is_admin());

create policy "returns_customer_read_own" on public.return_requests for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "returns_customer_submit" on public.return_requests for insert to authenticated with check (user_id = auth.uid());
create policy "returns_admin_update" on public.return_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "reviews_public_approved" on public.product_reviews for select using (is_approved = true or user_id = auth.uid() or public.is_admin());
create policy "reviews_customer_submit" on public.product_reviews for insert to authenticated with check (user_id = auth.uid() and is_approved = false);
create policy "reviews_admin_moderate" on public.product_reviews for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "settings_public_safe_read" on public.store_settings for select using (is_public = true or public.is_admin());
create policy "settings_admin_manage" on public.store_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Create the initial customer profile when Supabase Auth creates a user.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Bootstrap the first admin manually after signing up:
-- update public.profiles set role = 'admin' where id = '<AUTH_USER_UUID>';
-- Never expose the service_role key in browser code.


-- Initial navigation categories; these are catalogue groupings, not product imports.
insert into public.categories (slug, name, sort_order, is_active)
values
  ('girls', 'Girls', 10, true),
  ('boys', 'Boys', 20, true),
  ('lollipop', 'Lollipop', 30, true),
  ('limited-edition', 'Limited Edition', 40, true)
on conflict (slug) do update
set name = excluded.name, sort_order = excluded.sort_order, is_active = excluded.is_active;

insert into public.store_settings (key, value, is_public)
values
  ('store_name', '"KANIRA"'::jsonb, true),
  ('currency', '"INR"'::jsonb, true),
  ('whatsapp_number', '"919944177755"'::jsonb, true)
on conflict (key) do nothing;


-- Storage buckets: catalogue images are public; return evidence is private.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('return-evidence', 'return-evidence', false, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "product_images_public_read"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "product_images_admin_insert"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.is_admin());

create policy "return_evidence_owner_upload"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'return-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "return_evidence_owner_read_or_admin"
on storage.objects for select to authenticated
using (
  bucket_id = 'return-evidence'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

create policy "return_evidence_admin_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'return-evidence' and public.is_admin());
