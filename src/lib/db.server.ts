/// <reference types="@cloudflare/workers-types" />

export interface CloudflareEnv {
  DB: D1Database;
  SESSION_SECRET?: string;
}

let cachedEnv: CloudflareEnv | null = null;

export async function getCloudflareEnv(): Promise<CloudflareEnv> {
  if (cachedEnv) return cachedEnv;

  if (import.meta.env.DEV) {
    const { getPlatformProxy } = await import("wrangler");
    const proxy = await getPlatformProxy({
      configPath: "./wrangler.jsonc",
    });
    cachedEnv = proxy.env as CloudflareEnv;
    return cachedEnv;
  }

  const { env } = await import("cloudflare:workers");
  cachedEnv = env as CloudflareEnv;
  return cachedEnv;
}

export async function getDb() {
  const { DB } = await getCloudflareEnv();
  if (!DB) {
    throw new Error("D1 binding DB is not configured. Check wrangler.jsonc d1_databases.");
  }
  return DB;
}
