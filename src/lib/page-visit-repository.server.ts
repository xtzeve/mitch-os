import { getDb } from "@/lib/db.server";
import {
  VISIT_MAX_DURATION_SEC,
  VISIT_MIN_ENGAGEMENT_SEC,
  VISIT_SESSION_TTL_SEC,
} from "@/lib/page-visit-constants";
import { isBotUserAgent, type PageVisitRecord } from "@/lib/page-visit-types";

export type { PageVisitRecord } from "@/lib/page-visit-types";
export {
  VISIT_HEARTBEAT_SEC,
  VISIT_MAX_DURATION_SEC,
  VISIT_MIN_ENGAGEMENT_SEC,
  VISIT_SESSION_TTL_SEC,
} from "@/lib/page-visit-constants";

function mapVisit(row: Record<string, unknown>): PageVisitRecord {
  return {
    visit_id: Number(row.visit_id),
    page_id: Number(row.page_id),
    started_at: String(row.started_at ?? ""),
    last_seen_at: String(row.last_seen_at ?? ""),
    ended_at: row.ended_at != null ? String(row.ended_at) : null,
    duration_sec: Number(row.duration_sec ?? 0),
    locale: row.locale != null ? String(row.locale) : null,
    user_agent: row.user_agent != null ? String(row.user_agent) : null,
    is_bot: Number(row.is_bot ?? 0) === 1,
    counted: Number(row.counted ?? 0) === 1,
  };
}

function clampDuration(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return 0;
  return Math.min(Math.floor(sec), VISIT_MAX_DURATION_SEC);
}

async function getVisitById(visitId: number) {
  const db = await getDb();
  const row = await db
    .prepare("SELECT * FROM page_visit WHERE visit_id = ?")
    .bind(visitId)
    .first<Record<string, unknown>>();
  return row ? mapVisit(row) : null;
}

function isSessionAlive(visit: PageVisitRecord) {
  const raw = visit.last_seen_at.includes("T")
    ? visit.last_seen_at
    : visit.last_seen_at.replace(" ", "T");
  const lastSeen = new Date(raw.endsWith("Z") ? raw : `${raw}Z`).getTime();
  if (Number.isNaN(lastSeen)) return false;
  return Date.now() - lastSeen <= VISIT_SESSION_TTL_SEC * 1000;
}

async function maybeCountVisit(visit: PageVisitRecord, nextDuration: number) {
  if (visit.counted || visit.is_bot) return;
  if (nextDuration < VISIT_MIN_ENGAGEMENT_SEC) return;

  const db = await getDb();
  const result = await db
    .prepare(
      `UPDATE page_visit
       SET counted = 1
       WHERE visit_id = ? AND counted = 0 AND is_bot = 0`,
    )
    .bind(visit.visit_id)
    .run();

  if (!result.meta.changes) return;

  await db
    .prepare(
      `UPDATE page
       SET visited = visited + 1, last_visited = datetime('now')
       WHERE page_id = ?`,
    )
    .bind(visit.page_id)
    .run();
}

export async function startOrResumePageVisit(input: {
  pageId: number;
  visitId?: number | null;
  locale?: string | null;
  userAgent?: string | null;
}): Promise<{ visitId: number; resumed: boolean }> {
  const pageId = Number(input.pageId);
  if (!Number.isFinite(pageId) || pageId <= 0) {
    throw new Error("Invalid pageId.");
  }

  const existingId = input.visitId != null ? Number(input.visitId) : null;
  if (existingId && Number.isFinite(existingId)) {
    const existing = await getVisitById(existingId);
    if (existing && existing.page_id === pageId && isSessionAlive(existing)) {
      const db = await getDb();
      await db
        .prepare(
          `UPDATE page_visit
           SET last_seen_at = datetime('now'),
               locale = COALESCE(?, locale),
               ended_at = NULL
           WHERE visit_id = ?`,
        )
        .bind(input.locale ?? null, existingId)
        .run();
      return { visitId: existingId, resumed: true };
    }
  }

  const db = await getDb();
  const page = await db
    .prepare(
      `SELECT page_id FROM page
       WHERE page_id = ? AND published IS NOT NULL AND trim(published) != ''`,
    )
    .bind(pageId)
    .first();
  if (!page) throw new Error("Page not found.");

  const userAgent = input.userAgent?.slice(0, 500) ?? null;
  const bot = isBotUserAgent(userAgent) ? 1 : 0;

  const insert = await db
    .prepare(
      `INSERT INTO page_visit (
         page_id, started_at, last_seen_at, duration_sec, locale,
         user_agent, is_bot, counted
       ) VALUES (?, datetime('now'), datetime('now'), 0, ?, ?, ?, 0)`,
    )
    .bind(pageId, input.locale ?? null, userAgent, bot)
    .run();

  return { visitId: Number(insert.meta.last_row_id), resumed: false };
}

export async function pingPageVisit(input: {
  visitId: number;
  pageId: number;
  durationSec: number;
}): Promise<void> {
  const visitId = Number(input.visitId);
  const pageId = Number(input.pageId);
  const durationSec = clampDuration(input.durationSec);
  if (!Number.isFinite(visitId) || !Number.isFinite(pageId)) {
    throw new Error("Invalid visit.");
  }

  const existing = await getVisitById(visitId);
  if (!existing || existing.page_id !== pageId) {
    throw new Error("Visit not found.");
  }

  const nextDuration = Math.max(existing.duration_sec, durationSec);
  const db = await getDb();
  await db
    .prepare(
      `UPDATE page_visit
       SET last_seen_at = datetime('now'),
           duration_sec = ?,
           ended_at = NULL
       WHERE visit_id = ?`,
    )
    .bind(nextDuration, visitId)
    .run();

  await maybeCountVisit(existing, nextDuration);

  await db
    .prepare(`UPDATE page SET last_visited = datetime('now') WHERE page_id = ?`)
    .bind(pageId)
    .run();
}

export async function endPageVisit(input: {
  visitId: number;
  pageId: number;
  durationSec: number;
}): Promise<void> {
  const visitId = Number(input.visitId);
  const pageId = Number(input.pageId);
  const durationSec = clampDuration(input.durationSec);
  if (!Number.isFinite(visitId) || !Number.isFinite(pageId)) {
    throw new Error("Invalid visit.");
  }

  const existing = await getVisitById(visitId);
  if (!existing || existing.page_id !== pageId) {
    throw new Error("Visit not found.");
  }

  const nextDuration = Math.max(existing.duration_sec, durationSec);
  const db = await getDb();
  await db
    .prepare(
      `UPDATE page_visit
       SET last_seen_at = datetime('now'),
           ended_at = datetime('now'),
           duration_sec = ?
       WHERE visit_id = ?`,
    )
    .bind(nextDuration, visitId)
    .run();

  await maybeCountVisit(existing, nextDuration);
}

export async function listPageVisits(pageId: number): Promise<PageVisitRecord[]> {
  const db = await getDb();
  const result = await db
    .prepare(
      `SELECT *
       FROM page_visit
       WHERE page_id = ?
       ORDER BY started_at DESC, visit_id DESC`,
    )
    .bind(pageId)
    .all<Record<string, unknown>>();
  return (result.results ?? []).map(mapVisit);
}
