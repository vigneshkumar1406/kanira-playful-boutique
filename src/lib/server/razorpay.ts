import { createHmac, timingSafeEqual } from "node:crypto";
import { requiredEnv } from "./env";

const RAZORPAY_API = "https://api.razorpay.com/v1";

function basicAuth() {
  const id = requiredEnv("RAZORPAY_KEY_ID");
  const secret = requiredEnv("RAZORPAY_KEY_SECRET");
  return { id, header: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}` };
}

export async function createRazorpayOrder(input: { amountPaise: number; receipt: string; notes?: Record<string, string> }) {
  if (!Number.isInteger(input.amountPaise) || input.amountPaise < 100) throw new Error("Invalid payment amount");
  const auth = basicAuth();
  const response = await fetch(`${RAZORPAY_API}/orders`, {
    method: "POST",
    headers: { Authorization: auth.header, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: input.amountPaise, currency: "INR", receipt: input.receipt, notes: input.notes ?? {} }),
  });
  const payload = await response.json() as { id?: string; amount?: number; currency?: string; error?: { description?: string } };
  if (!response.ok || !payload.id) throw new Error(payload.error?.description ?? "Unable to create payment order");
  return { id: payload.id, amount: payload.amount ?? input.amountPaise, currency: payload.currency ?? "INR", keyId: auth.id };
}

export function verifyRazorpayCheckoutSignature(input: { orderId: string; paymentId: string; signature: string }) {
  const secret = requiredEnv("RAZORPAY_KEY_SECRET");
  const expected = createHmac("sha256", secret).update(`${input.orderId}|${input.paymentId}`).digest("hex");
  const received = Buffer.from(input.signature, "utf8");
  const calculated = Buffer.from(expected, "utf8");
  return received.length === calculated.length && timingSafeEqual(received, calculated);
}

export function verifyRazorpayWebhook(rawBody: string, signature: string) {
  const secret = requiredEnv("RAZORPAY_WEBHOOK_SECRET");
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = Buffer.from(signature, "utf8");
  const calculated = Buffer.from(expected, "utf8");
  return received.length === calculated.length && timingSafeEqual(received, calculated);
}
