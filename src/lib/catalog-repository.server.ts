import { getDb } from "@/lib/db.server";
import {
  CATALOG_META,
  type CatalogKind,
  type CatalogRecord,
} from "@/lib/catalog-types";

function mapCatalog(kind: CatalogKind, row: Record<string, unknown>): CatalogRecord {
  const idColumn = CATALOG_META[kind].idColumn;
  return {
    id: Number(row[idColumn]),
    name: String(row.name ?? ""),
    date_added: String(row.date_added ?? ""),
    date_modified: String(row.date_modified ?? ""),
  };
}

export async function listCatalog(kind: CatalogKind): Promise<CatalogRecord[]> {
  const meta = CATALOG_META[kind];
  const db = await getDb();
  const result = await db
    .prepare(
      `SELECT ${meta.idColumn}, name, date_added, date_modified
       FROM ${meta.table}
       ORDER BY name COLLATE NOCASE ASC`,
    )
    .all<Record<string, unknown>>();
  return (result.results ?? []).map((row) => mapCatalog(kind, row));
}

export async function createCatalogItem(kind: CatalogKind, name: string): Promise<CatalogRecord> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error(`${CATALOG_META[kind].label} name is required.`);
  if (trimmed.length > 64) throw new Error("Name must be 64 characters or less.");

  const meta = CATALOG_META[kind];
  const db = await getDb();

  try {
    const insert = await db
      .prepare(
        `INSERT INTO ${meta.table} (name, date_added, date_modified)
         VALUES (?, datetime('now'), datetime('now'))`,
      )
      .bind(trimmed)
      .run();

    const id = Number(insert.meta.last_row_id);
    const row = await db
      .prepare(
        `SELECT ${meta.idColumn}, name, date_added, date_modified
         FROM ${meta.table}
         WHERE ${meta.idColumn} = ?`,
      )
      .bind(id)
      .first<Record<string, unknown>>();
    if (!row) throw new Error("Failed to create record.");
    return mapCatalog(kind, row);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("unique")) {
      throw new Error(`"${trimmed}" already exists.`);
    }
    throw error;
  }
}

export async function updateCatalogItem(
  kind: CatalogKind,
  id: number,
  name: string,
): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error(`${CATALOG_META[kind].label} name is required.`);
  if (trimmed.length > 64) throw new Error("Name must be 64 characters or less.");

  const meta = CATALOG_META[kind];
  const db = await getDb();

  try {
    const result = await db
      .prepare(
        `UPDATE ${meta.table}
         SET name = ?, date_modified = datetime('now')
         WHERE ${meta.idColumn} = ?`,
      )
      .bind(trimmed, id)
      .run();
    if (!result.meta.changes) throw new Error("Record not found.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("unique")) {
      throw new Error(`"${trimmed}" already exists.`);
    }
    throw error;
  }
}

export async function deleteCatalogItem(kind: CatalogKind, id: number): Promise<void> {
  const meta = CATALOG_META[kind];
  const db = await getDb();
  const result = await db
    .prepare(`DELETE FROM ${meta.table} WHERE ${meta.idColumn} = ?`)
    .bind(id)
    .run();
  if (!result.meta.changes) throw new Error("Record not found.");
}
