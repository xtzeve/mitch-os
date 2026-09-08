CREATE TABLE IF NOT EXISTS territory (
  territory_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  date_added TEXT NOT NULL DEFAULT (datetime('now')),
  date_modified TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS owner (
  owner_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  date_added TEXT NOT NULL DEFAULT (datetime('now')),
  date_modified TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS campaign (
  campaign_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  date_added TEXT NOT NULL DEFAULT (datetime('now')),
  date_modified TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO territory (name) VALUES ('DE'), ('CA'), ('US');
INSERT OR IGNORE INTO owner (name) VALUES ('Vince'), ('Ash'), ('Rucha');
INSERT OR IGNORE INTO campaign (name) VALUES ('NIS2'), ('SaaS-ICP'), ('Snail Papers');

ALTER TABLE page ADD COLUMN territory_id INTEGER REFERENCES territory(territory_id) ON DELETE SET NULL;
ALTER TABLE page ADD COLUMN owner_id INTEGER REFERENCES owner(owner_id) ON DELETE SET NULL;
ALTER TABLE page ADD COLUMN campaign_id INTEGER REFERENCES campaign(campaign_id) ON DELETE SET NULL;
ALTER TABLE page ADD COLUMN published TEXT;
ALTER TABLE page ADD COLUMN last_visited TEXT;

UPDATE page
SET published = date(date_modified)
WHERE status = 1 AND (published IS NULL OR published = '');
