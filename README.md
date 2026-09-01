# MITCH OS

Marketing site + personalized landing pages with admin panel.

## Stack

- TanStack Start (React SSR) on Cloudflare Workers
- Cloudflare D1 (SQLite)
- Admin panel at `/admin`

## Local setup

```bash
npm install
cp .dev.vars.example .dev.vars   # set SESSION_SECRET
npm run db:migrate:local
npm run dev
```

Default admin after migration: **username `admin`**, **password `admin`**. Create your own account under `/admin/users` and delete the seed account when ready.

## Production (Cloudflare)

This repo is public — **no deploy secrets in GitHub**. Secrets live only in the Cloudflare dashboard (and locally in `.dev.vars`, which is gitignored).

### Option A — Cloudflare Builds (recommended, no local terminal)

Build command: `npm ci && npm run build` · Deploy command: `npm run deploy:cf` (or `rm -rf .wrangler && npx wrangler deploy --cwd dist/server`)

Uses GitHub only as source code. Cloudflare connects via OAuth; tokens stay in Cloudflare, not in GitHub secrets.

1. **Cloudflare → Workers & Pages → mitch-os → Settings → Builds**
2. Connect repository `xtzeve/mitch-os`, branch `main`
3. Build settings:
   - **Build command:** `npm ci && npm run build`
   - **Deploy command:** `npm run deploy:cf`
4. **Bindings → D1:** variable `DB` → database `mitch-os`
5. **One-time:** set `SESSION_SECRET` as a **Wrangler secret** (survives every deploy):
   ```bash
   npx wrangler login
   npm run build
   npx wrangler secret put SESSION_SECRET --cwd dist/server
   ```
   Paste a random string **≥ 32 characters** (e.g. output of `openssl rand -base64 32`).

   **Do not** add `SESSION_SECRET` as a plain **Text** variable in the dashboard — `wrangler deploy` removes dashboard-only text vars on each deploy. Use **Encrypt** (secret) in the dashboard only if you cannot run Wrangler locally; plain Text will be wiped.

6. **D1 → mitch-os → Console:** run SQL from `migrations/0001_initial.sql` and `migrations/0002_admin_users.sql` if not applied yet
7. Trigger **Create deployment** (or push to `main` if auto-build is enabled)

Add your D1 **Database ID** to `wrangler.jsonc` (not a secret — safe to commit):

```jsonc
"database_id": "paste-uuid-from-cloudflare-d1-dashboard"
```

### Option B — Manual deploy (Wrangler on your machine)

```bash
npx wrangler login
# add database_id to wrangler.jsonc first (see above)
npm run build && npm run deploy:cf
npm run db:migrate:remote
npx wrangler secret put SESSION_SECRET --cwd dist/server
```

### GitHub Actions in this repo

Only **CI** (`.github/workflows/ci.yml`) — runs `npm run build` to verify the project compiles. **No secrets, no deploy.**


## URLs

| Route | Description |
|-------|-------------|
| `/` | Marketing homepage |
| `/{slug}` | English landing page |
| `/de/{slug}` | German landing page |
| `/admin` | Admin panel |

All landing pages send `noindex, nofollow`.

## Database

OpenCart-style schema:

- `language` — EN (1), DE (2)
- `page` — first_name, slug (unique), status
- `page_description` — content per (page_id, language_id)
- `admin_user` — admin panel accounts (username + hashed password)

Create New Page in admin seeds EN/DE defaults from the HTML prototype.
