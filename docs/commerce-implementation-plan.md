# KANIRA commerce implementation plan

## Delivery order

1. **Foundation** — dedicated Supabase project, migrations, RLS, environment separation, storage access policies.
2. **Catalogue** — product/category/variant/image admin, inventory, real product photography and verified price import.
3. **Customer experience** — product detail pages, variant selection, cart, address book, login, account and order history.
4. **Checkout** — server-side price calculation, stock reservation, shipping/tax rules, COD and Razorpay order creation.
5. **Order operations** — payment webhooks, order status, courier/tracking, cancellation, return requests and refunds.
6. **Admin** — role-protected dashboard for catalogue, stock, orders, returns, reviews and store settings.
7. **Quality and launch** — automated tests, mobile/browser testing, accessibility, SEO, monitoring, backups and production checklist.

## API boundaries

All write operations that affect money or stock must run in trusted server code. The browser may request a checkout quote, but the server must recalculate it from current database records before creating an order.

Suggested server endpoints / server functions:
- `GET /api/catalogue`: published categories and products only.
- `GET /api/products/:slug`: product, active variants, public images and channel-appropriate display prices.
- `POST /api/checkout/quote`: validate cart IDs and quantities, calculate server-side totals; no order created.
- `POST /api/checkout/create`: revalidate quote, reserve inventory atomically, create order snapshots, and create Razorpay order when online payment is selected.
- `POST /api/payments/razorpay/webhook`: verify webhook signature, deduplicate provider events and reconcile payment/order state.
- `GET /api/orders/:orderNumber`: authenticated owner view; guest tracking must use a secure one-time token or OTP, not an order number alone.
- `POST /api/orders/:id/returns`: validate order ownership and return eligibility before accepting evidence.
- `/admin/*`: server-verified admin role required for every read/write action.

## Decisions that need owner confirmation

- Retail prices for all products where the approved catalogue does not contain MRP.
- Wholesale MOQ, pack-size and size-ratio rules per product/collection.
- Whether wholesale buyers need account approval and tax/GST details.
- Shipping provider, serviceable pincodes, shipping fee, COD availability and delivery estimates.
- Tax treatment and invoice fields.
- Cancellation/return window, damaged-item evidence rules and refund method.
- Whether guest checkout is allowed.
- Customer support email and transactional email/SMS provider.

## Security requirements

- Keep the Supabase service-role key and Razorpay secret keys server-only.
- Do not trust client-supplied prices, discounts, shipping, tax, payment status or stock.
- Verify Razorpay signatures server-side and handle webhook retries idempotently.
- Use RLS for customer-owned data; check admin privileges on the server as well as in database policies.
- Store private return evidence in a private bucket and issue short-lived signed URLs for authorized staff.
- Do not expose guest orders through predictable order numbers plus phone numbers alone.
- Record stock movements and preserve immutable order-line snapshots for auditability.

## Acceptance gates

A feature is not complete just because its screen exists. It must pass unit tests, RLS tests with anonymous/customer/admin identities, server-side validation tests, payment sandbox tests, mobile layout checks and a full order lifecycle test before launch.
