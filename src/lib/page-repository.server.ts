import {
  DEFAULT_DESCRIPTIONS_BY_LANGUAGE,
} from "@/lib/page-defaults";
import {
  normalizeSlug,
  validateFirstName,
  validateSlug,
} from "@/lib/page-validation";
import {
  LANGUAGE_DE,
  LANGUAGE_EN,
  PAGE_DESCRIPTION_COLUMNS,
  PAGE_LIST_PER_PAGE_OPTIONS,
  PAGE_STATUS_DRAFT,
  type PageDescriptionRecord,
  type PageFormData,
  type PageListPerPage,
  type PageRecord,
  type PageWithDescriptions,
} from "@/lib/page-types";
import { getDb } from "@/lib/db.server";

function mapDescription(row: Record<string, unknown>): PageDescriptionRecord {
  return {
    page_id: Number(row.page_id),
    language_id: Number(row.language_id),
    greeting: String(row.greeting ?? ""),
    why_body: String(row.why_body ?? ""),
    why_claim: String(row.why_claim ?? ""),
    preview_intro: String(row.preview_intro ?? ""),
    four_thing_1: String(row.four_thing_1 ?? ""),
    four_thing_2: String(row.four_thing_2 ?? ""),
    four_thing_3: String(row.four_thing_3 ?? ""),
    four_thing_4: String(row.four_thing_4 ?? ""),
    structure_intro: String(row.structure_intro ?? ""),
    mechanism_p1: String(row.mechanism_p1 ?? ""),
    mechanism_p2: String(row.mechanism_p2 ?? ""),
    mechanism_p3: String(row.mechanism_p3 ?? ""),
    unseen_p1: String(row.unseen_p1 ?? ""),
    unseen_p2: String(row.unseen_p2 ?? ""),
    cta_phone: String(row.cta_phone ?? ""),
    cta_label: String(row.cta_label ?? ""),
    cta_alt: String(row.cta_alt ?? ""),
  };
}

function mapPage(row: Record<string, unknown>): PageRecord {
  return {
    page_id: Number(row.page_id),
    first_name: String(row.first_name ?? ""),
    slug: String(row.slug ?? ""),
    status: Number(row.status ?? 0),
    visited: Number(row.visited ?? 0),
    date_added: String(row.date_added ?? ""),
    date_modified: String(row.date_modified ?? ""),
  };
}

export { normalizeSlug, validateFirstName, validateSlug } from "@/lib/page-validation";

export type ListPagesParams = {
  search?: string;
  page?: number;
  perPage?: number;
};

export type ListPagesResult = {
  items: PageRecord[];
  total: number;
  page: number;
  perPage: PageListPerPage;
  totalPages: number;
};

function normalizePerPage(value: number | undefined): PageListPerPage {
  return (PAGE_LIST_PER_PAGE_OPTIONS as readonly number[]).includes(value ?? -1)
    ? (value as PageListPerPage)
    : 20;
}

export async function listPages(params: ListPagesParams = {}): Promise<ListPagesResult> {
  const search = (params.search ?? "").trim();
  const perPage = normalizePerPage(params.perPage);
  let page = Math.max(1, Math.floor(params.page ?? 1) || 1);

  const db = await getDb();
  const like = `%${search}%`;
  const where = search
    ? "WHERE first_name LIKE ? COLLATE NOCASE OR slug LIKE ? COLLATE NOCASE"
    : "";
  const filterBinds = search ? [like, like] : [];

  const countRow = await db
    .prepare(`SELECT COUNT(*) AS total FROM page ${where}`)
    .bind(...filterBinds)
    .first<{ total: number }>();
  const total = Number(countRow?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / perPage) || 1);
  if (page > totalPages) page = totalPages;
  const offset = (page - 1) * perPage;

  const result = await db
    .prepare(
      `SELECT * FROM page ${where}
       ORDER BY date_modified DESC, page_id DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...filterBinds, perPage, offset)
    .all<PageRecord>();

  return {
    items: (result.results ?? []).map((row) => mapPage(row as unknown as Record<string, unknown>)),
    total,
    page,
    perPage,
    totalPages,
  };
}

export async function getPageById(pageId: number): Promise<PageWithDescriptions | null> {
  const db = await getDb();
  const pageRow = await db.prepare("SELECT * FROM page WHERE page_id = ?").bind(pageId).first();
  if (!pageRow) return null;

  const descriptions = await db
    .prepare("SELECT * FROM page_description WHERE page_id = ?")
    .bind(pageId)
    .all<PageDescriptionRecord>();

  const descriptionsMap: Record<number, PageDescriptionRecord> = {};
  for (const row of descriptions.results ?? []) {
    const mapped = mapDescription(row as unknown as Record<string, unknown>);
    descriptionsMap[mapped.language_id] = mapped;
  }

  return {
    ...mapPage(pageRow as unknown as Record<string, unknown>),
    descriptions: descriptionsMap,
  };
}

export async function getPublishedPageBySlug(
  slug: string,
  languageId: number,
): Promise<(PageRecord & PageDescriptionRecord) | null> {
  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT p.*, pd.*
       FROM page p
       INNER JOIN page_description pd ON p.page_id = pd.page_id
       WHERE p.slug = ? AND pd.language_id = ? AND p.status = 1`,
    )
    .bind(slug, languageId)
    .first();

  if (!row) return null;

  const record = row as unknown as Record<string, unknown>;
  return {
    ...mapPage(record),
    ...mapDescription(record),
  };
}

