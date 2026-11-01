import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const QuoteInput = z.object({
  accessToken: z.string().min(20),
  channel: z.enum(["retail", "wholesale"]),
  lines: z.array(z.object({ variantId: z.string().uuid(), quantity: z.number().int().min(1).max(10) })).min(1).max(30),
});

export const getCheckoutQuote = createServerFn({ method: "POST" })
  .validator(QuoteInput)
  .handler(async ({ data }) => {
    const [{ verifySupabaseUser }, { createCheckoutQuote }] = await Promise.all([
      import("./supabase-admin"),
      import("./commerce"),
    ]);
    const user = await verifySupabaseUser(data.accessToken);
    return createCheckoutQuote(data.lines, data.channel, user.id);
  });

export const getAdminOverview = createServerFn({ method: "POST" })
  .validator(z.object({ accessToken: z.string().min(20) }))
  .handler(async ({ data }) => {
    const [{ verifySupabaseUser }, { supabaseAdmin }] = await Promise.all([
      import("./supabase-admin"),
      import("./supabase-admin"),
    ]);
    const user = await verifySupabaseUser(data.accessToken);
    const profiles = await supabaseAdmin<Array<{ role: string }>>(
      `profiles?id=eq.${encodeURIComponent(user.id)}&select=role`,
    );
    if (profiles[0]?.role !== "admin") throw new Error("Administrator access required");
    const [orders, products, returns] = await Promise.all([
      supabaseAdmin<Array<{ id: string; order_number: string; status: string; total_paise: number; created_at: string }>>("orders?select=id,order_number,status,total_paise,created_at&order=created_at.desc&limit=10"),
      supabaseAdmin<Array<{ id: string }>>("products?select=id&limit=1000"),
      supabaseAdmin<Array<{ id: string; status: string }>>("return_requests?select=id,status&status=in.(submitted,under_review)"),
    ]);
    return { recentOrders: orders, productCount: products.length, openReturns: returns.length };
  });
