# KANIRA Supabase setup

Use a new, dedicated KANIRA Supabase project. Do not connect this repository to Honey Badger's Supabase projects or reuse its customer/order/payment data.

## Environment variables
Copy .env.example to .env.local for local development and add the KANIRA project URL and publishable/anon key. Add the service-role key and Razorpay credentials only to server-side environment settings (for example, Vercel Project Settings). Never commit .env.local, never put a secret in a VITE_ variable, and never send a service-role key to the browser.

## Database
Review migrations in timestamp order and apply them only to the KANIRA project:
1. 202611020001_initial_kanira_schema.sql
2. 202611020002_api_grants_and_security.sql

These migrations are a starting schema, not a verified production database. Run them first in a disposable KANIRA development project, inspect SQL errors and Supabase Security Advisor findings, then test with anonymous, customer, approved wholesale and admin accounts. Do not apply to a live project until those checks pass.

## Important business configuration still required
- Approved retail MRP and wholesale price rows (stored as integer paise).
- Variant stock counts and product image records.
- Wholesale MOQ/pack rules and account approval process.
- Shipping provider, serviceable pincodes, shipping charges, COD and delivery estimates.
- GST/tax and invoice settings.
- Cancellation, return, damaged-item and refund rules.
- Payment sandbox testing, webhook URL and webhook secret.

The checkout quote helper deliberately refuses missing prices and stock. Shipping and tax are currently zero only as unconfigured placeholders; do not launch checkout until approved rules are implemented.

## Current server code
- src/lib/server/supabase-admin.ts: server-only PostgREST helper and Supabase access-token validation.
- src/lib/server/auth.functions.ts: email sign-up and sign-in wrappers.
- src/lib/server/commerce.ts: server-side catalogue price/stock quote validation.
- src/lib/server/commerce.functions.ts: authenticated quote and admin overview server functions.
- src/lib/server/razorpay.ts: Razorpay order creation and checkout/webhook signature verification helpers.

These are foundations, not a completed order lifecycle. Atomic stock reservation, order creation, payment reconciliation, refunds, courier integration and end-to-end tests must be completed before accepting live orders.
