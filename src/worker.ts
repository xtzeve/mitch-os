import { AsyncLocalStorage } from "node:async_hooks";
import server from "@tanstack/react-start/server-entry";
import { bindCloudflareEnvStorage, type CloudflareEnv } from "@/lib/db.server";

const envStorage = new AsyncLocalStorage<CloudflareEnv>();
bindCloudflareEnvStorage(envStorage);

type WorkerFetchArgs = [Request, CloudflareEnv, ExecutionContext];

export default {
  async fetch(...args: WorkerFetchArgs) {
    const [, env] = args;
    return envStorage.run(env, () => server.fetch(...args));
  },
};
