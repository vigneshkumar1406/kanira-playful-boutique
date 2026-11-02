# KANIRA Supabase setup

Use a new, dedicated KANIRA Supabase project. Do not connect this repository to Honey Badger's Supabase projects or reuse its customer/order/payment data.

## Environment variables
Copy .env.example to .env.local for local development and add the KANIRA project URL and publishable/anon key. Add the service-role key and Razorpay credentials only to server-side environment settings (for example, Vercel Project Settings). Never commit .env.local, never put a secret in a VITE_ variable, and never send a service-role key to the browser.

## Database
Review migrations in timestamp order and apply them only to the KANIRA project:
1. 202611020001_initial_kanira_schema.sql
2. 202611020002_api_grants_and_security.sql
3. 202611020003_global_commerce_foundation.sql

These migrations are a starting schema, not a verified production database. Run them first in a disposable KANIRA development project, inspect SQL errors and Supabase Security Advisor findings, then test with anonymous, customer, approved wholesale and admin accounts. Do not apply to a live project until those checks pass. The migration files in this branch have not been applied to any Supabase project.

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


## India-first multi-currency model

- Product catalogue prices remain canonical INR values stored as integer paise.
- `currencies` defines supported ISO currency codes and minor-unit precision.
- `exchange_rates` stores the current INR-to-quote-currency rate, its source, fetch time and expiry. Expired rates are not readable through the public policy.
- `localized_product_prices` supports approved fixed prices by product, sales channel and currency. If a fixed price is absent, the storefront can show an indicative INR conversion.
- `orders.*_paise` fields remain the INR/base-currency reconciliation snapshot. New `*_minor` fields store the amount in the customer's selected order currency. The FX quote, source and capture time are saved on the order.
- Address postal-code validation is country-aware. Indian PIN codes remain six digits; other destinations are not forced into that format.
- The storefront currency selector only offers non-INR currencies when an unexpired rate exists. No exchange-rate values are seeded or fabricated.

**Current boundary:** the selector is a display preference only. It does not enable foreign-currency checkout, payment settlement, international shipping, duties or taxes. The existing Razorpay server helper creates INR orders only. Until a verified international payment and export/shipping flow is implemented, KANIRA must quote and confirm international orders manually in INR.
