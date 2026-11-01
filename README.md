# KANIRA Kidswear

KANIRA is a kidswear storefront with separate retail and wholesale shopping paths.

## Development

Requirements: Node.js and Bun.

```sh
git clone https://github.com/vigneshkumar1406/kanira-playful-boutique.git
cd kanira-playful-boutique
bun install
bun run dev
```

## Project notes

- Product details are maintained in `src/lib/catalogue.ts`.
- Retail and wholesale prices are kept separate. Wholesale SKU prices must not be presented as retail prices.
- Product catalogue photography is pending; the current storefront uses clearly labelled colour previews.
- Production commerce features, database integration, checkout and payment processing must be implemented and tested before accepting live orders.
