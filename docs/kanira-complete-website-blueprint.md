# KANIRA — Complete Website Blueprint

## Goal
A premium, playful kidswear commerce website with two distinct journeys: Retail customers and Wholesale buyers. Honey Badger is the functional reference; KANIRA keeps its own brand, catalogue, pricing, policies, data and business workflows.

Brand: KANIRA · Curated with love · Tiny Outfits. Big Stories. · Tiruppur, India.
Visual direction: editorial boutique styling; warm cream, peach, muted rose, olive and cocoa; elegant serif headings, clean sans-serif body, balanced animation, mobile-first layouts and reduced-motion support. Use genuine catalogue photography only. Until actual photos are mapped, show “Catalogue photo pending”.

## Site-wide shell
- Announcement strip managed from admin settings.
- Responsive header: logo, collections, search, account, wishlist, cart.
- Retail / Wholesale switch with clear explanation of different prices and order rules.
- Mobile drawer, accessible focus/keyboard states and close controls.
- Footer: collections, brand story, policies, contact, WhatsApp and social links.
- SEO metadata, canonical URLs, Open Graph, sitemap, robots and product structured data.

## Public routes
- / — Home
- /shop — Retail catalogue
- /collections/:slug — Girls, Boys, Lollipop, Limited Edition and future collections
- /product/:slug — Product details
- /search — Search results
- /wishlist — Saved items
- /cart and /checkout — Retail cart and checkout
- /account — Profile, addresses and order history
- /orders/:orderNumber — Authenticated order details
- /track — Guest tracking using order number + checkout phone
- /returns — Eligible damaged-item return/replacement requests
- /wholesale — Wholesale landing page and buying information
- /wholesale/catalogue — Wholesale SKUs, size runs and MOQ
- /wholesale/enquiry — Business enquiry form
- /about, /contact, /faq, /shipping-policy, /return-policy, /privacy-policy, /terms

## Retail journey
### Home
Editorial hero “Tiny Outfits. Big Stories.”; Girls/Boys/Lollipop/Limited Edition collection cards; new arrivals and curated edits; brand story; quality/care information; trust strip; distinct Retail and Wholesale calls to action; WhatsApp support.

### Catalogue and search
Filters for collection, age/size, colour, price and availability; sorting by featured, newest, name and price; search by product name, SKU and catalogue terms; real product imagery, price and stock on cards; pagination/load-more; loading, empty and error states.

### Product detail
Image gallery with zoom and colour-specific photos; product description, MRP, configured sale price, SKU, colour/size selection and live stock; size guide, fabric/care and delivery estimate when verified; add-to-cart, wishlist, quantity and related products; verified-purchase reviews with moderation.

### Cart and checkout
Persistent cart with add/update/remove; server-side price and stock revalidation; guest or signed-in checkout if enabled; address book; Indian address fields and 6-digit pincode validation; shipping/free-shipping/COD fees from admin settings; Razorpay and COD when configured; idempotent order creation, verified payment callbacks/webhooks and stock deduction; confirmation, order number and receipt; clear retry/error states.

### Customer account
Secure registration/login/logout/password recovery; profile and saved addresses; order list/detail; payment and shipment status; wishlist; reviews; return request history.

### Tracking and returns
Guest tracking requires both order number and checkout phone. Timeline: placed, confirmed, processing, packed, shipped, out for delivery, delivered or cancelled. Show courier, AWB and tracking link when available. Return requests must follow KANIRA's published policy and capture order item, reason, description and photo evidence; customers can follow request status.

## Wholesale journey
- Dedicated landing page explains verified MOQ, pack/size assortment, lead time, dispatch and enquiry process.
- Wholesale-only prices and SKU-level catalogue, filters by collection/SKU/size/availability.
- Product details show verified colour/SKU options, size run, MOQ and enquiry action.
- Current downloadable catalogue only after PDF assets are uploaded.
- Catalogue WhatsApp: https://wa.me/c/919944177755
- Direct WhatsApp: https://wa.me/919944177755
- Enquiry form: business/shop name, contact person, phone, city, optional email, collections, estimated quantity and message; save to KANIRA database and notify authorised team.
- Optional approval/login for wholesale accounts, negotiated pricing, quotes and wholesale orders. MOQ and pack rules must be configurable, never guessed.
- Retail and wholesale carts, orders, offers and reporting remain separate.