export async function incrementPageVisited(pageId: number) {
  const db = await getDb();
  await db
    .prepare("UPDATE page SET visited = visited + 1 WHERE page_id = ?")
    .bind(pageId)
    .run();
}

export async function isSlugTaken(slug: string, excludePageId?: number) {
  const normalized = normalizeSlug(slug);
  const db = await getDb();
  const query =
    excludePageId != null
      ? db
          .prepare("SELECT page_id FROM page WHERE slug = ? AND page_id != ?")
          .bind(normalized, excludePageId)
      : db.prepare("SELECT page_id FROM page WHERE slug = ?").bind(normalized);
  const row = await query.first();
  return Boolean(row);
}

export async function createPage(): Promise<number> {
  const db = await getDb();
  const insert = await db
    .prepare(
      `INSERT INTO page (first_name, slug, status, date_added, date_modified)
       VALUES ('', '', ?, datetime('now'), datetime('now'))`,
    )
    .bind(PAGE_STATUS_DRAFT)
    .run();

  const pageId = Number(insert.meta.last_row_id);
  const languages = [LANGUAGE_EN, LANGUAGE_DE];

  for (const languageId of languages) {
    const defaults = DEFAULT_DESCRIPTIONS_BY_LANGUAGE[languageId];
    const columns = ["page_id", "language_id", ...PAGE_DESCRIPTION_COLUMNS];
    const placeholders = columns.map(() => "?").join(", ");
    const values = [pageId, languageId, ...PAGE_DESCRIPTION_COLUMNS.map((col) => defaults[col])];

    await db
      .prepare(
        `INSERT INTO page_description (${columns.join(", ")})
         VALUES (${placeholders})`,
      )
      .bind(...values)
      .run();
  }

  return pageId;
}

export async function savePage(pageId: number, data: PageFormData) {
  const firstNameError = validateFirstName(data.first_name);
  if (firstNameError) throw new Error(firstNameError);

  const slugError = validateSlug(data.slug);
  if (slugError) throw new Error(slugError);

  const normalizedSlug = normalizeSlug(data.slug);
  if (await isSlugTaken(normalizedSlug, pageId)) {
    throw new Error(`Slug "${normalizedSlug}" is already in use. Choose a different URL.`);
  }

  const db = await getDb();

  await db
    .prepare(
      `UPDATE page
       SET first_name = ?, slug = ?, status = ?, date_modified = datetime('now')
       WHERE page_id = ?`,
    )
    .bind(data.first_name.trim(), normalizedSlug, data.status, pageId)
    .run();

  for (const languageId of [LANGUAGE_EN, LANGUAGE_DE]) {
    const description = data.page_description[languageId];
    if (!description) continue;

    const setClause = PAGE_DESCRIPTION_COLUMNS.map((col) => `${col} = ?`).join(", ");
    const values = [...PAGE_DESCRIPTION_COLUMNS.map((col) => description[col]), pageId, languageId];

    await db
      .prepare(
        `UPDATE page_description
         SET ${setClause}
         WHERE page_id = ? AND language_id = ?`,
      )
      .bind(...values)
      .run();
  }
}

export async function deletePage(pageId: number) {
  const db = await getDb();
  await db.prepare("DELETE FROM page WHERE page_id = ?").bind(pageId).run();
}

export function pageToFormData(page: PageWithDescriptions): PageFormData {
  return {
    first_name: page.first_name,
    slug: page.slug,
    status: page.status,
    page_description: {
      [LANGUAGE_EN]: page.descriptions[LANGUAGE_EN] ?? DEFAULT_DESCRIPTIONS_BY_LANGUAGE[LANGUAGE_EN],
      [LANGUAGE_DE]: page.descriptions[LANGUAGE_DE] ?? DEFAULT_DESCRIPTIONS_BY_LANGUAGE[LANGUAGE_DE],
    },
  };
}
