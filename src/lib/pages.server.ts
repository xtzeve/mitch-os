import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import {
  createPageFromForm,
  deleteEmptyDraftPages,
  deletePage,
  getPageById,
  getPublishedPageBySlug,
  incrementPageVisited,
  listPages,
  pageToFormData,
  savePage,
} from "@/lib/page-repository.server";
import {
  createCatalogItem,
  deleteCatalogItem,
  listCatalog,
  updateCatalogItem,
} from "@/lib/catalog-repository.server";
import type { CatalogKind } from "@/lib/catalog-types";
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

const CATALOG_KINDS = new Set<CatalogKind>(["territory", "owner", "campaign"]);

function assertCatalogKind(kind: string): CatalogKind {
  if (!CATALOG_KINDS.has(kind as CatalogKind)) {
    throw new Error("Invalid catalog kind.");
  }
  return kind as CatalogKind;
}

export const fetchPublishedLanding = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; languageId: number }) => data)
  .handler(async ({ data }) => {
    const page = await getPublishedPageBySlug(data.slug, data.languageId);
    if (!page) {
      setResponseStatus(404);
      return null;
    }
    await incrementPageVisited(page.page_id);
    return page;
  });

export const fetchPages = createServerFn({ method: "GET" })
  .inputValidator(
    (data: {
      search?: string;
      page?: number;
      perPage?: number;
      territoryId?: number | null;
      ownerId?: number | null;
      campaignId?: number | null;
      publishedFrom?: string | null;
      publishedTo?: string | null;
      sortBy?: string;
      sortDir?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    await deleteEmptyDraftPages();
    const [result, territories, owners, campaigns] = await Promise.all([
      listPages(data),
      listCatalog("territory"),
      listCatalog("owner"),
      listCatalog("campaign"),
    ]);
    return { ...result, territories, owners, campaigns };
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
    const [territories, owners, campaigns] = await Promise.all([
      listCatalog("territory"),
      listCatalog("owner"),
      listCatalog("campaign"),
    ]);
    return {
      form: pageToFormData(page),
      territories,
      owners,
      campaigns,
    };
  });

export const fetchNewPageForm = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const [territories, owners, campaigns] = await Promise.all([
    listCatalog("territory"),
    listCatalog("owner"),
    listCatalog("campaign"),
  ]);
  return { territories, owners, campaigns };
});

export const createPageAction = createServerFn({ method: "POST" })
  .inputValidator((data: { form: PageFormData }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const pageId = await createPageFromForm(data.form);
    return { success: true, pageId };
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

export const fetchCatalog = createServerFn({ method: "GET" })
  .inputValidator((data: { kind: CatalogKind }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    return listCatalog(assertCatalogKind(data.kind));
  });

export const createCatalogAction = createServerFn({ method: "POST" })
  .inputValidator((data: { kind: CatalogKind; name: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    try {
      const item = await createCatalogItem(assertCatalogKind(data.kind), data.name);
      return { success: true, item };
    } catch (error) {
      setResponseStatus(400);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create.",
      };
    }
  });

export const updateCatalogAction = createServerFn({ method: "POST" })
  .inputValidator((data: { kind: CatalogKind; id: number; name: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    try {
      await updateCatalogItem(assertCatalogKind(data.kind), data.id, data.name);
      return { success: true };
    } catch (error) {
      setResponseStatus(400);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update.",
      };
    }
  });

export const deleteCatalogAction = createServerFn({ method: "POST" })
  .inputValidator((data: { kind: CatalogKind; id: number }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    try {
      await deleteCatalogItem(assertCatalogKind(data.kind), data.id);
      return { success: true };
    } catch (error) {
      setResponseStatus(400);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete.",
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
      published: page.published,
      ...description,
    };
  });
