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

Push to `main` deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`).

### One-time setup

1. **GitHub repository secrets** (Settings → Secrets and variables → Actions):
   - `CLOUDFLARE_API_TOKEN` — API token with **Workers Scripts Edit** and **D1 Edit**
   - `CLOUDFLARE_ACCOUNT_ID` — Cloudflare dashboard → Workers & Pages → right sidebar

2. **Worker secret** (Cloudflare → mitch-os → Settings → Variables and Secrets):
   - `SESSION_SECRET` — long random string (admin sessions). Set once; not stored in GitHub.

3. **D1 database** — if `mitch-os-db` already exists on your Cloudflare account (it should for mitch-os.com), nothing to create. Each deploy runs pending migrations from `migrations/` automatically.

### Manual deploy (optional)

```bash
npm run build && npm run deploy:cf
npm run db:migrate:remote
npx wrangler secret put SESSION_SECRET --cwd dist/server
```

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
