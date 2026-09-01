import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { getCloudflareEnv } from "@/lib/db.server";
import { verifyAdminCredentials } from "@/lib/admin-user-repository.server";
import {
  clearSession,
  getSession,
  getRequest,
  updateSession,
} from "@tanstack/react-start/server";

const SESSION_NAME = "mitch-admin-session";

async function sessionConfig() {
  const { SESSION_SECRET } = await getCloudflareEnv();
  const password = SESSION_SECRET ?? "dev-session-secret-change-me";
  const requestUrl = getRequest()?.url;
  const isHttps = requestUrl ? new URL(requestUrl).protocol === "https:" : false;
  return {
    password,
    name: SESSION_NAME,
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

type AdminSession = {
  authenticated: boolean;
  userId?: number;
  username?: string;
};

export async function isAdminAuthenticated() {
  const session = await getSession<AdminSession>(await sessionConfig());
  return Boolean(session.data?.authenticated && session.data.userId);
}

export async function getAuthenticatedAdmin() {
  const session = await getSession<AdminSession>(await sessionConfig());
  if (!session.data?.authenticated || !session.data.userId) return null;
  return {
    userId: session.data.userId,
    username: session.data.username ?? "",
  };
}

export async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    setResponseStatus(401);
    throw new Error("Unauthorized");
  }
}

export async function loginAdmin(username: string, password: string) {
  const user = await verifyAdminCredentials(username, password);
  if (!user) return false;
  await updateSession(await sessionConfig(), {
    authenticated: true,
    userId: user.user_id,
    username: user.username,
  });
  return true;
}

export async function logoutAdmin() {
  await clearSession(await sessionConfig());
}

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await getAuthenticatedAdmin();
  return {
    authenticated: Boolean(admin),
    username: admin?.username ?? null,
  };
});
