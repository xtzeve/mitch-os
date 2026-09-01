CREATE TABLE IF NOT EXISTS language (
  language_id INTEGER PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 1
);

INSERT OR IGNORE INTO language (language_id, code, name, status) VALUES
  (1, 'en', 'English', 1),
  (2, 'de', 'Deutsch', 1);

CREATE TABLE IF NOT EXISTS page (
  page_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  status INTEGER NOT NULL DEFAULT 0,
  date_added TEXT NOT NULL DEFAULT (datetime('now')),
  date_modified TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS page_description (
  page_id INTEGER NOT NULL,
  language_id INTEGER NOT NULL,
  greeting TEXT NOT NULL DEFAULT '',
  why_body TEXT NOT NULL DEFAULT '',
  why_claim TEXT NOT NULL DEFAULT '',
  preview_intro TEXT NOT NULL DEFAULT '',
  four_thing_1 TEXT NOT NULL DEFAULT '',
  four_thing_2 TEXT NOT NULL DEFAULT '',
  four_thing_3 TEXT NOT NULL DEFAULT '',
  four_thing_4 TEXT NOT NULL DEFAULT '',
  structure_intro TEXT NOT NULL DEFAULT '',
  mechanism_p1 TEXT NOT NULL DEFAULT '',
  mechanism_p2 TEXT NOT NULL DEFAULT '',
  mechanism_p3 TEXT NOT NULL DEFAULT '',
  unseen_p1 TEXT NOT NULL DEFAULT '',
  unseen_p2 TEXT NOT NULL DEFAULT '',
  cta_phone TEXT NOT NULL DEFAULT '',
  cta_label TEXT NOT NULL DEFAULT '',
  cta_alt TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (page_id, language_id),
  FOREIGN KEY (page_id) REFERENCES page(page_id) ON DELETE CASCADE,
  FOREIGN KEY (language_id) REFERENCES language(language_id)
);

CREATE INDEX IF NOT EXISTS idx_page_slug ON page(slug);
CREATE INDEX IF NOT EXISTS idx_page_status ON page(status);
