/** Server-only environment access. Never import this module from browser components. */
type RuntimeEnv = Record<string, string | undefined>;

function runtimeEnv(): RuntimeEnv {
  return typeof process !== "undefined" ? process.env : {};
}

export function requiredEnv(name: string): string {
  const value = runtimeEnv()[name];
  if (!value || value.startsWith("YOUR_")) throw new Error(`Missing server configuration: ${name}`);
  return value;
}

export function optionalEnv(name: string): string | undefined {
  const value = runtimeEnv()[name];
  return value && !value.startsWith("YOUR_") ? value : undefined;
}

export function publicStoreConfig() {
  const env = runtimeEnv();
  return {
    supabaseUrl: env.VITE_SUPABASE_URL ?? "",
    supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY ?? "",
    whatsappNumber: "919944177755",
  };
}
