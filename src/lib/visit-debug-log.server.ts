import { getDb } from "@/lib/db.server";

/** Temporary investigation logger. Flip off when done. */
export const VISIT_DEBUG_LOG_ENABLED = true;

export type VisitDebugLogRow = {
  id: number;
  created_at: string;
  action: string | null;
  page_id: number | null;
  visit_id: number | null;
  payload: string;
};

export type VisitDebugLogListResult = {
  rows: VisitDebugLogRow[];
  total: number;
  page: number;
  perPage: number;
};

const LOCAL_LOG_FILE = "logs/visit-debug.ndjson";

function headersToObject(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

function cfToObject(cf: unknown): Record<string, unknown> | null {
  if (!cf) return null;
  try {
    return JSON.parse(JSON.stringify(cf)) as Record<string, unknown>;
  } catch {
    return { note: "cf present but not serializable" };
  }
}

export function buildVisitDebugPayload(input: {
  request: Request;
  body: Record<string, unknown>;
  extra?: Record<string, unknown>;
}) {
  const url = new URL(input.request.url);
  return {
    at: new Date().toISOString(),
    action: input.body.action ?? null,
    pageId: input.body.pageId ?? null,
    visitId: input.body.visitId ?? null,
    request: {
      method: input.request.method,
      url: input.request.url,
      pathname: url.pathname,
      search: url.search,
      headers: headersToObject(input.request.headers),
      cf: cfToObject(input.request.cf),
    },
    body: input.body,
    extra: input.extra ?? null,
  };
}

async function appendLocalDevFile(line: string) {
  if (!import.meta.env.DEV) return;
  try {
    const fs = await import("node:fs/promises");
    await fs.mkdir("logs", { recursive: true });
    await fs.appendFile(LOCAL_LOG_FILE, `${line}\n`, "utf8");
  } catch {
    // local file is best-effort only
  }
}

export async function writeVisitDebugLog(payload: Record<string, unknown>) {
  if (!VISIT_DEBUG_LOG_ENABLED) return;

  const line = JSON.stringify(payload);
  console.log("[visit-debug]", line);
  await appendLocalDevFile(line);

  try {
    const db = await getDb();
    await db
      .prepare(
        `INSERT INTO visit_debug_log (action, page_id, visit_id, payload)
         VALUES (?, ?, ?, ?)`,
      )
      .bind(
        payload.action != null ? String(payload.action) : null,
        payload.pageId != null && Number.isFinite(Number(payload.pageId))
          ? Number(payload.pageId)
          : null,
        payload.visitId != null && Number.isFinite(Number(payload.visitId))
          ? Number(payload.visitId)
          : null,
        line,
      )
      .run();
  } catch (error) {
    console.error("[visit-debug] D1 write failed", error);
  }
}

export async function listVisitDebugLogs(input: {
  page?: number;
  perPage?: number;
  pageId?: number | null;
  action?: string | null;
}): Promise<VisitDebugLogListResult> {
  const page = Math.max(1, Math.floor(input.page ?? 1));
  const perPage = [20, 50, 100].includes(input.perPage ?? 0) ? (input.perPage as number) : 50;
  const offset = (page - 1) * perPage;

  const where: string[] = [];
  const binds: Array<string | number> = [];

  if (input.pageId != null && Number.isFinite(input.pageId) && input.pageId > 0) {
    where.push("page_id = ?");
    binds.push(Math.floor(input.pageId));
  }
  if (input.action && input.action !== "all") {
    where.push("action = ?");
    binds.push(input.action);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const db = await getDb();

  try {
    const countRow = await db
      .prepare(`SELECT COUNT(*) AS total FROM visit_debug_log ${whereSql}`)
      .bind(...binds)
      .first<{ total: number }>();
    const total = Number(countRow?.total ?? 0);

    const result = await db
      .prepare(
        `SELECT id, created_at, action, page_id, visit_id, payload
         FROM visit_debug_log
         ${whereSql}
         ORDER BY id DESC
         LIMIT ? OFFSET ?`,
      )
      .bind(...binds, perPage, offset)
      .all<VisitDebugLogRow>();

    return {
      rows: (result.results ?? []).map((row) => ({
        id: Number(row.id),
        created_at: String(row.created_at ?? ""),
        action: row.action != null ? String(row.action) : null,
        page_id: row.page_id != null ? Number(row.page_id) : null,
        visit_id: row.visit_id != null ? Number(row.visit_id) : null,
        payload: String(row.payload ?? ""),
      })),
      total,
      page,
      perPage,
    };
  } catch (error) {
    console.error("[visit-debug] list failed", error);
    return { rows: [], total: 0, page, perPage };
  }
}

export async function clearVisitDebugLogs() {
  const db = await getDb();
  await db.prepare("DELETE FROM visit_debug_log").run();
}
