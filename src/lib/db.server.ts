/// <reference types="@cloudflare/workers-types" />

export interface CloudflareEnv {
  DB: D1Database;
  SESSION_SECRET?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __mitchOsEnvPromise: Promise<CloudflareEnv> | undefined;
}

async function loadCloudflareEnv(): Promise<CloudflareEnv> {
  if (import.meta.env.DEV) {
    const { getPlatformProxy } = await import("wrangler");
    const proxy = await getPlatformProxy({
      configPath: "./wrangler.jsonc",
    });
    return proxy.env as CloudflareEnv;
  }

  const { env } = await import("cloudflare:workers");
  return env as CloudflareEnv;
}

export async function getCloudflareEnv(): Promise<CloudflareEnv> {
  if (!globalThis.__mitchOsEnvPromise) {
    globalThis.__mitchOsEnvPromise = loadCloudflareEnv();
  }
  return globalThis.__mitchOsEnvPromise;
}

export async function getDb() {
  const { DB } = await getCloudflareEnv();
  if (!DB) {
    throw new Error("D1 binding DB is not configured. Check wrangler.jsonc d1_databases.");
  }
  return DB;
}
