export type Category = "girls" | "boys" | "lollipop" | "limited";
export type PriceKind = "wholesale" | "mrp";

export interface Product {
  id: string;
  name: string;
  skus: string[];
  sizes: string[];
  category: Category;
  fabric?: string;
  details?: string[];
  price: { kind: PriceKind; amount: number };
}

export const CATEGORIES: { id: Category; label: string; note: string }[] = [
  { id: "girls", label: "Girls", note: "Wholesale catalogue" },
  { id: "boys", label: "Boys", note: "Wholesale catalogue" },
  { id: "lollipop", label: "Lollipop", note: "Wholesale catalogue" },
  { id: "limited", label: "Limited Edition", note: "MRP (retail)" },
];

const p = (
  category: Category,
  kind: PriceKind,
  name: string,
  skus: string[],
  amount: number,
  sizes: string[],
  extras: Pick<Product, "fabric" | "details"> = {},
): Product => ({ id: `${category}-${skus[0]}`, category, name, skus, sizes, price: { kind, amount }, ...extras });

const M3 = ["0-3M", "3-6M", "6-9M"];

// Girls & Boys catalogues use WHL- SKUs: treated as wholesale prices, never retail.
export const PRODUCTS: Product[] = [
  p("girls", "wholesale", "Midnight Blossom / Peach Blossom Muslin Frock", ["WHL-FRK-006-BLK", "WHL-FRK-006-PCH"], 599, ["3M", "6M", "9M"]),
  p("girls", "wholesale", "Toffee Belle / Buttercup Belle Frock", ["WHL-FRK-001-ORG", "WHL-FRK-001-YLW"], 599, ["6M", "12M", "18M"]),
  p("girls", "wholesale", "Flora Frock", ["WHL-FRK-005-PNK"], 799, ["1Y", "2Y", "3Y"]),
  p("girls", "wholesale", "Dora Frock", ["WHL-FRK-004-PNK"], 799, ["1Y", "2Y", "3Y"]),
  p("girls", "wholesale", "Sapphire Bloom Hakoba Frock", ["WHL-FRK-002-BLU"], 999, ["6M", "9M", "12M", "18M", "24M"]),
  p("girls", "wholesale", "Lime Bloom Hakoba Frock", ["WHL-FRK-003-LIM"], 899, ["3M", "6M", "9M", "12M", "18M"]),
  p("girls", "wholesale", "Royal Bloom Shorts Set", ["WHL-FRK-008-BLU"], 799, ["18M", "2Y"]),
  p("girls", "wholesale", "Emerald Bloom Hakoba Frock", ["WHL-FRK-007-GRN"], 799, ["24M", "5Y"]),

  p("limited", "mrp", "Dottie Bloomers", ["KNR-CRD-006-BRN", "KNR-CRD-006-PLM"], 699, ["12-18M", "18-24M", "2-3Y"]),
  p("limited", "mrp", "Kiss Tiered Dress", ["KNR-FRK-001-YLW", "KNR-FRK-001-RED"], 899, ["9-12M", "12-18M", "18-24M", "2-3Y"]),
  p("limited", "mrp", "Rosie & Bonnie Rompers", ["KNR-RMP-003-PNK", "KNR-RMP-003-ORG"], 599, ["0-3M", "3-6M", "6-9M", "9-12M"]),
  p("limited", "mrp", "Daisy & Kiwi Jumpsuits", ["KNR-JMP-002-YLW", "KNR-JMP-002-GRN"], 499, ["6-9M", "9-12M", "12-18M", "18-24M"]),
  p("limited", "mrp", "Reversible Jabla", ["KNR-JBL-004"], 199, ["NB", "0-3M", "3-6M", "6-9M", "9-12M"], { fabric: "Double Gauze Crinkle Muslin", details: ["Reversible design — two looks in one", "Soft and breathable", "Carrot patch detail"] }),

  p("lollipop", "wholesale", "Dottie style", ["KNR-CRD-006-BRN", "KNR-CRD-006-PLM"], 475, ["12-18M", "18-24M", "2-3Y"]),
  p("lollipop", "wholesale", "Red / Yellow Tiered Dress", ["KNR-FRK-001-RED", "KNR-FRK-001-YLW"], 549, ["9-12M", "12-18M", "18-24M", "2-3Y"]),
  p("lollipop", "wholesale", "Kiwi / Daisy Jumpsuits", ["KNR-JMP-002-GRN", "KNR-JMP-002-YLW"], 335, ["6-9M", "9-12M", "12-18M", "18-24M"]),
  p("lollipop", "wholesale", "Rosie Romper", ["KNR-RMP-003-PNK"], 399, ["0-3M", "3-6M", "6-9M", "9-12M"]),

  p("boys", "wholesale", "Elphy Shorts Set", ["WHL-CRD-010-BLU", "WHL-CRD-010-GRN"], 899, M3),
  p("boys", "wholesale", "Leo Muslin Set", ["WHL-CRD-006-BGE", "WHL-CRD-006-GRN"], 699, M3),
  p("boys", "wholesale", "Giraffe Muslin Set", ["WHL-CRD-008-PNK", "WHL-CRD-008-GRN"], 699, M3),
  p("boys", "wholesale", "Teddy Set", ["WHL-CRD-007-BLU", "WHL-CRD-007-SGE"], 699, M3),
  p("boys", "wholesale", "Milo Muslin Suspender Set", ["WHL-CRD-005-BLU", "WHL-CRD-005-PCH"], 799, M3),
  p("boys", "wholesale", "Alfie Muslin Set", ["WHL-CRD-009-CRM", "WHL-CRD-009-BLU"], 799, M3),
  p("boys", "wholesale", "Ralph Shirt Set", ["WHL-SRT-001-OLV", "WHL-SRT-001-NAVY"], 1099, ["6M", "12M", "18M", "24M"]),
  p("boys", "wholesale", "Little Pilot Set", ["WHL-CRD-011-ORG"], 799, M3),
  p("boys", "wholesale", "Oliver Shirt Set", ["WHL-SRT-002-BLU", "WHL-SRT-002-OLV"], 1099, ["6M", "12M", "18M", "24M"]),
  p("boys", "wholesale", "Archie-Charlie Shorts Set", ["WHL-CRD-003-CRM", "WHL-CRD-003-BLU"], 599, ["0-6M", "6-12M", "12-18M", "18-24M"]),
  p("boys", "wholesale", "Palm Pop Shorts Set", ["WHL-CRD-002-WHT"], 399, ["3M", "6M", "9M", "12M", "18M"]),
  p("boys", "wholesale", "Cocoa Checks Shorts Set", ["WHL-CRD-001-BRN"], 399, ["3M", "6M", "9M", "12M", "18M"]),
];

