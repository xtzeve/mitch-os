CREATE TABLE IF NOT EXISTS visit_debug_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  action TEXT,
  page_id INTEGER,
  visit_id INTEGER,
  payload TEXT NOT NULL
);
