import { requiredEnv } from "./env";

/** Minimal server-only PostgREST client. Service-role credentials must never reach the browser. */
export async function supabaseAdmin<T>(
  path: string,
  options: { method?: string; body?: unknown; prefer?: string } = {},
): Promise<T> {
  const base = requiredEnv("VITE_SUPABASE_URL").replace(/\/$/, "");
  const key = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${base}/rest/v1/${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`KANIRA database request failed (${response.status}): ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : null) as T;
}

/** Validate a caller's Supabase access token before using it for customer-scoped actions. */
export async function verifySupabaseUser(accessToken: string) {
  const base = requiredEnv("VITE_SUPABASE_URL").replace(/\/$/, "");
  const anon = requiredEnv("VITE_SUPABASE_ANON_KEY");
  const response = await fetch(`${base}/auth/v1/user`, {
    headers: { apikey: anon, Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error("Authentication required");
  return response.json() as Promise<{ id: string; email?: string; phone?: string }>;
}
