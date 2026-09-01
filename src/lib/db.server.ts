/// <reference types="@cloudflare/workers-types" />

export interface CloudflareEnv {
  DB: D1Database;
  SESSION_SECRET?: string;
}

interface EnvStorage {
  getStore(): CloudflareEnv | undefined;
}

let envStorage: EnvStorage | undefined;

export function bindCloudflareEnvStorage(storage: EnvStorage) {
  envStorage = storage;
}

async function loadCloudflareEnv(): Promise<CloudflareEnv> {
  const stored = envStorage?.getStore();
  if (stored) return stored;

  if (import.meta.env.DEV) {
    const { getPlatformProxy } = await import("wrangler");
    const proxy = await getPlatformProxy({
      configPath: "./wrangler.jsonc",
    });
    return proxy.env as CloudflareEnv;
  }

  throw new Error("Cloudflare env is not available in this request context.");
}

export async function getCloudflareEnv(): Promise<CloudflareEnv> {
  return loadCloudflareEnv();
}

export async function getDb() {
  const { DB } = await getCloudflareEnv();
  if (!DB) {
    console.error("D1 binding DB is missing from worker env");
    throw new Error("D1 binding DB is not configured. Check wrangler.jsonc d1_databases.");
  }
  return DB;
}
