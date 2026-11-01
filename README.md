# KANIRA — Tiny Outfits. Big Stories.

A premium kidswear storefront for KANIRA, with separate retail and wholesale journeys.

## Current project status

- Hybrid editorial storefront prototype is on the `design/kanira-hybrid-homepage-v1` branch.
- The current catalogue contains transcribed product metadata and price-kind safeguards. Real product photography has not yet been integrated.
- Supabase schema foundation is in `supabase/migrations`.
- This is not yet a live checkout system. Cart persistence, customer accounts, server-side checkout, Razorpay verification, shipping, order management and admin UI still require implementation and testing.

## Development

Requirements: Node.js compatible with the Vite toolchain and Bun (the repository includes `bun.lock`).

```sh
bun install
bun run dev
```

Available scripts: `bun run build`, `bun run lint`, `bun run test`.

## Backend setup

Read [Supabase setup](supabase/README.md) before creating a backend. KANIRA must have a dedicated Supabase project and separate payment credentials. Do not reuse Honey Badger data or secrets.

Copy `.env.example` to `.env.local` only after creating the KANIRA Supabase project. Keep server-only keys out of browser variables and out of Git.

## Business rules

- Retail MRP and wholesale prices are separate price types. Never display a wholesale price as retail MRP.
- Missing retail price means enquiry, not an invented price.
- Do not invent product images, descriptions, fabric claims, sizes, stock, MOQ or delivery promises.
- Wholesale MOQ and pack rules must be confirmed by the business before checkout is enabled.
- WhatsApp enquiries open a prefilled draft; the customer must review and send it.

## Safety before launch

No production deployment, live payment processing or customer-data import should happen until the KANIRA owner has supplied the required credentials and confirmed pricing, stock, shipping, taxes, returns and wholesale terms.
