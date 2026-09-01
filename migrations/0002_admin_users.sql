CREATE TABLE IF NOT EXISTS admin_user (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 1,
  date_added TEXT NOT NULL DEFAULT (datetime('now')),
  date_modified TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_user_username ON admin_user(username);
CREATE INDEX IF NOT EXISTS idx_admin_user_status ON admin_user(status);

-- Seed initial admin: username "admin", password "admin" — change after first login.
INSERT OR IGNORE INTO admin_user (user_id, username, password_hash, salt, status) VALUES
  (
    1,
    'admin',
    '17a434ff87fda4ef6910bd5a37944be0b59239482395aa860f37a566eac6ddcc',
    'a1b2c3d4e5f60718293a4b5c6d7e8f90',
    1
  );
