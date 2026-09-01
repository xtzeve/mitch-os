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

Uses GitHub only as source code. Cloudflare connects via OAuth; tokens stay in Cloudflare, not in GitHub secrets.

1. **Cloudflare → Workers & Pages → mitch-os → Settings → Builds**
2. Connect repository `xtzeve/mitch-os`, branch `main`
3. Build settings:
   - **Build command:** `npm ci && npm run build`
   - **Deploy command:** `npx wrangler deploy` (root directory: `dist/server`, or set working directory to `dist/server`)
4. **Bindings → D1:** variable `DB` → database `mitch-os-db`
5. **Settings → Variables and Secrets:** add secret `SESSION_SECRET` (admin sessions)
6. **D1 → mitch-os-db → Console:** run SQL from `migrations/0001_initial.sql` and `migrations/0002_admin_users.sql` if not applied yet
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
