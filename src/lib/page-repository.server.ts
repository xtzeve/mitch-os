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

function nullableId(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function nullableString(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function mapPage(row: Record<string, unknown>): PageRecord {
  return {
    page_id: Number(row.page_id),
    first_name: String(row.first_name ?? ""),
    slug: String(row.slug ?? ""),
    territory_id: nullableId(row.territory_id),
    owner_id: nullableId(row.owner_id),
    campaign_id: nullableId(row.campaign_id),
    territory_name: nullableString(row.territory_name),
    owner_name: nullableString(row.owner_name),
    campaign_name: nullableString(row.campaign_name),
    published: nullableString(row.published)?.slice(0, 10) ?? null,
    visited: Number(row.visited ?? 0),
    last_visited: nullableString(row.last_visited),
    date_added: String(row.date_added ?? ""),
    date_modified: String(row.date_modified ?? ""),
  };
}

export { normalizeSlug, validateFirstName, validateSlug } from "@/lib/page-validation";

export type ListPagesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  territoryId?: number | null;
  ownerId?: number | null;
  campaignId?: number | null;
  publishedFrom?: string | null;
  publishedTo?: string | null;
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

function normalizeDateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

export async function listPages(params: ListPagesParams = {}): Promise<ListPagesResult> {
  const search = (params.search ?? "").trim();
  const perPage = normalizePerPage(params.perPage);
  let page = Math.max(1, Math.floor(params.page ?? 1) || 1);
  const territoryId = nullableId(params.territoryId);
  const ownerId = nullableId(params.ownerId);
  const campaignId = nullableId(params.campaignId);
  const publishedFrom = normalizeDateOnly(params.publishedFrom);
  const publishedTo = normalizeDateOnly(params.publishedTo);

  const whereParts: string[] = [];
  const filterBinds: Array<string | number> = [];

  if (search) {
    whereParts.push("(p.first_name LIKE ? COLLATE NOCASE OR p.slug LIKE ? COLLATE NOCASE)");
    const like = `%${search}%`;
    filterBinds.push(like, like);
  }
  if (territoryId != null) {
    whereParts.push("p.territory_id = ?");
    filterBinds.push(territoryId);
  }
  if (ownerId != null) {
    whereParts.push("p.owner_id = ?");
    filterBinds.push(ownerId);
  }
  if (campaignId != null) {
    whereParts.push("p.campaign_id = ?");
    filterBinds.push(campaignId);
  }
  if (publishedFrom) {
    whereParts.push("p.published IS NOT NULL AND date(p.published) >= date(?)");
    filterBinds.push(publishedFrom);
  }
  if (publishedTo) {
    whereParts.push("p.published IS NOT NULL AND date(p.published) <= date(?)");
    filterBinds.push(publishedTo);
  }

  const where = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
  const fromJoin = `FROM page p
    LEFT JOIN territory t ON t.territory_id = p.territory_id
    LEFT JOIN owner o ON o.owner_id = p.owner_id
    LEFT JOIN campaign c ON c.campaign_id = p.campaign_id`;

  const db = await getDb();

  const countRow = await db
    .prepare(`SELECT COUNT(*) AS total ${fromJoin} ${where}`)
    .bind(...filterBinds)
    .first<{ total: number }>();
  const total = Number(countRow?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / perPage) || 1);
  if (page > totalPages) page = totalPages;
  const offset = (page - 1) * perPage;

  const result = await db
    .prepare(
      `SELECT
         p.*,
         t.name AS territory_name,
         o.name AS owner_name,
         c.name AS campaign_name
       ${fromJoin}
       ${where}
       ORDER BY p.visited DESC, (p.last_visited IS NULL) ASC, p.last_visited DESC, p.page_id DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...filterBinds, perPage, offset)
    .all<Record<string, unknown>>();

  return {
    items: (result.results ?? []).map((row) => mapPage(row)),
    total,
    page,
    perPage,
    totalPages,
  };
}

async function attachCatalogNames(page: PageRecord): Promise<PageRecord> {
  const db = await getDb();
  let territory_name = page.territory_name;
  let owner_name = page.owner_name;
  let campaign_name = page.campaign_name;

  if (page.territory_id != null && !territory_name) {
    const row = await db
      .prepare("SELECT name FROM territory WHERE territory_id = ?")
      .bind(page.territory_id)
      .first<{ name: string }>();
    territory_name = row?.name ?? null;
  }
  if (page.owner_id != null && !owner_name) {
    const row = await db
      .prepare("SELECT name FROM owner WHERE owner_id = ?")
      .bind(page.owner_id)
      .first<{ name: string }>();
    owner_name = row?.name ?? null;
  }
  if (page.campaign_id != null && !campaign_name) {
    const row = await db
      .prepare("SELECT name FROM campaign WHERE campaign_id = ?")
      .bind(page.campaign_id)
      .first<{ name: string }>();
    campaign_name = row?.name ?? null;
  }

  return { ...page, territory_name, owner_name, campaign_name };
}

export async function getPageById(pageId: number): Promise<PageWithDescriptions | null> {
  const db = await getDb();
  const pageRow = await db
    .prepare(
      `SELECT
         p.*,
         t.name AS territory_name,
         o.name AS owner_name,
         c.name AS campaign_name
       FROM page p
       LEFT JOIN territory t ON t.territory_id = p.territory_id
       LEFT JOIN owner o ON o.owner_id = p.owner_id
       LEFT JOIN campaign c ON c.campaign_id = p.campaign_id
       WHERE p.page_id = ?`,
    )
    .bind(pageId)
    .first();
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
    ...(await attachCatalogNames(mapPage(pageRow as unknown as Record<string, unknown>))),
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
      `SELECT
         p.*,
         pd.*,
         t.name AS territory_name,
         o.name AS owner_name,
         c.name AS campaign_name
       FROM page p
       INNER JOIN page_description pd ON p.page_id = pd.page_id
       LEFT JOIN territory t ON t.territory_id = p.territory_id
       LEFT JOIN owner o ON o.owner_id = p.owner_id
       LEFT JOIN campaign c ON c.campaign_id = p.campaign_id
       WHERE p.slug = ?
         AND pd.language_id = ?
         AND p.published IS NOT NULL
         AND trim(p.published) != ''`,
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
    .prepare(
      `UPDATE page
       SET visited = visited + 1, last_visited = datetime('now')
       WHERE page_id = ?`,
    )
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

function validatePageFormData(data: PageFormData) {
  const firstNameError = validateFirstName(data.first_name);
  if (firstNameError) throw new Error(firstNameError);

  const slugError = validateSlug(data.slug);
  if (slugError) throw new Error(slugError);

  return normalizeSlug(data.slug);
}

export async function createPageFromForm(data: PageFormData): Promise<number> {
  const normalizedSlug = validatePageFormData(data);
  if (await isSlugTaken(normalizedSlug)) {
    throw new Error(`Slug "${normalizedSlug}" is already in use. Choose a different URL.`);
  }

  const published = normalizeDateOnly(data.published);
  const db = await getDb();
  const insert = await db
    .prepare(
      `INSERT INTO page (
         first_name, slug, territory_id, owner_id, campaign_id, published,
         date_added, date_modified
       ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    )
    .bind(
      data.first_name.trim(),
      normalizedSlug,
      data.territory_id,
      data.owner_id,
      data.campaign_id,
      published,
    )
    .run();

  const pageId = Number(insert.meta.last_row_id);

  for (const languageId of [LANGUAGE_EN, LANGUAGE_DE]) {
    const description =
      data.page_description[languageId] ?? DEFAULT_DESCRIPTIONS_BY_LANGUAGE[languageId];
    const columns = ["page_id", "language_id", ...PAGE_DESCRIPTION_COLUMNS];
    const placeholders = columns.map(() => "?").join(", ");
    const values = [
      pageId,
      languageId,
      ...PAGE_DESCRIPTION_COLUMNS.map((col) => description[col]),
    ];

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
  const normalizedSlug = validatePageFormData(data);
  if (await isSlugTaken(normalizedSlug, pageId)) {
    throw new Error(`Slug "${normalizedSlug}" is already in use. Choose a different URL.`);
  }

  const published = normalizeDateOnly(data.published);
  const db = await getDb();

  await db
    .prepare(
      `UPDATE page
       SET first_name = ?,
           slug = ?,
           territory_id = ?,
           owner_id = ?,
           campaign_id = ?,
           published = ?,
           date_modified = datetime('now')
       WHERE page_id = ?`,
    )
    .bind(
      data.first_name.trim(),
      normalizedSlug,
      data.territory_id,
      data.owner_id,
      data.campaign_id,
      published,
      pageId,
    )
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

/** Remove blank pages left by the old create-on-open flow. */
export async function deleteEmptyDraftPages() {
  const db = await getDb();
  await db
    .prepare(
      `DELETE FROM page_description
       WHERE page_id IN (
         SELECT page_id FROM page
         WHERE trim(first_name) = ''
           AND trim(slug) = ''
           AND visited = 0
       )`,
    )
    .run();
  await db
    .prepare(
      `DELETE FROM page
       WHERE trim(first_name) = ''
         AND trim(slug) = ''
         AND visited = 0`,
    )
    .run();
}

export async function deletePage(pageId: number) {
  const db = await getDb();
  await db.prepare("DELETE FROM page WHERE page_id = ?").bind(pageId).run();
}

export function pageToFormData(page: PageWithDescriptions): PageFormData {
  return {
    first_name: page.first_name,
    slug: page.slug,
    territory_id: page.territory_id,
    owner_id: page.owner_id,
    campaign_id: page.campaign_id,
    published: page.published,
    page_description: {
      [LANGUAGE_EN]: page.descriptions[LANGUAGE_EN] ?? DEFAULT_DESCRIPTIONS_BY_LANGUAGE[LANGUAGE_EN],
      [LANGUAGE_DE]: page.descriptions[LANGUAGE_DE] ?? DEFAULT_DESCRIPTIONS_BY_LANGUAGE[LANGUAGE_DE],
    },
  };
}
