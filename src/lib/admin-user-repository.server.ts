import { getDb } from "@/lib/db.server";
import { hashPassword, verifyPassword } from "@/lib/password.server";
import {
  ADMIN_USER_STATUS_ACTIVE,
  type AdminUserRecord,
  validateAdminPassword,
  validateAdminUsername,
} from "@/lib/admin-user-types";

function mapUser(row: Record<string, unknown>): AdminUserRecord {
  return {
    user_id: Number(row.user_id),
    username: String(row.username ?? ""),
    status: Number(row.status ?? 0),
    date_added: String(row.date_added ?? ""),
    date_modified: String(row.date_modified ?? ""),
  };
}

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  const db = await getDb();
  const result = await db
    .prepare(
      `SELECT user_id, username, status, date_added, date_modified
       FROM admin_user
       ORDER BY user_id ASC`,
    )
    .all<Record<string, unknown>>();
  return (result.results ?? []).map(mapUser);
}

export async function countActiveAdminUsers() {
  const db = await getDb();
  const row = await db
    .prepare("SELECT COUNT(*) AS count FROM admin_user WHERE status = ?")
    .bind(ADMIN_USER_STATUS_ACTIVE)
    .first<{ count: number }>();
  return Number(row?.count ?? 0);
}

export async function getAdminUserByUsername(username: string) {
  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT user_id, username, password_hash, salt, status, date_added, date_modified
       FROM admin_user
       WHERE username = ? COLLATE NOCASE
       LIMIT 1`,
    )
    .bind(username.trim())
    .first<Record<string, unknown>>();
  if (!row) return null;
  return {
    ...mapUser(row),
    password_hash: String(row.password_hash ?? ""),
    salt: String(row.salt ?? ""),
  };
}

export async function getAdminUserById(userId: number) {
  const db = await getDb();
  const row = await db
    .prepare(
      `SELECT user_id, username, status, date_added, date_modified
       FROM admin_user
       WHERE user_id = ?
       LIMIT 1`,
    )
    .bind(userId)
    .first<Record<string, unknown>>();
  return row ? mapUser(row) : null;
}

export async function verifyAdminCredentials(username: string, password: string) {
  const user = await getAdminUserByUsername(username);
  if (!user || user.status !== ADMIN_USER_STATUS_ACTIVE) return null;
  const valid = await verifyPassword(password, user.salt, user.password_hash);
  if (!valid) return null;
  return mapUser(user);
}

export async function createAdminUser(username: string, password: string) {
  const usernameError = validateAdminUsername(username);
  if (usernameError) throw new Error(usernameError);
  const passwordError = validateAdminPassword(password);
  if (passwordError) throw new Error(passwordError);

  const existing = await getAdminUserByUsername(username);
  if (existing) throw new Error("Username is already taken.");

  const { passwordHash, salt } = await hashPassword(password);
  const db = await getDb();
  const result = await db
    .prepare(
      `INSERT INTO admin_user (username, password_hash, salt, status, date_modified)
       VALUES (?, ?, ?, ?, datetime('now'))`,
    )
    .bind(username.trim(), passwordHash, salt, ADMIN_USER_STATUS_ACTIVE)
    .run();

  const userId = Number(result.meta.last_row_id);
  const user = await getAdminUserById(userId);
  if (!user) throw new Error("Failed to create admin user.");
  return user;
}

export async function deleteAdminUser(userId: number) {
  const activeCount = await countActiveAdminUsers();
  if (activeCount <= 1) {
    throw new Error("Cannot delete the last admin user.");
  }

  const db = await getDb();
  const result = await db.prepare("DELETE FROM admin_user WHERE user_id = ?").bind(userId).run();
  if (!result.meta.changes) {
    throw new Error("Admin user not found.");
  }
}
