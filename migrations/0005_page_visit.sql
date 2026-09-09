CREATE TABLE IF NOT EXISTS page_visit (
  visit_id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id INTEGER NOT NULL,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at TEXT,
  duration_sec INTEGER NOT NULL DEFAULT 0,
  locale TEXT,
  FOREIGN KEY (page_id) REFERENCES page(page_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_page_visit_page_id ON page_visit(page_id);
CREATE INDEX IF NOT EXISTS idx_page_visit_last_seen ON page_visit(last_seen_at);