export type Mode = "retail" | "wholesale";

/** Price to show for a product in a given mode, or null => "Enquire". Never mixes kinds. */
export function priceFor(product: Product, mode: Mode): { label: string; amount: number } | null {
  const want: PriceKind = mode === "retail" ? "mrp" : "wholesale";
  if (product.price.kind === want) {
    return { label: want === "mrp" ? "MRP" : "Wholesale", amount: product.price.amount };
  }
  return null;
}

export const WHATSAPP_NUMBER = "919944177755";

export function whatsappLink(product?: Product): string {
  const msg = product
    ? `Hello KANIRA, I'd like a wholesale enquiry for ${product.name} (SKU: ${product.skus.join(", ")}). Sizes: ${product.sizes.join(", ")}. Please share MOQ and availability.`
    : "Hello KANIRA, I'd like to enquire about wholesale orders for your kidswear collections. Please share the catalogue, MOQ and availability.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const SWATCH: Record<string, string> = {
  BLK: "oklch(0.3 0.03 260)", PCH: "oklch(0.85 0.08 50)", ORG: "oklch(0.74 0.14 55)", YLW: "oklch(0.88 0.13 95)",
  PNK: "oklch(0.84 0.08 10)", BLU: "oklch(0.7 0.09 245)", LIM: "oklch(0.88 0.14 125)", GRN: "oklch(0.68 0.1 150)",
  BRN: "oklch(0.52 0.07 55)", PLM: "oklch(0.5 0.09 350)", RED: "oklch(0.6 0.19 25)", BGE: "oklch(0.86 0.04 75)",
  SGE: "oklch(0.76 0.05 140)", CRM: "oklch(0.95 0.03 85)", OLV: "oklch(0.55 0.07 120)", NAVY: "oklch(0.33 0.07 260)",
  WHT: "oklch(0.98 0.005 90)",
};
export const swatchFor = (sku: string) => SWATCH[sku.split("-").pop() ?? ""] ?? "oklch(0.9 0.03 60)";
