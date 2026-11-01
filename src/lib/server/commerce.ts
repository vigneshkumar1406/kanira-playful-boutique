import { supabaseAdmin } from "./supabase-admin";
import { createRazorpayOrder } from "./razorpay";

type CartLine = { variantId: string; quantity: number };
type VariantRow = { id: string; product_id: string; sku: string; size_label: string; colour_name: string | null; stock_quantity: number; reserved_quantity: number; is_active: boolean; products: { name: string; is_published: boolean } };
type PriceRow = { product_id: string; channel: "retail" | "wholesale"; price_paise: number; is_active: boolean };

export type CheckoutQuote = {
  lines: Array<{ variantId: string; productId: string; name: string; sku: string; size: string; colour: string | null; quantity: number; unitPricePaise: number; lineTotalPaise: number }>;
  subtotalPaise: number; shippingPaise: number; taxPaise: number; totalPaise: number; channel: "retail" | "wholesale";
};

/** Internal server-only helper. userId MUST come from verifySupabaseUser(accessToken), never from request JSON. */
export async function createCheckoutQuote(lines: CartLine[], channel: "retail" | "wholesale", userId: string): Promise<CheckoutQuote> {
  if (!userId || !Array.isArray(lines) || lines.length < 1 || lines.length > 30) throw new Error("Cart is empty or invalid");
  const seen = new Set<string>();
  for (const line of lines) {
    if (!line.variantId || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 10 || seen.has(line.variantId)) throw new Error("Invalid cart line");
    seen.add(line.variantId);
  }
  if (channel === "wholesale") {
    const profiles = await supabaseAdmin<Array<{ wholesale_approved: boolean }>>(`profiles?id=eq.${encodeURIComponent(userId)}&select=wholesale_approved`);
    if (!profiles[0]?.wholesale_approved) throw new Error("Wholesale account approval is required");
  }
  const ids = [...seen].map(encodeURIComponent).join(",");
  const variants = await supabaseAdmin<VariantRow[]>(`product_variants?id=in.(${ids})&select=id,product_id,sku,size_label,colour_name,stock_quantity,reserved_quantity,is_active,products(name,is_published)`);
  if (variants.length !== lines.length) throw new Error("One or more items are unavailable");
  const productIds = [...new Set(variants.map((v) => v.product_id))].map(encodeURIComponent).join(",");
  const prices = await supabaseAdmin<PriceRow[]>(`product_prices?product_id=in.(${productIds})&channel=eq.${channel}&is_active=eq.true&select=product_id,channel,price_paise,is_active`);
  const priceMap = new Map(prices.map((price) => [price.product_id, price.price_paise]));
  const quoteLines = lines.map((line) => {
    const variant = variants.find((v) => v.id === line.variantId);
    if (!variant || !variant.is_active || !variant.products?.is_published || variant.stock_quantity - variant.reserved_quantity < line.quantity) throw new Error("An item is out of stock or unavailable");
    const unitPricePaise = priceMap.get(variant.product_id);
    if (!unitPricePaise || unitPricePaise < 1) throw new Error("Price is not configured for this sales channel");
    return { variantId: variant.id, productId: variant.product_id, name: variant.products.name, sku: variant.sku, size: variant.size_label, colour: variant.colour_name, quantity: line.quantity, unitPricePaise, lineTotalPaise: unitPricePaise * line.quantity };
  });
  const subtotalPaise = quoteLines.reduce((sum, line) => sum + line.lineTotalPaise, 0);
  // Shipping/tax remain zero until approved rules are configured in the store.
  const shippingPaise = 0; const taxPaise = 0;
  return { lines: quoteLines, subtotalPaise, shippingPaise, taxPaise, totalPaise: subtotalPaise + shippingPaise + taxPaise, channel };
}

/** Call only after a trusted transaction creates a pending order and immutable order-item snapshots. */
export async function createPaymentForPendingOrder(orderId: string, amountPaise: number) {
  if (!orderId) throw new Error("Order ID is required");
  const payment = await createRazorpayOrder({ amountPaise, receipt: orderId });
  await supabaseAdmin("payment_transactions", { method: "POST", prefer: "return=minimal", body: { order_id: orderId, provider_order_id: payment.id, amount_paise: amountPaise, currency: "INR", status: "pending" } });
  return payment;
}
