import { describe, expect, it } from "vitest";
import { PRODUCTS, priceFor, whatsappLink } from "./catalogue";

describe("pricing rules", () => {
  it("never shows wholesale prices as retail", () => {
    for (const p of PRODUCTS.filter((x) => x.price.kind === "wholesale")) {
      expect(priceFor(p, "retail")).toBeNull();
    }
  });
  it("Kiss Tiered Dress shows MRP 899 in retail", () => {
    const kiss = PRODUCTS.find((p) => p.name === "Kiss Tiered Dress")!;
    expect(priceFor(kiss, "retail")).toEqual({ label: "MRP", amount: 899 });
  });
  it("whatsapp goes to +91 9944177755 with a prefilled message", () => {
    const url = whatsappLink(PRODUCTS[0]);
    expect(url.startsWith("https://wa.me/919944177755?text=")).toBe(true);
    expect(decodeURIComponent(url)).toContain("WHL-FRK-006-BLK");
  });
});