## Admin / operations portal
Every admin route requires server-side role authorization, not merely hidden UI links.
- /admin — sales, orders, enquiries, low stock and returns dashboard
- /admin/products — product CRUD, descriptions, collections, status, SEO and images
- /admin/variants — colour × size variants and unique SKUs
- /admin/inventory — stock adjustments, immutable stock history and low-stock alerts
- /admin/orders — retail/wholesale order views, filters and status updates
- /admin/shipments — courier, AWB, tracking URL and dispatch updates
- /admin/returns — evidence review, approve/reject and replacement workflow
- /admin/reviews — approve, reject and moderate reviews
- /admin/wholesale-enquiries — inbox, assignment, notes and status
- /admin/customers — customer and wholesale account management
- /admin/promotions — separate retail campaigns and wholesale offers
- /admin/settings — brand, WhatsApp, shipping, COD, MOQ, policies and announcement
- /admin/team — staff roles if multi-user access is enabled
- Audit log for sensitive price, stock, payment, order and role changes.

## KANIRA business rules
1. Use a separate KANIRA Supabase project, storage, auth, payment credentials and production environment. Never connect to Honey Badger customer/order data.
2. Retail prices must come from an explicitly verified KANIRA MRP/retail field.
3. Wholesale SKU prices must never appear as retail prices.
4. If retail price is missing, show “Enquire / View details”; do not calculate or invent it.
5. Wholesale prices are visible only in wholesale mode and under wholesale terms.
6. MOQ, size packs, stock and lead times must be based on verified KANIRA business rules.
7. Never invent product names, SKUs, sizes, photos, fabric claims, discounts or delivery promises.
8. Catalogue photography remains pending until actual images are provided and mapped correctly.
9. WhatsApp links prepare a message; the customer chooses whether to send it.

## Data and backend architecture
Dedicated KANIRA Supabase database:
- Auth profiles and customer/admin/staff roles
- Categories/collections, products, media and variants
- Inventory and stock transactions
- Distinct retail MRP/pricing and wholesale pricing
- Retail carts, orders, order items and status history
- Wholesale enquiries, accounts, quotes and orders
- Addresses, shipments and tracking
- Returns and private evidence storage
- Reviews and moderation
- Promotions, shipping and store settings
- Audit events

Security: Row Level Security; privileged keys server-only; server-side price/stock/MOQ/payment/order validation; Razorpay signature verification and idempotent webhooks; rate limiting and input validation; private return evidence storage; never trust browser payment success.

## Non-functional requirements
Responsive Android/mobile through desktop; accessible contrast, labels, keyboard and focus states; reduced-motion support; optimized/lazy-loaded images; secure headers; validation and useful loading/empty/error states; privacy-conscious analytics; backups, migrations and tested restore; crawlable SEO pages.

## Delivery phases and launch gates
1. Storefront foundation: responsive public pages, retail/wholesale navigation, verified catalogue data and real photos; test price separation, search, filters and details.
2. Backend and identity: isolated Supabase project, schema, RLS, roles, media, variants, inventory, authentication and admin catalogue.
3. Retail commerce: cart, server pricing, address/pincode, shipping/COD, Razorpay/webhooks, order history and guest tracking.
4. Wholesale operations: catalogue, MOQ/pack rules, enquiry inbox, account approval, quotes and order handling according to confirmed policy.
5. After-sales: returns/replacements, evidence, reviews, shipment updates, notifications, admin dashboards, promotions and audit log.
6. Production: mobile/desktop QA, accessibility/security/performance, payment sandbox, COD test orders, stock concurrency, webhook retry, backup/restore, policy review and domain deployment.

This blueprint describes the intended end state, not currently completed functionality. The site must not accept live orders or payments until backend, security, payment and operational launch gates have passed. A visual preview or demo must never be presented as a live commerce system.
