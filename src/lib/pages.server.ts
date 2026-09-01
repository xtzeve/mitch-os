import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import {
  createPage,
  deletePage,
  getPageById,
  getPublishedPageBySlug,
  listPages,
  pageToFormData,
  savePage,
} from "@/lib/page-repository.server";
import type { PageFormData } from "@/lib/page-types";
import {
  requireAdmin,
  loginAdmin,
  logoutAdmin,
  getAuthenticatedAdmin,
} from "@/lib/admin-auth.server";
import {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
} from "@/lib/admin-user-repository.server";

export const fetchPublishedLanding = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; languageId: number }) => data)
  .handler(async ({ data }) => {
    const page = await getPublishedPageBySlug(data.slug, data.languageId);
    if (!page) {
      setResponseStatus(404);
      return null;
    }
    return page;
  });

export const fetchPages = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return listPages();
});

export const fetchPage = createServerFn({ method: "GET" })
  .inputValidator((data: { pageId: number }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const page = await getPageById(data.pageId);
    if (!page) {
      setResponseStatus(404);
      return null;
    }
    return pageToFormData(page);
  });

export const createPageAction = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const pageId = await createPage();
  return { pageId };
});

export const savePageAction = createServerFn({ method: "POST" })
  .inputValidator((data: { pageId: number; form: PageFormData }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    await savePage(data.pageId, data.form);
    return { success: true };
  });

export const deletePageAction = createServerFn({ method: "POST" })
  .inputValidator((data: { pageId: number }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    await deletePage(data.pageId);
    return { success: true };
  });

export const adminLoginAction = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    try {
      const ok = await loginAdmin(data.username, data.password);
      if (!ok) {
        return { success: false, error: "Invalid username or password." };
      }
      return { success: true };
    } catch (error) {
      console.error("adminLoginAction failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed.",
      };
    }
  });

export const adminLogoutAction = createServerFn({ method: "POST" }).handler(async () => {
  await logoutAdmin();
  return { success: true };
});

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await getAuthenticatedAdmin();
  return {
    authenticated: Boolean(admin),
    username: admin?.username ?? null,
  };
});

export const fetchAdminUsers = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return listAdminUsers();
});

export const createAdminUserAction = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    try {
      const user = await createAdminUser(data.username, data.password);
      return { success: true, user };
    } catch (error) {
      setResponseStatus(400);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create user.",
      };
    }
  });

export const deleteAdminUserAction = createServerFn({ method: "POST" })
  .inputValidator((data: { userId: number }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const current = await getAuthenticatedAdmin();
    if (current?.userId === data.userId) {
      setResponseStatus(400);
      return { success: false, error: "You cannot delete your own account." };
    }
    try {
      await deleteAdminUser(data.userId);
      return { success: true };
    } catch (error) {
      setResponseStatus(400);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user.",
      };
    }
  });

export const previewLanding = createServerFn({ method: "GET" })
  .inputValidator((data: { pageId: number; languageId: number }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const page = await getPageById(data.pageId);
    if (!page) {
      setResponseStatus(404);
      return null;
    }
    const description = page.descriptions[data.languageId];
    if (!description) {
      setResponseStatus(404);
      return null;
    }
    return {
      first_name: page.first_name,
      slug: page.slug,
      status: page.status,
      ...description,
    };
  });
