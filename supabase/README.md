# KANIRA backend setup

This project must use its own Supabase project. Do not reuse Honey Badger's project, keys, tables, storage, customer records, orders or payment credentials.

## What is included

- `migrations/202611020001_initial_kanira_schema.sql`: first commerce schema for profiles, addresses, catalogue, variants, product images, orders, immutable order-line snapshots, payment transactions, inventory movements, returns, reviews and store settings.
- Retail and wholesale prices live in a separate table. Retail prices are readable for published products; wholesale prices are limited to admins and explicitly approved wholesale accounts. Customers cannot approve themselves.\n- Row Level Security is enabled for every application table.
- Public visitors can read only active categories and published catalogue content.
- Customers can read their own profile, addresses and orders; they cannot write order totals or payment records from the browser.
- Admin access is role-based. Bootstrap the first admin manually after creating that user's account.

## Create the project

1. Create a new Supabase project named KANIRA in the correct owner/organisation.
2. Choose a strong database password and store it in a password manager.
3. In Supabase SQL Editor, run the migration file in this folder.
4. Sign up the intended owner account through Supabase Auth.
5. In SQL Editor, find that user's UUID in Authentication > Users, then run:
   `update public.profiles set role = 'admin' where id = 'YOUR_AUTH_USER_UUID';`
6. Create a private Storage bucket named `product-images`. Add policies so public users can read images belonging to published products, while only admins can upload, update or delete. Do not make return-evidence uploads public.
7. Add environment variables to the deployment provider (never commit actual values):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - server-only `SUPABASE_SERVICE_ROLE_KEY`
   - server-only Razorpay credentials when payment integration is approved.
8. Keep service-role and payment secrets exclusively in server/Edge Function environment variables.

## Important checkout boundary

The storefront must not insert orders or order items directly with the anon key. A trusted server endpoint/Edge Function must:
- validate product/variant IDs and active status;
- fetch current channel-specific prices from the database;
- validate wholesale MOQ and any pack/size rules configured by the business;
- reserve stock atomically;
- calculate discounts, shipping and taxes on the server;
- create order and item snapshots;
- create Razorpay orders server-side;
- verify Razorpay signatures server-side and reconcile webhook events idempotently;
- mark an order paid only after verified provider confirmation.

COD orders still need server-side stock reservation and order validation. Do not trust totals sent by the browser.

## Before launch

- Confirm real retail prices, wholesale prices, MOQ, pack rules, delivery charges, taxes, return window and shipping coverage with the business owner.
- Import catalogue records only after reconciling all product photos, SKU/variant mappings and prices against the approved PDFs.
- Test RLS with anonymous, customer and admin accounts.
- Test payment success, failure, duplicate webhook delivery, COD, cancellation, refunds and inventory races.
- Configure email/SMS provider and courier integration only after credentials and business decisions are supplied.
- This schema is a foundation, not a deployed or production-verified backend. Review and test the migration in a fresh KANIRA Supabase project before launch.
